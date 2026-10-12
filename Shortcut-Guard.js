/* Online Exam Portal · Shortcut Guard (v1)
 *
 * WHAT IT DOES (only while an exam is running)
 *  - Blocks keyboard / operating-system shortcuts: Ctrl+..., Alt+..., Windows key, Ctrl+Shift+T/N/W,
 *    Ctrl+Tab / Ctrl+Shift+Tab (tab switching), Alt+Tab, Alt+Left/Right, F1-F24, Escape, PrintScreen,
 *    Win+Shift+S, the Menu key, browser/launch keys.
 *  - Every blocked attempt is counted as ONE strike through your existing warning system
 *    (Exam.js: triggerAiViolation  /  app.js: recordShortcutAttempt)  -> 5 warnings, termination on the 6th.
 *  - Normal typing keeps working: letters, Shift + letters (capital letters), Shift + numbers (symbols),
 *    Space, Enter, Backspace, arrows and AltGr characters.
 *  - Pressing only Ctrl / Alt / Shift on their own is NOT a strike; the strike is counted when the
 *    actual shortcut key is pressed, so one shortcut attempt = one strike (not 2-3).
 *  - In fullscreen (Chrome / Edge) it asks the browser to deliver ALL keys to the page (Keyboard Lock API),
 *    so reserved shortcuts such as Ctrl+W, Ctrl+T, Ctrl+N, Ctrl+Tab and Alt+Tab can be intercepted too.
 *  - Blocks Ctrl + mouse-wheel zoom and asks for confirmation before the exam tab is refreshed or closed.
 *
 * Load it BEFORE app.js (index.html) and BEFORE Exam.js (Exam.html). Existing files are not modified.
 */
(() => {
  "use strict";

  if (window.__shortcutGuardInstalled) return;
  window.__shortcutGuardInstalled = true;

  const CFG = Object.freeze({
    debounceMs: 450,          // the same shortcut inside this time counts once
    lockKeyboard: true,       // Keyboard Lock API (Chrome / Edge, fullscreen only)
    blockCtrlWheelZoom: true, // Ctrl + scroll zoom
    confirmBeforeLeaving: true
  });

  const IS_TOP = window.top === window;

  /* ---------- exam state (works in index.html and in the Exam.html iframe) ---------- */
  function examRunning() {
    try {
      return typeof state !== "undefined" && !!state && state.examActive === true && state.finishing !== true;
    } catch (_) {
      return false;
    }
  }

  /* ---------- report a strike through the existing system ---------- */
  function report(label) {
    try {
      if (typeof triggerAiViolation === "function") triggerAiViolation(label);      // Exam.js (iframe)
      else if (typeof recordShortcutAttempt === "function") recordShortcutAttempt(label); // app.js (parent)
    } catch (err) {
      console.warn("[ShortcutGuard] could not record strike", err);
    }
  }

  /* ---------- classification ---------- */
  function keyName(e) {
    const k = e.key || "";
    if (k === " ") return "Space";
    if (k.length === 1) return k.toUpperCase();
    return k || e.code || "Key";
  }

  function chordLabel(e) {
    const parts = [];
    if (e.metaKey) parts.push("Win");
    if (e.ctrlKey) parts.push("Ctrl");
    if (e.altKey) parts.push("Alt");
    if (e.shiftKey) parts.push("Shift");
    parts.push(keyName(e));
    return parts.join("+");
  }

  /* returns null  -> normal typing, let the page handle it
     returns {count, label} -> restricted: block it (and count a strike when count = true) */
  function classify(e) {
    const key = e.key || "";

    // IME / dead keys / mobile soft keyboards are never shortcuts
    if (e.isComposing || key === "Process" || key === "Dead" || key === "Unidentified") return null;

    // AltGr (Ctrl+Alt on Windows) is only used to type characters such as @ or #
    const altGr = typeof e.getModifierState === "function" && e.getModifierState("AltGraph");
    if (altGr && key.length === 1 && !e.metaKey) return null;

    // modifier keys on their own
    if (key === "Shift" || key === "AltGraph" || key === "CapsLock") return null;       // typing needs them
    if (key === "Meta" || key === "OS") return { count: true, label: "Windows Key" };   // opens Start menu / switches window
    if (key === "Control" || key === "Alt") return { count: false, label: key };        // neutralised, no strike alone

    if (key === "Escape" || key === "Esc") return { count: true, label: "Escape" };
    if (key === "PrintScreen" || key === "Snapshot" || (e.type !== "keypress" && e.keyCode === 44)) {
      return { count: true, label: "PrintScreen" };
    }
    if (/^F([1-9]|1[0-9]|2[0-4])$/.test(key)) return { count: true, label: key };
    if (key === "ContextMenu") return { count: true, label: "Context Menu Key" };
    if (/^(Browser|Launch)/.test(key)) return { count: true, label: key };

    if (e.ctrlKey || e.altKey || e.metaKey) return { count: true, label: chordLabel(e) };

    return null; // letters, Shift+letters, digits, Space, Enter, Backspace, arrows, Tab ...
  }

  /* ---------- strike counting with de-duplication ---------- */
  let last = { label: "", at: 0 };
  function countStrike(label) {
    const now = Date.now();
    if (label === last.label && now - last.at < CFG.debounceMs) return;
    last = { label, at: now };
    report(label);
  }

  function onKey(e) {
    if (!examRunning()) return;
    const c = classify(e);
    if (!c) return;

    // always neutralise the shortcut and keep the page's older handlers from counting it a second time
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();

    if (e.type === "keyup") {
      // PrintScreen only fires keyup on Windows
      if (c.count && c.label === "PrintScreen") countStrike(c.label);
      return;
    }
    if (e.type !== "keydown") return;
    if (!c.count || e.repeat) return; // held keys do not create extra strikes
    countStrike(c.label);
  }

  ["keydown", "keyup", "keypress"].forEach((type) => window.addEventListener(type, onKey, true));

  /* ---------- Ctrl + wheel zoom ---------- */
  if (CFG.blockCtrlWheelZoom) {
    window.addEventListener("wheel", (e) => {
      if (examRunning() && (e.ctrlKey || e.metaKey)) e.preventDefault();
    }, { passive: false, capture: true });
  }

  /* ---------- refresh / close confirmation (top page only) ---------- */
  if (CFG.confirmBeforeLeaving && IS_TOP) {
    window.addEventListener("beforeunload", (e) => {
      if (!examRunning()) return;
      e.preventDefault();
      e.returnValue = "";
      return "";
    });
  }

  /* ---------- Keyboard Lock API: capture reserved shortcuts in fullscreen ---------- */
  if (CFG.lockKeyboard && IS_TOP) {
    const kb = navigator.keyboard;
    if (kb && typeof kb.lock === "function") {
      let wasLocked = false;
      const sync = () => {
        const want = examRunning() && !!document.fullscreenElement;
        if (want) {
          // lock() with no arguments captures every key; calling it again simply re-applies it
          // (app.js locks only Escape when fullscreen starts, this widens it to all keys)
          kb.lock().catch(() => {});
          wasLocked = true;
        } else if (wasLocked) {
          try { kb.unlock(); } catch (_) { /* ignore */ }
          wasLocked = false;
        }
      };
      document.addEventListener("fullscreenchange", () => window.setTimeout(sync, 250));
      window.setInterval(sync, 2000);
    }
  }

  window.ShortcutGuard = Object.freeze({ version: 1, classify, config: CFG });
})();