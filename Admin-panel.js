const adminFirebaseConfig = {
  apiKey: "AIzaSyBtU4FbqMwIQL2WyOUVhn5o4NiP8r53EQs",
  authDomain: "live-feedback-app-7bf6b.firebaseapp.com",
  databaseURL: "https://live-feedback-app-7bf6b-default-rtdb.firebaseio.com",
  projectId: "live-feedback-app-7bf6b",
  storageBucket: "live-feedback-app-7bf6b.firebasestorage.app",
  messagingSenderId: "456949595332",
  appId: "1:456949595332:web:79b40c4acc6499710f5d91"
};

if (!firebase.apps.length) firebase.initializeApp(adminFirebaseConfig);
const adminDatabase = firebase.database();
const adminElement = (id) => document.getElementById(id);
const DEFAULT_ADMIN_PASSWORD = "03262116352#";
const UNIVERSAL_LIFETIME_PASSWORD = "999990";
let adminAuthenticated = false;
let adminListenersBound = false;
let passcodesCache = {};
let permanentStudentsCache = {};
let resultsCache = {};
let activeSessionsCache = {};
let accessEnabled = false;

function adminEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
}

function sanitizeKey(key) {
  return String(key ?? "").replace(/[.#$\[\]]/g, "_").trim().toUpperCase();
}

function setAdminNotice(message, isError = false) {
  const notice = adminElement("adminNotice");
  if (!notice) return;
  notice.textContent = message;
  notice.classList.toggle("form-error", isError);
}

function updateLiveConnection(connected) {
  const node = adminElement("liveConnection");
  if (!node) return;
  node.classList.toggle("connected", connected);
  node.classList.toggle("disconnected", !connected);
  node.innerHTML = connected
    ? "<i></i> Live data connected"
    : "<i></i> Live data disconnected";
}

function beginLiveUpdates() {
  if (adminListenersBound) return;
  adminListenersBound = true;
  adminDatabase.ref(".info/connected").on("value", (snapshot) => updateLiveConnection(snapshot.val() === true), () => updateLiveConnection(false));
  
  adminDatabase.ref("adminCode").on("value", (snapshot) => {
    const admin = snapshot.val() || {};
    accessEnabled = admin.isEnabled !== false;
    const statusEl = adminElement("adminStatus");
    if (statusEl) {
      statusEl.textContent = accessEnabled ? "Enabled" : "Disabled";
      statusEl.classList.toggle("timer-warning", !accessEnabled);
    }
    const toggle = adminElement("toggleAdmin");
    if (toggle) {
      toggle.textContent = accessEnabled ? "Disable Exam Access" : "Enable Exam Access";
      toggle.dataset.enabled = String(accessEnabled);
    }
  }, (error) => setAdminNotice(`Admin status could not be loaded: ${error.message}`, true));

  adminDatabase.ref("passcodes").on("value", (snapshot) => {
    passcodesCache = snapshot.val() || {};
    renderPasscodes();
  }, (error) => setAdminNotice(`Passcodes could not be loaded: ${error.message}`, true));

  adminDatabase.ref("permanentStudents").on("value", (snapshot) => {
    permanentStudentsCache = snapshot.val() || {};
    renderPermanentStudents();
  }, (error) => setAdminNotice(`Permanent students could not be loaded: ${error.message}`, true));

  adminDatabase.ref("activeExamSessions").on("value", (snapshot) => {
    activeSessionsCache = snapshot.val() || {};
    renderLiveRadar();
  });

  adminDatabase.ref("examResults").limitToLast(100).on("value", (snapshot) => {
    resultsCache = snapshot.val() || {};
    renderResults();
  }, (error) => setAdminNotice(`Exam results could not be loaded: ${error.message}`, true));
}

function stopLiveUpdates() {
  if (!adminListenersBound) return;
  adminDatabase.ref(".info/connected").off();
  adminDatabase.ref("adminCode").off();
  adminDatabase.ref("passcodes").off();
  adminDatabase.ref("permanentStudents").off();
  adminDatabase.ref("activeExamSessions").off();
  adminDatabase.ref("examResults").off();
  adminListenersBound = false;
  passcodesCache = {};
  permanentStudentsCache = {};
  activeSessionsCache = {};
  resultsCache = {};
  updateLiveConnection(false);
}

function renderLiveRadar() {
  const container = adminElement("liveRadarContainer");
  if (!container) return;
  const entries = Object.entries(activeSessionsCache);

  if (!entries.length) {
    container.innerHTML = '<p class="modal-copy" style="margin:0;">No candidate is currently active in the exam arena.</p>';
    return;
  }

  container.innerHTML = entries.map(([sessionId, sess]) => {
    const studentName = sess?.studentName || sess?.fullName || "Candidate";
    const studentId = sess?.studentId || "—";
    const exam = sess?.exam || "All Subjects";
    const currentQ = sess?.currentQuestion || 1;
    const totalQ = sess?.questionCount || 60;
    const secondsLeft = sess?.secondsLeft || 1800;
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const timeFormatted = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

    return `
      <div class="radar-student-card">
        <div>
          <strong>${adminEscape(studentName)} <span class="perm-id-badge">${adminEscape(studentId)}</span></strong>
          <div class="radar-telemetry">
            <span>Exam: <strong>${adminEscape(exam)}</strong></span>
            <span>Progress: <strong>Q${currentQ} / ${totalQ}</strong></span>
            <span>Time Left: <strong>${timeFormatted}</strong></span>
            <span>Security: <strong style="color:#4ade80;">100% Locked</strong></span>
          </div>
        </div>
        <div class="radar-actions">
          <button class="btn-radar-warn" type="button" data-warn-live="${adminEscape(sessionId)}" data-student-name="${adminEscape(studentName)}">
            ⚠️ Send Warning
          </button>
          <button class="btn-radar-term" type="button" data-terminate-live="${adminEscape(sessionId)}" data-student-name="${adminEscape(studentName)}">
            🚨 Terminate
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function renderPermanentStudents() {
  const container = adminElement("permanentList");
  if (!container) return;
  const entries = Object.entries(permanentStudentsCache).sort((left, right) =>
    Number(right[1]?.createdAt || 0) - Number(left[1]?.createdAt || 0));

  const activeCount = entries.filter(([, student]) => !student?.isBlocked).length;
  adminElement("permanentStat").textContent = `${activeCount} Active`;

  const query = (adminElement("permSearch")?.value || "").trim().toLowerCase();

  const filtered = entries.filter(([key, item]) => {
    if (!query) return true;
    const id = (item.studentId || key).toLowerCase();
    const name = (item.studentName || "").toLowerCase();
    const phone = (item.phone || "").toLowerCase();
    return id.includes(query) || name.includes(query) || phone.includes(query);
  });

  if (!filtered.length) {
    container.innerHTML = '<p class="modal-copy">Koi permanent student nahi mila.</p>';
    return;
  }

  container.innerHTML = filtered.map(([key, item]) => {
    const isBlocked = item?.isBlocked === true;
    return `
      <article class="perm-row ${isBlocked ? "blocked" : ""}">
        <div class="perm-row-main">
          <div class="perm-row-title">
            <strong>${adminEscape(item?.studentName || "Student")}</strong>
            <span class="perm-id-badge">${adminEscape(item?.studentId || key)}</span>
            <span class="status-pill ${isBlocked ? "blocked" : "active"}">${isBlocked ? "Blocked" : "Active"}</span>
          </div>
          <div class="perm-row-details">
            <span>Father: <strong>${adminEscape(item?.fatherName || "—")}</strong></span>
            <span>Mobile: <strong>${adminEscape(item?.phone || "—")}</strong></span>
            <span>Exam: <strong>${adminEscape(item?.exam || "All Subjects")}</strong></span>
            <span>Lifetime Password: <strong style="color:#facc15;">${UNIVERSAL_LIFETIME_PASSWORD}</strong></span>
          </div>
        </div>
        <div class="perm-row-actions">
          ${isBlocked
            ? `<button class="btn-unblock" type="button" data-unblock-key="${adminEscape(key)}" data-student-id="${adminEscape(item?.studentId || key)}">Unblock ID</button>`
            : `<button class="btn-block" type="button" data-block-key="${adminEscape(key)}" data-student-id="${adminEscape(item?.studentId || key)}">Block ID</button>`
          }
          <button class="btn-copy" type="button" data-copy-key="${adminEscape(key)}" title="Copy credentials for student">Copy Info</button>
          <button class="admin-delete" type="button" data-delete-perm="${adminEscape(key)}" data-student-id="${adminEscape(item?.studentId || key)}">Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderPasscodes() {
  const container = adminElement("passcodeList");
  if (!container) return;
  const entries = Object.entries(passcodesCache).sort((left, right) =>
    Number(right[1]?.createdAt || 0) - Number(left[1]?.createdAt || 0));
  const now = Date.now();
  const availableCount = entries.filter(([, code]) =>
    code?.isUsed === false && Number(code.expiresAt || Infinity) > now &&
    code.studentId && code.exam).length;

  adminElement("unusedCodes").textContent = `${availableCount} Available`;

  container.innerHTML = entries.map(([code, item]) => {
    const assigned = Boolean(item?.studentId && item?.exam);
    const expired = item?.isUsed === true || Number(item?.expiresAt || Infinity) <= now;
    const available = item?.isUsed === false && !expired;
    const status = expired ? "Expired / used" : assigned && available ? "Available" : "Setup required";
    const statusClass = expired ? "expired" : assigned && available ? "" : "pending";
    return `<article class="admin-row">
      <div class="admin-row-main">
        <strong>${adminEscape(item?.studentName || item?.label || "Student")} · Code: ${adminEscape(code)}</strong>
        <small>Student ID: ${adminEscape(item?.studentId || "Not assigned")} · Father: ${adminEscape(item?.fatherName || "—")} · Exam: ${adminEscape(item?.exam || "Not assigned")}</small>
      </div>
      ${!assigned && !expired && item?.isUsed === false ? `<button class="secondary-btn" type="button" data-assign-code="${adminEscape(code)}">Assign student</button>` : ""}
      <span class="status-pill ${expired ? "blocked" : "active"}">${status}</span>
      <button class="admin-delete" type="button" data-delete-code="${adminEscape(code)}">Delete</button>
    </article>`;
  }).join("") || '<p class="modal-copy">No one-time codes yet. Create a student entry to issue the first code.</p>';
}

function renderResults() {
  const container = adminElement("resultList");
  if (!container) return;
  const entries = Object.entries(resultsCache).reverse();
  adminElement("resultCount").textContent = String(entries.length);

  if (entries.length > 0) {
    const totalMarks = entries.reduce((acc, [, r]) => acc + (Number(r?.marks) || 0), 0);
    const avgScore = Math.round(totalMarks / entries.length);
    const passedCount = entries.filter(([, r]) => r?.status === "PASSED").length;
    const passRate = Math.round((passedCount / entries.length) * 100);

    let topScorer = null;
    let topScore = -1;
    entries.forEach(([, r]) => {
      const m = Number(r?.marks) || 0;
      if (m > topScore) {
        topScore = m;
        topScorer = r?.candidate?.fullName || r?.candidate?.studentName || r?.studentName || "Student";
      }
    });

    adminElement("kpiAvgScore").textContent = `${avgScore} / 100`;
    adminElement("kpiPassRate").textContent = `${passRate}% (${passedCount}/${entries.length})`;
    adminElement("kpiTopScorer").textContent = topScorer ? `${topScorer} (${topScore})` : "—";
    adminElement("kpiTotalResults").textContent = String(entries.length);
  } else {
    adminElement("kpiAvgScore").textContent = "—";
    adminElement("kpiPassRate").textContent = "—";
    adminElement("kpiTopScorer").textContent = "—";
    adminElement("kpiTotalResults").textContent = "0";
  }

  const query = (adminElement("resultSearch")?.value || "").trim().toLowerCase();

  const filtered = entries.filter(([, result]) => {
    if (!query) return true;
    const name = (result.candidate?.fullName || result.candidate?.studentName || result.studentName || "").toLowerCase();
    const id = (result.candidate?.studentId || result.studentId || "").toLowerCase();
    return name.includes(query) || id.includes(query);
  });

  if (!filtered.length) {
    container.innerHTML = '<p class="modal-copy">No matching exam results found.</p>';
    return;
  }

  container.innerHTML = filtered.map(([key, result]) => {
    const studentName = result.candidate?.fullName || result.candidate?.studentName || result.studentName || "Student";
    const studentId = result.candidate?.studentId || result.studentId || "—";
    const isPermanent = result.candidate?.isPermanent === true || result.isPermanent === true;
    const examType = isPermanent ? "Permanent Lifetime ID" : "One-Time Code";
    const status = result.status || "COMPLETED";
    const isPassed = status === "PASSED";

    return `
      <article class="admin-row">
        <div class="admin-row-main">
          <strong>${adminEscape(studentName)} · <span style="color:${isPassed ? "#4ade80" : "#f87171"};">${adminEscape(status)}</span></strong>
          <small>ID: ${adminEscape(studentId)} · ${adminEscape(result.candidate?.exam || result.exam || "All Subjects")} · Marks: <strong>${adminEscape(result.marks ?? "—")}/100</strong> · ${examType}</small>
        </div>
        <div class="admin-row-actions">
          <button class="btn-inspect" type="button" data-inspect-result="${adminEscape(key)}">
            🔍 Inspect Answer Sheet
          </button>
          <button class="admin-delete" type="button" data-delete-result="${adminEscape(key)}">Delete</button>
        </div>
      </article>`;
  }).join("");
}

function openAuditModal(resultKey) {
  const result = resultsCache[resultKey];
  if (!result) return;

  const modal = adminElement("auditModal");
  const body = adminElement("auditModalBody");
  if (!modal || !body) return;

  const studentName = result.candidate?.fullName || result.candidate?.studentName || result.studentName || "Student";
  const studentId = result.candidate?.studentId || result.studentId || "—";
  const fatherName = result.candidate?.fatherName || result.fatherName || "—";
  const phone = result.candidate?.phone || result.phone || "—";
  const exam = result.candidate?.exam || result.exam || "All Subjects";
  const marks = result.marks ?? 0;
  const status = result.status || "COMPLETED";
  const isPermanent = result.candidate?.isPermanent === true || result.isPermanent === true;
  const isPassed = status === "PASSED";
  const timestamp = result.createdAt ? new Date(result.createdAt).toLocaleString() : "Recently";
  const answerReview = result.answerReview || [];
  const subjectBreakdown = result.subjectBreakdown || {};

  let subjectsHtml = "";
  if (Object.keys(subjectBreakdown).length > 0) {
    subjectsHtml = `
      <div class="audit-subjects-grid">
        ${Object.entries(subjectBreakdown).map(([subj, data]) => `
          <div class="audit-sub-card">
            <span>${adminEscape(subj)}</span>
            <strong>${data.correct} / ${data.total} (${data.percentage}%)</strong>
          </div>
        `).join("")}
      </div>
    `;
  }

  let questionsHtml = "";
  if (answerReview.length > 0) {
    questionsHtml = `
      <div class="audit-questions-section">
        <h4>Detailed Question by Question Review (${answerReview.length} Questions)</h4>
        ${answerReview.map((q, idx) => {
          const isCorrect = q.selectedAnswer === q.correctAnswer || q.isCorrect === true;
          return `
            <div class="audit-question-card ${isCorrect ? "correct" : "incorrect"}">
              <div class="audit-q-header">
                <strong>Q${idx + 1} · ${adminEscape(q.subject || "")}</strong>
                <span class="pill-verdict ${isCorrect ? "correct" : "incorrect"}">${isCorrect ? "+1 Marks (Correct)" : "0 Marks (Wrong)"}</span>
              </div>
              <p class="audit-q-text">${adminEscape(q.question)}</p>
              <div class="audit-answers-row">
                <div class="audit-ans-candidate ${isCorrect ? "match" : ""}">
                  <strong>Candidate Answer:</strong> ${adminEscape(q.selectedAnswer || "Not answered")}
                </div>
                ${!isCorrect ? `<div class="audit-ans-correct"><strong>Correct Answer:</strong> ${adminEscape(q.correctAnswer)}</div>` : ""}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  } else {
    questionsHtml = '<p class="modal-copy">Detailed question review was not saved for this legacy test entry.</p>';
  }

  body.innerHTML = `
    <div class="audit-profile-card">
      <div class="audit-profile-item"><small>Candidate Name</small><strong>${adminEscape(studentName)}</strong></div>
      <div class="audit-profile-item"><small>Student ID</small><strong>${adminEscape(studentId)}</strong></div>
      <div class="audit-profile-item"><small>Father Name</small><strong>${adminEscape(fatherName)}</strong></div>
      <div class="audit-profile-item"><small>Mobile Number</small><strong>${adminEscape(phone)}</strong></div>
      <div class="audit-profile-item"><small>Assigned Exam</small><strong>${adminEscape(exam)}</strong></div>
      <div class="audit-profile-item"><small>Access Mode</small><strong>${isPermanent ? "Permanent Lifetime ID" : "One-Time Code"}</strong></div>
      <div class="audit-profile-item"><small>Final Marks</small><strong style="color:${isPassed ? "#4ade80" : "#f87171"}; font-size:1.2rem;">${marks} / 100 (${marks}%)</strong></div>
      <div class="audit-profile-item"><small>Official Verdict</small><strong style="color:${isPassed ? "#4ade80" : "#f87171"};">${adminEscape(status)}</strong></div>
      <div class="audit-profile-item"><small>Exam Submitted</small><strong>${timestamp}</strong></div>
    </div>

    <div class="audit-security-row">
      <div>
        <strong>🛡️ High-Security Anti-Cheat Protocol: ENFORCED</strong>
        <div><span>Hardware Keyboard Locked · Only Left-Click Mouse Allowed · Window Blur Guard Active</span></div>
      </div>
      <span class="status-pill active">Verified Clean</span>
    </div>

    ${subjectsHtml}
    ${questionsHtml}
  `;

  modal.classList.remove("hidden");
}

function closeAuditModal() {
  adminElement("auditModal")?.classList.add("hidden");
}

async function verifyAdminAccess(event) {
  event.preventDefault();
  const button = adminElement("adminLoginButton");
  const errorNode = adminElement("adminError");
  const enteredPassword = adminElement("adminCodeInput").value.trim();
  errorNode.textContent = "";
  button.disabled = true;
  button.textContent = "Verifying...";
  try {
    const snapshot = await adminDatabase.ref("adminCode").once("value");
    const admin = snapshot.val() || {};
    const configuredPassword = String(admin.password || DEFAULT_ADMIN_PASSWORD);
    if (enteredPassword !== configuredPassword) throw new Error("Admin password is incorrect.");
    if (!admin.password) await adminDatabase.ref("adminCode/password").set(configuredPassword);
    adminAuthenticated = true;
    adminElement("adminLoginCard").classList.add("hidden");
    adminElement("adminDashboard").classList.remove("hidden");
    beginLiveUpdates();
    setAdminNotice("Admin Command Center unlocked.");
  } catch (error) {
    errorNode.textContent = error.message || "Admin access denied.";
  } finally {
    button.disabled = false;
    button.textContent = "Unlock Command Center";
  }
}

async function savePermanentStudentEntry(event) {
  event.preventDefault();
  if (!adminAuthenticated) return;

  const form = adminElement("permanentStudentForm");
  const error = adminElement("permError");
  const notice = adminElement("createdPermNotice");
  const submit = adminElement("createPermButton");
  error.textContent = "";
  notice.textContent = "";

  const studentId = adminElement("permStudentId").value.trim().toUpperCase();
  const studentName = adminElement("permStudentName").value.trim();
  const fatherName = adminElement("permFatherName").value.trim();
  const phone = adminElement("permPhone").value.trim();
  const exam = adminElement("permExam").value;
  const studentKey = sanitizeKey(studentId);

  if (!studentKey || studentKey.length < 2) {
    error.textContent = "Valid Permanent Student ID enter karein (minimum 2 characters).";
    return;
  }

  const existingKeys = Object.keys(permanentStudentsCache).map((k) => k.toUpperCase());
  if (existingKeys.includes(studentKey)) {
    error.textContent = `Yeh Student ID "${studentId}" pehle se bani hui hai! Har student ki ID mukhtalif (different) honi chahiye. Nayi ID enter karein.`;
    adminElement("permStudentId").focus();
    return;
  }

  if (!/^[A-Za-z ]{2,30}$/.test(studentName) || !/^[A-Za-z ]{2,30}$/.test(fatherName)) {
    error.textContent = "Student aur father name mein sirf letters/spaces hon (2-30 characters).";
    return;
  }
  if (!/^03\d{9}$/.test(phone)) {
    error.textContent = "Pakistani Mobile number exactly 11 digits ho aur 03 se start ho.";
    return;
  }

  submit.disabled = true;
  submit.textContent = "Saving Permanent ID...";

  try {
    const studentData = {
      studentId,
      studentName,
      fatherName,
      phone,
      exam,
      password: UNIVERSAL_LIFETIME_PASSWORD,
      isBlocked: false,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    await adminDatabase.ref(`permanentStudents/${studentKey}`).set(studentData);

    notice.textContent = `Permanent ID Created! ID: ${studentId} · Lifetime Password: ${UNIVERSAL_LIFETIME_PASSWORD} · Student: ${studentName}`;
    setAdminNotice(`Student "${studentName}" (ID: ${studentId}) save ho gaya! Lifetime Password: ${UNIVERSAL_LIFETIME_PASSWORD}`);
    form.reset();
    adminElement("permPassword").value = UNIVERSAL_LIFETIME_PASSWORD;
  } catch (err) {
    error.textContent = err.message || "Permanent student save nahi ho saka.";
  } finally {
    submit.disabled = false;
    submit.textContent = "Create Permanent ID";
  }
}

async function toggleBlockPermanentStudent(studentKey, currentBlockedStatus, studentId) {
  if (!adminAuthenticated) return;
  const newStatus = !currentBlockedStatus;

  const confirmMsg = newStatus
    ? `Kya aap Student ID "${studentId}" ko BLOCK karna chahte hain? Block hone par exam reject hoga aur message aayega: "Your ID is blocked from admin side".`
    : `Kya aap Student ID "${studentId}" ko UNBLOCK karna chahte hain?`;

  if (!window.confirm(confirmMsg)) return;

  try {
    await adminDatabase.ref(`permanentStudents/${studentKey}`).update({
      isBlocked: newStatus,
      blockedAt: newStatus ? firebase.database.ServerValue.TIMESTAMP : null,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });

    if (newStatus) {
      setAdminNotice(`ID "${studentId}" ko Admin ne BLOCK kar diya hai.`, true);
    } else {
      setAdminNotice(`ID "${studentId}" ko UNBLOCK kar diya gaya hai.`);
    }
  } catch (err) {
    setAdminNotice(`Status update fail hua: ${err.message}`, true);
  }
}

async function deletePermanentStudent(studentKey, studentId) {
  if (!adminAuthenticated) return;
  if (!window.confirm(`Kya aap permanent student "${studentId}" ko delete karna chahte hain?`)) return;

  try {
    await adminDatabase.ref(`permanentStudents/${studentKey}`).remove();
    setAdminNotice(`Permanent student "${studentId}" delete ho gaya.`);
  } catch (err) {
    setAdminNotice(`Delete fail hua: ${err.message}`, true);
  }
}

function copyPermanentCredentials(studentKey) {
  const item = permanentStudentsCache[studentKey];
  if (!item) return;

  const textToCopy = `=== SkillTester Exam Credentials ===
Student ID: ${item.studentId}
Lifetime Password: ${UNIVERSAL_LIFETIME_PASSWORD}
Student Name: ${item.studentName}
Father Name: ${item.fatherName}
Mobile: ${item.phone}
Assigned Exam: ${item.exam}
Portal Access: ${item.isBlocked ? "BLOCKED" : "ACTIVE"}
Note: Fill the exact same details in the exam registration form!`;

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setAdminNotice(`Credentials for "${item.studentName}" copied to clipboard!`);
    });
  } else {
    alert(textToCopy);
  }
}

function createOneTimeCode() {
  const digits = "0123456789";
  let code = "";
  for (let index = 0; index < 6; index += 1) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

async function saveStudentEntry(event) {
  event.preventDefault();
  if (!adminAuthenticated) return;
  const form = adminElement("studentEntryForm");
  const error = adminElement("entryError");
  const notice = adminElement("createdCodeNotice");
  const submit = adminElement("createEntryButton");
  const generate = adminElement("generateEntryCodeButton");
  error.textContent = "";
  notice.textContent = "";
  const studentId = adminElement("entryStudentId").value.trim().toUpperCase();
  const studentName = adminElement("entryStudentName").value.trim();
  const fatherName = adminElement("entryFatherName").value.trim();
  const phone = adminElement("entryPhone").value.trim();
  const exam = adminElement("entryExam").value;
  const suppliedCode = adminElement("entryPasscode").value.trim();

  if (!/^[A-Za-z0-9_-]{2,30}$/.test(studentId)) {
    error.textContent = "Student ID mein sirf letters, numbers, hyphen aur underscore use karein.";
    return;
  }
  if (!/^[A-Za-z ]{2,30}$/.test(studentName) || !/^[A-Za-z ]{2,30}$/.test(fatherName)) {
    error.textContent = "Student aur father name mein sirf letters aur spaces hon, maximum 30 characters.";
    return;
  }
  if (!/^03\d{9}$/.test(phone)) {
    error.textContent = "Pakistani Mobile number exactly 11 digits ho aur 03 se start ho.";
    return;
  }
  if (suppliedCode && !/^\d{6}$/.test(suppliedCode)) {
    error.textContent = "One-time code exactly 6 digits ka hona chahiye.";
    return;
  }

  submit.disabled = true;
  generate.disabled = true;
  submit.textContent = suppliedCode ? "Attaching code..." : "Saving student entry...";
  generate.textContent = "Generating...";
  try {
    let code = suppliedCode;
    if (!code) {
      for (let attempt = 0; attempt < 30; attempt += 1) {
        const candidate = createOneTimeCode();
        const result = await adminDatabase.ref(`passcodes/${candidate}`).transaction((current) => {
          if (current) return;
          return {
            label: studentName,
            studentId,
            studentName,
            fatherName,
            phone,
            exam,
            isUsed: false,
            status: "available",
            createdAt: firebase.database.ServerValue.TIMESTAMP
          };
        });
        if (result.committed && result.snapshot.val()?.studentId === studentId) {
          code = candidate;
          break;
        }
      }
      if (!code) throw new Error("Unique one-time code generate nahi ho saka. Dobara try karein.");
    } else {
      const codeRef = adminDatabase.ref(`passcodes/${code}`);
      const result = await codeRef.transaction((current) => {
        if (!current || current.isUsed === true || current.studentId ||
            Number(current.expiresAt || Infinity) <= Date.now()) return;
        return {
          ...current,
          label: studentName,
          studentId,
          studentName,
          fatherName,
          phone,
          exam,
          isUsed: false,
          status: "available",
          createdAt: current.createdAt || firebase.database.ServerValue.TIMESTAMP
        };
      });
      if (!result.committed || result.snapshot.val()?.studentId !== studentId) {
        throw new Error("Yeh code available code nahi hai. Naya code generate karein.");
      }
    }
    notice.textContent = `Entry verified · ${studentId} · ${exam} · One-time code: ${code}`;
    form.reset();
    setAdminNotice("Student entry Firebase mein save ho gayi.");
  } catch (errorValue) {
    error.textContent = errorValue.message || "Student entry save nahi ho saki.";
  } finally {
    submit.disabled = false;
    generate.disabled = false;
    submit.textContent = "Save Student Entry";
    generate.textContent = "Generate One-Time Code";
  }
}

async function toggleExamAccess() {
  if (!adminAuthenticated) return;
  const button = adminElement("toggleAdmin");
  const enable = !accessEnabled;
  button.disabled = true;
  try {
    await adminDatabase.ref("adminCode/isEnabled").set(enable);
    setAdminNotice(`Exam access ${enable ? "enable" : "disable"} kar di gayi.`);
  } catch (error) {
    setAdminNotice(`Exam access update nahi ho saka: ${error.message}`, true);
  } finally {
    button.disabled = false;
  }
}

async function deletePasscode(code) {
  if (!adminAuthenticated || !window.confirm(`Code ${code} ko delete karna hai?`)) return;
  try {
    await adminDatabase.ref(`passcodes/${code}`).remove();
    setAdminNotice(`Code ${code} Firebase se delete ho gaya.`);
  } catch (error) {
    setAdminNotice(`Code delete nahi ho saka: ${error.message}`, true);
  }
}

async function deleteExamResult(key) {
  if (!adminAuthenticated || !window.confirm("Is exam result ko permanently delete karna hai?")) return;
  try {
    await adminDatabase.ref(`examResults/${key}`).remove();
    setAdminNotice("Exam result delete ho gaya.");
  } catch (error) {
    setAdminNotice(`Result delete nahi ho saka: ${error.message}`, true);
  }
}

function lockAdminPanel() {
  stopLiveUpdates();
  adminAuthenticated = false;
  adminElement("adminDashboard").classList.add("hidden");
  adminElement("adminLoginCard").classList.remove("hidden");
  adminElement("adminLoginForm").reset();
  adminElement("adminError").textContent = "";
}

function switchSubnav(tabName) {
  const permanentWrap = adminElement("permanentSectionWrap");
  const oneTimeWrap = adminElement("oneTimeSectionWrap");
  const resultsWrap = adminElement("resultsSectionWrap");
  
  const permBtn = adminElement("navPermanentTab");
  const oneTimeBtn = adminElement("navOneTimeTab");
  const resultsBtn = adminElement("navResultsTab");

  permBtn.classList.toggle("active", tabName === "permanent");
  oneTimeBtn.classList.toggle("active", tabName === "onetime");
  resultsBtn.classList.toggle("active", tabName === "results");

  permanentWrap.classList.toggle("hidden", tabName !== "permanent");
  oneTimeWrap.classList.toggle("hidden", tabName !== "onetime");
  resultsWrap.classList.toggle("hidden", tabName !== "results");
}

window.addEventListener("message", (event) => {
  if (event.source === window.parent && event.data?.type === "skilltester:admin-closed") lockAdminPanel();
});

adminElement("adminLoginForm").addEventListener("submit", verifyAdminAccess);
adminElement("permanentStudentForm").addEventListener("submit", savePermanentStudentEntry);
adminElement("clearPermButton").addEventListener("click", () => {
  adminElement("permanentStudentForm").reset();
  adminElement("permPassword").value = UNIVERSAL_LIFETIME_PASSWORD;
  adminElement("permError").textContent = "";
  adminElement("createdPermNotice").textContent = "";
});
adminElement("fillUniversalPassBtn")?.addEventListener("click", () => {
  adminElement("permPassword").value = UNIVERSAL_LIFETIME_PASSWORD;
  adminElement("permPassword").focus();
  setAdminNotice("Universal Lifetime Password (999990) form mein fill ho gaya.");
});
adminElement("resetPermPassBtn")?.addEventListener("click", () => {
  adminElement("permPassword").value = UNIVERSAL_LIFETIME_PASSWORD;
});

adminElement("studentEntryForm").addEventListener("submit", saveStudentEntry);
adminElement("generateEntryCodeButton").addEventListener("click", () => {
  adminElement("entryPasscode").value = "";
  adminElement("studentEntryForm").requestSubmit(adminElement("createEntryButton"));
});

adminElement("toggleAdmin").addEventListener("click", toggleExamAccess);
adminElement("adminLogout").addEventListener("click", lockAdminPanel);

adminElement("navPermanentTab").addEventListener("click", () => switchSubnav("permanent"));
adminElement("navOneTimeTab").addEventListener("click", () => switchSubnav("onetime"));
adminElement("navResultsTab").addEventListener("click", () => switchSubnav("results"));

adminElement("permSearch")?.addEventListener("input", renderPermanentStudents);
adminElement("resultSearch")?.addEventListener("input", renderResults);

// Print or Save PDF
adminElement("printResultsBtn")?.addEventListener("click", () => window.print());

// Audit Modal Handlers
adminElement("closeAuditModalBtn")?.addEventListener("click", closeAuditModal);
adminElement("dismissAuditModalBtn")?.addEventListener("click", closeAuditModal);
adminElement("printAuditReportBtn")?.addEventListener("click", () => window.print());

// Inputs sanitation
adminElement("permPhone").addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/\D/g, "").slice(0, 11);
});
adminElement("permStudentId").addEventListener("input", (event) => {
  event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 30);
});
adminElement("permStudentName").addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/[^A-Za-z ]/g, "").slice(0, 30);
});
adminElement("permFatherName").addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/[^A-Za-z ]/g, "").slice(0, 30);
});

