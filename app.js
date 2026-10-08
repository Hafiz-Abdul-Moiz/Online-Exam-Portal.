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
  exam: "Computer Science Group",
  durationMinutes: 60,
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
  maxShortcutAttempts: 3,
  lastSavedResultKey: null
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
  } catch (error) { /* Sound enhancement */ }
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
    event.preventDefault();
    event.stopPropagation();
    if (state.examActive) {
      recordShortcutAttempt("Right-Click Context Menu");
    }
    return false;
  }, true);

  const blockNonLeftClick = (event) => {
    if (event.button !== 0) {
      event.preventDefault();
      event.stopPropagation();
      if (state.examActive) {
        recordShortcutAttempt("Right/Auxiliary Mouse Click");
      }
      return false;
    }
  };
  window.addEventListener("mousedown", blockNonLeftClick, true);
  window.addEventListener("mouseup", blockNonLeftClick, true);
  window.addEventListener("auxclick", blockNonLeftClick, true);

  // Global developer tools & inspection shortcut prevention
  window.addEventListener("keydown", (event) => {
    const key = event.key || "";
    const isFKey = /^F\d+$/.test(key) || (event.keyCode >= 112 && event.keyCode <= 123);
    const isDangerousCtrl = event.ctrlKey && ["u", "s", "p", "r", "i", "j"].includes(key.toLowerCase());
    const isPrintScreen = key === "PrintScreen" || event.keyCode === 44;
    if (isFKey || isDangerousCtrl || isPrintScreen) {
      event.preventDefault();
      event.stopPropagation();
      if (state.examActive) {
        recordShortcutAttempt(isPrintScreen ? "PrintScreen" : isFKey ? key : `Ctrl+${key}`);
      }
      return false;
    }
  }, true);
}

