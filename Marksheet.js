/* Online Exam Portal · VVIP Marksheet & Academic Certification Engine (v3) */
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
const REDUCE_MOTION = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

function escapeHtml(val) {
  return String(val ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

function sanitizeKey(key) {
  return String(key ?? "").replace(/[.#$\[\]]/g, "_").trim().toUpperCase();
}

const round1 = (n) => Math.round((Number(n) || 0) * 10) / 10;
const fmtNum = (n) => {
  const v = round1(n);
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
};
const decOf = (n) => (Number.isInteger(round1(n)) ? 0 : 1);

function calculateGrade(percentage, passed = true) {
  if (percentage >= 85) return { grade: "A+", remarks: "Outstanding / Exceptional (Distinction)", badgeClass: "a-plus" };
  if (percentage >= 70) return { grade: "A", remarks: "First Division / High Merit", badgeClass: "a" };
  if (percentage >= 55) return { grade: "B", remarks: "Second Division / Good", badgeClass: "b" };
  if (percentage >= 40) return { grade: "C", remarks: "Pass / Qualified", badgeClass: "b" };
  if (passed) return { grade: "D", remarks: "Pass (Marginal) / Qualified", badgeClass: "b" };
  return { grade: "F", remarks: "Failed (Needs Re-sit)", badgeClass: "f" };
}

function pctColor(p) {
  if (p >= 85) return "#34d399";
  if (p >= 70) return "#38bdf8";
  if (p >= 55) return "#facc15";
  if (p >= 40) return "#fb923c";
  return "#f87171";
}

function skillLevel(p) {
  if (p >= 85) return { text: "Expert", cls: "lvl-expert" };
  if (p >= 70) return { text: "Advanced", cls: "lvl-advanced" };
  if (p >= 55) return { text: "Intermediate", cls: "lvl-mid" };
  if (p >= 40) return { text: "Beginner", cls: "lvl-low" };
  return { text: "Needs Training", cls: "lvl-none" };
}

/* ---------- Track detection ---------- */
function isBoardTrack(data) {
  const exam = String(data.exam || "").toLowerCase();
  return data.eng !== undefined || data.cs !== undefined || Number(data.totalMarks) === 400 || exam.includes("board");
}

function isWebTrack(data) {
  const exam = String(data.exam || "").toLowerCase();
  const keys = Object.keys(data.subjectBreakdown || {}).join(" ").toLowerCase();
  return /web|html|css|javascript|all subjects|full.?stack/.test(exam) || /html|css|javascript/.test(keys);
}

const BOARD_SUBJECTS = [
  { key: "eng", name: "English Compulsory (Grammar, Composition & MCQs)", short: "English", icon: "📖", max: 100, pass: 50, color: "#fbbf24" },
  { key: "cs", name: "Computer Science (Theory, Architecture & Coding)", short: "Computer Science", icon: "💻", max: 75, pass: 25, color: "#a5b4fc" },
  { key: "math", name: "Mathematics (Algebra, Matrices & Calculus)", short: "Mathematics", icon: "📐", max: 75, pass: 25, color: "#7dd3fc" },
  { key: "phy", name: "Physics (Mechanics, Thermodynamics & Optics)", short: "Physics", icon: "⚡", max: 75, pass: 25, color: "#fdba74" },
  { key: "pak", name: "Pakistan Studies (Ideology, Constitution & Geography)", short: "Pakistan Studies", icon: "🇵🇰", max: 75, pass: 25, color: "#6ee7b7" }
];

/* ---------- Visual effects (all safe, optional, print-disabled) ---------- */
function startParticles() {
  const canvas = $("fxParticles");
  if (!canvas || REDUCE_MOTION) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let w = 0;
  let h = 0;
  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);
  const count = window.innerWidth < 720 ? 26 : 52;
  const dots = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.8 + 0.4,
    vy: Math.random() * 0.25 + 0.08,
    vx: (Math.random() - 0.5) * 0.15,
    a: Math.random() * 0.45 + 0.12,
    p: Math.random() * Math.PI * 2
  }));
  const tick = () => {
    if (!document.hidden) {
      ctx.clearRect(0, 0, w, h);
      dots.forEach((d) => {
        d.p += 0.01;
        d.y -= d.vy;
        d.x += d.vx + Math.sin(d.p) * 0.1;
        if (d.y < -5) { d.y = h + 5; d.x = Math.random() * w; }
        ctx.beginPath();
        ctx.fillStyle = `rgba(251,191,36,${d.a})`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    requestAnimationFrame(tick);
  };
  tick();
}

function launchConfetti(intensity = 1) {
  const canvas = $("fxConfetti");
  if (!canvas || REDUCE_MOTION) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width = window.innerWidth;
  const h = canvas.height = window.innerHeight;
  const colors = ["#fbbf24", "#f59e0b", "#34d399", "#38bdf8", "#f472b6", "#a78bfa", "#ffffff"];
  const total = Math.round(140 * intensity);
  const pieces = Array.from({ length: total }, () => ({
    x: w / 2 + (Math.random() - 0.5) * w * 0.3,
    y: h * 0.28,
    vx: (Math.random() - 0.5) * 14,
    vy: -(Math.random() * 11 + 4),
    g: 0.28 + Math.random() * 0.12,
    s: Math.random() * 7 + 4,
    rot: Math.random() * 6.28,
    vr: (Math.random() - 0.5) * 0.3,
    c: colors[Math.floor(Math.random() * colors.length)]
  }));
  const start = performance.now();
  const frame = (now) => {
    const t = now - start;
    ctx.clearRect(0, 0, w, h);
    let alive = 0;
    pieces.forEach((p) => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.rot += p.vr;
      if (p.y < h + 20) {
        alive++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.max(0, 1 - t / 4200);
        ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.6);
        ctx.restore();
      }
    });
    if (alive > 0 && t < 4200) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, w, h);
  };
  requestAnimationFrame(frame);
}

