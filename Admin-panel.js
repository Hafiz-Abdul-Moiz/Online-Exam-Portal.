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
let currentMarksheetFilter = "all";

let lastGeneratedCodeData = null;

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
    renderMarksheetCandidates();
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
    const exam = sess?.exam || "Computer Science Group";
    const currentQ = sess?.currentQuestion || 1;
    const totalQ = sess?.questionCount || 60;
    const secondsLeft = sess?.secondsLeft || 1800;
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const timeFormatted = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    const aiStatus = sess?.aiWarning ? "⚠️ AI Alert" : "🛡️ Clean";

    return `
      <div class="radar-student-card">
        <div>
          <strong>${adminEscape(studentName)} <span class="perm-id-badge">${adminEscape(studentId)}</span></strong>
          <div class="radar-telemetry">
            <span>Exam: <strong>${adminEscape(exam)}</strong></span>
            <span>Progress: <strong>Q${currentQ} / ${totalQ}</strong></span>
            <span>Time Left: <strong>${timeFormatted}</strong></span>
            <span>AI Sentinel: <strong style="color:#4ade80;">${adminEscape(aiStatus)}</strong></span>
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
    const duration = item?.durationMinutes ? `${item.durationMinutes} Min` : "1 Hour";
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
            <span>Exam: <strong>${adminEscape(item?.exam || "Computer Science Group")}</strong></span>
            <span>Duration: <strong>${adminEscape(duration)}</strong></span>
            <span>Lifetime Password: <strong style="color:#facc15;">${UNIVERSAL_LIFETIME_PASSWORD}</strong></span>
          </div>
        </div>
        <div class="perm-row-actions">
          ${isBlocked
            ? `<button class="btn-unblock" type="button" data-unblock-key="${adminEscape(key)}" data-student-id="${adminEscape(item?.studentId || key)}">Unblock ID</button>`
            : `<button class="btn-block" type="button" data-block-key="${adminEscape(key)}" data-student-id="${adminEscape(item?.studentId || key)}">Block ID</button>`
          }
          <button class="btn-generate-marksheet" type="button" data-quick-marksheet="${adminEscape(item?.studentId || key)}" data-name="${adminEscape(item?.studentName)}" data-father="${adminEscape(item?.fatherName)}" data-exam="${adminEscape(item?.exam || "Computer Science Group")}">👑 Generate Marksheet</button>
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
    const duration = item?.durationMinutes ? `${item.durationMinutes} Min` : "1 Hour";
    return `<article class="admin-row">
      <div class="admin-row-main">
        <strong>${adminEscape(item?.studentName || item?.label || "Student")} · Code: <code style="color:#38bdf8; font-weight:700;">${adminEscape(code)}</code></strong>
        <small>Student ID: <strong>${adminEscape(item?.studentId || "Not assigned")}</strong> · Father: ${adminEscape(item?.fatherName || "—")} · Exam: ${adminEscape(item?.exam || "Computer Science Group")} · Duration: ${adminEscape(duration)}</small>
      </div>
      <div class="admin-row-actions">
        <button class="btn-copy" type="button" data-copy-onetime="${adminEscape(code)}" title="Copy credentials">Copy Info</button>
        <span class="status-pill ${expired ? "blocked" : "active"}">${status}</span>
        <button class="admin-delete" type="button" data-delete-code="${adminEscape(code)}">Delete</button>
      </div>
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
          <small>ID: ${adminEscape(studentId)} · ${adminEscape(result.candidate?.exam || result.exam || "Computer Science Group")} · Marks: <strong>${adminEscape(result.marks ?? "—")}/100</strong> · ${examType}</small>
        </div>
        <div class="admin-row-actions">
          <button class="btn-generate-marksheet" type="button" data-open-marksheet-key="${adminEscape(key)}">
            👑 Marksheet
          </button>
          <button class="btn-inspect" type="button" data-inspect-result="${adminEscape(key)}">
            🔍 Inspect
          </button>
          <button class="admin-delete" type="button" data-delete-result="${adminEscape(key)}">Delete</button>
        </div>
      </article>`;
  }).join("");
}

// 4. VVIP MARKSHEET HUB RENDERER
function renderMarksheetCandidates() {
  const container = adminElement("marksheetCandidatesList");
  if (!container) return;

  const entries = Object.entries(resultsCache).reverse();

  let filtered = entries;
  if (currentMarksheetFilter === "passed") {
    filtered = entries.filter(([, r]) => (r.status || "").toUpperCase() === "PASSED");
  } else if (currentMarksheetFilter === "failed") {
    filtered = entries.filter(([, r]) => (r.status || "").toUpperCase() === "FAILED");
  } else if (currentMarksheetFilter === "terminated") {
    filtered = entries.filter(([, r]) => (r.status || "").toUpperCase() === "TERMINATED");
  }

  if (!filtered.length) {
    container.innerHTML = `<p class="modal-copy">Koi student is category (${currentMarksheetFilter}) mein nahi mila.</p>`;
    return;
  }

  container.innerHTML = filtered.map(([key, r]) => {
    const studentName = r.candidate?.fullName || r.candidate?.studentName || r.studentName || "Student";
    const studentId = r.candidate?.studentId || r.studentId || "—";
    const fatherName = r.candidate?.fatherName || r.fatherName || "—";
    const marks = r.marks ?? 0;
    const status = (r.status || "COMPLETED").toUpperCase();
    const exam = r.candidate?.exam || r.exam || "Computer Science Group";
    const isPassed = status === "PASSED";
    const isTerminated = status === "TERMINATED";

    let actionBtn = "";
    if (isPassed) {
      actionBtn = `<button class="btn-generate-marksheet" type="button" data-open-marksheet-key="${adminEscape(key)}">🎓 Generate VVIP Marksheet</button>`;
    } else if (isTerminated) {
      actionBtn = `<button class="btn-penalty" type="button" data-open-marksheet-key="${adminEscape(key)}">🚨 Disciplinary Penalty Record</button>`;
    } else {
      actionBtn = `<button class="btn-remedial" type="button" data-open-marksheet-key="${adminEscape(key)}">📋 View Remedial Notice</button>`;
    }

    return `
      <article class="perm-row">
        <div class="perm-row-main">
          <div class="perm-row-title">
            <strong>${adminEscape(studentName)}</strong>
            <span class="perm-id-badge">${adminEscape(studentId)}</span>
            <span class="status-pill ${isPassed ? "active" : "blocked"}">${adminEscape(status)}</span>
          </div>
          <div class="perm-row-details">
            <span>Father: <strong>${adminEscape(fatherName)}</strong></span>
            <span>Marks: <strong style="color:${isPassed ? "#4ade80" : "#f87171"}; font-size:0.95rem;">${marks} / 100</strong></span>
            <span>Exam: <strong>${adminEscape(exam)}</strong></span>
            ${r.reason ? `<span>Forensic Note: <em style="color:#f87171;">${adminEscape(r.reason)}</em></span>` : ""}
          </div>
        </div>
        <div class="perm-row-actions">
          ${actionBtn}
          <a href="Marksheet.html?resultKey=${encodeURIComponent(key)}" target="_top" class="btn-copy" style="text-decoration:none;">👑 View Marksheet</a>
        </div>
      </article>
    `;
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
  const exam = result.candidate?.exam || result.exam || "Computer Science Group";
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
        <strong>🛡️ AI Proctor Sentinel &amp; Anti-Cheat Audit: ENFORCED</strong>
        <div><span>Shortcut Monitoring Active · Tab-Switch Guard · Realtime Telemetry Recorded</span></div>
      </div>
      <span class="status-pill ${status === "TERMINATED" ? "blocked" : "active"}">${status === "TERMINATED" ? "Violation Detected" : "Verified Clean"}</span>
    </div>

    <div style="display:flex; justify-content:center; margin-top:10px;">
      <a href="Marksheet.html?resultKey=${encodeURIComponent(resultKey)}" target="_top" class="btn-generate-marksheet" style="text-decoration:none; font-size:0.9rem; padding:10px 20px;">
        👑 Open Official Marksheet &amp; Certificate View
      </a>
    </div>

    ${subjectsHtml}
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
  const duration = Number(adminElement("permDuration")?.value || 60);
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

  submit.disabled = true;
  submit.textContent = "Saving Permanent ID...";

  try {
    const studentData = {
      studentId,
      studentName,
      fatherName,
      phone,
      exam,
      durationMinutes: duration,
      password: UNIVERSAL_LIFETIME_PASSWORD,
      isBlocked: false,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    await adminDatabase.ref(`permanentStudents/${studentKey}`).set(studentData);

    notice.textContent = `Permanent ID Created! ID: ${studentId} · Lifetime Password: ${UNIVERSAL_LIFETIME_PASSWORD} · Exam: ${exam} (${duration} mins)`;
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
  if (!adminAuthenticated || !window.confirm(`Permanent student "${studentId}" ko delete karna hai?`)) return;
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
Duration: ${item.durationMinutes || 60} Minutes
Portal Access: ${item.isBlocked ? "BLOCKED" : "ACTIVE"}`;

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setAdminNotice(`Credentials for "${item.studentName}" copied to clipboard!`);
    });
  } else {
    alert(textToCopy);
  }
}

