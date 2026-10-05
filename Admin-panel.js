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

  // One-time passcodes listener
  adminDatabase.ref("passcodes").on("value", (snapshot) => {
    passcodesCache = snapshot.val() || {};
    renderPasscodes();
  }, (error) => setAdminNotice(`Passcodes could not be loaded: ${error.message}`, true));

  // Permanent students listener (LIVE FIREBASE)
  adminDatabase.ref("permanentStudents").on("value", (snapshot) => {
    permanentStudentsCache = snapshot.val() || {};
    renderPermanentStudents();
  }, (error) => setAdminNotice(`Permanent students could not be loaded: ${error.message}`, true));

  // Exam results listener
  adminDatabase.ref("examResults").limitToLast(50).on("value", (snapshot) => {
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
  adminDatabase.ref("examResults").off();
  adminListenersBound = false;
  passcodesCache = {};
  permanentStudentsCache = {};
  resultsCache = {};
  updateLiveConnection(false);
}

// Render Permanent Students List
function renderPermanentStudents() {
  const container = adminElement("permanentList");
  if (!container) return;
  const entries = Object.entries(permanentStudentsCache).sort((left, right) =>
    Number(right[1]?.createdAt || 0) - Number(left[1]?.createdAt || 0));

  const totalCount = entries.length;
  const blockedCount = entries.filter(([, student]) => student?.isBlocked === true).length;
  const activeCount = totalCount - blockedCount;

  const statEl = adminElement("permanentStat");
  if (statEl) {
    statEl.textContent = `${activeCount} Active / ${blockedCount} Blocked`;
  }

  const query = (adminElement("permSearch")?.value || "").trim().toLowerCase();

  const filtered = entries.filter(([key, student]) => {
    if (!query) return true;
    const sId = String(student?.studentId || key).toLowerCase();
    const sName = String(student?.studentName || "").toLowerCase();
    const sFather = String(student?.fatherName || "").toLowerCase();
    const sPhone = String(student?.phone || "").toLowerCase();
    return sId.includes(query) || sName.includes(query) || sFather.includes(query) || sPhone.includes(query);
  });

  if (!filtered.length) {
    container.innerHTML = entries.length
      ? '<p class="modal-copy">No permanent students matching your search.</p>'
      : '<p class="modal-copy">No permanent students created yet. Use Form 2 above to create a lifetime student entry.</p>';
    return;
  }

  container.innerHTML = filtered.map(([key, item]) => {
    const isBlocked = item?.isBlocked === true;
    const statusLabel = isBlocked ? "BLOCKED BY ADMIN" : "ACTIVE / ALLOWED";
    const statusBadgeClass = isBlocked ? "blocked" : "active";
    const rowClass = isBlocked ? "perm-row blocked" : "perm-row";

    return `
      <article class="${rowClass}">
        <div class="perm-row-main">
          <div class="perm-row-title">
            <span class="perm-id-badge">${adminEscape(item?.studentId || key)}</span>
            <span class="perm-student-name">${adminEscape(item?.studentName || "Student")}</span>
            <span class="perm-status-badge ${statusBadgeClass}">${statusLabel}</span>
          </div>
          <div class="perm-row-meta">
            <span class="perm-meta-item">Father: <strong>${adminEscape(item?.fatherName || "—")}</strong></span>
            <span class="perm-meta-item">Mobile: <strong>${adminEscape(item?.phone || "—")}</strong></span>
            <span class="perm-meta-item">Exam: <strong>${adminEscape(item?.exam || "All Subjects")}</strong></span>
            <span class="perm-meta-item">
              Lifetime Pass: <span class="perm-pass-tag">${adminEscape(UNIVERSAL_LIFETIME_PASSWORD)}</span>
            </span>
          </div>
        </div>
        <div class="perm-row-actions">
          ${isBlocked
            ? `<button class="btn-unblock" type="button" data-unblock-key="${adminEscape(key)}" data-student-id="${adminEscape(item?.studentId || key)}">Unblock ID</button>`
            : `<button class="btn-block" type="button" data-block-key="${adminEscape(key)}" data-student-id="${adminEscape(item?.studentId || key)}">Block ID</button>`
          }
          <button class="btn-copy" type="button" data-copy-key="${adminEscape(key)}" title="Copy all details to give to student">Copy Info</button>
          <button class="admin-delete" type="button" data-delete-perm="${adminEscape(key)}" data-student-id="${adminEscape(item?.studentId || key)}">Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

// Render One-Time Passcodes List
function renderPasscodes() {
  const container = adminElement("passcodeList");
  if (!container) return;
  const entries = Object.entries(passcodesCache).sort((left, right) =>
    Number(right[1]?.createdAt || 0) - Number(left[1]?.createdAt || 0));
  const now = Date.now();
  const availableCount = entries.filter(([, code]) =>
    code?.isUsed === false && Number(code.expiresAt || Infinity) > now &&
    code.studentId && code.exam).length;

  adminElement("unusedCodes").textContent = String(availableCount);

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
      <span class="admin-row-status ${statusClass}">${status}</span>
      <button class="admin-delete" type="button" data-delete-code="${adminEscape(code)}">Delete</button>
    </article>`;
  }).join("") || '<p class="modal-copy">No one-time codes yet. Create a student entry to issue the first code.</p>';
}

// Render Exam Results: NEVER displays "Candidate" fallback!
function renderResults() {
  const container = adminElement("resultList");
  if (!container) return;
  const entries = Object.entries(resultsCache).reverse();
  adminElement("resultCount").textContent = String(entries.length);

  container.innerHTML = entries.map(([key, result]) => {
    // Exact student name priority
    const studentName = result.candidate?.fullName || result.candidate?.studentName || result.studentName || "Student";
    const studentId = result.candidate?.studentId || result.studentId || "—";
    const isPermanent = result.candidate?.isPermanent === true || result.isPermanent === true;
    const examType = isPermanent ? "Permanent Lifetime ID" : "One-Time Code";

    return `
      <article class="admin-row">
        <div class="admin-row-main">
          <strong>${adminEscape(studentName)} · ${adminEscape(result.status || "COMPLETED")}</strong>
          <small>ID: ${adminEscape(studentId)} · ${adminEscape(result.candidate?.exam || result.exam || "All Subjects")} · Marks: ${adminEscape(result.marks ?? "—")}/100 · ${examType}</small>
        </div>
        <button class="admin-delete" type="button" data-delete-result="${adminEscape(key)}">Delete</button>
      </article>`;
  }).join("") || '<p class="modal-copy">No exam results yet.</p>';
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
  } catch (error) {
    errorNode.textContent = error.message || "Admin access could not be verified.";
  } finally {
    button.disabled = false;
    button.textContent = "Unlock Admin Panel";
  }
}