function recordShortcutAttempt(keyName) {
  if (!state.examActive || state.finishing) return;
  state.shortcutAttempts = (state.shortcutAttempts || 0) + 1;
  const remaining = state.maxShortcutAttempts - state.shortcutAttempts;

  if (state.shortcutAttempts >= state.maxShortcutAttempts) {
    terminateActiveExam(`Exam Terminated: Multiple unauthorized keyboard shortcut attempts detected (${state.shortcutAttempts} attempts: ${keyName}).`);
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
  const isDangerousCtrl = event.ctrlKey && ["u", "s", "p", "r", "w", "i", "j", "c", "v"].includes(key.toLowerCase());

  if (isEscape || isPrintScreen || isFKey || isAltCombo || isMetaKey || isDangerousCtrl) {
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    recordShortcutAttempt(isEscape ? "Escape" : isPrintScreen ? "PrintScreen" : isFKey ? key : isAltCombo ? "Alt Shortcut" : isMetaKey ? "Windows Key" : `Ctrl+${key}`);
    return false;
  }
}

function bindAntiCheat() {
  if (state.antiCheatBound) return;
  state.antiCheatBound = true;

  document.addEventListener("fullscreenchange", () => {
    if (state.examActive && !state.finishing) {
      if (!document.fullscreenElement) {
        terminateActiveExam("Exam Terminated: Fullscreen mode was exited.");
      }
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.examActive && !state.finishing) {
      terminateActiveExam("AI Sentinel Disqualification: Tab switch or background mode detected.");
    }
  });

  window.addEventListener("blur", () => {
    if (!state.examActive || state.finishing) return;
    window.setTimeout(() => {
      if (!state.examActive || state.finishing) return;
      const activeEl = document.activeElement;
      const isExamIframe = activeEl && (activeEl.id === "examCardFrame" || activeEl.tagName === "IFRAME");
      if (isExamIframe || !document.hidden) return;
      if (document.hidden) {
        terminateActiveExam("AI Sentinel Disqualification: Candidate switched away from exam window.");
      }
    }, 300);
  });

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

function openRegistration(preselectedExam = "Computer Science Group") {
  if (state.examActive) {
    toast("Exam chal raha hai.", "info");
    return;
  }
  $("registrationModal").classList.add("open");
  $("registrationForm").reset();
  $("registrationError").textContent = "";
  if ($("selectedExamGroup")) $("selectedExamGroup").value = preselectedExam;
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

async function verifyPasscode(code, studentId, fullName, fatherName, phone, selectedExam) {
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

  // CASE A: Permanent Lifetime Access Password "999990"
  if (rawCode === UNIVERSAL_LIFETIME_PASSWORD) {
    const permSnap = await database.ref(`permanentStudents/${studentKey}`).once("value");
    const permData = permSnap.val();

    if (!permData) {
      const oneTimeSnap = await database.ref(`studentIdToPasscode/${studentKey}`).once("value");
      if (oneTimeSnap.exists()) {
        throw new Error(`Student ID "${studentId}" One-Time Form mein bani hui hai. Kripya apna 6-digit One-Time Code enter karein, 999990 nahi.`);
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

    state.exam = permData.exam || selectedExam || "Computer Science Group";
    state.durationMinutes = permData.durationMinutes || 60;

    return {
      code: UNIVERSAL_LIFETIME_PASSWORD,
      studentId: permData.studentId || normStudentId,
      studentName: permData.studentName,
      fullName: permData.studentName,
      fatherName: permData.fatherName,
      phone: permData.phone,
      exam: state.exam,
      durationMinutes: state.durationMinutes,
      isPermanent: true,
      studentKey
    };
  }

  // CASE B: One-Time 6-Digit Passcode
  if (!rawCode || rawCode.length < 4) {
    throw new Error("Kripya apna 6-digit One-Time Code ya Permanent Password (999990) enter karein.");
  }

  const codeSnap = await database.ref(`passcodes/${rawCode}`).once("value");
  const codeData = codeSnap.val();

  if (!codeData) {
    const permSnap = await database.ref(`permanentStudents/${studentKey}`).once("value");
    if (permSnap.exists()) {
      throw new Error(`Yeh Permanent Student ID hai! Is ke liye Lifetime Password enter karein: "${UNIVERSAL_LIFETIME_PASSWORD}".`);
    }
    throw new Error(`Passcode "${rawCode}" exist nahi karta! Sahi 6-digit One-Time Code enter karein.`);
  }

  if (codeData.isUsed === true) {
    throw new Error(`Yeh One-Time Code (${rawCode}) pehle use ho chuka hai!`);
  }

  if (Number(codeData.expiresAt || Infinity) <= Date.now()) {
    throw new Error("Yeh access code expire ho chuka hai.");
  }

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

  // Mark code as used
  await database.ref(`passcodes/${rawCode}`).update({
    isUsed: true,
    usedAt: firebase.database.ServerValue.TIMESTAMP,
    status: "used"
  });

  state.exam = codeData.exam || selectedExam || "Computer Science Group";
  state.durationMinutes = codeData.durationMinutes || 60;

  return {
    code: rawCode,
    studentId: codeData.studentId || normStudentId,
    studentName: codeData.studentName || fullName,
    fullName: codeData.studentName || fullName,
    fatherName: codeData.fatherName || fatherName,
    phone: codeData.phone || phone,
    exam: state.exam,
    durationMinutes: state.durationMinutes,
    isPermanent: false
  };
}

async function submitRegistration(event) {
  event.preventDefault();
  const studentId = $("studentId").value.trim().toUpperCase();
  const fullName = $("fullName").value.trim();
  const fatherName = $("fatherName").value.trim();
  const phone = $("candidatePhone").value.trim();
  const selectedExam = $("selectedExamGroup")?.value || "Computer Science Group";
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
    const assignedEntry = await verifyPasscode(code, studentId, fullName, fatherName, phone, selectedExam);
    state.candidate = assignedEntry;
    closeRegistration();

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
      durationMinutes: state.durationMinutes,
      currentQuestion: 1,
      secondsLeft: state.durationMinutes * 60,
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
      exam: state.exam,
      durationMinutes: state.durationMinutes
    }, "*");
  } catch (err) {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    $("loaderScreen").classList.remove("open");
    error.textContent = err.message || "Passcode verification failed.";
  } finally {
    $("registrationSubmit").disabled = false;
  }
}

function runLoadingSequence() {
  playSound("loading");
  $("loaderTitle").textContent = "Verifying Passcode...";
  $("loaderText").textContent = "Authenticating candidate identity";
  $("loaderProgress").style.width = "25%";
  $("loaderScreen").classList.add("open");
  return new Promise((resolve) => {
    window.setTimeout(() => {
      $("loaderTitle").textContent = "Initializing AI Proctor Sentinel...";
      $("loaderText").textContent = "Arming screen surveillance & real-time telemetry";
      $("loaderProgress").style.width = "100%";
      document.querySelectorAll(".loader-step")[0]?.classList.remove("active");
      document.querySelectorAll(".loader-step")[1]?.classList.add("active");
    }, 700);
    window.setTimeout(() => {
      document.querySelectorAll(".loader-step")[1]?.classList.remove("active");
      document.querySelectorAll(".loader-step")[2]?.classList.add("active");
      $("loaderScreen").classList.remove("open");
      resolve();
    }, 1500);
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
  state.score = typeof result.correctAnswers === "number"
    ? Math.max(0, Math.min(result.correctAnswers, result.questionCount || 0))
    : state.score;
  state.questionCount = Number.isInteger(result.questionCount) && result.questionCount > 0
    ? result.questionCount
    : state.questionCount;
  state.answerReview = !cheating && Array.isArray(result.answerReview)
    ? result.answerReview.filter((item) => item && typeof item.subject === "string")
    : [];
  renderAnswerReview(state.answerReview);
  sessionStorage.removeItem(SESSION_KEY);
  if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => undefined);
  const finalMarks = calculateMarks(state.score);

  const isWebDev = state.exam && (
    state.exam.toLowerCase().includes("web") ||
    state.exam.toLowerCase().includes("html") ||
    state.exam === "All Subjects"
  );
  const passingScore = isWebDev ? 40 : PASSING_SCORE;
  const status = cheating ? "TERMINATED" : finalMarks < passingScore ? "FAILED" : "PASSED";

  const actualName = state.candidate?.fullName || state.candidate?.studentName || "Student";
  const studentId = state.candidate?.studentId || "—";
  const fatherName = state.candidate?.fatherName || "—";
  const phone = state.candidate?.phone || "—";
  const exam = state.exam || "Computer Science Group";

  const immediateParams = `studentId=${encodeURIComponent(studentId)}&name=${encodeURIComponent(actualName)}&father=${encodeURIComponent(fatherName)}&phone=${encodeURIComponent(phone)}&exam=${encodeURIComponent(exam)}&marks=${encodeURIComponent(finalMarks)}&status=${encodeURIComponent(status)}&reason=${encodeURIComponent(reason)}`;
  const vipLink = $("openVipMarksheetBtn");
  const disLink = $("viewDisciplinaryRecordBtn");
  if (vipLink) vipLink.href = `Marksheet.html?${immediateParams}`;
  if (disLink) disLink.href = `Marksheet.html?${immediateParams}`;

  saveExamResult(finalMarks, status, reason, result, (savedKey) => {
    state.lastSavedResultKey = savedKey;
    if (vipLink) vipLink.href = `Marksheet.html?resultKey=${encodeURIComponent(savedKey)}&${immediateParams}`;
    if (disLink) disLink.href = `Marksheet.html?resultKey=${encodeURIComponent(savedKey)}&${immediateParams}`;
  });

  if (cheating || finalMarks < passingScore) {
    playSound("failure");
    renderFailure(reason, cheating);
  } else {
    playSound("success");
    renderResult();
  }
}

function terminateActiveExam(reason) {
  if (!state.examActive) return;
  $("examCardFrame").contentWindow.postMessage({ type: "skilltester:terminate-exam", reason }, "*");
  finalizeExamResult(reason, true);
}

function saveExamResult(finalMarks, status, reason, extra = {}, callback) {
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

  const newRef = database.ref("examResults").push();
  newRef.set(resultPayload).then(() => {
    if (callback) callback(newRef.key);
  }).catch(() => {});
}

function renderFailure(reason, cheating) {
  hide("examView"); hide("homeView"); hide("resultView"); show("failureView");
  const failReasonEl = $("failureReason");
  if (failReasonEl) failReasonEl.textContent = reason || "Exam session cancelled.";
  loadLiveResults();
  window.setTimeout(() => $("failureView").scrollIntoView({ behavior: "smooth", block: "start" }), 50);
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
  $("resultRating").textContent = percentage >= 85 ? "Distinction" : percentage >= 70 ? "First Class" : "Qualified";
  $("resultIcon").textContent = "✓";
  $("resultEyebrow").textContent = "Assessment Passed";
  $("resultHeading").textContent = "Congratulations, you passed!";
  $("resultSubtitle").textContent = "Your official VVIP Animated Marksheet and Certificate is generated. Click below to view.";
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
      const isPassed = result.status === "PASSED";
      return `
        <div class="public-result-row">
          <span>
            <strong>${escapeHtml(studentName)}</strong>
            <small>${escapeHtml(result.candidate?.exam || result.exam || "CS Group")} · ${escapeHtml(result.status || "UNKNOWN")}</small>
          </span>
          <strong class="public-result-score" style="color:${isPassed ? "#4ade80" : "#f87171"};">${escapeHtml(result.marks ?? "-")} / ${EXAM_TOTAL_MARKS}</strong>
        </div>`;
    }).join("");
    status.textContent = results.length ? "Latest results live Firebase se update ho rahe hain." : "Abhi koi exam result available nahi hai.";
  } catch (error) {
    status.textContent = "Live results load nahi ho sake.";
  }
}