function copyOneTimeCredentials(code) {
  const item = passcodesCache[code];
  if (!item) return;

  const textToCopy = `=== SkillTester One-Time Passcode ===
Student ID: ${item.studentId}
One-Time Code: ${code}
Student Name: ${item.studentName}
Father Name: ${item.fatherName}
Mobile: ${item.phone}
Assigned Exam: ${item.exam}
Duration: ${item.durationMinutes || 60} Minutes`;

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setAdminNotice(`Credentials for "${item.studentName}" copied!`);
    });
  } else {
    alert(textToCopy);
  }
}

function createOneTimeCode() {
  const digits = "0123456789";
  let code = "";
  do {
    code = "";
    for (let index = 0; index < 6; index += 1) {
      code += digits[Math.floor(Math.random() * digits.length)];
    }
  } while (code === UNIVERSAL_LIFETIME_PASSWORD || code === "999990");
  return code;
}

async function saveStudentEntry(event) {
  if (event) event.preventDefault();
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
  const duration = Number(adminElement("entryDuration")?.value || 60);
  const suppliedCode = adminElement("entryPasscode").value.trim();

  if (suppliedCode === UNIVERSAL_LIFETIME_PASSWORD || suppliedCode === "999990") {
    error.textContent = "Code '999990' is strictly reserved for Form 2 (Permanent IDs)!";
    return;
  }

  submit.disabled = true;
  generate.disabled = true;

  try {
    let code = suppliedCode;
    if (!code) {
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const candidate = createOneTimeCode();
        if (candidate === UNIVERSAL_LIFETIME_PASSWORD || candidate === "999990") continue;
        const snap = await adminDatabase.ref(`passcodes/${candidate}`).once("value");
        if (!snap.exists()) {
          code = candidate;
          break;
        }
      }
      if (!code) code = String(Math.floor(100000 + Math.random() * 900000));
    }

    const payload = {
      label: studentName,
      code,
      studentId,
      studentName,
      fatherName,
      phone,
      exam,
      durationMinutes: duration,
      isUsed: false,
      status: "available",
      createdAt: firebase.database.ServerValue.TIMESTAMP
    };

    await adminDatabase.ref(`passcodes/${code}`).set(payload);

    const studentKey = sanitizeKey(studentId);
    await adminDatabase.ref(`studentIdToPasscode/${studentKey}`).set({
      code,
      studentId,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    });

    lastGeneratedCodeData = { code, studentId, studentName, fatherName, phone, exam, durationMinutes: duration };
    adminElement("entryPasscode").value = code;
    notice.textContent = `Saved! Student ID: ${studentId} · Code: ${code} · Exam: ${exam}`;
    setAdminNotice(`Success! Code "${code}" created for "${studentName}".`);
  } catch (err) {
    error.textContent = err.message || "Entry save nahi ho saki.";
  } finally {
    submit.disabled = false;
    generate.disabled = false;
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
    setAdminNotice(`Code ${code} delete ho gaya.`);
  } catch (error) {
    setAdminNotice(`Code delete fail: ${error.message}`, true);
  }
}

