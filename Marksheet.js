/* SkillTester VVIP Marksheet & Academic Certification Engine */
const marksheetFirebaseConfig = {
  apiKey: "AIzaSyBtU4FbqMwIQL2WyOUVhn5o4NiP8r53EQs",
  authDomain: "live-feedback-app-7bf6b.firebaseapp.com",
  databaseURL: "https://live-feedback-app-7bf6b-default-rtdb.firebaseio.com",
  projectId: "live-feedback-app-7bf6b",
  storageBucket: "live-feedback-app-7bf6b.firebasestorage.app",
  messagingSenderId: "456949595332",
  appId: "1:456949595332:web:79b40c4acc6499710f5d91"
};

if (!firebase.apps.length) firebase.initializeApp(marksheetFirebaseConfig);
const db = firebase.database();

const $ = (id) => document.getElementById(id);

function escapeHtml(val) {
  return String(val ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

function calculateGrade(percentage) {
  if (percentage >= 85) return { grade: "A+", remarks: "Outstanding / Exceptional", badgeClass: "a-plus" };
  if (percentage >= 70) return { grade: "A", remarks: "Excellent / High Merit", badgeClass: "a" };
  if (percentage >= 50) return { grade: "B", remarks: "Satisfactory / Qualified", badgeClass: "b" };
  return { grade: "F", remarks: "Failed (Needs Re-sit)", badgeClass: "f" };
}

function renderMarksheet(data) {
  const card = $("marksheetCard");
  const studentName = data.fullName || data.studentName || "Candidate";
  const studentId = data.studentId || "ST-DEMO";
  const fatherName = data.fatherName || "—";
  const phone = data.phone || "—";
  const exam = data.exam || "Computer Science & General Science";
  const marks = Number(data.marks ?? 78);
  const totalMarks = Number(data.totalMarks ?? 100);
  const percentage = Math.round((marks / totalMarks) * 100);
  const isPermanent = data.isPermanent === true;
  const status = (data.status || (marks >= 50 ? "PASSED" : "FAILED")).toUpperCase();
  const reason = data.reason || "";
  const subjectBreakdown = data.subjectBreakdown || {};

  // Update bio
  $("studentNameDisplay").textContent = studentName;
  $("studentIdDisplay").innerHTML = `<code>${escapeHtml(studentId)}</code>`;
  $("fatherNameDisplay").textContent = fatherName;
  $("phoneDisplay").textContent = phone;
  $("examGroupDisplay").textContent = exam;
  $("accessModeDisplay").textContent = isPermanent ? "Permanent Lifetime Access ID" : "Single-Use Verified Passcode";

  const dateObj = data.createdAt ? new Date(data.createdAt) : new Date();
  const dateFormatted = dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const serialNo = `ST-TRANS-${studentId.replace(/[^A-Za-z0-9]/g, "")}-${dateObj.getFullYear()}`;
  if ($("certSerialDisplay")) $("certSerialDisplay").innerHTML = `<code>${escapeHtml(serialNo)}</code>`;
  if ($("issueDateDisplay")) $("issueDateDisplay").textContent = dateFormatted;

  // Reset mode classes
  card.classList.remove("mode-failed", "mode-terminated");
  const bannerContainer = $("statusSpecificBanner");
  bannerContainer.innerHTML = "";

  const { grade, remarks } = calculateGrade(percentage);

  // Status-Specific Treatment
  if (status === "TERMINATED") {
    card.classList.add("mode-terminated");
    $("docMainTitle").textContent = "Official Malpractice & Disciplinary Verdict Record";
    bannerContainer.innerHTML = `
      <div class="punishment-banner">
        <span class="punish-badge">DISCIPLINARY PENALTY RECORD</span>
        <h2 class="punish-title">🚨 EXAM TERMINATED DUE TO UNFAIR MEANS (CHEATING)</h2>
        <p class="punish-reasons">
          <strong>Violation Reason:</strong> ${escapeHtml(reason || "Proctor detected window minimization / forbidden keyboard shortcut.")}<br>
          <strong>Penal Action Taken:</strong> The candidate's examination attempt has been officially CANCELLED. All marks nullified (0/100). Formal disciplinary sanction logged in database. Re-registration subject to Administrative Review.
        </p>
      </div>
    `;
    $("kpiVerdict").textContent = "DISQUALIFIED";
    $("kpiVerdict").className = "stat-pill-val failed";
    $("kpiStanding").textContent = "Disciplinary Cancel";
  } else if (status === "FAILED" || marks < 50) {
    card.classList.add("mode-failed");
    $("docMainTitle").textContent = "Provisional Performance & Remedial Guidance Slip";
    bannerContainer.innerHTML = `
      <div class="remedial-box">
        <div class="remedial-title">⚠️ Re-Sit &amp; Remedial Advisory Notice</div>
        <p class="remedial-text">
          Allah na kare agar aap is martaba pass nahi ho sake, to ghabrane ya mayus hone ki koi baat nahi hai!
          Mehnat jari rakhain, Allah Ta'ala har koshish ka ajar deta hai. Aapki weak areas neeche table mein darj hain.
          <strong>Eligible for Re-attempt:</strong> Allowed after 7 days of comprehensive revision.
        </p>
      </div>
    `;
    $("kpiVerdict").textContent = "FAILED";
    $("kpiVerdict").className = "stat-pill-val failed";
    $("kpiStanding").textContent = "Remedial Student";
  } else {
    // VVIP PASSED
    $("docMainTitle").textContent = "Official Provisional Certificate & Marksheet";
    $("kpiVerdict").textContent = "PASSED";
    $("kpiVerdict").className = "stat-pill-val passed";
    $("kpiStanding").textContent = percentage >= 85 ? "Distinction (Gold)" : percentage >= 70 ? "First Division" : "Second Division";
  }

  // Populate Subject Breakdown Table
  const tableBody = $("marksTableBody");
  tableBody.innerHTML = "";

  let subjects = [];
  if (Object.keys(subjectBreakdown).length > 0) {
    subjects = Object.entries(subjectBreakdown).map(([name, item]) => ({
      name,
      max: 25, // default proportional max
      obtained: item.correct ? Math.round((item.correct / item.total) * 25) : Math.round(marks / 4)
    }));
  } else if (exam.toLowerCase().includes("computer") || exam.toLowerCase().includes("science")) {
    const p1 = Math.min(25, Math.round(marks * 0.28));
    const p2 = Math.min(25, Math.round(marks * 0.26));
    const p3 = Math.min(25, Math.round(marks * 0.24));
    const p4 = Math.max(0, marks - (p1 + p2 + p3));
    subjects = [
      { name: "English Compulsory (Grammar, Essay & MCQs)", max: 25, obtained: p1 },
      { name: "Computer Science (Architecture, SQL & Programming)", max: 25, obtained: p2 },
      { name: "Mathematics (Matrices, Calculus & Algebra)", max: 25, obtained: p3 },
      { name: "Physics (Kinematics, Thermodynamics & Optics)", max: 25, obtained: p4 }
    ];
  } else {
    // Web Dev subjects (HTML, CSS, JavaScript)
    const h = Math.round(marks * 0.33);
    const c = Math.round(marks * 0.33);
    const j = marks - (h + c);
    subjects = [
      { name: "HTML5 (Semantic Web & Forms)", max: 35, obtained: h },
      { name: "CSS3 (Flexbox, Grid & Animations)", max: 35, obtained: c },
      { name: "JavaScript ES6+ (DOM, Logic & Async)", max: 30, obtained: j }
    ];
  }

  let totalMaxSum = 0;
  let totalObtSum = 0;

  subjects.forEach((subj, idx) => {
    totalMaxSum += subj.max;
    totalObtSum += subj.obtained;
    const subPerc = Math.round((subj.obtained / subj.max) * 100);
    const subG = calculateGrade(subPerc);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${idx + 1}</td>
      <td><strong>${escapeHtml(subj.name)}</strong></td>
      <td>${subj.max}</td>
      <td><strong>${subj.obtained}</strong></td>
      <td><span class="grade-badge ${subG.badgeClass}">${subG.grade}</span></td>
      <td>${subG.remarks}</td>
    `;
    tableBody.appendChild(row);
  });

  $("grandTotalMax").textContent = totalMarks;
  $("grandTotalObtained").textContent = status === "TERMINATED" ? "0 (Cancelled)" : marks;
  $("grandOverallGrade").innerHTML = status === "TERMINATED" ? `<span class="grade-badge f">X</span>` : `<span class="grade-badge ${calculateGrade(percentage).badgeClass}">${grade}</span>`;
  $("grandStatusText").textContent = status;

  $("kpiMarks").textContent = status === "TERMINATED" ? "0 / 100" : `${marks} / ${totalMarks}`;
  $("kpiPercentage").textContent = status === "TERMINATED" ? "0%" : `${percentage}%`;
}

// Load data from URL parameters or Firebase
async function loadCandidateData() {
  const params = new URLSearchParams(window.location.search);
  const studentId = params.get("studentId") || params.get("id");
  const resultKey = params.get("resultKey");

  if (resultKey) {
    try {
      const snap = await db.ref(`examResults/${resultKey}`).once("value");
      if (snap.exists()) {
        const val = snap.val();
        renderMarksheet({
          fullName: val.candidate?.fullName || val.studentName,
          studentId: val.candidate?.studentId || val.studentId,
          fatherName: val.candidate?.fatherName || val.fatherName,
          phone: val.candidate?.phone || val.phone,
          exam: val.candidate?.exam || val.exam,
          marks: val.marks,
          totalMarks: val.totalMarks || 100,
          status: val.status,
          reason: val.reason,
          isPermanent: val.candidate?.isPermanent,
          subjectBreakdown: val.subjectBreakdown
        });
        return;
      }
    } catch (e) {
      console.warn("Could not fetch by resultKey", e);
    }
  }

  if (studentId) {
    try {
      const snap = await db.ref("examResults").orderByChild("studentId").equalTo(studentId.toUpperCase()).limitToLast(1).once("value");
      if (snap.exists()) {
        const entries = Object.values(snap.val());
        const val = entries[entries.length - 1];
        renderMarksheet({
          fullName: val.candidate?.fullName || val.studentName,
          studentId: val.candidate?.studentId || val.studentId,
          fatherName: val.candidate?.fatherName || val.fatherName,
          phone: val.candidate?.phone || val.phone,
          exam: val.candidate?.exam || val.exam,
          marks: val.marks,
          totalMarks: val.totalMarks || 100,
          status: val.status,
          reason: val.reason,
          isPermanent: val.candidate?.isPermanent,
          subjectBreakdown: val.subjectBreakdown
        });
        return;
      }
    } catch (e) {
      console.warn("Could not search by studentId", e);
    }
  }

  // Parameters passed directly in URL
  if (params.get("name")) {
    renderMarksheet({
      fullName: params.get("name"),
      studentId: params.get("studentId") || "ST-1001",
      fatherName: params.get("father") || "Muhammad Ahmed",
      phone: params.get("phone") || "03001234567",
      exam: params.get("exam") || "Computer Science & General Science",
      marks: Number(params.get("marks") || 88),
      totalMarks: 100,
      status: params.get("status") || "PASSED",
      reason: params.get("reason") || ""
    });
    return;
  }

  // Default Pristine Demo Marksheet
  renderMarksheet({
    fullName: "Muhammad Muzammil Ahmed",
    studentId: "ST-2026-VIP",
    fatherName: "Tariq Ahmed",
    phone: "03262116352",
    exam: "Computer Science & Technical Science Board",
    marks: 92,
    totalMarks: 100,
    status: "PASSED",
    isPermanent: true,
    subjectBreakdown: {
      "English Compulsory": { correct: 24, total: 25 },
      "Computer Science": { correct: 25, total: 25 },
      "Mathematics": { correct: 22, total: 25 },
      "Physics": { correct: 21, total: 25 }
    }
  });
}

// Search handler
$("verifySearchBtn")?.addEventListener("click", () => {
  const query = ($("verifySearchInput")?.value || "").trim();
  if (!query) return;
  window.location.search = `?studentId=${encodeURIComponent(query)}`;
});

$("verifySearchInput")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    $("verifySearchBtn")?.click();
  }
});

$("backNavBtn")?.addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "index.html";
  }
});

$("adminNavBtn")?.addEventListener("click", () => {
  window.location.href = "index.html?openAdmin=true";
});

$("printMarksheetBtn")?.addEventListener("click", () => {
  window.print();
});

$("copyLinkBtn")?.addEventListener("click", () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Official Marksheet Verification Link Copied!");
    });
  } else {
    alert(window.location.href);
  }
});

loadCandidateData();

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  return false;
}, true);

window.addEventListener("keydown", (e) => {
  const key = e.key || "";
  const isFKey = /^F\d+$/.test(key) || (e.keyCode >= 112 && e.keyCode <= 123);
  const isDangerousCtrl = e.ctrlKey && ["u", "s", "p", "r", "i", "j"].includes(key.toLowerCase());
  if (isFKey || isDangerousCtrl) {
    e.preventDefault();
    return false;
  }
}, true);