function countUp(el, target, opts = {}) {
  if (!el) return;
  const decimals = opts.decimals || 0;
  const suffix = opts.suffix || "";
  const duration = opts.duration || 1300;
  const final = Number(target) || 0;
  const write = (v) => { el.textContent = `${decimals ? v.toFixed(decimals) : Math.round(v)}${suffix}`; };
  if (REDUCE_MOTION || final === 0) { write(final); return; }
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    write(final * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(step);
    else write(final);
  };
  requestAnimationFrame(step);
}

function activateVisuals(scope) {
  const run = () => {
    scope.querySelectorAll("[data-w]").forEach((el) => { el.style.width = `${el.dataset.w}%`; });
    scope.querySelectorAll("[data-ring]").forEach((el) => { el.style.strokeDashoffset = el.dataset.ring; });
    scope.querySelectorAll("[data-count]").forEach((el) => {
      countUp(el, el.dataset.count, { decimals: Number(el.dataset.dec || 0), suffix: el.dataset.suffix || "" });
    });
  };
  if (REDUCE_MOTION) { run(); return; }
  requestAnimationFrame(() => requestAnimationFrame(run));
}

function ringSvg(pct, color, size = 110, stroke = 9) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
  const mid = size / 2;
  return `<svg class="ring" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">
    <circle class="ring-bg" cx="${mid}" cy="${mid}" r="${r}" stroke-width="${stroke}"></circle>
    <circle class="ring-fg" cx="${mid}" cy="${mid}" r="${r}" stroke-width="${stroke}" stroke="${color}"
      stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${c.toFixed(2)}" data-ring="${off.toFixed(2)}"
      transform="rotate(-90 ${mid} ${mid})"></circle>
  </svg>`;
}

/* ---------- Banner (topper ribbon + verdict stamp) ---------- */
let bannerState = { ribbon: "", stamp: "" };
function paintBanner() {
  const box = $("positionBanner");
  if (!box) return;
  box.innerHTML = `${bannerState.ribbon}${bannerState.stamp}`;
}

function ribbonHtml(kind, title, sub) {
  const icons = { 1: "🥇", 2: "🥈", 3: "🥉", d: "⭐", top: "🏆" };
  return `<div class="position-ribbon pos-${kind}">
    <span class="pos-medal">${icons[kind] || "🏅"}</span>
    <div><strong>${escapeHtml(title)}</strong><small>${escapeHtml(sub)}</small></div>
    <i class="pos-spark s1"></i><i class="pos-spark s2"></i><i class="pos-spark s3"></i>
  </div>`;
}

function stampHtml(kind, text) {
  return `<div class="verdict-stamp ${kind}" aria-label="Result: ${escapeHtml(text)}">${escapeHtml(text)}</div>`;
}

/* ---------- Section builders ---------- */
function buildBoardSubjects(data, marks) {
  return BOARD_SUBJECTS.map((s) => {
    let v = data[s.key];
    if (v === undefined || v === null || Number.isNaN(Number(v))) {
      // legacy fallback when only an aggregate is known
      const share = s.max / 400;
      v = s.key === "pak"
        ? Math.max(0, marks - BOARD_SUBJECTS.filter((x) => x.key !== "pak").reduce((a, x) => a + Math.round(marks * (x.max / 400)), 0))
        : Math.round(marks * share);
    }
    const obtained = Math.max(0, Math.min(s.max, Number(v) || 0));
    return { ...s, obtained };
  });
}

function buildWebSections(data, marks, totalMarks, status) {
  const bd = data.subjectBreakdown || {};
  const keys = Object.keys(bd).filter((k) => /html|css|javascript|js/i.test(k) || Object.keys(bd).length <= 4);
  const audits = data.aiEvaluation && Array.isArray(data.aiEvaluation.questionAudits) ? data.aiEvaluation.questionAudits : [];
  const pretty = (k) => {
    const l = k.toLowerCase();
    if (l.includes("html")) return { name: "HTML5 (Semantic Web, Forms & Canvas)", short: "HTML5", icon: "🌐", color: "#fb923c" };
    if (l.includes("css")) return { name: "CSS3 (Flexbox, Grid, Animations & Media Queries)", short: "CSS3", icon: "🎨", color: "#38bdf8" };
    if (l.includes("java") || l === "js") return { name: "JavaScript ES6+ (DOM, Logic, ES6 & Async)", short: "JavaScript", icon: "⚡", color: "#facc15" };
    return { name: k, short: k, icon: "📘", color: "#a5b4fc" };
  };

  let sections = [];
  if (keys.length) {
    const sumTotal = keys.reduce((s, k) => s + (Number(bd[k].total) || 0), 0) || keys.length;
    sections = keys.map((k) => {
      const it = bd[k] || {};
      const total = Number(it.total) || 0;
      const correct = Number(it.correct) || 0;
      const own = audits.filter((a) => a.section === k || a.subject === k);
      return {
        ...pretty(k),
        max: round1((totalMarks * (total || 1)) / sumTotal),
        obtained: status === "TERMINATED" ? 0 : round1((totalMarks * correct) / sumTotal),
        total,
        correct,
        right: own.filter((a) => a.status === "APPROVED").length,
        partial: own.filter((a) => a.status === "PARTIAL").length,
        wrong: own.filter((a) => a.status === "REJECTED").length,
        skipped: own.filter((a) => a.status === "SKIPPED").length,
        hasAudit: own.length > 0
      };
    });
    // keep the sum of sections equal to the official total
    if (status !== "TERMINATED" && sections.length) {
      const diff = round1(marks - sections.reduce((s, x) => s + x.obtained, 0));
      if (Math.abs(diff) > 0 && Math.abs(diff) <= 0.3) {
        const last = sections[sections.length - 1];
        last.obtained = Math.max(0, round1(last.obtained + diff));
      }
    }
  } else {
    const split = [35, 35, 30];
    const names = ["HTML5", "CSS3", "JavaScript"];
    let used = 0;
    sections = names.map((n, i) => {
      const max = round1((totalMarks * split[i]) / 100);
      const obt = i === 2 ? Math.max(0, round1(marks - used)) : Math.min(max, round1((marks * split[i]) / 100));
      used += obt;
      return { ...pretty(n), max, obtained: Math.min(max, obt), total: 0, correct: 0, right: 0, partial: 0, wrong: 0, skipped: 0, hasAudit: false };
    });
  }
  return sections;
}