async function deleteExamResult(key) {
  if (!adminAuthenticated || !window.confirm("Is result ko delete karna hai?")) return;
  try {
    await adminDatabase.ref(`examResults/${key}`).remove();
    setAdminNotice("Exam result delete ho gaya.");
  } catch (error) {
    setAdminNotice(`Result delete fail: ${error.message}`, true);
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
  const marksheetWrap = adminElement("marksheetSectionWrap");
  
  const permBtn = adminElement("navPermanentTab");
  const oneTimeBtn = adminElement("navOneTimeTab");
  const resultsBtn = adminElement("navResultsTab");
  const marksheetBtn = adminElement("navMarksheetTab");

  permBtn.classList.toggle("active", tabName === "permanent");
  oneTimeBtn.classList.toggle("active", tabName === "onetime");
  resultsBtn.classList.toggle("active", tabName === "results");
  marksheetBtn.classList.toggle("active", tabName === "marksheet");

  permanentWrap.classList.toggle("hidden", tabName !== "permanent");
  oneTimeWrap.classList.toggle("hidden", tabName !== "onetime");
  resultsWrap.classList.toggle("hidden", tabName !== "results");
  marksheetWrap.classList.toggle("hidden", tabName !== "marksheet");

  if (tabName === "marksheet") {
    renderMarksheetCandidates();
  }
}

// Instant Manual Marksheet Form Handler
adminElement("instantMarksheetForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = adminElement("instId").value.trim().toUpperCase();
  const name = adminElement("instName").value.trim();
  const father = adminElement("instFather").value.trim();
  const phone = adminElement("instPhone").value.trim();
  const exam = adminElement("instExam").value;
  const marks = adminElement("instMarks").value;
  const status = adminElement("instStatus").value;
  const reason = adminElement("instReason").value.trim();

  const url = `Marksheet.html?studentId=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&father=${encodeURIComponent(father)}&phone=${encodeURIComponent(phone)}&exam=${encodeURIComponent(exam)}&marks=${encodeURIComponent(marks)}&status=${encodeURIComponent(status)}&reason=${encodeURIComponent(reason)}`;
  (window.top || window).location.href = url;
});