function goHome(event) {
  event.preventDefault();
  if (state.examActive) { toast("Exam ke dauran Home par jana allowed nahi hai.", "danger"); return; }
  hide("examView"); hide("resultView"); hide("failureView"); show("homeView");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goExam(event) {
  if (event) event.preventDefault();
  if (state.examActive) { $("examView").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  hide("homeView"); hide("resultView"); hide("failureView"); show("examView");
  $("examCardFrame")?.contentWindow?.postMessage({ type: "skilltester:reset-overview" }, "*");
  $("examView").scrollIntoView({ behavior: "smooth", block: "start" });
}

function goResults(event) {
  event.preventDefault();
  if (state.examActive) { toast("Exam ke dauran Results par jana allowed nahi hai.", "danger"); return; }
  hide("examView"); hide("homeView"); hide("failureView"); show("resultView");
  loadLiveResults();
  $("resultView").scrollIntoView({ behavior: "smooth", block: "start" });
}

$("startButton")?.addEventListener("click", (e) => {
  if (e) e.preventDefault();
  goExam();
});

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
    openRegistration(message.exam || "Computer Science Group");
  } else if (message.type === "skilltester:exam-started") {
    if (!state.candidate) {
      frame.contentWindow.postMessage({
        type: "skilltester:terminate-exam",
        reason: "Secure exam session could not be started."
      }, "*");
      return;
    }
    state.examActive = true;
    state.finishing = false;
    state.shortcutAttempts = 0;
    state.score = 0;
    state.questionCount = Number.isInteger(message.questionCount) ? message.questionCount : 60;
    document.body.classList.add("exam-in-progress");
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ candidate: state.candidate, startedAt: Date.now() }));
    bindAntiCheat();
  } else if (message.type === "skilltester:shortcut-attempt" && state.examActive) {
    recordShortcutAttempt(message.key);
  } else if (message.type === "skilltester:exam-progress" && state.examActive) {
    state.score = message.correctAnswers || 0;
    state.questionCount = message.questionCount || 60;
    if (state.activeSessionId) {
      database.ref(`activeExamSessions/${state.activeSessionId}`).update({
        currentQuestion: message.currentQuestion || 1,
        secondsLeft: message.secondsLeft || 3600,
        score: message.correctAnswers
      }).catch(() => {});
    }
  } else if (message.type === "skilltester:exam-finished" && state.examActive) {
    finalizeExamResult(message.reason || "Exam completed.", message.cheating === true, message);
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

try {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("openAdmin") === "true") {
    openAdminPanel();
  }
} catch (e) {}
