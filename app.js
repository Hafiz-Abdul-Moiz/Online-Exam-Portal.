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

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
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
  liveBlockListener: null,
  activeSessionId: null,
  activeSessionListener: null,
  lastWarningSeen: 0,
  shortcutAttempts: 0,
  maxShortcutAttempts: 4
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

function bindSecurityDefaults() {
  document.addEventListener("contextmenu", (event) => {
    if (state.examActive) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  // Left click is allowed (button === 0); block other mouse buttons when exam is active
  const blockNonLeftClick = (event) => {
    if (!state.examActive) return;
    if (event.button !== 0) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  };
  window.addEventListener("mousedown", blockNonLeftClick, true);
  window.addEventListener("mouseup", blockNonLeftClick, true);
  window.addEventListener("auxclick", blockNonLeftClick, true);
}

function recordShortcutAttempt(keyName) {
  if (!state.examActive || state.finishing) return;
  state.shortcutAttempts = (state.shortcutAttempts || 0) + 1;
  const remaining = state.maxShortcutAttempts - state.shortcutAttempts;

  if (state.shortcutAttempts >= state.maxShortcutAttempts) {
    terminateActiveExam(`Exam Terminated: Multiple unauthorized keyboard shortcut attempts detected (${state.shortcutAttempts} attempts: Escape/Restricted keys).`);
  } else {
    const warningMsg = `⚠️ SECURITY WARNING (Attempt ${state.shortcutAttempts}/${state.maxShortcutAttempts}): Key '${keyName}' is BLOCKED! Keyboard shortcuts are locked. ${remaining} attempt(s) remaining before immediate EXAM TERMINATION!`;
    playSound("wrong");
    toast(warningMsg, "danger");
    $("examCardFrame")?.contentWindow?.postMessage({
      type: "skilltester:admin-warning",
      warning: warningMsg
    }, "*");
  }
}

function handleRestrictedKey(event) {
  if (!state.examActive || state.finishing) return;
  const key = event.key || "";
  const isEscape = key === "Escape" || key === "Esc" || event.keyCode === 27;
  const isPrintScreen = key === "PrintScreen" || event.keyCode === 44;
  const isFKey = /^F\d+$/.test(key) || (event.keyCode >= 112 && event.keyCode <= 123);
  const isAltCombo = event.altKey;
  const isMetaKey = event.metaKey;
  const isDangerousCtrl = event.ctrlKey && ["u", "s", "p", "r", "w", "i", "j"].includes(key.toLowerCase());

  if (isEscape || isPrintScreen || isFKey || isAltCombo || isMetaKey || isDangerousCtrl) {
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    recordShortcutAttempt(isEscape ? "Escape (Esc)" : isPrintScreen ? "PrintScreen" : isFKey ? key : isAltCombo ? "Alt Shortcut" : isMetaKey ? "Windows Key" : `Ctrl+${key}`);
    return false;
  }
}

function bindAntiCheat() {
  if (state.antiCheatBound) return;
  state.antiCheatBound = true;

  // 1. Fullscreen exit detection (clicking Chrome top X button or exiting Esc mode)
  document.addEventListener("fullscreenchange", () => {
    if (state.examActive && !state.finishing) {
      if (!document.fullscreenElement) {
        terminateActiveExam("Exam Terminated: Fullscreen mode was exited via top (X) button or Escape.");
      }
    }
  });

  // 2. Genuine tab switch / minimization detection
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.examActive && !state.finishing) {
      terminateActiveExam("Tab switch or background mode detected.");
    }
  });

  // 3. Window blur: only terminate if user genuinely switched to another window/app
  window.addEventListener("blur", () => {
    if (!state.examActive || state.finishing) return;
    window.setTimeout(() => {
      if (!state.examActive || state.finishing) return;
      const activeEl = document.activeElement;
      const isExamIframe = activeEl && (activeEl.id === "examCardFrame" || activeEl.tagName === "IFRAME");
      if (isExamIframe || !document.hidden) {
        // Candidate is still inside the exam arena! Do NOT terminate!
        return;
      }
      if (document.hidden) {
        terminateActiveExam("Window focus lost or candidate switched away from exam.");
      }
    }, 300);
  });

  // 4. Keyboard shortcut guard on parent window
  window.addEventListener("keydown", handleRestrictedKey, true);
}

function requestExamFullscreen() {
  if (document.fullscreenElement || isMobileDevice()) return Promise.resolve();
  const root = document.documentElement;
  const method = root.requestFullscreen || root.webkitRequestFullscreen || root.msRequestFullscreen;
  return method ? method.call(root).catch(() => undefined) : Promise.resolve();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
}