function buildGenericRows(data, marks, totalMarks, exam) {
  const lower = exam.toLowerCase();
  const bd = data.subjectBreakdown || {};
  const keys = Object.keys(bd);
  if (keys.length) {
    const count = keys.length;
    let weights;
    if (lower.includes("english")) weights = [20, 30, 50];
    else if (count === 3) weights = [20, 35, 20];
    else {
      const avg = Math.floor(totalMarks / count);
      weights = Array(count).fill(avg);
      weights[0] += totalMarks - avg * count;
    }
    return keys.map((name, i) => {
      const item = bd[name] || {};
      const max = weights[i] || Math.round(totalMarks / count);
      // Board subjects already store marks (not counts) in "correct"
      const obtained = Number(item.total) === max ? Number(item.correct) || 0 : Math.round(((item.correct || 0) / (item.total || 1)) * max);
      return { name, max, obtained: Math.min(max, obtained) };
    });
  }
  if (lower.includes("english")) {
    const a = Math.min(20, Math.round(marks * 0.2));
    const b = Math.min(30, Math.round(marks * 0.3));
    return [
      { name: "Section A: 20 Objective MCQs (Grammar & Vocabulary)", max: 20, obtained: a },
      { name: "Section B: 8 Short Questions (Grammar & Sentences - Attempt 5)", max: 30, obtained: b },
      { name: "Section C: 4 Long Questions (Formal Application & Essay - Attempt 2)", max: 50, obtained: Math.max(0, marks - (a + b)) }
    ];
  }
  const a = Math.min(20, Math.round(marks * (20 / 75)));
  const b = Math.min(35, Math.round(marks * (35 / 75)));
  return [
    { name: "Section A: 20 Objective MCQs (Concepts & Theory)", max: 20, obtained: a },
    { name: "Section B: 8 Short Questions (Attempt any 5)", max: 35, obtained: b },
    { name: "Section C: 4 Long Analytical Questions (Attempt any 2)", max: 20, obtained: Math.max(0, marks - (a + b)) }
  ];
}

