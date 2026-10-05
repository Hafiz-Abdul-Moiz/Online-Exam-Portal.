/* SkillTester Exam Portal: client orchestration and Firebase integration. */
const firebaseConfig = {
  apiKey: "AIzaSyBtU4FbqMwIQL2WyOUVhn5o4NiP8r53EQs",
  authDomain: "live-feedback-app-7bf6b.firebaseapp.com",
  databaseURL: "https://live-feedback-app-7bf6b-default-rtdb.firebaseio.com",
  projectId: "live-feedback-app-7bf6b",
  storageBucket: "live-feedback-app-7bf6b.firebasestorage.app",
  messagingSenderId: "456949595332",
  appId: "1:456949595332:web:79b40c4acc6499710f5d91"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const EXAM_TOTAL_MARKS = 100;
const PASSING_SCORE = 50;
const SESSION_KEY = "skilltester_session";
const UNIVERSAL_LIFETIME_PASSWORD = "999990";
localStorage.removeItem("skilltester_lockout");

const state = {
  candidate: null,
  exam: "All Subjects",
  score: 0,
  questionCount: 0,
  answerReview: [],
  examActive: false,
  antiCheatBound: false,
  finishing: false,
  liveBlockListener: null
};
let audioContext = null;

const $ = (id) => document.getElementById(id);
const show = (id) => $(id)?.classList.add("active");
const hide = (id) => $(id)?.classList.remove("active");

function playSound(kind) {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const tones = { loading: [420, 0.08], correct: [720, 0.12], wrong: [180, 0.16], success: [880, 0.18], failure: [120, 0.2] };
    const [frequency, duration] = tones[kind] || tones.loading;
    oscillator.type = kind === "wrong" || kind === "failure" ? "sawtooth" : "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(); oscillator.stop(audioContext.currentTime + duration + 0.02);
  } catch (error) { /* Sound progressive enhancement */ }
}

function toast(message, tone = "info") {
  const node = $("toast");
  if (!node) return;
  node.textContent = message;
  node.dataset.tone = tone;
  node.classList.remove("hidden");
  window.clearTimeout(toast.timeout);
  toast.timeout = window.setTimeout(() => node.classList.add("hidden"), 4500);
}

function calculateMarks(correctAnswers, questionCount = state.questionCount) {
  if (!Number.isInteger(questionCount) || questionCount < 1) return 0;
  return Math.round((correctAnswers / questionCount) * EXAM_TOTAL_MARKS);
}

function renderAnswerReview(answerReview) {
  const section = $("answerReview");
  const list = $("answerReviewList");
  if (!section || !list) return;
  list.replaceChildren();
  if (!Array.isArray(answerReview) || answerReview.length === 0) {
    section.classList.add("hidden");
    return;
  }
  answerReview.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "answer-review-item";
    const heading = document.createElement("h4");
    heading.textContent = `Question ${index + 1} · ${item.subject}`;
    const question = document.createElement("p");
    question.className = "answer-review-question";
    question.textContent = item.question;
    const selected = document.createElement("p");
    selected.className = item.selectedAnswer === item.correctAnswer
      ? "answer-review-value answer-review-correct"
      : "answer-review-value answer-review-incorrect";
    const selectedLabel = document.createElement("strong");
    selectedLabel.textContent = "Your answer: ";
    selected.append(selectedLabel, document.createTextNode(item.selectedAnswer || "Not answered"));
    const correct = document.createElement("p");
    correct.className = "answer-review-value answer-review-correct";
    const correctLabel = document.createElement("strong");
    correctLabel.textContent = "Correct answer: ";
    correct.append(correctLabel, document.createTextNode(item.correctAnswer));
    card.append(heading, question, selected, correct);
    list.appendChild(card);
  });
  section.classList.remove("hidden");
}

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