function sanitizeKey(key) {
  return String(key ?? "").replace(/[.#$\[\]]/g, "_").trim().toUpperCase();
}

function openRegistration() {
  if (state.examActive) {
    toast("Exam chal raha hai.", "info");
    return;
  }
  $("registrationModal").classList.add("open");
  $("registrationForm").reset();
  $("registrationError").textContent = "";
  $("studentId").focus();
}

function closeRegistration() {
  $("registrationModal").classList.remove("open");
}

function openAdminPanel() {
  if (state.examActive) {
    toast("Exam chalte hue Admin panel kholna mana hai.", "danger");
    return;
  }
  $("adminModal").classList.add("open");
}

function closeAdminPanel() {
  $("adminModal").classList.remove("open");
  $("adminPanelFrame")?.contentWindow?.postMessage({ type: "skilltester:admin-closed" }, "*");
}

async function verifyPasscode(code, studentId, fullName, fatherName, phone) {
  const adminSnapshot = await database.ref("adminCode").once("value");
  const adminData = adminSnapshot.val() || {};
  if (adminData.isEnabled === false) {
    throw new Error("Portal administrator ne exam access band kar di hai.");
  }

  const normStudentId = String(studentId || "").trim().toUpperCase();
  const studentKey = sanitizeKey(normStudentId);
  const normFullName = String(fullName || "").trim().toLowerCase();
  const normFatherName = String(fatherName || "").trim().toLowerCase();
  const normPhone = String(phone || "").trim();
  const rawCode = String(code || "").trim();

  // ==============================================================
  // CASE A: Candidate entered the Lifetime Password "999990"
  // STRICT RULE: Only students created in Form 2 (Permanent) can use 999990!
  // ==============================================================
  if (rawCode === UNIVERSAL_LIFETIME_PASSWORD) {
    const permSnap = await database.ref(`permanentStudents/${studentKey}`).once("value");
    const permData = permSnap.val();

    if (!permData) {
      // Check if this student belongs to Form 1 (One-Time)
      const oneTimeSnap = await database.ref(`studentIdToPasscode/${studentKey}`).once("value");
      if (oneTimeSnap.exists()) {
        throw new Error(`Student ID "${studentId}" One-Time Form (Form 1) mein bani hui hai! Yeh Permanent ID nahi hai. Kripya apna 6-digit One-Time Code enter karein, 999990 nahi.`);
      }
      throw new Error(`Student ID "${studentId}" Permanent list (Form 2) mein registered nahi hai! Pehle Admin Panel se Form 2 mein Permanent ID create karein.`);
    }

    if (permData.isBlocked === true) {
      throw new Error("Your ID is blocked from admin side");
    }

    if (permData.studentName.trim().toLowerCase() !== normFullName) {
      throw new Error(`Student name match nahi hua! Registered name: "${permData.studentName}".`);
    }
    if (permData.fatherName.trim().toLowerCase() !== normFatherName) {
      throw new Error(`Father name match nahi hua! Registered father: "${permData.fatherName}".`);
    }
    if (permData.phone.trim() !== normPhone) {
      throw new Error(`Mobile number match nahi hua! Registered number: "${permData.phone}".`);
    }

    state.exam = permData.exam || "All Subjects";
    return {
      code: UNIVERSAL_LIFETIME_PASSWORD,
      studentId: permData.studentId || normStudentId,
      studentName: permData.studentName,
      fullName: permData.studentName,
      fatherName: permData.fatherName,
      phone: permData.phone,
      exam: permData.exam || "All Subjects",
      isPermanent: true,
      studentKey
    };
  }

  // ==============================================================
  // CASE B: Candidate entered a One-Time Code (Form 1)
  // STRICT RULE: Must be a valid 6-digit code created in Form 1 for THIS student!
  // ==============================================================
  if (!rawCode || rawCode.length < 4) {
    throw new Error("Kripya apna 6-digit One-Time Code ya Permanent Password (999990) enter karein.");
  }

  // 1. Direct lookup in passcodes
  const codeSnap = await database.ref(`passcodes/${rawCode}`).once("value");
  const codeData = codeSnap.val();

  if (!codeData) {
    // If student is actually a Permanent student who typed wrong code:
    const permSnap = await database.ref(`permanentStudents/${studentKey}`).once("value");
    if (permSnap.exists()) {
      throw new Error(`Yeh Permanent Student ID hai! Is ke liye Lifetime Password enter karein: "${UNIVERSAL_LIFETIME_PASSWORD}".`);
    }
    throw new Error(`Passcode "${rawCode}" exist nahi karta! Sahi 6-digit One-Time Code enter karein.`);
  }

  // 2. Check if code has already been used
  if (codeData.isUsed === true) {
    throw new Error(`Yeh One-Time Code (${rawCode}) pehle use ho chuka hai! Ek code sirf ek dafa use ho sakta hai.`);
  }

  // 3. Check if expired by time
  if (Number(codeData.expiresAt || Infinity) <= Date.now()) {
    throw new Error("Yeh access code expire ho chuka hai.");
  }

  // 4. Verify that this specific code belongs to this student
  if (codeData.studentId && codeData.studentId.trim().toUpperCase() !== normStudentId) {
    throw new Error(`Yeh code Student ID "${normStudentId}" ka nahi hai! Yeh code Student ID "${codeData.studentId}" ko issue hua tha.`);
  }

  if (codeData.studentName && codeData.studentName.trim().toLowerCase() !== normFullName) {
    throw new Error(`Student name match nahi hua! Registered name: "${codeData.studentName}".`);
  }

  if (codeData.fatherName && codeData.fatherName.trim().toLowerCase() !== normFatherName) {
    throw new Error(`Father name match nahi hua! Registered father: "${codeData.fatherName}".`);
  }

  if (codeData.phone && codeData.phone.trim() !== normPhone) {
    throw new Error(`Mobile number match nahi hua! Registered number: "${codeData.phone}".`);
  }

  // 5. Mark THIS one-time code as used in Firebase
  await database.ref(`passcodes/${rawCode}`).update({
    isUsed: true,
    usedAt: firebase.database.ServerValue.TIMESTAMP,
    status: "used"
  });

  state.exam = codeData.exam || "All Subjects";
  return {
    code: rawCode,
    studentId: codeData.studentId || normStudentId,
    studentName: codeData.studentName || fullName,
    fullName: codeData.studentName || fullName,
    fatherName: codeData.fatherName || fatherName,
    phone: codeData.phone || phone,
    exam: codeData.exam || "All Subjects",
    isPermanent: false
  };
}

async function submitRegistration(event) {
  event.preventDefault();
  const studentId = $("studentId").value.trim().toUpperCase();
  const fullName = $("fullName").value.trim();
  const fatherName = $("fatherName").value.trim();
  const phone = $("candidatePhone").value.trim();
  const code = $("accessCode").value.trim();
  const error = $("registrationError");
  error.textContent = "";

  if (!/^[A-Za-z0-9_-]{2,30}$/.test(studentId)) {
    error.textContent = "Student ID mein sirf letters, numbers, hyphen aur underscore use karein.";
    return;
  }
  if (!/^[A-Za-z ]{2,30}$/.test(fullName) || !/^[A-Za-z ]{2,30}$/.test(fatherName)) {
    error.textContent = "Student aur father name mein sirf letters/spaces hon, maximum 30 characters.";
    return;
  }
  if (!/^03\d{9}$/.test(phone)) {
    error.textContent = "Mobile number exactly 11 digits ho aur 03 se start ho.";
    return;
  }
  if (code.length < 2) {
    error.textContent = "6-digit access code ya lifetime password (999990) enter karein.";
    return;
  }

  $("registrationSubmit").disabled = true;

  try {
    const assignedEntry = await verifyPasscode(code, studentId, fullName, fatherName, phone);
    state.candidate = assignedEntry;
    closeRegistration();

    // Enter Fullscreen officially ONLY when verification succeeds!
    await requestExamFullscreen();
    await runLoadingSequence();
    hide("homeView"); hide("resultView"); hide("failureView"); show("examView");

    state.activeSessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const sessionRef = database.ref(`activeExamSessions/${state.activeSessionId}`);
    await sessionRef.set({
      studentId: assignedEntry.studentId,
      studentName: assignedEntry.fullName,
      fullName: assignedEntry.fullName,
      exam: state.exam,
      currentQuestion: 1,
      secondsLeft: 1800,
      isPermanent: assignedEntry.isPermanent,
      startedAt: firebase.database.ServerValue.TIMESTAMP
    });

    state.activeSessionListener = sessionRef.on("value", (snap) => {
      const sess = snap.val();
      if (!sess) return;
      if (sess.forceTerminated === true && state.examActive) {
        terminateActiveExam(sess.terminateReason || "Terminated live by Admin Command Center.");
      }
      if (sess.lastWarning && sess.lastWarning.timestamp > state.lastWarningSeen && state.examActive) {
        state.lastWarningSeen = sess.lastWarning.timestamp;
        $("examCardFrame").contentWindow.postMessage({
          type: "skilltester:admin-warning",
          warning: sess.lastWarning.message
        }, "*");
      }
    });

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
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    $("loaderScreen").classList.remove("open");
    error.textContent = verificationError.message || "Passcode verification failed.";
  } finally {
    $("registrationSubmit").disabled = false;
  }
}

function runLoadingSequence() {
  playSound("loading");
  $("loaderTitle").textContent = "Verifying Passcode...";
  $("loaderText").textContent = "Checking secure access status";
  $("loaderProgress").style.width = "20%";
  $("loaderScreen").classList.add("open");
  return new Promise((resolve) => {
    window.setTimeout(() => {
      $("loaderTitle").textContent = "Arming High-Security AI Proctor Guard...";
      $("loaderText").textContent = "Locking display & syncing live telemetrics";
      $("loaderProgress").style.width = "100%";
      document.querySelectorAll(".loader-step")[0]?.classList.remove("active");
      document.querySelectorAll(".loader-step")[1]?.classList.add("active");
    }, 800);
    window.setTimeout(() => {
      document.querySelectorAll(".loader-step")[1]?.classList.remove("active");
      document.querySelectorAll(".loader-step")[2]?.classList.add("active");
      $("loaderScreen").classList.remove("open");
      resolve();
    }, 1600);
  });
}

function finalizeExamResult(reason, cheating = false, result = {}) {
  if (state.finishing) return;
  state.finishing = true;
  state.examActive = false;

  if (state.activeSessionId) {
    if (state.activeSessionListener) database.ref(`activeExamSessions/${state.activeSessionId}`).off();
    database.ref(`activeExamSessions/${state.activeSessionId}`).remove().catch(() => {});
    state.activeSessionId = null;
  }

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
    saveExamResult(finalMarks, cheating ? "TERMINATED" : "FAILED", reason, result);
    playSound("failure");
    renderFailure(reason, cheating);
  } else {
    saveExamResult(finalMarks, "PASSED", reason, result);
    playSound("success");
    renderResult();
  }
}

function terminateActiveExam(reason) {
  if (!state.examActive) return;
  $("examCardFrame").contentWindow.postMessage({ type: "skilltester:terminate-exam", reason }, "*");
  finalizeExamResult(reason, true);
}

function saveExamResult(finalMarks, status, reason, extra = {}) {
  const actualName = state.candidate?.fullName || state.candidate?.studentName || "Student";
  const studentId = state.candidate?.studentId || "—";
  const isPermanent = state.candidate?.isPermanent === true;

  const resultPayload = {
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
    fatherName: state.candidate?.fatherName || "—",
    phone: state.candidate?.phone || "—",
    exam: state.exam,
    marks: finalMarks,
    totalMarks: EXAM_TOTAL_MARKS,
    correctAnswers: state.score,
    percentage: finalMarks,
    status,
    reason,
    isPermanent: isPermanent,
    questionCount: state.questionCount,
    answerReview: state.answerReview || [],
    subjectBreakdown: extra.subjectBreakdown || {},
    createdAt: firebase.database.ServerValue.TIMESTAMP
  };

  database.ref("examResults").push(resultPayload).catch(() => {});
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
    state.shortcutAttempts = 0;
    state.score = 0;
    state.questionCount = Number.isInteger(message.questionCount) && message.questionCount > 0
      ? message.questionCount
      : 0;
    document.body.classList.add("exam-in-progress");
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ candidate: state.candidate, startedAt: Date.now() }));
    bindAntiCheat();
  } else if (message.type === "skilltester:shortcut-attempt" && state.examActive) {
    recordShortcutAttempt(message.key);
  } else if (message.type === "skilltester:exam-progress" && state.examActive) {
    if (!Number.isInteger(message.correctAnswers) || !Number.isInteger(message.questionCount) ||
        message.questionCount < 1 || message.correctAnswers < 0 ||
        message.correctAnswers > message.questionCount) return;
    state.score = message.correctAnswers;
    state.questionCount = message.questionCount;

    if (state.activeSessionId) {
      database.ref(`activeExamSessions/${state.activeSessionId}`).update({
        currentQuestion: message.currentQuestion || 1,
        secondsLeft: message.secondsLeft || 1800,
        score: message.correctAnswers
      }).catch(() => {});
    }
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
$("accessCode").addEventListener("input", (event) => { event.target.value = event.target.value.slice(0, 30); });

bindSecurityDefaults();
loadLiveResults();