/* ---------- Main renderer ---------- */
function renderMarksheet(data) {
  const card = $("marksheetCard");
  const exam = data.exam || "Computer Science Board Exam";
  const board = isBoardTrack(data);
  const web = !board && isWebTrack(data);
  const track = board ? "board" : web ? "web" : "generic";
  const sourceForm = data.source === "form";

  const studentName = data.fullName || data.studentName || "Candidate";
  const studentId = data.studentId || "ST-DEMO";
  const fatherName = data.fatherName || "—";
  const phone = data.phone || "—";
  const isPermanent = data.isPermanent === true;
  const displayExam = web && /all subjects/i.test(exam) ? "Web Development Certification (HTML5 + CSS3 + JavaScript)" : exam;

  const rawMarks = Number.isFinite(Number(data.marks)) ? Number(data.marks) : 0;
  const boardSubjects = board ? buildBoardSubjects(data, rawMarks) : null;
  const marks = board ? round1(boardSubjects.reduce((s, x) => s + x.obtained, 0)) : rawMarks;
  const fallbackTotal = web || exam.toLowerCase().includes("english") ? 100 : 75;
  const totalMarks = board ? 400 : Number(data.totalMarks ?? fallbackTotal);
  const percentage = Math.max(0, Math.min(100, Math.round((marks / (totalMarks || 1)) * 100)));

  let defaultPass = 25;
  if (totalMarks === 400) defaultPass = 150;
  else if (totalMarks === 100) defaultPass = web ? 40 : 50;
  const passingMarks = Number(data.passingMarks ?? defaultPass);

  const failedSubjects = board ? boardSubjects.filter((s) => s.obtained < s.pass) : [];
  let status = String(data.status || "").toUpperCase();
  if (!status) status = board ? (failedSubjects.length ? "FAILED" : "PASSED") : (marks >= passingMarks ? "PASSED" : "FAILED");
  const isTerminated = status === "TERMINATED";
  const isFailed = !isTerminated && (status === "FAILED" || (!board && marks < passingMarks));
  const isPassed = !isTerminated && !isFailed;
  const reason = data.reason || "";

  /* Bio */
  $("studentNameDisplay").textContent = studentName;
  $("studentIdDisplay").innerHTML = `<code>${escapeHtml(studentId)}</code>`;
  $("fatherNameDisplay").textContent = fatherName;
  $("phoneDisplay").textContent = phone;
  $("examGroupDisplay").textContent = displayExam;
  $("accessModeDisplay").textContent = sourceForm ? "Admin Issued · Official Board Record" : (isPermanent ? "Permanent Lifetime Access ID" : "Single-Use Verified Passcode");

  const dateObj = data.createdAt ? new Date(data.createdAt) : new Date();
  const dateFormatted = dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const serialNo = `ST-TRANS-${String(studentId).replace(/[^A-Za-z0-9]/g, "")}-${dateObj.getFullYear()}`;
  if ($("certSerialDisplay")) $("certSerialDisplay").innerHTML = `<code>${escapeHtml(serialNo)}</code>`;
  if ($("issueDateDisplay")) $("issueDateDisplay").textContent = dateFormatted;
  const subTitleEl = document.querySelector(".board-titles .sub-title");
  if (subTitleEl && data.session) subTitleEl.textContent = `${data.session} · Verified Academic Transcript`;

  /* Reset */
  card.classList.remove("mode-failed", "mode-terminated", "track-board", "track-web", "track-generic", "is-passed", "is-topper");
  card.classList.add(`track-${track}`);
  if (isPassed) card.classList.add("is-passed");
  const bannerContainer = $("statusSpecificBanner");
  bannerContainer.innerHTML = "";
  bannerState = { ribbon: "", stamp: "" };

  const overallGrade = calculateGrade(percentage, isPassed);

  if (isTerminated) {
    card.classList.add("mode-terminated");
    $("docMainTitle").textContent = "Official Malpractice & Disciplinary Verdict Record";
    bannerContainer.innerHTML = `
      <div class="punishment-banner">
        <span class="punish-badge">DISCIPLINARY PENALTY RECORD</span>
        <h2 class="punish-title">🚨 EXAM TERMINATED DUE TO UNFAIR MEANS (CHEATING)</h2>
        <p class="punish-reasons">
          <strong>Violation Reason:</strong> ${escapeHtml(reason || "Proctor detected window minimization / forbidden keyboard shortcut.")}<br>
          <strong>Penal Action Taken:</strong> The candidate's examination attempt has been officially CANCELLED. All marks nullified (0/${totalMarks}). Formal disciplinary sanction logged in database. Re-registration subject to Administrative Review.
        </p>
      </div>`;
    $("kpiVerdict").textContent = "DISQUALIFIED";
    $("kpiVerdict").className = "stat-pill-val failed";
    $("kpiStanding").textContent = "Disciplinary Cancel";
    bannerState.stamp = stampHtml("terminated", "DISQUALIFIED");
  } else if (isFailed) {
    card.classList.add("mode-failed");
    $("docMainTitle").textContent = "Provisional Performance & Remedial Guidance Slip";
    const failList = failedSubjects.length
      ? `<br><strong>Subjects to re-sit:</strong> ${failedSubjects.map((s) => `${escapeHtml(s.short)} (${fmtNum(s.obtained)}/${s.max}, needs ${s.pass})`).join(" · ")}`
      : "";
    const passLine = board
      ? `Passing Criteria: <strong>har subject mein pass marks</strong> (English 50, baaqi 25). Aapke obtained marks: <strong>${fmtNum(marks)} / ${totalMarks}</strong> (${percentage}%).`
      : `Passing Criteria: <strong>${passingMarks} / ${totalMarks} Marks</strong> (${Math.round((passingMarks / totalMarks) * 100)}%). Aapke obtained marks: <strong>${fmtNum(marks)} / ${totalMarks}</strong> (${percentage}%).`;
    bannerContainer.innerHTML = `
      <div class="remedial-box">
        <div class="remedial-title">⚠️ Re-Sit &amp; Remedial Advisory Notice</div>
        <p class="remedial-text">
          ${passLine}${failList}<br>
          Ghabrane ki koi baat nahi hai! Mehnat jari rakhain, Allah Ta'ala har koshish ka ajar deta hai. Weak areas neeche table mein darj hain.
          <strong>Eligible for Re-attempt:</strong> Allowed after comprehensive revision.
        </p>
      </div>`;
    $("kpiVerdict").textContent = "FAILED";
    $("kpiVerdict").className = "stat-pill-val failed";
    $("kpiStanding").textContent = "Remedial Student";
    bannerState.stamp = stampHtml("failed", "FAILED");
  } else {
    $("docMainTitle").textContent = board
      ? "Official Board Consolidated Marksheet & Transcript"
      : web ? "Web Development Certification · Official Marksheet" : "Official Provisional Certificate & Marksheet";
    $("kpiVerdict").textContent = "PASSED";
    $("kpiVerdict").className = "stat-pill-val passed";
    $("kpiStanding").textContent = percentage >= 85 ? "Distinction (A+)" : percentage >= 70 ? "First Division (A)" : "Qualified (Merit)";
    bannerState.stamp = stampHtml("passed", "PASSED");
  }

  /* Position ribbon (board form) */
  const pos = String(data.position || "").toLowerCase();
  let topperLevel = 0;
  if (isPassed && ["1", "2", "3", "d"].includes(pos)) {
    const titles = {
      1: ["BOARD TOPPER · 1st POSITION", "Highest honour of the examination session"],
      2: ["2nd POSITION HOLDER", "Silver merit of the examination session"],
      3: ["3rd POSITION HOLDER", "Bronze merit of the examination session"],
      d: ["DISTINCTION HOLDER", "Exceptional academic performance"]
    };
    bannerState.ribbon = ribbonHtml(pos, titles[pos][0], titles[pos][1]);
    topperLevel = pos === "1" ? 2 : 1;
    if (pos === "1") card.classList.add("is-topper");
  }
  paintBanner();

  /* Subject rows */
  const tableBody = $("marksTableBody");
  tableBody.innerHTML = "";
  let rows = [];
  let webSections = [];
  if (board) {
    rows = boardSubjects.map((s) => ({ name: s.name, max: s.max, obtained: s.obtained, pass: s.pass }));
  } else if (web) {
    webSections = buildWebSections(data, marks, totalMarks, status);
    rows = webSections.map((s) => ({ name: s.name, max: s.max, obtained: s.obtained }));
  } else {
    rows = buildGenericRows(data, marks, totalMarks, exam);
  }

  rows.forEach((subj, idx) => {
    const subPerc = subj.max ? Math.round((subj.obtained / subj.max) * 100) : 0;
    const cleared = subj.pass !== undefined ? subj.obtained >= subj.pass : true;
    const subG = calculateGrade(subPerc, cleared);
    const passNote = subj.pass !== undefined
      ? `<small class="pass-note ${cleared ? "ok" : "bad"}">Pass marks: ${subj.pass} · ${cleared ? "✔ Cleared" : "✖ Not cleared"}</small>`
      : "";
    const row = document.createElement("tr");
    row.className = "row-reveal";
    row.style.setProperty("--i", String(idx));
    row.innerHTML = `
      <td>${idx + 1}</td>
      <td><strong>${escapeHtml(subj.name)}</strong>${passNote}</td>
      <td>${fmtNum(subj.max)}</td>
      <td><strong>${isTerminated ? 0 : fmtNum(subj.obtained)}</strong></td>
      <td><span class="grade-badge ${subG.badgeClass}">${isTerminated ? "X" : subG.grade}</span></td>
      <td>${isTerminated ? "Cancelled" : subG.remarks}</td>`;
    tableBody.appendChild(row);
  });

  $("grandTotalMax").textContent = totalMarks;
  $("grandTotalObtained").textContent = isTerminated ? "0 (Cancelled)" : fmtNum(marks);
  $("grandOverallGrade").innerHTML = isTerminated
    ? `<span class="grade-badge f">X</span>`
    : `<span class="grade-badge ${overallGrade.badgeClass}">${overallGrade.grade}</span>`;
  $("grandStatusText").textContent = status;

  /* KPI cards with count-up */
  if (isTerminated) {
    $("kpiMarks").textContent = `0 / ${totalMarks}`;
    $("kpiPercentage").textContent = "0%";
  } else {
    $("kpiMarks").innerHTML = `<span data-count="${marks}" data-dec="${decOf(marks)}">0</span> / ${totalMarks}`;
    $("kpiPercentage").innerHTML = `<span data-count="${percentage}">0</span>%`;
  }

  /* Visual analytics + insight */
  renderAnalytics({ track, isTerminated, isPassed, percentage, boardSubjects, webSections, rows, marks, totalMarks });

  /* Honors line (admin-written remarks on official board sheets) */
  const honors = $("honorsLine");
  if (honors) {
    if (sourceForm && reason && isPassed) {
      honors.innerHTML = `🎖️ <strong>Honors / Remarks:</strong> ${escapeHtml(reason)}`;
      honors.classList.remove("hidden");
    } else {
      honors.classList.add("hidden");
    }
  }

  renderAiAudit(data.aiEvaluation);

  /* Run animations */
  activateVisuals(card);
  if (isPassed && !REDUCE_MOTION) {
    window.setTimeout(() => launchConfetti(topperLevel === 2 ? 2 : 1), 650);
    if (topperLevel === 2) window.setTimeout(() => launchConfetti(1.4), 2100);
  }

  /* Async: merit rank among web-development candidates */
  if (web && isPassed && data.resultKey) applyWebRank(marks);
}