// -------------------------------------------------------------
// STRICT SECURITY: KEYBOARD COMPLETE LOCK & ONLY MOUSE LEFT CLICK
// -------------------------------------------------------------
function bindSecurityDefaults() {
  // Prevent contextmenu right-click anytime during exam
  document.addEventListener("contextmenu", (event) => {
    if (state.examActive) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);

  // Prevent text selection during exam
  document.addEventListener("selectstart", (event) => {
    if (state.examActive && !event.target.matches("input, textarea")) {
      event.preventDefault();
    }
  });

  document.addEventListener("dragstart", (event) => {
    if (state.examActive) event.preventDefault();
  });

  // 🔥 KEYBOARD LOCK: When exam is active, ALL keys and shortcuts are blocked!
  const blockKeys = (event) => {
    if (state.examActive) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  };
  window.addEventListener("keydown", blockKeys, true);
  window.addEventListener("keypress", blockKeys, true);
  window.addEventListener("keyup", blockKeys, true);

  // 🔥 MOUSE LOCK: ONLY Mouse Left Click (button === 0) is allowed!
  const blockOtherMouse = (event) => {
    if (state.examActive && event.button !== 0) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  };
  window.addEventListener("mousedown", blockOtherMouse, true);
  window.addEventListener("mouseup", blockOtherMouse, true);
  window.addEventListener("auxclick", blockOtherMouse, true);
}

function bindAntiCheat() {
  if (state.antiCheatBound) return;
  state.antiCheatBound = true;
  document.addEventListener("visibilitychange", () => {
    if (state.examActive && document.hidden) terminateActiveExam("Browser tab or window focus changed.");
  });
  window.addEventListener("pagehide", () => {
    if (state.examActive) terminateActiveExam("The exam page was hidden or closed.");
  });
  document.addEventListener("fullscreenchange", () => {
    if (state.examActive && !document.fullscreenElement) terminateActiveExam("Fullscreen mode was exited.");
  });
  if (isMobileDevice()) {
    document.addEventListener("touchmove", (event) => {
      if (state.examActive) event.preventDefault();
    }, { passive: false });
  }
}

async function requestExamFullscreen() {
  if (document.fullscreenElement) return;
  if (!document.documentElement.requestFullscreen) {
    throw new Error("This browser does not support secure fullscreen exams. Please use an up-to-date desktop browser.");
  }
  try { await document.documentElement.requestFullscreen(); }
  catch (error) { throw new Error("Fullscreen permission is required before the exam can start."); }
  if (!document.fullscreenElement) throw new Error("Fullscreen could not be activated. Please allow fullscreen and try again.");
}

function openRegistration() {
  $("registrationModal").classList.add("open");
  $("fullName").focus();
}
function closeRegistration() { $("registrationModal").classList.remove("open"); }

function openAdminPanel() {
  if (state.examActive) { toast("Exam ke dauran Admin Panel allowed nahi hai.", "danger"); return; }
  $("adminModal").classList.add("open");
}

function closeAdminPanel() {
  $("adminPanelFrame").contentWindow.postMessage({ type: "skilltester:admin-closed" }, "*");
  $("adminModal").classList.remove("open");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
}

// -------------------------------------------------------------
// VERIFY PASSCODE: PERMANENT LIFETIME ID (999990) & ONE-TIME CODE
// -------------------------------------------------------------
async function verifyPasscode(code, studentId, fullName, fatherName, phone) {
  const adminSnapshot = await database.ref("adminCode").once("value");
  const admin = adminSnapshot.val() || {};

  if (admin.isEnabled === false) {
    throw new Error("Exam access is temporarily disabled by the administrator.");
  }

  // 1. FIRST CHECK: PERMANENT LIFETIME ID IN FIREBASE
  const studentKey = String(studentId).trim().toUpperCase().replace(/[.#$\[\]]/g, "_");
  const permSnap = await database.ref(`permanentStudents/${studentKey}`).once("value");
  const permStudent = permSnap.val();

  if (permStudent) {
    // 🔥 THE TWIST: Check if ID is blocked from admin side
    if (permStudent.isBlocked === true) {
      throw new Error("Your ID is blocked from admin side");
    }

    // Check Universal Lifetime Password (999990)
    const expectedPass = String(permStudent.password || UNIVERSAL_LIFETIME_PASSWORD).trim();
    if (code !== expectedPass && code !== UNIVERSAL_LIFETIME_PASSWORD) {
      throw new Error("Incorrect lifetime password. Use 999990.");
    }

    // Check student details match registered record
    if (String(permStudent.studentName).trim().replace(/\s+/g, " ").toLowerCase() !== fullName.trim().replace(/\s+/g, " ").toLowerCase()) {
      throw new Error("Student Name does not match registered record for this ID.");
    }
    if (String(permStudent.fatherName || "").trim().replace(/\s+/g, " ").toLowerCase() !== fatherName.trim().replace(/\s+/g, " ").toLowerCase()) {
      throw new Error("Father Name does not match registered record for this ID.");
    }
    if (String(permStudent.phone || "").trim() !== phone.trim()) {
      throw new Error("Mobile number does not match registered record for this ID.");
    }

    // Permanent student verified! (Never displays "Candidate", exact name saved)
    state.exam = permStudent.exam || "All Subjects";
    return {
      studentId: permStudent.studentId || studentId,
      fullName: permStudent.studentName || fullName,
      studentName: permStudent.studentName || fullName,
      fatherName: permStudent.fatherName || fatherName,
      phone: permStudent.phone || phone,
      exam: state.exam,
      isPermanent: true,
      studentKey
    };
  }

  // 2. SECOND CHECK: ONE-TIME PASSCODE
  const passcodeRef = database.ref(`passcodes/${code}`);
  const snapshot = await passcodeRef.once("value");
  const passcode = snapshot.val();
  if (!passcode || passcode.isUsed !== false) throw new Error("This passcode is invalid, expired, or has already been used.");
  if (!passcode.studentId || !passcode.studentName || !passcode.exam) {
    throw new Error("This older code needs to be assigned to a student and exam by the administrator first.");
  }
  if (!["All Subjects", "HTML", "CSS", "JavaScript"].includes(passcode.exam)) {
    throw new Error("The exam assigned to this code is invalid. Ask the administrator to issue a corrected code.");
  }
  if (Number(passcode.expiresAt || Infinity) <= Date.now()) throw new Error("This passcode has expired. Ask the administrator for a new code.");
  if (String(passcode.studentId).trim().toUpperCase() !== studentId.trim().toUpperCase()) {
    throw new Error("Student ID does not match the student assigned to this passcode.");
  }
  if (String(passcode.studentName).trim().replace(/\s+/g, " ").toLowerCase() !== fullName.trim().replace(/\s+/g, " ").toLowerCase()) {
    throw new Error("Student name does not match the name registered by the administrator.");
  }
  if (String(passcode.fatherName || "").trim().replace(/\s+/g, " ").toLowerCase() !== fatherName.trim().replace(/\s+/g, " ").toLowerCase()) {
    throw new Error("Father name does not match the student record created by the administrator.");
  }
  if (String(passcode.phone || "").trim() !== phone) {
    throw new Error("Mobile number does not match the student record created by the administrator.");
  }
  
  let result;
  try {
    result = await passcodeRef.transaction((current) => {
      if (!current) return null;
      if (current.isUsed !== false ||
          String(current.studentId || "").trim().toUpperCase() !== String(passcode.studentId).trim().toUpperCase() ||
          current.exam !== passcode.exam ||
          String(current.studentName || "").trim().replace(/\s+/g, " ").toLowerCase() !==
            String(passcode.studentName).trim().replace(/\s+/g, " ").toLowerCase() ||
          String(current.fatherName || "").trim().replace(/\s+/g, " ").toLowerCase() !==
            String(passcode.fatherName || "").trim().replace(/\s+/g, " ").toLowerCase() ||
          String(current.phone || "").trim() !== String(passcode.phone || "").trim() ||
          Number(current.expiresAt || Infinity) <= Date.now()) return current;
      return {
        ...current,
        isUsed: true
      };
    });
  } catch (error) {
    if (String(error.code || error.message || "").includes("PERMISSION_DENIED")) {
      throw new Error("Firebase rejected the one-time-code update. Check Realtime Database write rules for passcodes/{code}.");
    }
    throw new Error(`Could not claim this code from Firebase: ${error.message || "database request failed"}`);
  }
  if (!result.committed) {
    const latest = (await passcodeRef.once("value")).val();
    if (!latest) throw new Error("This passcode no longer exists. Ask the administrator to issue a new code.");
    if (latest.isUsed === true) throw new Error("This passcode has already been used.");
    if (Number(latest.expiresAt || Infinity) <= Date.now()) throw new Error("This passcode has expired. Ask the administrator for a new code.");
    if (String(latest.studentId || "").trim().toUpperCase() !== studentId.trim().toUpperCase()) {
      throw new Error("This passcode was reassigned to a different student. Ask the administrator to verify the entry.");
    }
    throw new Error("Firebase did not save the one-time-code claim. Check Realtime Database write rules and try again.");
  }
  
  state.exam = passcode.exam;
  return {
    studentId: passcode.studentId || studentId,
    fullName: passcode.studentName || fullName,
    studentName: passcode.studentName || fullName,
    fatherName: passcode.fatherName || fatherName,
    phone: passcode.phone || phone,
    exam: passcode.exam,
    isPermanent: false
  };
}

async function submitRegistration(event) {
  event.preventDefault();
  const studentId = $("studentId").value.trim();
  const fullName = $("fullName").value.trim();
  const fatherName = $("fatherName").value.trim();
  const phone = $("candidatePhone").value.trim();
  const code = $("accessCode").value.trim();
  const error = $("registrationError");
  error.textContent = "";

  if (!/^[A-Za-z0-9_-]{2,30}$/.test(studentId)) { error.textContent = "Student ID mein sirf letters, numbers, hyphen aur underscore use karein."; return; }
  if (!/^[A-Za-z ]{2,30}$/.test(fullName) || !/^[A-Za-z ]{2,30}$/.test(fatherName)) { error.textContent = "Student aur father name mein sirf letters/spaces hon, maximum 30 characters."; return; }
  if (!/^03\d{9}$/.test(phone)) { error.textContent = "Mobile number exactly 11 digits ho aur 03 se start ho."; return; }
  if (code.length < 4) { error.textContent = "Enter 6-digit access code or lifetime password (999990)."; return; }

  $("registrationSubmit").disabled = true;
  const fullscreenRequest = requestExamFullscreen();
  try {
    await fullscreenRequest;
    const assignedEntry = await verifyPasscode(code, studentId, fullName, fatherName, phone);
    state.candidate = assignedEntry;
    closeRegistration();
    await runLoadingSequence();
    hide("homeView"); hide("resultView"); hide("failureView"); show("examView");

    // LIVE BLOCK LISTENER: If student is inside exam and Admin blocks them, terminate exam instantly!
    if (assignedEntry.isPermanent && assignedEntry.studentKey) {
      if (state.liveBlockListener) state.liveBlockListener.off();
      state.liveBlockListener = database.ref(`permanentStudents/${assignedEntry.studentKey}/isBlocked`);
      state.liveBlockListener.on("value", (snap) => {
        if (snap.val() === true && state.examActive) {
          terminateActiveExam("Your ID is blocked from admin side");
        }
      });
    }

    $("examCardFrame").contentWindow.postMessage({
      type: "skilltester:start-exam",
      exam: state.exam
    }, "*");
  } catch (verificationError) {
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => undefined);
    $("loaderScreen").classList.remove("open");
    error.textContent = verificationError.message || "Passcode verification failed.";
  } finally { $("registrationSubmit").disabled = false; }
}

function runLoadingSequence() {
  playSound("loading");
  $("loaderTitle").textContent = "Verifying Passcode...";
  $("loaderText").textContent = "Checking secure access status";
  $("loaderProgress").style.width = "20%";
  $("loaderScreen").classList.add("open");
  return new Promise((resolve) => {
    window.setTimeout(() => {
      $("loaderTitle").textContent = "Initializing Anti-Cheating Environment...";
      $("loaderText").textContent = "Locking keyboard and preparing secure questions";
      $("loaderProgress").style.width = "100%";
      document.querySelectorAll(".loader-step")[0]?.classList.remove("active");
      document.querySelectorAll(".loader-step")[1]?.classList.add("active");
    }, 1000);
    window.setTimeout(() => {
      document.querySelectorAll(".loader-step")[1]?.classList.remove("active");
      document.querySelectorAll(".loader-step")[2]?.classList.add("active");
      $("loaderScreen").classList.remove("open");
      resolve();
    }, 2000);
  });
}

function finalizeExamResult(reason, cheating = false, result = {}) {
  if (state.finishing) return;
  state.finishing = true;
  state.examActive = false;
  if (state.liveBlockListener) {
    state.liveBlockListener.off();
    state.liveBlockListener = null;
  }
  document.body.classList.remove("exam-in-progress");
  state.score = Number.isInteger(result.correctAnswers)
    ? Math.max(0, Math.min(result.correctAnswers, result.questionCount || 0))
    : state.score;
  state.questionCount = Number.isInteger(result.questionCount) && result.questionCount > 0
    ? result.questionCount
    : state.questionCount;
  state.answerReview = !cheating && Array.isArray(result.answerReview)
    ? result.answerReview.filter((item) => item &&
      typeof item.subject === "string" &&
      typeof item.question === "string" &&
      (typeof item.selectedAnswer === "string" || item.selectedAnswer === null) &&
      typeof item.correctAnswer === "string")
    : [];
  renderAnswerReview(state.answerReview);
  sessionStorage.removeItem(SESSION_KEY);
  if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => undefined);
  const finalMarks = calculateMarks(state.score);
  if (cheating || finalMarks < PASSING_SCORE) {
    saveExamResult(finalMarks, cheating ? "TERMINATED" : "FAILED", reason); playSound("failure"); renderFailure(reason, cheating);
  } else { saveExamResult(finalMarks, "PASSED", reason); playSound("success"); renderResult(); }
}

function terminateActiveExam(reason) {
  if (!state.examActive) return;
  $("examCardFrame").contentWindow.postMessage({ type: "skilltester:terminate-exam", reason }, "*");
  finalizeExamResult(reason, true);
}

// SAVE EXAM RESULT: ALWAYS saves actual student name (Never "Candidate")
function saveExamResult(finalMarks, status, reason) {
  const actualName = state.candidate?.fullName || state.candidate?.studentName || "Student";
  const studentId = state.candidate?.studentId || "—";
  const isPermanent = state.candidate?.isPermanent === true;

  database.ref("examResults").push({
    candidate: {
      studentId: studentId,
      fullName: actualName,
      studentName: actualName,
      fatherName: state.candidate?.fatherName || "—",
      phone: state.candidate?.phone || "—",
      exam: state.exam,
      isPermanent: isPermanent
    },
    studentName: actualName,
    studentId: studentId,
    exam: state.exam,
    marks: finalMarks,
    totalMarks: EXAM_TOTAL_MARKS,
    correctAnswers: state.score,
    percentage: finalMarks,
    status,
    reason,
    isPermanent: isPermanent,
    questionCount: state.questionCount,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  }).catch(() => undefined);
}

function renderFailure(reason, cheating) {
  hide("examView"); hide("homeView"); hide("failureView"); show("resultView");
  $("scorecard").classList.remove("hidden");
  const finalMarks = calculateMarks(state.score);
  const percentage = finalMarks;
  $("scorecard").classList.add("result-failed");
  $("resultIcon").textContent = "!";
  $("resultEyebrow").textContent = cheating ? "Security termination" : "Assessment complete";
  $("resultHeading").textContent = cheating ? "Exam Terminated" : "Exam failed: pass mark not reached.";
  $("resultSubtitle").textContent = reason || "Session closed.";
  
  // Exact student name
  const actualName = state.candidate?.fullName || state.candidate?.studentName || "Student";
  $("resultName").textContent = actualName;
  $("resultFather").textContent = state.candidate?.fatherName || "—";
  $("resultScore").textContent = `${finalMarks} / ${EXAM_TOTAL_MARKS}`;
  $("resultPercentage").textContent = `${percentage}%`;
  $("resultRating").textContent = cheating ? "TERMINATED" : "FAILED";
  loadLiveResults();
  window.setTimeout(() => $("resultView").scrollIntoView({ behavior: "smooth", block: "start" }), 50);
}

function renderResult() {
  hide("examView"); hide("homeView"); hide("failureView"); show("resultView");
  $("scorecard").classList.remove("hidden");
  $("scorecard").classList.remove("result-failed");
  const finalMarks = calculateMarks(state.score);
  const percentage = finalMarks;

  // Exact student name
  const actualName = state.candidate?.fullName || state.candidate?.studentName || "Student";
  $("resultName").textContent = actualName;
  $("resultFather").textContent = state.candidate?.fatherName || "—";
  $("resultScore").textContent = `${finalMarks} / ${EXAM_TOTAL_MARKS}`;
  $("resultPercentage").textContent = `${percentage}%`;
  $("resultRating").textContent = percentage >= 90 ? "Outstanding" : percentage >= 75 ? "Excellent" : "Qualified";
  $("resultIcon").textContent = "✓";
  $("resultEyebrow").textContent = "Assessment passed";
  $("resultHeading").textContent = "Congratulations, you passed.";
  $("resultSubtitle").textContent = "Your verified result card is ready. Download it below.";
  loadLiveResults();
  window.setTimeout(() => $("resultView").scrollIntoView({ behavior: "smooth", block: "start" }), 50);
}

async function downloadScorecard() {
  const actualName = state.candidate?.fullName || state.candidate?.studentName || "Student";
  const canvas = await html2canvas($("scorecard"), { backgroundColor: "#1e293b", scale: 2 });
  const image = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
  pdf.addImage(image, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(`skilltester-${actualName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`);
}

async function loadLiveResults() {
  const status = $("resultsStatus");
  const list = $("publicResultsList");
  if (!status || !list) return;
  status.textContent = "Live results Firebase se load ho rahe hain...";
  try {
    const snapshot = await database.ref("examResults").limitToLast(30).once("value");
    const results = Object.values(snapshot.val() || {}).reverse();
    list.innerHTML = results.map((result) => {
      const studentName = result.candidate?.fullName || result.candidate?.studentName || result.studentName || "Student";
      return `<div class="public-result-row"><span><strong>${escapeHtml(studentName)}</strong><small>${escapeHtml(result.status || "UNKNOWN")}</small></span><strong class="public-result-score">${escapeHtml(result.marks ?? "-")} / ${EXAM_TOTAL_MARKS}</strong></div>`;
    }).join("");
    status.textContent = results.length ? "Latest results live Firebase se update ho rahe hain." : "Abhi koi exam result available nahi hai.";
  } catch (error) {
    status.textContent = "Live results load nahi ho sake. Refresh karke dobara try karein.";
  }
}

function goHome(event) {
  event.preventDefault();
  if (state.examActive) { toast("Exam ke dauran Home par jana allowed nahi hai.", "danger"); return; }
  hide("examView"); hide("resultView"); hide("failureView"); show("homeView");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goExam(event) {
  event.preventDefault();
  if (state.examActive) { $("examView").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  hide("homeView"); hide("resultView"); hide("failureView"); show("examView");
  $("examView").scrollIntoView({ behavior: "smooth", block: "start" });
}

function goResults(event) {
  event.preventDefault();
  if (state.examActive) { toast("Exam ke dauran Results par jana allowed nahi hai.", "danger"); return; }
  hide("examView"); hide("homeView"); hide("failureView"); show("resultView");
  loadLiveResults();
  $("resultView").scrollIntoView({ behavior: "smooth", block: "start" });
}

$("startButton").addEventListener("click", openRegistration);
$("closeRegistration").addEventListener("click", closeRegistration);
$("registrationForm").addEventListener("submit", submitRegistration);
$("adminButton").addEventListener("click", openAdminPanel);
$("closeAdmin").addEventListener("click", closeAdminPanel);
$("downloadButton").addEventListener("click", downloadScorecard);
$("refreshResults").addEventListener("click", loadLiveResults);

window.addEventListener("message", (event) => {
  const frame = $("examCardFrame");
  if (event.source !== frame.contentWindow || !event.data || typeof event.data !== "object") return;
  const message = event.data;
  if (message.type === "skilltester:begin-exam") {
    if (state.examActive) {
      toast("Exam pehle se chal raha hai.", "danger");
      return;
    }
    hide("homeView"); hide("resultView"); hide("failureView"); show("examView");
    openRegistration();
  } else if (message.type === "skilltester:exam-started") {
    if (!state.candidate) {
      frame.contentWindow.postMessage({
        type: "skilltester:terminate-exam",
        reason: "Secure exam session could not be started."
      }, "*");
      toast("Secure exam session could not be started.", "danger");
      return;
    }
    state.examActive = true;
    state.finishing = false;
    state.score = 0;
    state.questionCount = Number.isInteger(message.questionCount) && message.questionCount > 0
      ? message.questionCount
      : 0;
    document.body.classList.add("exam-in-progress");
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ candidate: state.candidate, startedAt: Date.now() }));
    bindAntiCheat();
    if (!document.fullscreenElement) terminateActiveExam("Fullscreen was exited before the exam started.");
  } else if (message.type === "skilltester:exam-progress" && state.examActive) {
    if (!Number.isInteger(message.correctAnswers) || !Number.isInteger(message.questionCount) ||
        message.questionCount < 1 || message.correctAnswers < 0 ||
        message.correctAnswers > message.questionCount) return;
    state.score = message.correctAnswers;
    state.questionCount = message.questionCount;
  } else if (message.type === "skilltester:exam-finished" && state.examActive) {
    finalizeExamResult(message.reason || "Exam completed.", message.cheating === true, message);
  } else if (message.type === "skilltester:exam-error") {
    toast(typeof message.message === "string" ? message.message : "Exam could not be started.", "danger");
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => undefined);
  }
});

$("studentId").addEventListener("input", (event) => { event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 30); });
document.querySelector('.main-nav a[href="#homeView"]').addEventListener("click", goHome);
document.querySelector('.main-nav a[href="#examView"]').addEventListener("click", goExam);
document.querySelector('.main-nav a[href="#resultView"]').addEventListener("click", goResults);
$("fullName").addEventListener("input", (event) => { event.target.value = event.target.value.replace(/[^A-Za-z ]/g, "").slice(0, 30); });
$("fatherName").addEventListener("input", (event) => { event.target.value = event.target.value.replace(/[^A-Za-z ]/g, "").slice(0, 30); });
$("candidatePhone").addEventListener("input", (event) => { event.target.value = event.target.value.replace(/\D/g, "").slice(0, 11); });
// Input limiter allows both 6-digit one-time code and lifetime passwords:
$("accessCode").addEventListener("input", (event) => { event.target.value = event.target.value.slice(0, 20); });
bindSecurityDefaults();