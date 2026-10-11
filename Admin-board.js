/* Online Exam Portal · Admin VVIP Marksheet Studio
   System 1: One-Click Web Development marksheet (HTML5 + CSS3 + JavaScript)
   System 2: Computer Science Board form (5 subjects · 400 marks, topper positions)
   Loads AFTER Admin-panel.js and uses its globals (resultsCache, permanentStudentsCache, ...). */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const wrap = $("marksheetSectionWrap");
  if (!wrap) return;

  const REDUCE = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
  const keyOf = (v) => String(v ?? "").replace(/[.#$\[\]]/g, "_").trim().toUpperCase();
  const round1 = (n) => Math.round((Number(n) || 0) * 10) / 10;
  const fmt = (n) => { const v = round1(n); return Number.isInteger(v) ? String(v) : v.toFixed(1); };

  const results = () => (typeof resultsCache !== "undefined" && resultsCache) || {};
  const perms = () => (typeof permanentStudentsCache !== "undefined" && permanentStudentsCache) || {};
  const codes = () => (typeof passcodesCache !== "undefined" && passcodesCache) || {};
  const notice = (msg, isErr) => { if (typeof setAdminNotice === "function") setAdminNotice(msg, !!isErr); };
  const go = (url) => { (window.top || window).location.href = url; };

  const SUBJECTS = [
    { key: "eng", name: "English", icon: "📖", max: 100, pass: 50, color: "#fbbf24" },
    { key: "cs", name: "Computer Science", icon: "💻", max: 75, pass: 25, color: "#a5b4fc" },
    { key: "math", name: "Mathematics", icon: "📐", max: 75, pass: 25, color: "#7dd3fc" },
    { key: "phy", name: "Physics", icon: "⚡", max: 75, pass: 25, color: "#fdba74" },
    { key: "pak", name: "Pakistan Studies", icon: "🇵🇰", max: 75, pass: 25, color: "#6ee7b7" }
  ];
  const WEB_COLORS = { html: "#fb923c", css: "#38bdf8", java: "#facc15" };

  const state = { mode: "oneclick", filter: "all", query: "", position: "none", verdict: "AUTO", saving: false };

  /* ---------- result helpers ---------- */
  const examOf = (r) => r?.candidate?.exam || r?.exam || "";
  const idOf = (r) => r?.candidate?.studentId || r?.studentId || "";
  const nameOf = (r) => r?.candidate?.fullName || r?.candidate?.studentName || r?.studentName || "Student";
  const statusOf = (r) => String(r?.status || "COMPLETED").toUpperCase();
  const totalOf = (r) => (Number(r?.totalMarks) > 0 ? Number(r.totalMarks) : (typeof getCandidateTotalMarks === "function" ? getCandidateTotalMarks(r) : 100));
  const passOf = (r) => (Number(r?.passingMarks) > 0 ? Number(r.passingMarks) : (typeof getCandidatePassingMarks === "function" ? getCandidatePassingMarks(r) : 40));

  function isWeb(r) {
    const exam = examOf(r).toLowerCase();
    const keys = Object.keys(r?.subjectBreakdown || {}).join(" ").toLowerCase();
    return /web|html|css|javascript|all subjects|full.?stack/.test(exam) || /html|css|javascript/.test(keys);
  }

  function subjectKeyFromExam(examText) {
    const e = String(examText || "").toLowerCase();
    if (/web|html|css|javascript|all subjects/.test(e)) return null;
    if (e.includes("english") && !e.includes("group")) return "eng";
    if (e.includes("math")) return "math";
    if (e.includes("physic")) return "phy";
    if (e.includes("pakistan") || e.includes("pak study")) return "pak";
    if (e.includes("computer") || /\bcs\b/.test(e)) return "cs";
    return null;
  }

  /* =====================================================================
     BUILD UI
  ===================================================================== */
  function buildUI() {
    const legacyList = $("marksheetCandidatesList")?.closest("section");
    const legacyBoard = $("boardMarksheetForm")?.closest("section");
    const legacySingle = $("instantMarksheetForm")?.closest("section");
    legacyList?.classList.add("vvip-legacy-hidden");
    legacyBoard?.classList.add("vvip-legacy-hidden");
    if (legacySingle) legacySingle.id = legacySingle.id || "singleSubjectPanel";

    const bar = document.createElement("div");
    bar.id = "hubModeBar";
    bar.className = "hub-mode-bar";
    bar.innerHTML = `
      <button type="button" class="hub-mode-btn active" data-hub-mode="oneclick">
        <strong>⚡ System 1 · One-Click Marksheet</strong>
        <small>Web Development (HTML5 + CSS3 + JavaScript) — result par ek click mein marksheet</small>
      </button>
      <button type="button" class="hub-mode-btn" data-hub-mode="board">
        <strong>🏛️ System 2 · CS Board Form</strong>
        <small>Computer Science 5-subject transcript (400 marks) — admin form se, topper positions ke saath</small>
      </button>
      <button type="button" class="hub-mode-btn" data-hub-mode="single">
        <strong>📜 Single Subject Instant</strong>
        <small>Kisi bhi ek paper ka direct on-the-spot certificate</small>
      </button>`;

    const oneClick = document.createElement("section");
    oneClick.id = "oneClickPanel";
    oneClick.className = "admin-section vvip-panel";
    oneClick.innerHTML = `
      <div class="vvip-hero">
        <div class="vvip-hero-icon">⚡</div>
        <div>
          <p class="eyebrow">System 1 · Automatic</p>
          <h2 class="vvip-title">One-Click Web Development Marksheet</h2>
          <p>Jis student ne <strong>Web Development (HTML5 + CSS3 + JavaScript)</strong> exam diya hai, uski marksheet <strong>ek click</strong> mein ban jati hai: skill rings, MCQ analytics, merit rank aur topper ribbon khud-ba-khud.</p>
        </div>
        <div class="vvip-crown">👑</div>
      </div>
      <div class="oc-stats" id="ocStats"></div>
      <div class="oc-toolbar">
        <button type="button" class="subnav-btn active" data-oc-filter="all">All</button>
        <button type="button" class="subnav-btn" data-oc-filter="passed">🎓 Passed</button>
        <button type="button" class="subnav-btn" data-oc-filter="failed">📋 Failed</button>
        <button type="button" class="subnav-btn" data-oc-filter="terminated">🚨 Terminated</button>
        <input id="ocSearch" type="search" class="table-search" placeholder="Search name or ID...">
      </div>
      <div id="ocList" class="oc-list"></div>`;

    const board = document.createElement("section");
    board.id = "boardVvipPanel";
    board.className = "admin-section vvip-panel hidden";
    board.innerHTML = `
      <div class="vvip-hero">
        <div class="vvip-hero-icon">🏛️</div>
        <div>
          <p class="eyebrow">System 2 · Admin Form · Official Board Certification</p>
          <h2 class="vvip-title">Computer Science Board Marksheet Studio (400 Marks)</h2>
          <p>5 subjects: <strong>English 100 · Computer Science 75 · Mathematics 75 · Physics 75 · Pakistan Studies 75</strong>. Marks khud likhein ya <strong>Auto-Collect</strong> se student ke exam results se utha lein. Topper position aur honors bhi lagayein.</p>
        </div>
        <div class="vvip-crown">👑</div>
      </div>

      <form id="boardVvipForm" autocomplete="off" novalidate>
        <div class="vvip-layout">
          <div class="vvip-form-col">
            <fieldset class="vvip-step">
              <legend><span class="step-num">1</span> Candidate Identity</legend>
              <div class="vvip-grid">
                <div class="field">
                  <label for="bm_id">Student ID</label>
                  <div class="vvip-id-row">
                    <input id="bm_id" type="text" maxlength="30" placeholder="e.g. ST-1001 or PERM-101">
                    <button type="button" id="bmFetchBtn" class="btn-vvip-ghost" title="Permanent ID / purane results se details bharain">🔎 Auto-Fetch</button>
                  </div>
                </div>
                <div class="field">
                  <label for="bm_name">Student Full Name</label>
                  <input id="bm_name" type="text" maxlength="40" placeholder="e.g. Muhammad Ali">
                </div>
                <div class="field">
                  <label for="bm_father">Father Name</label>
                  <input id="bm_father" type="text" maxlength="40" placeholder="e.g. Tariq Ahmed">
                </div>
                <div class="field">
                  <label for="bm_phone">Mobile Number</label>
                  <input id="bm_phone" type="tel" inputmode="numeric" maxlength="11" placeholder="03xxxxxxxxx">
                </div>
                <div class="field span-2">
                  <label for="bm_session">Examination Session</label>
                  <input id="bm_session" type="text" maxlength="60" value="Annual Examination Session 2026">
                </div>
              </div>
              <p id="bmIdentityHint" class="vvip-hint" style="margin-top:12px;"></p>
            </fieldset>

            <fieldset class="vvip-step">
              <legend><span class="step-num">2</span> Subject Marks (Total 400)</legend>
              <div class="vvip-actions-row">
                <button type="button" id="bmCollectBtn" class="btn-vvip">⚡ Auto-Collect Marks from Exam Results</button>
                <button type="button" id="bmResetBtn" class="btn-vvip-ghost">↺ Reset Marks</button>
              </div>
              <div class="subject-tiles" id="bmTiles">
                ${SUBJECTS.map((s) => `
                  <div class="subject-tile" data-subject="${s.key}" style="--sc:${s.color}">
                    <div class="st-head">
                      <span class="st-icon">${s.icon}</span>
                      <div><strong>${s.name}</strong><small>Max ${s.max} · Pass ${s.pass}</small></div>
                      <span class="st-chip" id="chip_${s.key}">—</span>
                    </div>
                    <div class="st-input">
                      <button type="button" class="st-step" data-step="-1" data-for="bm_${s.key}" aria-label="Decrease ${s.name}">−</button>
                      <input id="bm_${s.key}" type="number" inputmode="decimal" min="0" max="${s.max}" step="any" placeholder="0">
                      <button type="button" class="st-step" data-step="1" data-for="bm_${s.key}" aria-label="Increase ${s.name}">+</button>
                      <span class="st-of">/ ${s.max}</span>
                    </div>
                    <div class="st-bar"><i id="bar_${s.key}"></i><u style="left:${(s.pass / s.max) * 100}%"></u></div>
                  </div>`).join("")}
              </div>
              <p id="bmCollectHint" class="vvip-hint" style="margin-top:12px;"></p>
            </fieldset>

            <fieldset class="vvip-step">
              <legend><span class="step-num">3</span> Position, Verdict &amp; Honors</legend>
              <span class="vvip-label">🏅 Merit Position (sirf PASSED students ke liye)</span>
              <div class="chip-group" data-chip-group="position">
                <button type="button" class="vchip active" data-value="none">No Position</button>
                <button type="button" class="vchip" data-value="1">🥇 1st · Board Topper</button>
                <button type="button" class="vchip" data-value="2">🥈 2nd Position</button>
                <button type="button" class="vchip" data-value="3">🥉 3rd Position</button>
                <button type="button" class="vchip" data-value="d">⭐ Distinction Holder</button>
              </div>
              <span class="vvip-label">⚖️ Official Result Verdict</span>
              <div class="chip-group" data-chip-group="verdict">
                <button type="button" class="vchip active" data-value="AUTO">🤖 AUTO (marks se)</button>
                <button type="button" class="vchip v-pass" data-value="PASSED">✅ PASSED</button>
                <button type="button" class="vchip v-fail" data-value="FAILED">📋 FAILED</button>
                <button type="button" class="vchip v-fail" data-value="TERMINATED">🚨 TERMINATED</button>
              </div>
              <div class="field" style="margin-top:14px;">
                <label for="bm_reason">Remarks / Honors / Violation Reason (Optional)</label>
                <input id="bm_reason" type="text" maxlength="160" placeholder="e.g. First Division with Distinction · Grade A+">
              </div>
              <p id="bmFormHint" class="vvip-hint" style="margin-top:12px;"></p>
            </fieldset>

            <div class="vvip-submit-row">
              <button class="btn-vvip" type="submit" id="bmSubmitBtn">🏛️ Generate &amp; Open Official Board Transcript (400 Marks)</button>
              <button class="btn-vvip-ghost" type="button" id="bmCopyBtn">🔗 Copy Marksheet Link</button>
            </div>
          </div>

          <aside class="vvip-live" aria-live="polite">
            <h3>Live Transcript Preview</h3>
            <div class="live-ring-wrap">
              <svg viewBox="0 0 140 140" width="140" height="140" aria-hidden="true">
                <circle class="live-ring-bg" cx="70" cy="70" r="60" stroke-width="11"></circle>
                <circle id="liveRing" class="live-ring-fg" cx="70" cy="70" r="60" stroke-width="11"
                  stroke-dasharray="376.99" stroke-dashoffset="376.99" transform="rotate(-90 70 70)"></circle>
              </svg>
              <div class="live-ring-center"><strong id="livePct">0%</strong><span>Overall</span></div>
            </div>
            <div class="live-stats">
              <div class="live-stat"><span>Total</span><strong id="liveTotal">0 / 400</strong></div>
              <div class="live-stat"><span>Grade</span><strong id="liveGrade">—</strong></div>
              <div class="live-stat"><span>Cleared</span><strong id="liveCleared">0 / 5</strong></div>
              <div class="live-stat"><span>Average</span><strong id="liveAvg">0</strong></div>
            </div>
            <div id="liveVerdict" class="live-verdict idle">AWAITING MARKS</div>
            <div id="livePos" class="live-pos"></div>
            <div id="liveFailed" class="live-failed"></div>
          </aside>
        </div>
      </form>`;

    wrap.prepend(bar);
    bar.after(oneClick);
    oneClick.after(board);
  }

  /* =====================================================================
     MODE SWITCH
  ===================================================================== */
  function setMode(mode) {
    state.mode = mode;
    document.querySelectorAll("#hubModeBar .hub-mode-btn").forEach((b) => b.classList.toggle("active", b.dataset.hubMode === mode));
    $("oneClickPanel")?.classList.toggle("hidden", mode !== "oneclick");
    $("boardVvipPanel")?.classList.toggle("hidden", mode !== "board");
    const single = $("instantMarksheetForm")?.closest("section");
    single?.classList.toggle("hidden", mode !== "single");
    if (mode === "oneclick") renderOneClick();
  }

  /* =====================================================================
     SYSTEM 1 · ONE-CLICK LIST
  ===================================================================== */
  function renderOneClick() {
    const list = $("ocList");
    const statsEl = $("ocStats");
    if (!list || !statsEl) return;

    const all = Object.entries(results()).filter(([, r]) => isWeb(r)).reverse();
    const scoring = all.filter(([, r]) => statusOf(r) !== "TERMINATED").map(([, r]) => Number(r.marks) || 0);
    const rankOf = (m) => 1 + scoring.filter((x) => x > m).length;
    const passed = all.filter(([, r]) => statusOf(r) === "PASSED").length;
    let top = null;
    all.forEach(([, r]) => {
      if (statusOf(r) === "TERMINATED") return;
      if (!top || (Number(r.marks) || 0) > (Number(top.marks) || 0)) top = r;
    });

    statsEl.innerHTML = `
      <div class="oc-stat"><span>Web Dev Results</span><strong>${all.length}</strong></div>
      <div class="oc-stat"><span>Passed</span><strong style="color:#34d399;">${passed}</strong></div>
      <div class="oc-stat"><span>Failed / Terminated</span><strong style="color:#f87171;">${all.length - passed}</strong></div>
      <div class="oc-stat"><span>🏆 Top Performer</span><strong>${top ? `${esc(nameOf(top))} (${fmt(top.marks)})` : "—"}</strong></div>`;

    const q = state.query.trim().toLowerCase();
    const rows = all.filter(([, r]) => {
      const st = statusOf(r).toLowerCase();
      if (state.filter !== "all") {
        if (state.filter === "failed" && st !== "failed") return false;
        if (state.filter === "passed" && st !== "passed") return false;
        if (state.filter === "terminated" && st !== "terminated") return false;
      }
      if (!q) return true;
      return nameOf(r).toLowerCase().includes(q) || idOf(r).toLowerCase().includes(q);
    });

    if (!rows.length) {
      list.innerHTML = `<p class="modal-copy">Is category mein koi Web Development result nahi mila. (Sirf HTML5 + CSS3 + JavaScript wale exams yahan aate hain.)</p>`;
      return;
    }

    list.innerHTML = rows.map(([key, r], i) => {
      const st = statusOf(r);
      const total = totalOf(r);
      const marks = Number(r.marks) || 0;
      const pct = Math.round((marks / total) * 100);
      const color = st === "PASSED" ? "#4ade80" : "#f87171";
      const rank = st === "TERMINATED" ? 0 : rankOf(marks);
      const rankHtml = rank === 1 ? `<div class="oc-rank r1" title="Rank 1">🥇</div>`
        : rank === 2 ? `<div class="oc-rank r2" title="Rank 2">🥈</div>`
        : rank === 3 ? `<div class="oc-rank r3" title="Rank 3">🥉</div>`
        : `<div class="oc-rank">${rank ? "#" + rank : "—"}</div>`;
      const bd = r.subjectBreakdown || {};
      const mini = Object.keys(bd).map((k) => {
        const it = bd[k] || {};
        const p = Number.isFinite(Number(it.percentage)) ? Number(it.percentage) : (it.total ? Math.round(((it.correct || 0) / it.total) * 100) : 0);
        const l = k.toLowerCase();
        const c = l.includes("html") ? WEB_COLORS.html : l.includes("css") ? WEB_COLORS.css : l.includes("java") ? WEB_COLORS.java : "#a5b4fc";
        return `<div><small><span>${esc(k)}</span><span>${Math.round(p)}%</span></small><i><b style="--w:${Math.max(0, Math.min(100, p))}%; background:${c};"></b></i></div>`;
      }).join("");
      const btnCls = st === "PASSED" ? "" : st === "TERMINATED" ? "v-terminated" : "v-failed";
      const btnTxt = st === "PASSED" ? "⚡ Generate VVIP Marksheet" : st === "TERMINATED" ? "🚨 Penalty Record" : "📋 Remedial Slip";
      return `
        <article class="oc-card st-${st.toLowerCase()}" style="--i:${Math.min(i, 12)}">
          ${rankHtml}
          <div>
            <div class="oc-title">
              <strong>${esc(nameOf(r))}</strong>
              <span class="perm-id-badge">${esc(idOf(r) || "—")}</span>
              <span class="status-pill ${st === "PASSED" ? "active" : "blocked"}">${esc(st)}</span>
            </div>
            <div class="oc-meta">Marks: <strong style="color:${color};">${fmt(marks)} / ${total}</strong> (${pct}%) · Pass: ${passOf(r)} · ${esc(examOf(r) || "Web Development")}</div>
            ${mini ? `<div class="oc-mini">${mini}</div>` : ""}
          </div>
          <button type="button" class="btn-oneclick ${btnCls}" data-oneclick-key="${esc(key)}">${btnTxt}</button>
        </article>`;
    }).join("");
  }

  /* Results tab: web → 1-click button, board subjects → "Board Form" */
  function decorateResultRows() {
    const list = $("resultList");
    if (!list) return;
    list.querySelectorAll(".admin-row").forEach((row) => {
      const btn = row.querySelector("[data-open-marksheet-key]");
      if (!btn) return;
      const key = btn.dataset.openMarksheetKey;
      const r = results()[key];
      if (!r) return;
      if (isWeb(r)) {
        btn.classList.add("btn-oneclick");
        btn.textContent = "⚡ 1-Click Marksheet";
        btn.title = "Web Development marksheet ek click mein";
      } else {
        const fill = document.createElement("button");
        fill.type = "button";
        fill.className = "btn-boardfill";
        fill.dataset.boardFillKey = key;
        fill.textContent = "🏛️ Board Form";
        fill.title = "Computer Science Board form mein is student ka data khud bhar do";
        btn.replaceWith(fill);
      }
    });
  }

  function addResultsHint() {
    const list = $("resultList");
    if (!list || $("resultsVvipHint")) return;
    const p = document.createElement("p");
    p.id = "resultsVvipHint";
    p.className = "vvip-hint";
    p.innerHTML = "👑 <strong>Marksheet buttons:</strong> Web Development (HTML5/CSS3/JS) result par <strong>⚡ 1-Click Marksheet</strong> — Computer Science board subjects par <strong>🏛️ Board Form</strong> (student ka data form mein khud bhar jata hai).";
    list.before(p);
  }

  /* =====================================================================
     SYSTEM 2 · BOARD FORM
  ===================================================================== */
  const gradeOf = (p, passed) => (p >= 85 ? "A+" : p >= 70 ? "A" : p >= 55 ? "B" : p >= 40 ? "C" : passed ? "D" : "F");

  function readMarks() {
    return SUBJECTS.map((s) => {
      const el = $(`bm_${s.key}`);
      const filled = el.value.trim() !== "";
      let v = parseFloat(el.value);
      if (!Number.isFinite(v)) v = 0;
      v = Math.max(0, Math.min(s.max, v));
      return { ...s, v, filled };
    });
  }

  function effectiveVerdict(failedCount) {
    return state.verdict === "AUTO" ? (failedCount ? "FAILED" : "PASSED") : state.verdict;
  }

  function animateText(el, text) {
    el.textContent = text;
  }

  function recalc() {
    const rows = readMarks();
    const anyFilled = rows.some((r) => r.filled);
    const total = round1(rows.reduce((s, r) => s + r.v, 0));
    const pct = Math.round((total / 400) * 100);
    const failed = rows.filter((r) => r.filled && r.v < r.pass);
    const cleared = rows.filter((r) => r.filled && r.v >= r.pass).length;

    rows.forEach((r) => {
      const tile = document.querySelector(`.subject-tile[data-subject="${r.key}"]`);
      const chip = $(`chip_${r.key}`);
      const bar = $(`bar_${r.key}`);
      tile.classList.toggle("pass", r.filled && r.v >= r.pass);
      tile.classList.toggle("fail", r.filled && r.v < r.pass);
      chip.textContent = !r.filled ? "—" : r.v >= r.pass ? `✔ ${gradeOf(Math.round((r.v / r.max) * 100), true)}` : "✖ Fail";
      bar.style.width = `${(r.v / r.max) * 100}%`;
    });

    const ring = $("liveRing");
    const C = 376.99;
    ring.style.strokeDashoffset = String(C * (1 - pct / 100));
    ring.style.stroke = pct >= 85 ? "#34d399" : pct >= 70 ? "#38bdf8" : pct >= 55 ? "#facc15" : pct >= 40 ? "#fb923c" : pct > 0 ? "#f87171" : "#fbbf24";
    animateText($("livePct"), `${pct}%`);
    animateText($("liveTotal"), `${fmt(total)} / 400`);
    animateText($("liveGrade"), anyFilled ? gradeOf(pct, failed.length === 0) : "—");
    animateText($("liveCleared"), `${cleared} / ${SUBJECTS.length}`);
    animateText($("liveAvg"), anyFilled ? fmt(total / SUBJECTS.length) : "0");

    const verdict = effectiveVerdict(failed.length);
    const vEl = $("liveVerdict");
    const nextText = !anyFilled && state.verdict === "AUTO" ? "AWAITING MARKS" : verdict === "TERMINATED" ? "DISQUALIFIED" : verdict;
    const nextCls = !anyFilled && state.verdict === "AUTO" ? "idle" : verdict.toLowerCase();
    if (vEl.textContent !== nextText) {
      vEl.textContent = nextText;
      vEl.className = `live-verdict ${nextCls}`;
      if (!REDUCE) { vEl.classList.add("pop"); setTimeout(() => vEl.classList.remove("pop"), 320); }
    } else {
      vEl.className = `live-verdict ${nextCls}`;
    }

    $("liveFailed").innerHTML = failed.length
      ? `✖ Re-sit: ${failed.map((r) => `${esc(r.name)} (${fmt(r.v)}/${r.max}, needs ${r.pass})`).join(" · ")}`
      : "";

    const posLabels = { 1: "🥇 Board Topper", 2: "🥈 2nd Position", 3: "🥉 3rd Position", d: "⭐ Distinction Holder" };
    $("livePos").textContent = state.position !== "none" && verdict === "PASSED" ? posLabels[state.position] : "";

    const hint = $("bmFormHint");
    if (state.position !== "none" && verdict !== "PASSED" && anyFilled) {
      hint.className = "vvip-hint warn";
      hint.textContent = "⚠️ Merit position sirf PASSED result par lagti hai — current verdict ki wajah se position marksheet par nahi aayegi.";
    } else if (state.verdict === "PASSED" && failed.length) {
      hint.className = "vvip-hint warn";
      hint.textContent = `⚠️ Aap ne verdict manually PASSED rakha hai lekin ${failed.length} subject(s) pass marks se neeche hain. AUTO verdict safe rehta hai.`;
    } else if (state.verdict === "TERMINATED") {
      hint.className = "vvip-hint bad";
      hint.textContent = "🚨 TERMINATED: marksheet par Disciplinary Penalty Record banega aur saare marks cancel dikhenge. Reason zaroor likhein.";
    } else {
      hint.className = "vvip-hint";
      hint.textContent = "";
    }
  }

  function setHint(id, html, tone) {
    const el = $(id);
    if (!el) return;
    el.className = `vvip-hint${tone ? " " + tone : ""}`;
    el.innerHTML = html;
  }

  function fetchIdentity(force) {
    const id = $("bm_id").value.trim().toUpperCase();
    if (!id) { setHint("bmIdentityHint", "Pehle Student ID likhein, phir Auto-Fetch dabayein.", "warn"); return; }
    let src = null;
    const p = perms()[keyOf(id)];
    if (p) {
      src = { name: p.studentName, father: p.fatherName, phone: p.phone, label: "Permanent Lifetime ID registry" };
    } else {
      const hit = Object.values(results()).reverse().find((r) => idOf(r).toUpperCase() === id);
      if (hit) {
        src = { name: nameOf(hit), father: hit.candidate?.fatherName || hit.fatherName, phone: hit.candidate?.phone || hit.phone, label: "latest exam result" };
      } else {
        const c = Object.values(codes()).find((x) => String(x?.studentId || "").toUpperCase() === id);
        if (c) src = { name: c.studentName, father: c.fatherName, phone: c.phone, label: "One-Time Code record" };
      }
    }
    if (!src) { setHint("bmIdentityHint", `ID "${esc(id)}" ka koi record nahi mila. Details manually likh dein.`, "warn"); return; }
    const put = (fieldId, val) => { const el = $(fieldId); if (el && val && (force || !el.value.trim())) el.value = val; };
    put("bm_name", src.name);
    put("bm_father", src.father);
    put("bm_phone", src.phone);
    setHint("bmIdentityHint", `✅ Details <strong>${esc(src.label)}</strong> se bhar di gayin.`, "ok");
  }

  function collectMarks() {
    const id = $("bm_id").value.trim().toUpperCase();
    if (!id) { setHint("bmCollectHint", "Pehle Student ID likhein.", "warn"); return; }
    const found = {};
    let terminated = 0;
    Object.values(results()).forEach((r) => {
      if (idOf(r).toUpperCase() !== id) return;
      if (statusOf(r) === "TERMINATED") { terminated++; return; }
      const sk = subjectKeyFromExam(examOf(r));
      if (!sk) return;
      const sub = SUBJECTS.find((s) => s.key === sk);
      const total = totalOf(r) || sub.max;
      const scaled = round1(((Number(r.marks) || 0) * sub.max) / total);
      found[sk] = { marks: Math.min(sub.max, scaled), when: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "" };
    });

    const keys = Object.keys(found);
    keys.forEach((k) => { $(`bm_${k}`).value = String(found[k].marks); });
    recalc();

    const missing = SUBJECTS.filter((s) => !found[s.key]).map((s) => s.name);
    if (!keys.length) {
      setHint("bmCollectHint", `ID <strong>${esc(id)}</strong> ke koi Computer Science board subject results nahi mile${terminated ? ` (${terminated} terminated attempt skip hue)` : ""}. Marks manually likh dein.`, "warn");
      return;
    }
    const lines = keys.map((k) => {
      const s = SUBJECTS.find((x) => x.key === k);
      return `<li>${s.icon} ${s.name}: <strong>${fmt(found[k].marks)} / ${s.max}</strong>${found[k].when ? ` <small>(${esc(found[k].when)})</small>` : ""}</li>`;
    }).join("");
    setHint(
      "bmCollectHint",
      `⚡ <strong>${keys.length} subject(s)</strong> ke marks latest results se utha liye gaye:<ul>${lines}</ul>${missing.length ? `<div style="margin-top:6px;">✍️ Manual entry baqi: <strong>${esc(missing.join(", "))}</strong></div>` : "✅ Paanchon subjects mil gaye!"}${terminated ? `<div>🚨 ${terminated} terminated attempt skip hue.</div>` : ""}`,
      missing.length ? "warn" : "ok"
    );
  }

  function resetMarks() {
    SUBJECTS.forEach((s) => { $(`bm_${s.key}`).value = ""; });
    setHint("bmCollectHint", "", "");
    recalc();
  }

  function buildTranscript() {
    const rows = readMarks();
    const failed = rows.filter((r) => r.v < r.pass);
    const status = effectiveVerdict(failed.length);
    const total = round1(rows.reduce((s, r) => s + r.v, 0));
    const data = {
      studentId: $("bm_id").value.trim().toUpperCase(),
      name: $("bm_name").value.trim(),
      father: $("bm_father").value.trim(),
      phone: $("bm_phone").value.trim(),
      exam: "Computer Science Board Exam",
      session: $("bm_session").value.trim(),
      totalMarks: 400,
      marks: total,
      status,
      reason: $("bm_reason").value.trim(),
      position: status === "PASSED" && state.position !== "none" ? state.position : ""
    };
    rows.forEach((r) => { data[r.key] = r.v; });
    return data;
  }

  function transcriptUrl(d) {
    const q = new URLSearchParams({
      studentId: d.studentId, name: d.name, father: d.father, phone: d.phone, exam: d.exam,
      totalMarks: "400", marks: String(d.marks), status: d.status, reason: d.reason, session: d.session, src: "form"
    });
    SUBJECTS.forEach((s) => q.set(s.key, String(d[s.key])));
    if (d.position) q.set("pos", d.position);
    return `Marksheet.html?${q.toString()}`;
  }

  function validateBoard() {
    const d = buildTranscript();
    if (!d.studentId) return { err: "Student ID likhein.", focus: "bm_id" };
    if (!/^[A-Za-z0-9_-]{2,30}$/.test(d.studentId)) return { err: "Student ID mein sirf letters, numbers, hyphen aur underscore.", focus: "bm_id" };
    if (!d.name) return { err: "Student ka naam likhein.", focus: "bm_name" };
    if (!d.father) return { err: "Father ka naam likhein.", focus: "bm_father" };
    if (d.phone && !/^03\d{9}$/.test(d.phone)) return { err: "Mobile number 03 se shuru ho aur 11 digits ka ho (ya khali chhor dein).", focus: "bm_phone" };
    const empty = SUBJECTS.find((s) => $(`bm_${s.key}`).value.trim() === "");
    if (empty) return { err: `${empty.name} ke marks likhein (0 bhi likh sakte hain).`, focus: `bm_${empty.key}` };
    if (d.status === "TERMINATED" && !d.reason) return { err: "TERMINATED verdict ke liye violation reason likhein.", focus: "bm_reason" };
    return { data: d };
  }

  async function submitBoard(event) {
    event.preventDefault();
    if (state.saving) return;
    const res = validateBoard();
    if (res.err) {
      setHint("bmFormHint", `❌ ${esc(res.err)}`, "bad");
      notice(res.err, true);
      $(res.focus)?.focus();
      return;
    }
    const d = res.data;
    state.saving = true;
    const btn = $("bmSubmitBtn");
    btn.disabled = true;
    btn.textContent = "⏳ Saving official record...";
    try {
      // Best-effort archive so the ID can be verified later on Marksheet.html
      const save = adminDatabase.ref(`boardTranscripts/${keyOf(d.studentId)}`).push().set({ ...d, createdAt: firebase.database.ServerValue.TIMESTAMP });
      await Promise.race([save, new Promise((resolve) => setTimeout(resolve, 1800))]);
    } catch (e) {
      console.warn("Board transcript archive failed (marksheet will still open)", e);
    }
    notice(`Board transcript for ${d.name} generate ho gaya.`);
    go(transcriptUrl(d));
  }

  async function copyLink() {
    const res = validateBoard();
    if (res.err) { setHint("bmFormHint", `❌ ${esc(res.err)}`, "bad"); $(res.focus)?.focus(); return; }
    const url = new URL(transcriptUrl(res.data), window.location.href).href;
    try {
      await navigator.clipboard.writeText(url);
      setHint("bmFormHint", "✅ Marksheet link copy ho gaya!", "ok");
    } catch (e) {
      window.prompt("Marksheet link copy karein:", url);
    }
  }

  function openBoardFor(resultKey) {
    const r = results()[resultKey];
    if (!r) return;
    if (typeof switchSubnav === "function") switchSubnav("marksheet");
    setMode("board");
    $("bm_id").value = idOf(r).toUpperCase();
    $("bm_name").value = nameOf(r);
    $("bm_father").value = r.candidate?.fatherName || r.fatherName || "";
    $("bm_phone").value = r.candidate?.phone || r.phone || "";
    fetchIdentity(false);
    collectMarks();
    const panel = $("boardVvipPanel");
    panel.classList.remove("flash");
    void panel.offsetWidth;
    panel.classList.add("flash");
    panel.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "start" });
  }

  /* =====================================================================
     EVENTS
  ===================================================================== */
  function bindEvents() {
    $("hubModeBar").addEventListener("click", (e) => {
      const b = e.target.closest("[data-hub-mode]");
      if (b) setMode(b.dataset.hubMode);
    });

    $("oneClickPanel").addEventListener("click", (e) => {
      const f = e.target.closest("[data-oc-filter]");
      if (f) {
        state.filter = f.dataset.ocFilter;
        $("oneClickPanel").querySelectorAll("[data-oc-filter]").forEach((b) => b.classList.toggle("active", b === f));
        renderOneClick();
        return;
      }
      const g = e.target.closest("[data-oneclick-key]");
      if (g) go(`Marksheet.html?resultKey=${encodeURIComponent(g.dataset.oneclickKey)}`);
    });
    $("ocSearch").addEventListener("input", (e) => { state.query = e.target.value; renderOneClick(); });

    document.addEventListener("click", (e) => {
      const fill = e.target.closest("[data-board-fill-key]");
      if (fill) openBoardFor(fill.dataset.boardFillKey);
    });

    const form = $("boardVvipForm");
    form.addEventListener("submit", submitBoard);
    $("bmFetchBtn").addEventListener("click", () => fetchIdentity(true));
    $("bm_id").addEventListener("input", (e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 30); });
    $("bm_id").addEventListener("blur", () => { if ($("bm_id").value.trim() && !$("bm_name").value.trim()) fetchIdentity(false); });
    $("bm_phone").addEventListener("input", (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11); });
    $("bmCollectBtn").addEventListener("click", collectMarks);
    $("bmResetBtn").addEventListener("click", resetMarks);
    $("bmCopyBtn").addEventListener("click", copyLink);

    SUBJECTS.forEach((s) => {
      const el = $(`bm_${s.key}`);
      el.addEventListener("input", () => {
        const v = parseFloat(el.value);
        if (Number.isFinite(v) && (v > s.max || v < 0)) {
          el.value = String(Math.max(0, Math.min(s.max, v)));
          const tile = el.closest(".subject-tile");
          tile.classList.remove("shake");
          void tile.offsetWidth;
          tile.classList.add("shake");
        }
        recalc();
      });
    });

    $("bmTiles").addEventListener("click", (e) => {
      const st = e.target.closest(".st-step");
      if (!st) return;
      const el = $(st.dataset.for);
      const sub = SUBJECTS.find((s) => `bm_${s.key}` === st.dataset.for);
      const cur = parseFloat(el.value);
      const next = (Number.isFinite(cur) ? cur : 0) + Number(st.dataset.step);
      el.value = String(Math.max(0, Math.min(sub.max, next)));
      recalc();
    });

    form.addEventListener("click", (e) => {
      const chip = e.target.closest(".vchip");
      if (!chip) return;
      const group = chip.closest("[data-chip-group]");
      if (!group) return;
      state[group.dataset.chipGroup] = chip.dataset.value;
      group.querySelectorAll(".vchip").forEach((c) => c.classList.toggle("active", c === chip));
      recalc();
    });

    $("navMarksheetTab")?.addEventListener("click", () => setMode(state.mode));

    // Re-decorate whenever Admin-panel.js re-renders the results list (live updates, search typing)
    const list = $("resultList");
    if (list && "MutationObserver" in window) {
      new MutationObserver(() => {
        decorateResultRows();
        if (state.mode === "oneclick") renderOneClick();
      }).observe(list, { childList: true });
    }
  }

  buildUI();
  addResultsHint();
  bindEvents();
  setMode("oneclick");
  recalc();
  decorateResultRows();
})();