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

function getExamConfig(examName) {
  const name = (examName || "").toLowerCase();
  if (name.includes("english") && !name.includes("group")) {
    return { totalMarks: 100, passingMarks: 50 };
  }
  if (name.includes("math") || name.includes("physic") || name.includes("pakistan") || name.includes("pak study") || (name.includes("computer science") && !name.includes("group"))) {
    return { totalMarks: 75, passingMarks: 25 };
  }
  if (name.includes("computer science group") || name.includes("cs group") || (name.includes("science") && !name.includes("web") && !name.includes("html"))) {
    return { totalMarks: 75, passingMarks: 25 };
  }
  if (name.includes("web") || name.includes("html") || name === "all subjects") {
    return { totalMarks: 100, passingMarks: 40 };
  }
  return { totalMarks: 75, passingMarks: 25 };
}

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
  maxShortcutAttempts: 6,
  fullscreenStrikes: 0,
  tabSwitchStrikes: 0,
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

function calculateMarks(correctAnswers, questionCount = state.questionCount, totalMarks = null) {
  const examCfg = getExamConfig(state.exam);
  const targetTotal = totalMarks || examCfg.totalMarks;
  if (!Number.isInteger(questionCount) || questionCount < 1) return 0;
  return Math.round((correctAnswers / questionCount) * targetTotal);
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

let fullscreenExitTimer = null;
let fullscreenCountdownSec = 10;

function showFullscreenLockOverlay(strikes, remaining) {
  const overlay = $("fullscreenLockOverlay");
  const warnText = $("fullscreenLockWarning");
  const countEl = $("fullscreenCountdownVal");
  if (overlay) {
    overlay.style.display = "flex";
    if (warnText) {
      const remText = remaining <= 0 
        ? "FINAL WARNING! Next exit will permanently terminate the exam!" 
        : `${remaining} warning(s) remaining before disqualification on 6th strike!`;
      warnText.textContent = `🚨 Fullscreen Exited (Strike ${strikes}/5): ${remText}`;
    }
    clearInterval(fullscreenExitTimer);
    fullscreenCountdownSec = 10;
    if (countEl) countEl.textContent = String(fullscreenCountdownSec);
    fullscreenExitTimer = setInterval(() => {
      if (!state.examActive || state.finishing) {
        clearInterval(fullscreenExitTimer);
        return;
      }
      fullscreenCountdownSec--;
      if (countEl) countEl.textContent = String(Math.max(0, fullscreenCountdownSec));
      if (fullscreenCountdownSec <= 0) {
        clearInterval(fullscreenExitTimer);
        terminateActiveExam("AI Sentinel Disqualification: Fullscreen was not restored within 10 seconds. Unauthorized window exit.");
      }
    }, 1000);
  }
}

function hideFullscreenLockOverlay() {
  clearInterval(fullscreenExitTimer);
  fullscreenExitTimer = null;
  const overlay = $("fullscreenLockOverlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}

function recordShortcutAttempt(keyName) {
  if (!state.examActive || state.finishing) return;
  state.shortcutAttempts = (state.shortcutAttempts || 0) + 1;
  const remaining = 5 - state.shortcutAttempts;

  if (state.shortcutAttempts >= state.maxShortcutAttempts) {
    terminateActiveExam(`Exam Terminated: Multiple unauthorized keyboard shortcut attempts detected (${state.shortcutAttempts} attempts: ${keyName}).`);
  } else {
    const remainingText = remaining <= 0
      ? "FINAL WARNING! 0 warnings remaining. Next attempt will immediately TERMINATE the exam!"
      : `${remaining} warning(s) remaining before disqualification on 6th violation!`;
    const warningMsg = `⚠️ SECURITY WARNING (Attempt ${state.shortcutAttempts}/5): Key '${keyName}' is BLOCKED! Keyboard shortcuts are locked. ${remainingText}`;
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
  const isCtrlCombo = event.ctrlKey;

  if (isEscape || isPrintScreen || isFKey || isAltCombo || isMetaKey || isCtrlCombo) {
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    if (event.type === "keydown") {
      recordShortcutAttempt(isEscape ? "Escape" : isPrintScreen ? "PrintScreen" : isFKey ? key : isAltCombo ? "Alt Shortcut" : isMetaKey ? "Windows Key" : `Ctrl+${key}`);
    }
    return false;
  }
}

function bindAntiCheat() {
  if (state.antiCheatBound) return;
  state.antiCheatBound = true;

  $("resumeFullscreenBtn")?.addEventListener("click", () => {
    requestExamFullscreen().catch(() => {});
  });

  document.addEventListener("fullscreenchange", () => {
    if (state.examActive && !state.finishing) {
      if (!document.fullscreenElement && !isMobileDevice()) {
        state.fullscreenStrikes = (state.fullscreenStrikes || 0) + 1;
        if (state.fullscreenStrikes >= 6) {
          terminateActiveExam("AI Sentinel Disqualification: Fullscreen mode was exited repeatedly (5 strikes exceeded).");
        } else {
          const remaining = 5 - state.fullscreenStrikes;
          playSound("wrong");
          const warningMsg = `🚨 FULLSCREEN EXITED (Strike ${state.fullscreenStrikes}/5)! Fullscreen is mandatory. ${remaining <= 0 ? 'FINAL CHANCE!' : remaining + ' chance(s) left before exam termination!'}`;
          toast(warningMsg, "danger");
          showFullscreenLockOverlay(state.fullscreenStrikes, remaining);
          $("examCardFrame")?.contentWindow?.postMessage({
            type: "skilltester:admin-warning",
            warning: warningMsg
          }, "*");
        }
      } else if (document.fullscreenElement) {
        hideFullscreenLockOverlay();
        if (navigator.keyboard && typeof navigator.keyboard.lock === "function") {
          navigator.keyboard.lock(["Escape"]).catch(() => {});
        }
      }
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.examActive && !state.finishing) {
      if (!document.fullscreenElement && !isMobileDevice()) {
        terminateActiveExam("AI Sentinel Disqualification: Student navigated away from the exam tab while out of fullscreen mode.");
        return;
      }
      state.tabSwitchStrikes = (state.tabSwitchStrikes || 0) + 1;
      if (state.tabSwitchStrikes >= 6) {
        terminateActiveExam("AI Sentinel Disqualification: Repeated tab switch or backgrounding detected (5 strikes exceeded).");
      } else {
        const remaining = 5 - state.tabSwitchStrikes;
        playSound("wrong");
        const warningMsg = `🚨 TAB SWITCH DETECTED (Strike ${state.tabSwitchStrikes}/5)! Do not leave exam window. ${remaining <= 0 ? 'FINAL CHANCE!' : remaining + ' chance(s) left before disqualification!'}`;
        toast(warningMsg, "danger");
        $("examCardFrame")?.contentWindow?.postMessage({
          type: "skilltester:admin-warning",
          warning: warningMsg
        }, "*");
      }
    }
  });

  window.addEventListener("blur", () => {
    if (!state.examActive || state.finishing) return;
    if (!document.fullscreenElement && !isMobileDevice()) {
      const activeEl = document.activeElement;
      const isExamIframe = activeEl && (activeEl.id === "examCardFrame" || activeEl.tagName === "IFRAME");
      if (!isExamIframe) {
        window.setTimeout(() => {
          if (!state.examActive || state.finishing || document.fullscreenElement) return;
          const currentActive = document.activeElement;
          const currentIsFrame = currentActive && (currentActive.id === "examCardFrame" || currentActive.tagName === "IFRAME");
          if (!currentIsFrame) {
            terminateActiveExam("AI Sentinel Disqualification: Focus lost to another application or tab while out of fullscreen.");
          }
        }, 500);
        return;
      }
    }
    window.setTimeout(() => {
      if (!state.examActive || state.finishing) return;
      const activeEl = document.activeElement;
      const isExamIframe = activeEl && (activeEl.id === "examCardFrame" || activeEl.tagName === "IFRAME");
      if (isExamIframe || !document.hidden) return;
      if (document.hidden) {
        state.tabSwitchStrikes = (state.tabSwitchStrikes || 0) + 1;
        if (state.tabSwitchStrikes >= 6) {
          terminateActiveExam("AI Sentinel Disqualification: Candidate switched away from exam window (5 strikes exceeded).");
        } else {
          const remaining = 5 - state.tabSwitchStrikes;
          playSound("wrong");
          toast(`🚨 WINDOW SWITCHED (Strike ${state.tabSwitchStrikes}/5)! ${remaining <= 0 ? 'FINAL CHANCE!' : remaining + ' strike(s) left before disqualification on 6th violation.'}`, "danger");
        }
      }
    }, 400);
  });

  let lastTopWarn = 0;
  window.addEventListener("mousemove", (e) => {
    if (state.examActive && !state.finishing && document.fullscreenElement) {
      if (e.clientY <= 12 && Date.now() - lastTopWarn > 4000) {
        lastTopWarn = Date.now();
        toast("⚠️ Cursor top edge ke qareeb hai! Screen exit button ko click mat karein.", "danger");
      }
    }
  });

  window.addEventListener("keydown", handleRestrictedKey, true);
  window.addEventListener("keyup", handleRestrictedKey, true);
  window.addEventListener("keypress", handleRestrictedKey, true);
}

async function requestExamFullscreen() {
  if (isMobileDevice()) return Promise.resolve();
  const root = document.documentElement;
  const method = root.requestFullscreen || root.webkitRequestFullscreen || root.msRequestFullscreen;
  if (!method) return Promise.resolve();
  try {
    if (!document.fullscreenElement) {
      await method.call(root);
    }
    hideFullscreenLockOverlay();
    if (navigator.keyboard && typeof navigator.keyboard.lock === "function") {
      await navigator.keyboard.lock(["Escape"]);
    }
  } catch (err) {
    console.warn("Fullscreen request warning:", err);
  }
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
      durationMinutes: state.durationMinutes,
      candidate: state.candidate,
      studentId: state.candidate?.studentId || assignedEntry.studentId || ""
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
  state.lastAiEvaluation = result?.aiEvaluation || null;
  renderAnswerReview(state.answerReview);
  sessionStorage.removeItem(SESSION_KEY);
  if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => undefined);

  const examCfg = getExamConfig(state.exam);
  const examTotal = result.totalMarks || examCfg.totalMarks;
  const passingScore = result.passingMarks || examCfg.passingMarks;
  const finalMarks = typeof result.obtainedMarks === "number"
    ? result.obtainedMarks
    : (typeof result.correctAnswers === "number" ? result.correctAnswers : calculateMarks(state.score, state.questionCount, examTotal));

  state.lastResultMarks = finalMarks;
  state.lastResultTotalMarks = examTotal;
  state.lastResultPassingMarks = passingScore;

  const status = cheating ? "TERMINATED" : finalMarks < passingScore ? "FAILED" : "PASSED";

  const actualName = state.candidate?.fullName || state.candidate?.studentName || "Student";
  const studentId = state.candidate?.studentId || "—";
  const fatherName = state.candidate?.fatherName || "—";
  const phone = state.candidate?.phone || "—";
  const exam = state.exam || "Computer Science Group";

  const immediateParams = `studentId=${encodeURIComponent(studentId)}&name=${encodeURIComponent(actualName)}&father=${encodeURIComponent(fatherName)}&phone=${encodeURIComponent(phone)}&exam=${encodeURIComponent(exam)}&marks=${encodeURIComponent(finalMarks)}&totalMarks=${encodeURIComponent(examTotal)}&passingMarks=${encodeURIComponent(passingScore)}&status=${encodeURIComponent(status)}&reason=${encodeURIComponent(reason)}`;
  const vipLink = $("openVipMarksheetBtn");
  const disLink = $("viewDisciplinaryRecordBtn");
  if (vipLink) vipLink.href = `Marksheet.html?${immediateParams}`;
  if (disLink) disLink.href = `Marksheet.html?${immediateParams}`;

  saveExamResult(finalMarks, status, reason, result, (savedKey) => {
    state.lastSavedResultKey = savedKey;
    if (vipLink) vipLink.href = `Marksheet.html?resultKey=${encodeURIComponent(savedKey)}&${immediateParams}`;
    if (disLink) disLink.href = `Marksheet.html?resultKey=${encodeURIComponent(savedKey)}&${immediateParams}`;
  });

  if (cheating) {
    playSound("failure");
    renderFailure(reason, true);
  } else {
    if (finalMarks < passingScore) {
      playSound("wrong");
    } else {
      playSound("success");
    }
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
  const examCfg = getExamConfig(state.exam);
  const examTotal = extra.totalMarks || examCfg.totalMarks;
  const examPass = extra.passingMarks || examCfg.passingMarks;
  const percentage = Math.round((finalMarks / examTotal) * 100);

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
    totalMarks: examTotal,
    passingMarks: examPass,
    correctAnswers: state.score,
    percentage: percentage,
    status,
    reason,
    isPermanent: isPermanent,
    questionCount: state.questionCount,
    answerReview: state.answerReview || [],
    subjectBreakdown: extra.subjectBreakdown || {},
    aiEvaluation: extra.aiEvaluation || state.lastAiEvaluation || null,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  };

  const newRef = database.ref("examResults").push();
  newRef.set(resultPayload).then(() => {
    if (callback) callback(newRef.key);
  }).catch(() => {});
}

function renderFailure(reason, cheating = true) {
  hide("examView"); hide("homeView"); hide("resultView"); show("failureView");
  const failReasonEl = $("failureReason");
  const failTitleEl = $("failureTitle");
  const failEyebrowEl = $("failureEyebrow");
  const failIconEl = $("failureIcon");

  if (cheating) {
    if (failIconEl) failIconEl.textContent = "🚨";
    if (failEyebrowEl) failEyebrowEl.textContent = "AI Sentinel Integrity Enforcement · DISQUALIFIED";
    if (failTitleEl) failTitleEl.textContent = "EXAM DISQUALIFIED & TERMINATED";
    if (failReasonEl) failReasonEl.textContent = reason || "Candidate disqualified due to prohibited shortcuts or unauthorized window exit.";
  } else {
    if (failIconEl) failIconEl.textContent = "⚠️";
    if (failEyebrowEl) failEyebrowEl.textContent = "Official Assessment Result · Did Not Qualify";
    if (failTitleEl) failTitleEl.textContent = "EXAM COMPLETED (FAILED)";
    if (failReasonEl) failReasonEl.textContent = reason || "Candidate did not achieve passing score.";
  }

  loadLiveResults();
  window.setTimeout(() => $("failureView").scrollIntoView({ behavior: "smooth", block: "start" }), 50);
}

function renderResult() {
  hide("examView"); hide("homeView"); hide("failureView"); show("resultView");
  const scorecard = $("scorecard");
  scorecard.classList.remove("hidden");
  
  const examCfg = getExamConfig(state.exam);
  const examTotal = state.lastResultTotalMarks || examCfg.totalMarks;
  const passingScore = state.lastResultPassingMarks || examCfg.passingMarks;
  const finalMarks = state.lastResultMarks !== undefined ? state.lastResultMarks : calculateMarks(state.score, state.questionCount, examTotal);
  const percentage = Math.round((finalMarks / examTotal) * 100);
  const isPassed = finalMarks >= passingScore;

  const actualName = state.candidate?.fullName || state.candidate?.studentName || "Student";
  $("resultName").textContent = actualName;
  $("resultFather").textContent = state.candidate?.fatherName || "—";
  $("resultScore").textContent = `${finalMarks} / ${examTotal}`;
  $("resultPercentage").textContent = `${percentage}%`;

  const vipBtn = $("openVipMarksheetBtn");
  const holdNotice = $("boardAdminHoldNotice");

  if (isPassed) {
    scorecard.classList.remove("result-failed");
    $("resultIcon").textContent = "✓";
    $("resultEyebrow").textContent = "Official Assessment Result · Passed";
    $("resultHeading").textContent = "Congratulations, you passed!";
    $("resultRating").textContent = percentage >= 85 ? "Distinction (A+)" : percentage >= 70 ? "First Class (A)" : "Passed (Qualified)";
    $("resultRating").style.color = "#4ade80";
    $("resultSubtitle").textContent = `Mubarak ho! You scored ${finalMarks} / ${examTotal} Marks (${percentage}%) and passed the ${state.exam} paper (Passing marks: ${passingScore}). Your verified scorecard and AI Examiner evaluation are available below.`;

    if (vipBtn) {
      vipBtn.style.display = "inline-flex";
      vipBtn.textContent = "👑 View Official VVIP Animated Marksheet & Certificate";
    }
    if (holdNotice) holdNotice.classList.add("hidden");
  } else {
    scorecard.classList.add("result-failed");
    $("resultIcon").textContent = "⚠️";
    $("resultEyebrow").textContent = "Official Assessment Result · Did Not Qualify";
    $("resultHeading").textContent = "Exam Completed: Result Failed";
    $("resultRating").textContent = "Failed (Below Passing Marks)";
    $("resultRating").style.color = "#f87171";
    $("resultSubtitle").textContent = `You scored ${finalMarks} / ${examTotal} Marks (${percentage}%). Required passing marks for ${state.exam}: ${passingScore} Marks (33% minimum). Aap bilkul pareshan na hon, neeche apna diagnostic analysis check karein aur re-test ke liye tayaari karein.`;

    if (vipBtn) vipBtn.style.display = "none";
    if (holdNotice) holdNotice.classList.add("hidden");
  }

  // Render Exam Progress (MCQs / Short / Long) + AI Examiner Forensic Report
  renderProgressSummary(state.lastAiEvaluation);
  renderAiExaminerReport(state.lastAiEvaluation);

  loadLiveResults();
  window.setTimeout(() => $("resultView").scrollIntoView({ behavior: "smooth", block: "start" }), 50);
}

function renderProgressSummary(aiEval) {
  const box = $("progressSummary");
  const cards = $("progressCards");
  const body = $("progressTableBody");
  const note = $("progressNote");
  if (!box || !cards || !body) return;

  const audits = aiEval && Array.isArray(aiEval.questionAudits) ? aiEval.questionAudits : [];
  if (audits.length === 0) {
    box.classList.add("hidden");
    return;
  }

  const isMcq = (item) => item.type === "mcq" || item.type === "multi_mcq";
  const countBy = (list, status) => list.filter((item) => item.status === status).length;
  const attemptedOf = (list) => list.length - countBy(list, "SKIPPED");

  const mcqs = audits.filter(isMcq);
  const written = audits.filter((item) => !isMcq(item));
  const shorts = written.filter((item) => item.section === "Section B");
  const longs = written.filter((item) => item.section === "Section C");

  const tile = (label, value, tone) =>
    `<div class="progress-card ${tone}"><span class="progress-card-label">${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;

  let cardsHtml = "";
  if (mcqs.length) {
    cardsHtml += tile("MCQs Sahi", `${countBy(mcqs, "APPROVED")} / ${mcqs.length}`, "good");
    cardsHtml += tile("MCQs Galat", `${countBy(mcqs, "REJECTED")}`, "bad");
    if (countBy(mcqs, "PARTIAL") > 0) cardsHtml += tile("MCQs Partial", `${countBy(mcqs, "PARTIAL")}`, "warn");
    cardsHtml += tile("MCQs Unattempted", `${countBy(mcqs, "SKIPPED")}`, "muted");
  }
  if (shorts.length) {
    cardsHtml += tile("Short Questions Attempted", `${attemptedOf(shorts)} / ${shorts.length}`, "info");
    cardsHtml += tile("Short Questions Sahi", `${countBy(shorts, "APPROVED")}`, "good");
  }
  if (longs.length) {
    cardsHtml += tile("Long Questions Attempted", `${attemptedOf(longs)} / ${longs.length}`, "info");
    cardsHtml += tile("Long Questions Sahi", `${countBy(longs, "APPROVED")}`, "good");
  }
  cards.innerHTML = cardsHtml;

  // Group rows by paper part (Section A / B / C or HTML5 / CSS3 / JavaScript)
  const order = [];
  const groups = {};
  audits.forEach((item) => {
    const section = item.section || item.subject || "General";
    const key = `${section}|${isMcq(item) ? "mcq" : "written"}`;
    if (!groups[key]) {
      groups[key] = { section, mcq: isMcq(item), list: [] };
      order.push(key);
    }
    groups[key].list.push(item);
  });

  const labelFor = (group) => {
    if (group.section === "Section A") return "Section A · MCQs";
    if (group.section === "Section B") return "Section B · Short Questions";
    if (group.section === "Section C") return "Section C · Long Questions";
    return `${group.section} · ${group.mcq ? "MCQs" : "Written"}`;
  };

  body.innerHTML = order.map((key) => {
    const group = groups[key];
    const list = group.list;
    return `<tr>
      <td>${escapeHtml(labelFor(group))}</td>
      <td>${list.length}</td>
      <td>${attemptedOf(list)}</td>
      <td class="pt-good">${countBy(list, "APPROVED")}</td>
      <td class="pt-warn">${countBy(list, "PARTIAL")}</td>
      <td class="pt-bad">${countBy(list, "REJECTED")}</td>
      <td class="pt-muted">${countBy(list, "SKIPPED")}</td>
    </tr>`;
  }).join("");

  if (note) {
    if (written.length) {
      note.textContent = "Note: Short aur Long answers AI Examiner ke criteria par check hote hain. Marks mein Section B ke best 5 aur Section C ke best 2 jawab count hote hain.";
      note.classList.remove("hidden");
    } else {
      note.classList.add("hidden");
    }
  }

  box.classList.remove("hidden");
}

function renderAiExaminerReport(aiEval) {
  const section = $("aiExaminerAuditSection");
  if (!section) return;

  if (!aiEval) {
    section.classList.add("hidden");
    return;
  }

  section.classList.remove("hidden");

  // Populate KPIs
  const attemptedEl = $("aiKpiAttempted");
  if (attemptedEl) {
    attemptedEl.textContent = `${aiEval.attemptedCount} / ${aiEval.totalQuestions} (${Math.round((aiEval.attemptedCount / (aiEval.totalQuestions || 1)) * 100)}%)`;
  }

  const appStatusEl = $("aiKpiAppStatus");
  if (appStatusEl) {
    const appAudit = aiEval.applicationAudit;
    if (appAudit && appAudit.status !== "NOT_APPLICABLE") {
      appStatusEl.textContent = appAudit.status === "APPROVED" ? "✅ APPROVED" : appAudit.status === "PARTIAL" ? "⚠️ CONDITIONAL" : "❌ REJECTED";
      appStatusEl.className = `ai-kpi-val ${appAudit.status === "APPROVED" ? "approved" : appAudit.status === "PARTIAL" ? "partial" : "rejected"}`;
    } else {
      appStatusEl.textContent = "N/A (MCQ Track)";
      appStatusEl.className = "ai-kpi-val";
    }
  }

  const essayRatingEl = $("aiKpiEssayRating");
  if (essayRatingEl) {
    const essayAudit = aiEval.essayAudit;
    if (essayAudit && essayAudit.status !== "NOT_APPLICABLE") {
      essayRatingEl.textContent = essayAudit.status === "APPROVED" ? `★ High Quality (${essayAudit.wordCount}w)` : essayAudit.status === "PARTIAL" ? `⚠️ Moderate (${essayAudit.wordCount}w)` : `❌ Underlength (${essayAudit.wordCount}w)`;
      essayRatingEl.className = `ai-kpi-val ${essayAudit.status === "APPROVED" ? "approved" : "partial"}`;
    } else {
      essayRatingEl.textContent = "N/A (MCQ Track)";
      essayRatingEl.className = "ai-kpi-val";
    }
  }

  const spellingCountEl = $("aiKpiSpellingCount");
  if (spellingCountEl) {
    spellingCountEl.textContent = `${aiEval.totalSpellingMistakes || 0} Spotted`;
    spellingCountEl.className = `ai-kpi-val ${aiEval.totalSpellingMistakes > 0 ? "partial" : "approved"}`;
  }

  const remarksText = $("aiExaminerRemarksText");
  if (remarksText) {
    remarksText.textContent = aiEval.teacherNotes || "Comprehensive evaluation complete.";
  }

  const diagList = $("aiDiagnosticsList");
  if (diagList && Array.isArray(aiEval.questionAudits)) {
    diagList.innerHTML = aiEval.questionAudits.map((item) => {
      const isApproved = item.status === "APPROVED";
      const isPartial = item.status === "PARTIAL";
      const isSkipped = item.status === "SKIPPED";
      const badgeCls = isApproved ? "approved" : isPartial ? "partial" : isSkipped ? "skipped" : "rejected";
      const statusLabel = isApproved ? "✓ Approved" : isPartial ? "⚠️ Partial Credit" : isSkipped ? "⚪ Skipped" : "❌ Incorrect / Flawed";
      
      const spellingHtml = item.spellingMistakes && item.spellingMistakes.length > 0
        ? `<div class="diag-spelling-warning"><strong>Spelling Errors Spotted:</strong> ${item.spellingMistakes.map(escapeHtml).join(", ")}</div>`
        : "";

      return `
        <article class="ai-diag-card ${badgeCls}">
          <div class="diag-header-row">
            <span class="diag-qnum">Q${item.qIndex} [${escapeHtml(item.subject)} · ${escapeHtml(item.section || "Sec")}]</span>
            <span class="diag-badge ${badgeCls}">${statusLabel}</span>
          </div>
          <p class="diag-qtext">${escapeHtml(item.question)}</p>
          <div class="diag-ai-reasoning">
            <strong>🤖 AI Examiner Diagnosis:</strong> ${escapeHtml(item.aiDiagnosis)}
          </div>
          ${spellingHtml}
        </article>
      `;
    }).join("");
  }
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
      const itemExam = result.candidate?.exam || result.exam || "";
      const itemTotal = result.totalMarks || (itemExam.toLowerCase().includes("english") ? 100 : (itemExam.toLowerCase().includes("web") ? 100 : 75));
      return `
        <div class="public-result-row">
          <span>
            <strong>${escapeHtml(studentName)}</strong>
            <small>${escapeHtml(result.candidate?.exam || result.exam || "CS Group")} · ${escapeHtml(result.status || "UNKNOWN")}</small>
          </span>
          <strong class="public-result-score" style="color:${isPassed ? "#4ade80" : "#f87171"};">${escapeHtml(result.marks ?? "-")} / ${itemTotal}</strong>
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
    state.fullscreenStrikes = 0;
    state.tabSwitchStrikes = 0;
    state.score = 0;
    state.questionCount = Number.isInteger(message.questionCount) ? message.questionCount : 60;
    document.body.classList.add("exam-in-progress");
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ candidate: state.candidate, startedAt: Date.now() }));
    bindAntiCheat();
  } else if (message.type === "skilltester:shortcut-attempt" && state.examActive) {
    recordShortcutAttempt(message.key);
  } else if (message.type === "skilltester:top-edge-warning" && state.examActive) {
    toast("⚠️ Cursor top edge ke qareeb hai! Screen exit button ko click mat karein.", "danger");
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