// Event listeners
adminElement("adminLoginForm").addEventListener("submit", verifyAdminAccess);
adminElement("permanentStudentForm").addEventListener("submit", savePermanentStudentEntry);
adminElement("clearPermButton").addEventListener("click", () => {
  adminElement("permanentStudentForm").reset();
  adminElement("permPassword").value = UNIVERSAL_LIFETIME_PASSWORD;
});
adminElement("fillUniversalPassBtn")?.addEventListener("click", () => {
  adminElement("permPassword").value = UNIVERSAL_LIFETIME_PASSWORD;
  setAdminNotice("Universal Lifetime Password (999990) fill ho gaya.");
});
adminElement("resetPermPassBtn")?.addEventListener("click", () => {
  adminElement("permPassword").value = UNIVERSAL_LIFETIME_PASSWORD;
});

adminElement("studentEntryForm").addEventListener("submit", saveStudentEntry);
adminElement("generateEntryCodeButton").addEventListener("click", () => saveStudentEntry());

adminElement("toggleAdmin").addEventListener("click", toggleExamAccess);
adminElement("adminLogout").addEventListener("click", lockAdminPanel);

adminElement("navPermanentTab").addEventListener("click", () => switchSubnav("permanent"));
adminElement("navOneTimeTab").addEventListener("click", () => switchSubnav("onetime"));
adminElement("navResultsTab").addEventListener("click", () => switchSubnav("results"));
adminElement("navMarksheetTab").addEventListener("click", () => switchSubnav("marksheet"));

adminElement("filterMarksheetAll")?.addEventListener("click", (e) => {
  currentMarksheetFilter = "all";
  document.querySelectorAll("#marksheetSectionWrap .subnav-btn").forEach((b) => b.classList.remove("active"));
  e.target.classList.add("active");
  renderMarksheetCandidates();
});
adminElement("filterMarksheetPassed")?.addEventListener("click", (e) => {
  currentMarksheetFilter = "passed";
  document.querySelectorAll("#marksheetSectionWrap .subnav-btn").forEach((b) => b.classList.remove("active"));
  e.target.classList.add("active");
  renderMarksheetCandidates();
});
adminElement("filterMarksheetFailed")?.addEventListener("click", (e) => {
  currentMarksheetFilter = "failed";
  document.querySelectorAll("#marksheetSectionWrap .subnav-btn").forEach((b) => b.classList.remove("active"));
  e.target.classList.add("active");
  renderMarksheetCandidates();
});
adminElement("filterMarksheetTerminated")?.addEventListener("click", (e) => {
  currentMarksheetFilter = "terminated";
  document.querySelectorAll("#marksheetSectionWrap .subnav-btn").forEach((b) => b.classList.remove("active"));
  e.target.classList.add("active");
  renderMarksheetCandidates();
});

