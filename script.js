/**
 * Online Exam Portal & Miss Mahnoor Tribute Hub
 * Official Suite Engineering by Hafiz Abdul Moiz (S/O Muzmmil Ahmed)
 */

(function () {
  "use strict";

  // ========================================================
  // 1. CONFIGURATION: DOWNLOAD LINKS (WINDOWS & ANDROID)
  // ========================================================

  // Windows Setup Release Link (.exe):
  const WINDOWS_SETUP_DOWNLOAD_URL =
    "https://github.com/Hafiz-Abdul-Moiz/Online-Exam-Portal./releases/download/v1.0.1/Online.Exam.Portal.Setup.1.0.1.exe";

  // Android APK Release Link (.apk):
  // -------------------------------------------------------------
  // JAB AAP APNI APK UPLOAD KAREIN:
  // Bas yahan quotes "" ke andar apni APK file ka direct link paste karein!
  // Example: "https://github.com/Hafiz-Abdul-Moiz/Online-Exam-Portal./releases/download/v1.0.1/Online.Exam.Portal.v1.0.1.apk"
  // Jab tak yeh blank "" rahega, tab tak website par "Pending / Development" status show hoga.
  // Jaise hi aap link paste karein gay, website AUTOMATICALLY "LIVE RELEASE" ban jayegi!
  // -------------------------------------------------------------
  const ANDROID_APK_DOWNLOAD_URL = "";

  let soundEnabled = true;

  // ========================================================
  // 2. WEB AUDIO API SYNTHESIZER (No external audio files)
  // ========================================================
  function getAudioCtx() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      return AudioCtx ? new AudioCtx() : null;
    } catch (_) {
      return null;
    }
  }

  function playTone(freq, type = "sine", duration = 0.15, vol = 0.12) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  }

  function playSuccessChord() {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      setTimeout(() => playTone(freq, "triangle", 0.25, 0.14), i * 70);
    });
  }

  function playAndroidTone() {
    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      setTimeout(() => playTone(freq, "sine", 0.22, 0.11), i * 80);
    });
  }

  function playCandleIgnite() {
    playTone(659.25, "triangle", 0.18, 0.15);
    setTimeout(() => playTone(880.00, "sine", 0.35, 0.12), 90);
  }

  function playGratitudeMelody() {
    const notes = [392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, "sine", 0.45, 0.13), i * 110);
    });
  }

  // ========================================================
  // 3. TOAST NOTIFICATION SYSTEM
  // ========================================================
  function showToast(message, type = "info") {
    const existing = document.getElementById("vvipDownloadToast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "vvipDownloadToast";
    const isSuccess = type === "success";
    toast.style.cssText = `
      position: fixed;
      bottom: 28px;
      right: 24px;
      z-index: 2147483647;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.96));
      border: 1px solid ${isSuccess ? "#10b981" : "#38bdf8"};
      box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 25px ${isSuccess ? "rgba(16,185,129,0.35)" : "rgba(56,189,248,0.35)"};
      color: #f8fafc;
      padding: 14px 22px;
      border-radius: 14px;
      font-size: 0.88rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
      backdrop-filter: blur(16px);
      animation: slideInToast 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
    `;
    toast.innerHTML = `<span>${isSuccess ? "✅" : "ℹ️"}</span> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // ========================================================
  // 4. AMBIENT PARTICLES CANVAS
  // ========================================================
  function initAmbientParticles() {
    const canvas = document.getElementById("ambientCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = [
      "rgba(56, 189, 248, ",
      "rgba(99, 102, 241, ",
      "rgba(244, 63, 94, ",
      "rgba(245, 158, 11, ",
      "rgba(16, 185, 129, "
    ];

    const count = Math.min(Math.floor((width * height) / 24000), 50);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.45 + 0.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Web connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.colorPrefix + p.alpha + ")";
        ctx.fill();
      });

      requestAnimationFrame(render);
    }
    render();
  }

  // ========================================================
  // 5. SMART ANDROID APK DOWNLOAD / MODAL CONTROLLER
  // ========================================================
  function initAndroidController() {
    const modal = document.getElementById("androidPendingModal");
    const openBtns = [
      document.getElementById("btnOpenApkPendingModal"),
      document.getElementById("heroApkBtn")
    ];
    const closeBtn = document.getElementById("btnClosePendingModal");
    const notifyBtn = document.getElementById("btnNotifyApkRelease");
    const emailInput = document.getElementById("inputApkEmail");

    const isApkLive = Boolean(ANDROID_APK_DOWNLOAD_URL && ANDROID_APK_DOWNLOAD_URL.trim() !== "");

    // If APK is released, auto-switch UI to LIVE DOWNLOAD mode!
    if (isApkLive) {
      const heroBadge = document.getElementById("heroApkBadge");
      const heroTitle = document.getElementById("heroApkTitle");
      const heroSub = document.getElementById("heroApkSub");

      const cardBadge = document.getElementById("cardApkBadge");
      const cardTitle = document.getElementById("btnApkCardTitle");
      const cardSub = document.getElementById("btnApkCardSubtitle");
      const cardFooter = document.getElementById("cardApkFooterNote");

      if (heroBadge) {
        heroBadge.textContent = "LIVE NOW";
        heroBadge.className = "btn-android-badge-live";
      }
      if (heroTitle) heroTitle.textContent = "Download Android APK";
      if (heroSub) heroSub.textContent = "Official APK • v1.0.1 (Direct Download)";

      if (cardBadge) {
        cardBadge.textContent = "● OFFICIAL ANDROID RELEASE (AVAILABLE NOW)";
        cardBadge.className = "card-badge-active";
      }
      if (cardTitle) cardTitle.textContent = "Download Android APK (v1.0.1)";
      if (cardSub) cardSub.textContent = "Official Package • Direct Download";
      if (cardFooter) cardFooter.textContent = "SHA-256 Verified APK • Compatible with Android 8.0 - 15";
    }

    function handleApkButtonClick() {
      if (isApkLive) {
        // Direct Download APK!
        playSuccessChord();
        showToast("🚀 Downloading Online Exam Portal Android APK...", "success");
        setTimeout(() => {
          window.location.href = ANDROID_APK_DOWNLOAD_URL;
        }, 300);
      } else {
        // Show Pending Info Modal
        playAndroidTone();
        if (modal) modal.style.display = "flex";
      }
    }

    function closeModal() {
      playTone(400, "sine", 0.08, 0.08);
      if (modal) modal.style.display = "none";
    }

    openBtns.forEach((btn) => {
      if (btn) btn.addEventListener("click", handleApkButtonClick);
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (notifyBtn) {
      notifyBtn.addEventListener("click", () => {
        const val = emailInput ? emailInput.value.trim() : "";
        playSuccessChord();
        showToast(
          val ? `Thank you! VIP early alert registered for ${val}` : "Thank you! You will be notified instantly on release.",
          "success"
        );
        closeModal();
      });
    }
  }

  // ========================================================
  // 6. WINDOWS DOWNLOAD TRIGGER
  // ========================================================
  function initDownloadTriggers() {
    const winBtn = document.getElementById("btnDownloadWindowsSetup");
    const heroWinBtn = document.getElementById("heroDownloadWinBtn");
    const navWinBtn = document.getElementById("navDownloadBtn");

    function handleWindowsDownload(e) {
      playSuccessChord();
      showToast("🚀 Downloading Online Exam Portal Setup (124 MB)...", "success");

      if (WINDOWS_SETUP_DOWNLOAD_URL && WINDOWS_SETUP_DOWNLOAD_URL !== "#") {
        setTimeout(() => {
          window.location.href = WINDOWS_SETUP_DOWNLOAD_URL;
        }, 300);
      }
    }

    if (winBtn) winBtn.addEventListener("click", handleWindowsDownload);
    if (heroWinBtn) heroWinBtn.addEventListener("click", handleWindowsDownload);
    if (navWinBtn) navWinBtn.addEventListener("click", handleWindowsDownload);
  }

  // ========================================================
  // 7. MISS MAHNOOR TRIBUTE SECTION INTERACTIONS
  // ========================================================
  function initTributeSection() {
    // A. Countdown to November 10th
    const daysEl = document.getElementById("tributeDays");
    const hoursEl = document.getElementById("tributeHours");
    const minsEl = document.getElementById("tributeMins");
    const secsEl = document.getElementById("tributeSecs");

    function updateCountdown() {
      const now = new Date();
      let targetYear = now.getFullYear();
      let targetDate = new Date(targetYear, 10, 10, 0, 0, 0); // Month 10 = November

      if (now.getTime() > targetDate.getTime()) {
        targetDate = new Date(targetYear + 1, 10, 10, 0, 0, 0);
      }

      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) return;

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      if (daysEl) daysEl.textContent = String(d).padStart(2, "0");
      if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
      if (minsEl) minsEl.textContent = String(m).padStart(2, "0");
      if (secsEl) secsEl.textContent = String(s).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // B. Candle Lighting Altar
    const candleBtn = document.getElementById("btnLightCandle");
    const candleCountDisplay = document.getElementById("candleCountDisplay");

    let count = 1482;
    try {
      const saved = localStorage.getItem("miss_mahnoor_candle_count");
      if (saved) count = parseInt(saved, 10);
    } catch (_) {}

    if (candleCountDisplay) candleCountDisplay.textContent = count.toLocaleString();

    if (candleBtn) {
      candleBtn.addEventListener("click", () => {
        count++;
        playCandleIgnite();
        if (candleCountDisplay) candleCountDisplay.textContent = count.toLocaleString();
        try {
          localStorage.setItem("miss_mahnoor_candle_count", count.toString());
        } catch (_) {}
        showToast("🕯️ Golden Candle Lit! In honor of Miss Mahnoor (Best Teacher of All Time).", "success");
      });
    }

    // C. Copy Tribute Letter
    const copyLetterBtn = document.getElementById("btnCopyTributeLetter");
    if (copyLetterBtn) {
      copyLetterBtn.addEventListener("click", () => {
        const text = `DEDICATION LETTER TO MISS MAHNOOR (BEST TEACHER OF ALL TIME)
By Hafiz Abdul Moiz (S/O Muzmmil Ahmed):

"Respected Miss Mahnoor,
Teachers teach from textbooks, but the greatest mentors teach from the soul. You were our guiding light and greatest support. When you resigned from the coaching center, a profound sadness filled our hearts. November 10th will be a day of tears and emotional goodbyes.
As an eternal tribute to your patience, wisdom, and moral standards, I engineered the Online Exam Portal in your honor. Though you depart from the academy halls, your lessons and kindness will illuminate our lives forever.
May Allah SWT bless you with endless happiness, health, and supreme success. Ameen."`;

        navigator.clipboard.writeText(text);
        playTone(660, "sine", 0.15, 0.1);
        showToast("📋 Tribute Dedication Letter copied to clipboard!", "success");
      });
    }

    // D. Play Tribute Melody
    const playMelodyBtn = document.getElementById("btnPlayTributeMelody");
    if (playMelodyBtn) {
      playMelodyBtn.addEventListener("click", () => {
        playGratitudeMelody();
        showToast("🎶 Playing Serene Gratitude Melody in honor of Miss Mahnoor...", "info");
      });
    }

    // E. Student Farewell Guestbook
    const guestbookForm = document.getElementById("tributeGuestbookForm");
    const authorInput = document.getElementById("guestbookAuthor");
    const messageInput = document.getElementById("guestbookMessage");
    const listContainer = document.getElementById("guestbookMessagesList");

    if (guestbookForm) {
      guestbookForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const author = authorInput ? authorInput.value.trim() : "";
        const message = messageInput ? messageInput.value.trim() : "";

        if (!author || !message) {
          showToast("Please enter both your name and farewell message for Miss Mahnoor.", "info");
          return;
        }

        const card = document.createElement("div");
        card.className = "guestbook-item-card";
        card.innerHTML = `
          <div class="guestbook-item-author">
            <span>${author}</span>
            <span style="font-size:0.7rem; color:#94a3b8;">Just Now</span>
          </div>
          <p class="guestbook-item-text">"${message}"</p>
        `;

        if (listContainer) {
          listContainer.prepend(card);
        }

        if (authorInput) authorInput.value = "";
        if (messageInput) messageInput.value = "";

        playCandleIgnite();
        showToast("✨ Your farewell dua for Miss Mahnoor has been posted to the wall!", "success");
      });
    }

    // F. Sound Toggle Button in Header
    const soundBtn = document.getElementById("btnToggleSound");
    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        soundBtn.textContent = soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF";
        showToast(soundEnabled ? "Sound Effects Enabled 🔊" : "Sound Effects Muted 🔇", "info");
      });
    }
  }
  // ========================================================
  // SECURITY SHIELD: BLOCK INSPECT, F12, & RIGHT CLICK
  // ========================================================
  function injectSecurityShield() {
    // 1. Right Click Disable Karein
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      showToast("⚠️ Security System: Right Click is Blocked!", "info");
    });

    // 2. F12 aur baqi core shortcuts ko block karein
    document.addEventListener('keydown', function(e) {
      // F12 Key ko block karein
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        showToast("⚠️ Security System: Developer Tools are Blocked!", "info");
        return false;
      }
      
      // Ctrl + Shift + I (Inspect)
      // Ctrl + Shift + J (Console)
      // Ctrl + Shift + C (Element Selector)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
        showToast("⚠️ Security System: Inspect Element is Blocked!", "info");
        return false;
      }
      
      // Ctrl + U (View Source Code)
      if (e.ctrlKey && (e.key === 'U' || e.keyCode === 85)) {
        e.preventDefault();
        showToast("⚠️ Security System: View Source is Blocked!", "info");
        return false;
      }

      // Ctrl + S (Save Page)
      if (e.ctrlKey && (e.key === 'S' || e.keyCode === 83)) {
        e.preventDefault();
        return false;
      }
    });
  }
   // ========================================================
  // 8. INITIALIZE ON DOM READY
  // ========================================================
  document.addEventListener("DOMContentLoaded", () => {
    injectSecurityShield();
    initAmbientParticles();
    initAndroidController();
    initDownloadTriggers();
    initTributeSection();
  });
})();