function renderAnalytics(ctx) {
  const box = $("visualAnalytics");
  const body = $("vaBody");
  const title = $("vaTitle");
  const insight = $("insightBox");
  if (!box || !body || !insight) return;

  if (ctx.isTerminated) {
    box.classList.add("hidden");
    insight.classList.add("hidden");
    return;
  }

  if (ctx.track === "board") {
    title.textContent = "📊 Subject-wise Performance (400 Marks)";
    const bars = ctx.boardSubjects.map((s) => {
      const p = Math.round((s.obtained / s.max) * 100);
      const passPct = Math.round((s.pass / s.max) * 100);
      return `<div class="va-bar">
        <div class="va-bar-head"><span>${s.icon} ${escapeHtml(s.short)}</span><b>${fmtNum(s.obtained)} / ${s.max}</b></div>
        <div class="va-bar-track">
          <i class="va-bar-fill" style="--c:${s.color}" data-w="${p}"></i>
          <u class="va-pass-mark" style="left:${passPct}%" title="Pass marks: ${s.pass}"></u>
        </div>
      </div>`;
    }).join("");
    body.innerHTML = `<div class="va-board">
      <div class="va-ring">${ringSvg(ctx.percentage, pctColor(ctx.percentage), 150, 12)}
        <div class="va-ring-center"><strong data-count="${ctx.percentage}" data-suffix="%">0%</strong><span>Overall</span></div>
      </div>
      <div class="va-bars">${bars}<p class="va-legend"><u></u> Pass marks line</p></div>
    </div>`;

    const sorted = [...ctx.boardSubjects].sort((a, b) => b.obtained / b.max - a.obtained / a.max);
    const best = sorted[0];
    const weak = sorted[sorted.length - 1];
    const failed = ctx.boardSubjects.filter((s) => s.obtained < s.pass);
    insight.innerHTML = `<h4>🧠 Performance Insight</h4>
      <div class="insight-grid">
        <div class="insight-item good"><span>Strongest Subject</span><strong>${best.icon} ${escapeHtml(best.short)}</strong><em>${Math.round((best.obtained / best.max) * 100)}%</em></div>
        <div class="insight-item warn"><span>Needs Focus</span><strong>${weak.icon} ${escapeHtml(weak.short)}</strong><em>${Math.round((weak.obtained / weak.max) * 100)}%</em></div>
        <div class="insight-item info"><span>Subjects Cleared</span><strong>${ctx.boardSubjects.length - failed.length} / ${ctx.boardSubjects.length}</strong><em>pass marks</em></div>
        <div class="insight-item info"><span>Average per Subject</span><strong>${Math.round(ctx.percentage)}%</strong><em>${fmtNum(ctx.marks / ctx.boardSubjects.length)} marks</em></div>
      </div>`;
  } else if (ctx.track === "web") {
    title.textContent = "📊 Web Development Skill Analytics";
    const gauges = ctx.webSections.map((s) => {
      const p = s.max ? Math.round((s.obtained / s.max) * 100) : 0;
      const lvl = skillLevel(p);
      const stats = s.hasAudit
        ? `<div class="gauge-stats"><span class="gs ok">✓ ${s.right}</span><span class="gs bad">✗ ${s.wrong}</span>${s.partial ? `<span class="gs mid">½ ${s.partial}</span>` : ""}<span class="gs skip">○ ${s.skipped}</span></div>`
        : (s.total ? `<div class="gauge-stats"><span class="gs ok">✓ ${fmtNum(s.correct)} / ${s.total}</span></div>` : "");
      return `<div class="gauge-card" style="--c:${s.color}">
        <div class="gauge-ring">${ringSvg(p, s.color, 112, 10)}
          <div class="gauge-center"><strong data-count="${p}" data-suffix="%">0%</strong></div>
        </div>
        <h4>${s.icon} ${escapeHtml(s.short)}</h4>
        <p class="gauge-marks">${fmtNum(s.obtained)} / ${fmtNum(s.max)} marks</p>
        ${stats}
        <span class="skill-chip ${lvl.cls}">${lvl.text}</span>
      </div>`;
    }).join("");
    body.innerHTML = `<div class="gauge-grid">${gauges}</div>`;

    const scored = ctx.webSections.map((s) => ({ ...s, p: s.max ? Math.round((s.obtained / s.max) * 100) : 0 })).sort((a, b) => b.p - a.p);
    const best = scored[0];
    const weak = scored[scored.length - 1];
    const ready = skillLevel(ctx.percentage);
    insight.innerHTML = `<h4>🧠 Developer Readiness Insight</h4>
      <div class="insight-grid">
        <div class="insight-item good"><span>Strongest Skill</span><strong>${best.icon} ${escapeHtml(best.short)}</strong><em>${best.p}%</em></div>
        <div class="insight-item warn"><span>Needs Focus</span><strong>${weak.icon} ${escapeHtml(weak.short)}</strong><em>${weak.p}%</em></div>
        <div class="insight-item info"><span>Overall Level</span><strong>${ready.text}</strong><em>${ctx.percentage}%</em></div>
      </div>
      <p class="insight-note">${ctx.isPassed
        ? `Candidate ne ${escapeHtml(best.short)} mein behtareen kaam kiya. Agla qadam: ${escapeHtml(weak.short)} par mazeed practice karke full-stack readiness barhayein.`
        : `Re-test se pehle sab se zyada tayari ${escapeHtml(weak.short)} par karein, phir ${escapeHtml(scored[Math.max(0, scored.length - 2)].short)} dobara revise karein.`}</p>`;
  } else {
    title.textContent = "📊 Section-wise Performance";
    body.innerHTML = `<div class="va-bars solo">${ctx.rows.map((r, i) => {
      const p = r.max ? Math.round((r.obtained / r.max) * 100) : 0;
      return `<div class="va-bar">
        <div class="va-bar-head"><span>${i + 1}. ${escapeHtml(r.name)}</span><b>${fmtNum(r.obtained)} / ${fmtNum(r.max)}</b></div>
        <div class="va-bar-track"><i class="va-bar-fill" style="--c:${pctColor(p)}" data-w="${p}"></i></div>
      </div>`;
    }).join("")}</div>`;
    insight.classList.add("hidden");
    box.classList.remove("hidden");
    return;
  }
  box.classList.remove("hidden");
  insight.classList.remove("hidden");
}

