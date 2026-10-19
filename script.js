(function () {
  "use strict";

  // ========================================================
  // 1. CONFIGURATION: PASTE YOUR PUBLIC DOWNLOAD LINK HERE!
  // ========================================================
  // Jab aap apni "Online Exam Portal Setup 1.0.0.exe" file ko
  // Google Drive ya MediaFire par upload kar dein, to uska link
  // yahan quotes ke andar paste kar dein:
const WINDOWS_SETUP_DOWNLOAD_URL = "https://github.com/Hafiz-Abdul-Moiz/Online-Exam-Portal./releases/download/v1.0.0/Online.Exam.Portal.Setup.1.0.0.exe";
  // Audio Synthesizer (Pleasant Sound Effects)
  function playAudioTone(freq, type = "sine", duration = 0.15, vol = 0.12) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
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
      setTimeout(() => playAudioTone(freq, "triangle", 0.25, 0.14), i * 70);
    });
  }

  function playPendingTone() {
    [440, 554.37, 659.25].forEach((freq, i) => {
      setTimeout(() => playAudioTone(freq, "sine", 0.2, 0.12), i * 90);
    });
  }

  // Toast Notification System
  function showToast(message, type = "info") {
    const existing = document.getElementById("vvipDownloadToast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "vvipDownloadToast";
    toast.style.cssText = `
      position: fixed;
      bottom: 28px;
      right: 24px;
      z-index: 2147483647;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
      border: 1px solid ${type === "success" ? "#10b981" : "#38bdf8"};
      box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 25px ${type === "success" ? "rgba(16,185,129,0.3)" : "rgba(56,189,248,0.3)"};
      color: #f8fafc;
      padding: 14px 22px;
      border-radius: 14px;
      font-size: 0.9rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
      backdrop-filter: blur(16px);
      animation: slideInToast 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
    `;
    toast.innerHTML = `<span>${type === "success" ? "✅" : "ℹ️"}</span> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // Ambient Particles Canvas
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
    const colors = ["rgba(56, 189, 248, ", "rgba(99, 102, 241, ", "rgba(244, 63, 94, ", "rgba(245, 158, 11, "];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

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

  // Android APK Pending Modal
  function initModals() {
    const pendingModal = document.getElementById("androidPendingModal");
    const openBtn = document.getElementById("btnOpenApkPendingModal");
    const heroApkBtn = document.getElementById("heroApkBtn");
    const closeBtn = document.getElementById("btnClosePendingModal");
    const actionBtn = document.getElementById("btnNotifyApkRelease");

    function openModal() {
      playPendingTone();
      if (pendingModal) pendingModal.style.display = "flex";
    }

    function closeModal() {
      playAudioTone(400, "sine", 0.08, 0.1);
      if (pendingModal) pendingModal.style.display = "none";
    }

    if (openBtn) openBtn.addEventListener("click", openModal);
    if (heroApkBtn) heroApkBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    if (pendingModal) {
      pendingModal.addEventListener("click", (e) => {
        if (e.target === pendingModal) closeModal();
      });
    }

    if (actionBtn) {
      actionBtn.addEventListener("click", () => {
        playSuccessChord();
        showToast("Shukriya! Android APK release hotay hi update mil jayegi.", "success");
        closeModal();
      });
    }
  }

  // Windows Download Trigger
  function initDownloadTriggers() {
    const winBtn = document.getElementById("btnDownloadWindowsSetup");
    const heroWinBtn = document.getElementById("heroDownloadWinBtn");
    const navWinBtn = document.getElementById("navDownloadBtn");

    function handleWindowsDownload(e) {
      playSuccessChord();
      showToast("🚀 Downloading Online Exam Portal Setup (228 MB)...", "success");

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

  document.addEventListener("DOMContentLoaded", () => {
    initAmbientParticles();
    initModals();
    initDownloadTriggers();
  });
})();