function createOneTimeCode() {
  const random = new Uint32Array(1);
  const cryptoProvider = window.crypto;
  if (!cryptoProvider?.getRandomValues) throw new Error("Secure code generation is unavailable in this browser.");
  cryptoProvider.getRandomValues(random);
  return String(100000 + (random[0] % 900000));
}

function normalizeStudentId(value) {
  return value.trim().toUpperCase();
}

// SAVE PERMANENT STUDENT ENTRY (FORM 2)
// STRICT RULE: Reject duplicate Student ID! Must be unique every time!
async function savePermanentStudentEntry(event) {
  event.preventDefault();
  if (!adminAuthenticated) return;
  const form = adminElement("permanentStudentForm");
  const error = adminElement("permError");
  const submit = adminElement("createPermButton");
  const notice = adminElement("createdPermNotice");

  const rawId = adminElement("permStudentId").value;
  const studentId = normalizeStudentId(rawId);
  const studentKey = sanitizeKey(studentId);
  const studentName = adminElement("permStudentName").value.trim().replace(/\s+/g, " ");
  const fatherName = adminElement("permFatherName").value.trim().replace(/\s+/g, " ");
  const phone = adminElement("permPhone").value.trim();
  const exam = adminElement("permExam").value;

  error.textContent = "";
  notice.textContent = "";

  if (!/^[A-Z0-9_-]{2,30}$/.test(studentId)) {
    error.textContent = "Permanent Student ID mein sirf letters, numbers, hyphen aur underscore use karein.";
    return;
  }

  // 🔥 STRICT CHECK: Har baar ID different honi chahiye! Duplicate ID reject:
  if (permanentStudentsCache[studentKey]) {
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

// BLOCK / UNBLOCK PERMANENT STUDENT (LIVE FIREBASE)
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

// DELETE PERMANENT STUDENT
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

// COPY PERMANENT CREDENTIALS
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
      setAdminNotice(`Credentials for ${item.studentId} copied to clipboard!`);
    }).catch(() => {
      prompt("Copy these credentials manually:", textToCopy);
    });
  } else {
    prompt("Copy these credentials manually:", textToCopy);
  }
}