async function applyWebRank(marks) {
  try {
    const snap = await db.ref("examResults").limitToLast(300).once("value");
    const all = Object.values(snap.val() || {}).filter((v) => {
      const probe = { exam: v.candidate?.exam || v.exam, subjectBreakdown: v.subjectBreakdown };
      return !isBoardTrack(probe) && isWebTrack(probe) && String(v.status || "").toUpperCase() !== "TERMINATED";
    });
    if (all.length < 1) return;
    const rank = 1 + all.filter((v) => Number(v.marks) > Number(marks)).length;
    const n = all.length;
    $("kpiStanding").textContent = `Rank #${rank} of ${n}`;
    if (n >= 2 && rank <= 3) {
      const card = $("marksheetCard");
      const titles = {
        1: ["TOP PERFORMER · RANK #1", "Highest score among Web Development candidates"],
        2: ["RANK #2 · SILVER MERIT", "Second highest score among Web Development candidates"],
        3: ["RANK #3 · BRONZE MERIT", "Third highest score among Web Development candidates"]
      };
      bannerState.ribbon = ribbonHtml(rank, titles[rank][0], titles[rank][1]);
      paintBanner();
      if (rank === 1) {
        card.classList.add("is-topper");
        launchConfetti(1.6);
      }
    }
  } catch (e) {
    console.warn("Could not compute web rank", e);
  }
}