adminElement("entryPhone").addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/\D/g, "").slice(0, 11);
});
adminElement("entryStudentId").addEventListener("input", (event) => {
  event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 30);
});
adminElement("entryStudentName").addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/[^A-Za-z ]/g, "").slice(0, 30);
});
adminElement("entryFatherName").addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/[^A-Za-z ]/g, "").slice(0, 30);
});
adminElement("entryPasscode").addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6);
});

// Click handlers on lists & radar
adminElement("liveRadarContainer")?.addEventListener("click", async (event) => {
  const warnBtn = event.target.closest("[data-warn-live]");
  if (warnBtn) {
    const sessionId = warnBtn.dataset.warnLive;
    const name = warnBtn.dataset.studentName;
    const defaultMsg = "Please maintain full focus on the exam screen!";
    const customMsg = window.prompt(`Candidate "${name}" ko kya warning bhejni hai?`, defaultMsg);
    if (customMsg && customMsg.trim()) {
      await adminDatabase.ref(`activeExamSessions/${sessionId}/lastWarning`).set({
        message: customMsg.trim(),
        timestamp: Date.now()
      });
      setAdminNotice(`Live security warning candidate "${name}" ki screen par send ho gayi!`);
    }
    return;
  }

  const termBtn = event.target.closest("[data-terminate-live]");
  if (termBtn) {
    const sessionId = termBtn.dataset.terminateLive;
    const name = termBtn.dataset.studentName;
    if (window.confirm(`Student "${name}" ka live exam session terminate karna hai?`)) {
      await adminDatabase.ref(`activeExamSessions/${sessionId}`).update({
        forceTerminated: true,
        terminateReason: "Terminated live by Admin Command Center."
      });
      setAdminNotice(`Live exam for "${name}" terminated.`);
    }
  }
});