// SAVE SINGLE-USE ONE-TIME ENTRY (FORM 1)
async function saveStudentEntry(event) {
  event.preventDefault();
  if (!adminAuthenticated) return;
  const form = adminElement("studentEntryForm");
  const error = adminElement("entryError");
  const submit = adminElement("createEntryButton");
  const generate = adminElement("generateEntryCodeButton");
  const notice = adminElement("createdCodeNotice");
  const studentId = normalizeStudentId(adminElement("entryStudentId").value);
  const studentName = adminElement("entryStudentName").value.trim().replace(/\s+/g, " ");
  const fatherName = adminElement("entryFatherName").value.trim().replace(/\s+/g, " ");
  const phone = adminElement("entryPhone").value.trim();
  const exam = adminElement("entryExam").value;
  const suppliedCode = adminElement("entryPasscode").value.trim();
  error.textContent = "";
  notice.textContent = "";

  if (!/^[A-Z0-9_-]{2,30}$/.test(studentId)) {
    error.textContent = "Student ID mein sirf letters, numbers, hyphen aur underscore use karein.";
    return;
  }
  if (!/^[A-Za-z ]{2,30}$/.test(studentName) || !/^[A-Za-z ]{2,30}$/.test(fatherName)) {
    error.textContent = "Student aur father name mein sirf letters/spaces hon, maximum 30 characters.";
    return;
  }
  if (!/^03\d{9}$/.test(phone)) {
    error.textContent = "Mobile number exactly 11 digits ho aur 03 se start ho.";
    return;
  }
  if (suppliedCode && !/^\d{6}$/.test(suppliedCode)) {
    error.textContent = "Existing one-time code exactly 6 digits ka hona chahiye.";
    return;
  }

  const alreadyIssued = Object.values(passcodesCache).some((item) =>
    String(item?.studentId || "").toUpperCase() === studentId && item?.isUsed !== true);
  if (alreadyIssued) {
    error.textContent = "Is Student ID ke liye pehle se active one-time code maujood hai.";
    return;
  }

  submit.disabled = true;
  generate.disabled = true;
  submit.textContent = suppliedCode ? "Attaching existing code..." : "Saving student entry...";
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
        throw new Error("Yeh code available legacy code nahi hai. Naya code generate karein.");
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
    setAdminNotice("Exam result Firebase se delete ho gaya.");
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

// Tab Switching (Feedback removed)
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

// Event Listeners
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

// Subnav Tab buttons
adminElement("navPermanentTab").addEventListener("click", () => switchSubnav("permanent"));
adminElement("navOneTimeTab").addEventListener("click", () => switchSubnav("onetime"));
adminElement("navResultsTab").addEventListener("click", () => switchSubnav("results"));

// Search input
adminElement("permSearch")?.addEventListener("input", renderPermanentStudents);

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

// Click handlers on lists
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
  const button = event.target.closest("[data-delete-result]");
  if (button) deleteExamResult(button.dataset.deleteResult);
});