/* ---------- AI forensic audit (unchanged logic) ---------- */
function renderAiAudit(aiEval) {
  const appVerdictEl = $("mAppVerdict");
  const essayVerdictEl = $("mEssayVerdict");
  const attemptedVerdictEl = $("mAttemptedVerdict");
  const spellingVerdictEl = $("mSpellingVerdict");
  const notesEl = $("mExaminerNotesText");
  const detailsEl = $("mDetailedAuditsContainer");

  if (aiEval) {
    if (appVerdictEl) {
      const appA = aiEval.applicationAudit;
      if (appA && appA.status !== "NOT_APPLICABLE") {
        appVerdictEl.textContent = appA.status === "APPROVED" ? "✅ APPROVED" : appA.status === "PARTIAL" ? "⚠️ CONDITIONAL" : "❌ REJECTED";
        appVerdictEl.className = `m-val ${appA.status === "APPROVED" ? "approved" : appA.status === "PARTIAL" ? "partial" : "rejected"}`;
      } else {
        appVerdictEl.textContent = "N/A (MCQ Track)";
        appVerdictEl.className = "m-val";
      }
    }
    if (essayVerdictEl) {
      const esA = aiEval.essayAudit;
      if (esA && esA.status !== "NOT_APPLICABLE") {
        essayVerdictEl.textContent = esA.status === "APPROVED" ? `★ High Depth (${esA.wordCount}w)` : esA.status === "PARTIAL" ? `⚠️ Moderate (${esA.wordCount}w)` : `❌ Underlength (${esA.wordCount}w)`;
        essayVerdictEl.className = `m-val ${esA.status === "APPROVED" ? "approved" : "partial"}`;
      } else {
        essayVerdictEl.textContent = "N/A (MCQ Track)";
        essayVerdictEl.className = "m-val";
      }
    }
    if (attemptedVerdictEl) {
      attemptedVerdictEl.textContent = `${aiEval.attemptedCount} / ${aiEval.totalQuestions} (${Math.round((aiEval.attemptedCount / (aiEval.totalQuestions || 1)) * 100)}%)`;
    }
    if (spellingVerdictEl) {
      spellingVerdictEl.textContent = `${aiEval.totalSpellingMistakes || 0} Spotted`;
      spellingVerdictEl.className = `m-val ${aiEval.totalSpellingMistakes > 0 ? "partial" : "approved"}`;
    }
    if (notesEl) notesEl.textContent = aiEval.teacherNotes || "Autonomous examination paper evaluation completed.";
    if (detailsEl && Array.isArray(aiEval.questionAudits)) {
      detailsEl.innerHTML = aiEval.questionAudits.map((item) => {
        const isAppr = item.status === "APPROVED";
        const isPart = item.status === "PARTIAL";
        const isSkip = item.status === "SKIPPED";
        const cls = isAppr ? "approved" : isPart ? "partial" : isSkip ? "skipped" : "rejected";
        const lbl = isAppr ? "✓ Approved" : isPart ? "⚠️ Partial Credit" : isSkip ? "⚪ Skipped" : "❌ Incorrect / Flawed";
        const typoStr = item.spellingMistakes && item.spellingMistakes.length > 0
          ? `<div style="color:#fbbf24; font-size:0.75rem; margin-top:4px;"><strong>Spelling/Typos:</strong> ${item.spellingMistakes.map(escapeHtml).join(", ")}</div>`
          : "";
        return `
          <div class="m-audit-row ${cls}">
            <div class="m-audit-header">
              <span>Q${item.qIndex} [${escapeHtml(item.subject)} · ${escapeHtml(item.section || "Sec")}]</span>
              <span class="m-val ${cls}" style="font-size:0.75rem;">${lbl}</span>
            </div>
            <p class="m-audit-text">${escapeHtml(item.question)}</p>
            <div class="m-audit-diag"><strong>🤖 AI Examiner Diagnosis:</strong> ${escapeHtml(item.aiDiagnosis)}</div>
            ${typoStr}
          </div>`;
      }).join("");
    }
  } else {
    if (appVerdictEl) appVerdictEl.textContent = "Verified";
    if (essayVerdictEl) essayVerdictEl.textContent = "Standard Review";
    if (attemptedVerdictEl) attemptedVerdictEl.textContent = "Complete";
    if (spellingVerdictEl) spellingVerdictEl.textContent = "0 Flags";
    if (notesEl) notesEl.textContent = "Candidate examination record verified under AI Sentinel oversight.";
    if (detailsEl) detailsEl.innerHTML = "";
  }
}

/* ---------- Data loading ---------- */
function mapDbResult(val, key) {
  const valExam = val.candidate?.exam || val.exam || "";
  const lower = valExam.toLowerCase();
  const fallbackTotal = lower.includes("english") || lower.includes("web") || lower.includes("all subjects") ? 100 : 75;
  return {
    resultKey: key,
    fullName: val.candidate?.fullName || val.studentName,
    studentId: val.candidate?.studentId || val.studentId,
    fatherName: val.candidate?.fatherName || val.fatherName,
    phone: val.candidate?.phone || val.phone,
    exam: valExam,
    marks: val.marks,
    totalMarks: val.totalMarks || fallbackTotal,
    passingMarks: val.passingMarks,
    status: val.status,
    reason: val.reason,
    createdAt: val.createdAt,
    isPermanent: val.candidate?.isPermanent,
    subjectBreakdown: val.subjectBreakdown,
    aiEvaluation: val.aiEvaluation
  };
}