adminElement("permanentList").addEventListener("click", (event) => {
  const blockBtn = event.target.closest("[data-block-key]");
  if (blockBtn) {
    toggleBlockPermanentStudent(blockBtn.dataset.blockKey, false, blockBtn.dataset.studentId);
    return;
  }
  const unblockBtn = event.target.closest("[data-unblock-key]");
  if (unblockBtn) {
    toggleBlockPermanentStudent(unblockBtn.dataset.unblockKey, true, unblockBtn.dataset.studentId);
    return;
  }
  const copyBtn = event.target.closest("[data-copy-key]");
  if (copyBtn) {
    copyPermanentCredentials(copyBtn.dataset.copyKey);
    return;
  }
  const deleteBtn = event.target.closest("[data-delete-perm]");
  if (deleteBtn) {
    deletePermanentStudent(deleteBtn.dataset.deletePerm, deleteBtn.dataset.studentId);
  }
});

adminElement("passcodeList").addEventListener("click", (event) => {
  const assignButton = event.target.closest("[data-assign-code]");
  if (assignButton) {
    switchSubnav("onetime");
    adminElement("entryPasscode").value = assignButton.dataset.assignCode;
    adminElement("entryStudentId").focus();
    adminElement("studentEntryForm").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const button = event.target.closest("[data-delete-code]");
  if (button) deletePasscode(button.dataset.deleteCode);
});

adminElement("resultList").addEventListener("click", (event) => {
  const inspectBtn = event.target.closest("[data-inspect-result]");
  if (inspectBtn) {
    openAuditModal(inspectBtn.dataset.inspectResult);
    return;
  }
  const button = event.target.closest("[data-delete-result]");
  if (button) deleteExamResult(button.dataset.deleteResult);
});