adminElement("permSearch")?.addEventListener("input", renderPermanentStudents);
adminElement("resultSearch")?.addEventListener("input", renderResults);

adminElement("closeAuditModalBtn")?.addEventListener("click", closeAuditModal);
adminElement("dismissAuditModalBtn")?.addEventListener("click", closeAuditModal);
adminElement("printAuditReportBtn")?.addEventListener("click", () => window.print());

// Click delegations
adminElement("liveRadarContainer")?.addEventListener("click", async (event) => {
  const warnBtn = event.target.closest("[data-warn-live]");
  if (warnBtn) {
    const sessionId = warnBtn.dataset.warnLive;
    const name = warnBtn.dataset.studentName;
    const customMsg = window.prompt(`Candidate "${name}" ko kya warning bhejni hai?`, "AI Proctor Sentinel: Focus on exam screen immediately!");
    if (customMsg && customMsg.trim()) {
      await adminDatabase.ref(`activeExamSessions/${sessionId}/lastWarning`).set({
        message: customMsg.trim(),
        timestamp: Date.now()
      });
      setAdminNotice(`Live warning candidate "${name}" ki screen par bhej di gayi!`);
    }
    return;
  }
  const termBtn = event.target.closest("[data-terminate-live]");
  if (termBtn) {
    const sessionId = termBtn.dataset.terminateLive;
    const name = termBtn.dataset.studentName;
    if (window.confirm(`Student "${name}" ka exam session terminate karna hai?`)) {
      await adminDatabase.ref(`activeExamSessions/${sessionId}`).update({
        forceTerminated: true,
        terminateReason: "Terminated live by Admin Command Center."
      });
      setAdminNotice(`Live exam for "${name}" terminated.`);
    }
  }
});

adminElement("permanentList")?.addEventListener("click", (event) => {
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
  const quickMarksheet = event.target.closest("[data-quick-marksheet]");
  if (quickMarksheet) {
    const id = quickMarksheet.dataset.quickMarksheet;
    const name = quickMarksheet.dataset.name;
    const father = quickMarksheet.dataset.father;
    const exam = quickMarksheet.dataset.exam;
    (window.top || window).location.href = `Marksheet.html?studentId=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&father=${encodeURIComponent(father)}&exam=${encodeURIComponent(exam)}&status=PASSED&marks=88`;
    return;
  }
  const deleteBtn = event.target.closest("[data-delete-perm]");
  if (deleteBtn) {
    deletePermanentStudent(deleteBtn.dataset.deletePerm, deleteBtn.dataset.studentId);
  }
});

adminElement("passcodeList")?.addEventListener("click", (event) => {
  const copyBtn = event.target.closest("[data-copy-onetime]");
  if (copyBtn) {
    copyOneTimeCredentials(copyBtn.dataset.copyOnetime);
    return;
  }
  const button = event.target.closest("[data-delete-code]");
  if (button) deletePasscode(button.dataset.deleteCode);
});

adminElement("resultList")?.addEventListener("click", (event) => {
  const openMarksheet = event.target.closest("[data-open-marksheet-key]");
  if (openMarksheet) {
    (window.top || window).location.href = `Marksheet.html?resultKey=${encodeURIComponent(openMarksheet.dataset.openMarksheetKey)}`;
    return;
  }
  const inspectBtn = event.target.closest("[data-inspect-result]");
  if (inspectBtn) {
    openAuditModal(inspectBtn.dataset.inspectResult);
    return;
  }
  const button = event.target.closest("[data-delete-result]");
  if (button) deleteExamResult(button.dataset.deleteResult);
});

adminElement("marksheetCandidatesList")?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-open-marksheet-key]");
  if (btn) {
    (window.top || window).location.href = `Marksheet.html?resultKey=${encodeURIComponent(btn.dataset.openMarksheetKey)}`;
  }
});

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  return false;
}, true);

window.addEventListener("keydown", (e) => {
  const key = event.key || "";
  const isFKey = /^F\d+$/.test(key) || (event.keyCode >= 112 && event.keyCode <= 123);
  const isDangerousCtrl = event.ctrlKey && ["u", "s", "p", "r", "i", "j"].includes(key.toLowerCase());
  if (isFKey || isDangerousCtrl) {
    e.preventDefault();
    return false;
  }
}, true);