function mapBoardTranscript(val) {
  return {
    fullName: val.name,
    studentId: val.studentId,
    fatherName: val.father,
    phone: val.phone,
    exam: val.exam || "Computer Science Board Exam",
    marks: val.marks,
    totalMarks: 400,
    status: val.status,
    reason: val.reason,
    position: val.position,
    session: val.session,
    createdAt: val.createdAt,
    source: "form",
    eng: val.eng, cs: val.cs, math: val.math, phy: val.phy, pak: val.pak
  };
}

function showNotFound(query) {
  const card = $("marksheetCard");
  card.innerHTML = `<div class="notfound-box">
    <div class="notfound-icon">🔎</div>
    <h2>No Official Record Found</h2>
    <p>"<strong>${escapeHtml(query)}</strong>" ke liye koi verified marksheet nahi mili. Student ID dobara check karein (jaise ST-1001).</p>
  </div>`;
}

async function loadCandidateData() {
  const params = new URLSearchParams(window.location.search);
  const studentId = params.get("studentId") || params.get("id");
  const resultKey = params.get("resultKey");

  // 1) Direct result from Firebase (1-click system)
  if (resultKey) {
    try {
      const snap = await db.ref(`examResults/${resultKey}`).once("value");
      if (snap.exists()) {
        renderMarksheet(mapDbResult(snap.val(), resultKey));
        return;
      }
    } catch (e) {
      console.warn("Could not fetch by resultKey", e);
    }
  }

  // 2) Admin form / direct URL data (board transcript, instant marksheet)
  if (params.get("name")) {
    const examName = params.get("exam") || "Computer Science Board Exam";
    const lower = examName.toLowerCase();
    const num = (k) => (params.get(k) !== null && params.get(k) !== "" ? Number(params.get(k)) : undefined);
    const totalMarks = Number(params.get("totalMarks") || (lower.includes("board") || params.get("eng") ? 400 : (lower.includes("english") || lower.includes("web") ? 100 : 75)));
    renderMarksheet({
      fullName: params.get("name"),
      studentId: studentId || "ST-1001",
      fatherName: params.get("father") || "—",
      phone: params.get("phone") || "—",
      exam: examName,
      marks: Number(params.get("marks") || 0),
      totalMarks,
      passingMarks: params.get("passingMarks") ? Number(params.get("passingMarks")) : undefined,
      status: params.get("status") || undefined,
      reason: params.get("reason") || "",
      position: params.get("pos") || "",
      session: params.get("session") || "",
      source: params.get("src") === "form" ? "form" : "url",
      eng: num("eng"), cs: num("cs"), math: num("math"), phy: num("phy"), pak: num("pak")
    });
    return;
  }

  // 3) Verify by Student ID: official board transcript first, then exam results
  if (studentId) {
    try {
      const bSnap = await db.ref(`boardTranscripts/${sanitizeKey(studentId)}`).limitToLast(1).once("value");
      if (bSnap.exists()) {
        const list = Object.values(bSnap.val());
        renderMarksheet(mapBoardTranscript(list[list.length - 1]));
        return;
      }
    } catch (e) {
      console.warn("Could not search board transcripts", e);
    }
    try {
      const snap = await db.ref("examResults").orderByChild("studentId").equalTo(studentId.toUpperCase()).limitToLast(1).once("value");
      if (snap.exists()) {
        const entries = Object.entries(snap.val());
        const [key, val] = entries[entries.length - 1];
        renderMarksheet(mapDbResult(val, key));
        return;
      }
    } catch (e) {
      console.warn("Could not search by studentId", e);
    }
    showNotFound(studentId);
    return;
  }

  // 4) Default pristine demo: full 5-subject board transcript (400 marks)
  renderMarksheet({
    fullName: "Muhammad Muzammil Ahmed",
    studentId: "ST-2026-VIP",
    fatherName: "Tariq Ahmed",
    phone: "03262116352",
    exam: "Computer Science Board Exam (Technical Group)",
    marks: 352,
    totalMarks: 400,
    status: "PASSED",
    position: "1",
    session: "Annual Examination Session 2026",
    reason: "First Division with Distinction · Grade A+",
    source: "form",
    isPermanent: true,
    eng: 88, cs: 69, math: 71, phy: 62, pak: 62
  });
}

/* ---------- UI bindings ---------- */
$("verifySearchBtn")?.addEventListener("click", () => {
  const query = ($("verifySearchInput")?.value || "").trim();
  if (!query) return;
  window.location.search = `?studentId=${encodeURIComponent(query)}`;
});

$("verifySearchInput")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("verifySearchBtn")?.click();
});

$("backNavBtn")?.addEventListener("click", () => {
  if (window.history.length > 1) window.history.back();
  else window.location.href = "index.html";
});

$("adminNavBtn")?.addEventListener("click", () => {
  window.location.href = "index.html?openAdmin=true";
});

$("printMarksheetBtn")?.addEventListener("click", () => window.print());

$("copyLinkBtn")?.addEventListener("click", () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Official Marksheet Verification Link Copied!");
    }).catch(() => alert(window.location.href));
  } else {
    alert(window.location.href);
  }
});

startParticles();
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