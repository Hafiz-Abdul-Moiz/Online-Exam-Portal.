function buildQuestionBank() {
  const html = [
    ["Sab se bari heading ke liye kaunsa element hota hai?", ["<h6>", "<heading>", "<h1>", "<head>"], 2],
    ["Image ke alternative text ke liye kaunsa attribute hota hai?", ["title", "alt", "src", "label"], 1],
    ["Hyperlink banane ke liye kaunsa element hota hai?", ["<link>", "<a>", "<href>", "<url>"], 1],
    ["Site navigation ke liye semantic element kaunsa hai?", ["<navigate>", "<menu>", "<nav>", "<links>"], 2],
    ["Email address ke liye behtareen input type kaunsa hai?", ["mail", "email", "text-email", "address"], 1],
    ["Video embed karne ke liye kaunsa element hota hai?", ["<media>", "<movie>", "<video>", "<play>"], 2],
    ["<!DOCTYPE html> kya declare karta hai?", ["CSS file", "HTML version aur mode", "JavaScript function", "Browser plugin"], 1],
    ["Table ki row ko represent karne wala element kaunsa hai?", ["<td>", "<th>", "<tr>", "<row>"], 2],
    ["Metadata kis tag ke andar hota hai?", ["<body>", "<meta>", "<head>", "<data>"], 2],
    ["Form control ko lazmi banane ke liye kaunsa attribute hota hai?", ["needed", "validate", "required", "must"], 2],
    ["Ordered list ke liye kaunsa element hota hai?", ["<ul>", "<ol>", "<list>", "<li>"], 1],
    ["Self-contained article ke liye kaunsa element hota hai?", ["<section>", "<article>", "<aside>", "<content>"], 1],
    ["Line break lagane ke liye kaunsa tag hota hai?", ["<break>", "<lb>", "<br>", "<newline>"], 2],
    ["Element ki unique ID set karne ke liye kaunsa attribute hota hai?", ["class", "id", "name", "key"], 1],
    ["Figure ke caption ke liye kaunsa element hota hai?", ["<caption>", "<figcaption>", "<figuretext>", "<legend>"], 1],
    ["Document ya section ka footer define karne wala tag kaunsa hai?", ["<bottom>", "<footer>", "<end>", "<section-footer>"], 1],
    ["Short inline quotation ke liye kaunsa element hota hai?", ["<quote>", "<q>", "<cite>", "<blockquote>"], 1],
    ["Link ko naye browsing context mein kholne ke liye kya use hota hai?", ["new", "target=\"_blank\"", "window=\"new\"", "open"], 1],
    ["Form control ke saath label connect karne wala element kaunsa hai?", ["<label>", "<formlabel>", "<caption>", "<field>"], 0],
    ["JavaScript ke saath graphics draw karne wala element kaunsa hai?", ["<draw>", "<canvas>", "<svg-js>", "<paint>"], 1]
  ].map(([question, options, answer]) => ({ subject: "HTML", question, options, answer }));

  const css = [
    ["Text ka color change karne wali property kaunsi hai?", ["font-color", "color", "text-color", "foreground"], 1],
    ["Flex formatting context banane wala display mode kaunsa hai?", ["display: flex", "position: flex", "layout: flex", "flex: display"], 0],
    ["Root font size ke relative kaunsi unit hoti hai?", ["em", "rem", "%", "vh"], 1],
    ["Element ke andar spacing control karne wali property kaunsi hai?", ["margin", "padding", "gap", "inset"], 1],
    ["Corners ko round karne wali property kaunsi hai?", ["corner-radius", "border-radius", "round", "radius"], 1],
    ["card naam ki class ko target karne wala selector kaunsa hai?", ["#card", ".card", "card", "*card"], 1],
    ["Stacking order change karne wali property kaunsi hai?", ["layer", "stack", "z-index", "order-index"], 2],
    ["Space rakhtay hue element ko invisible karne wali property kaunsi hai?", ["display: none", "visibility: hidden", "opacity: 0 and remove", "hidden: true"], 1],
    ["Reusable custom property value ke liye kaunsa CSS function hota hai?", ["var()", "custom()", "value()", "prop()"], 0],
    ["Grid columns control karne wali property kaunsi hai?", ["grid-template-columns", "grid-columns", "columns-grid", "template-columns"], 0],
    ["box-sizing: border-box kya karta hai?", ["Borders do baar add karta hai", "Padding aur border ko declared size mein include karta hai", "Box shadow remove karta hai", "Square force karta hai"], 1],
    ["Pointer element par hone par style karne wali pseudo-class kaunsi hai?", ["::pointer", ":hover", ":over", "@hover"], 1],
    ["Image ko background banane wali property kaunsi hai?", ["image-background", "background-image", "src-background", "background-src"], 1],
    ["Position ko viewport ke relative banane wali value kaunsi hai?", ["relative", "fixed", "absolute", "sticky"], 1],
    ["Line spacing set karne wali property kaunsi hai?", ["line-height", "text-spacing", "leading", "line-spacing"], 0],
    ["Responsive conditions define karne wali at-rule kaunsi hai?", ["@responsive", "@media", "@screen", "@breakpoint"], 1],
    ["Flex items ki direction control karne wali property kaunsi hai?", ["flex-flow-direction", "flex-direction", "direction-flex", "item-direction"], 1],
    ["Overflow content hide karne wali value kaunsi hai?", ["overflow: hidden", "clip: all", "content: hide", "hide-overflow: true"], 0],
    ["Transparency control karne wali property kaunsi hai?", ["alpha", "opacity", "transparency", "visible"], 1],
    ["Har element ko target karne wala selector kaunsa hai?", ["all", "#", ".", "*"], 3]
  ].map(([question, options, answer]) => ({ subject: "CSS", question, options, answer }));

  const javascript = [
    ["Block-scoped variable declare karne wala keyword kaunsa hai?", ["var", "let", "define", "value"], 1],
    ["JSON text ko object mein convert karne wala method kaunsa hai?", ["JSON.parse", "JSON.stringify", "JSON.object", "parse.JSON"], 0],
    ["Value aur type dono check karne wala operator kaunsa hai?", ["==", "=", "===", "equals"], 2],
    ["Array ke end mein item add karne wala method kaunsa hai?", ["push", "append", "addEnd", "insert"], 0],
    ["DOM ka full form kya hai?", ["Document Object Model", "Data Object Map", "Display Order Method", "Document Oriented Markup"], 0],
    ["Button activate hone par kaunsa event fire hota hai?", ["press", "activate", "click", "tap-only"], 2],
    ["Function define karne wala keyword kaunsa hai?", ["method", "function", "def", "procedure"], 1],
    ["Intentional empty value ko represent karne wali value kaunsi hai?", ["undefined", "null", "empty", "void-value"], 1],
    ["Pehla matching element select karne wala method kaunsa hai?", ["querySelector", "getFirst", "selectOne", "findElement"], 0],
    ["Template literal banane ke liye kaunsi syntax use hoti hai?", ["Single quotes", "Double quotes", "Backticks", "Parentheses"], 2],
    ["Promise rejection handle karne wala method kaunsa hai?", [".catch", ".error", ".reject", ".fail"], 0],
    ["Iterable values par direct loop karne wala loop kaunsa hai?", ["for...in", "for...of", "forEach-only", "repeat"], 1],
    ["Loop se bahar nikalne wala keyword kaunsa hai?", ["stop", "exit", "break", "return-loop"], 2],
    ["Browser mein origin ke liye data store karne wali API kaunsi hai?", ["window.store", "localStorage", "browserDB", "sessionFile"], 1],
    ["Closure kya hota hai?", ["CSS rule", "Aisa function jo apne lexical scope ko retain kare", "Closed tab", "Private HTML tag"], 1],
    ["Transformed values se naya array banane wala method kaunsa hai?", ["filter", "reduce", "map", "transformArray"], 2],
    ["Current object context ko refer karne wala keyword kaunsa hai?", ["self", "this", "current", "object"], 1],
    ["Delay ke baad callback schedule karne wali API kaunsi hai?", ["setTimeout", "delayCall", "waitFor", "later"], 0],
    ["typeof null ka result kis type ka hota hai?", ["null", "object", "undefined", "empty"], 1],
    ["Exceptions handle karne wali statement kaunsi hai?", ["try...catch", "handle...error", "safe...catch", "test...except"], 0]
  ].map(([question, options, answer]) => ({ subject: "JavaScript", question, options, answer }));

  return [...html, ...css, ...javascript];
}

const examElement = (id) => document.getElementById(id);
const EXAM_SUBJECTS = ["HTML", "CSS", "JavaScript"];
const EXAM_MINUTES = 30;
const SESSION_KEY = "skilltester_session";

const state = {
  exam: "All Subjects",
  questions: [],
  answers: [],
  flagged: {},
  activeFilter: "all",
  questionIndex: 0,
  secondsLeft: EXAM_MINUTES * 60,
  timerId: null,
  examActive: false,
  finishing: false
};

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function startExam(exam) {
  if (state.examActive) return;
  state.exam = exam;
  const questionBank = buildQuestionBank();
  const examSubjects = state.exam === "All Subjects"
    ? EXAM_SUBJECTS
    : EXAM_SUBJECTS.filter((subject) => subject === state.exam);
  const subjectOrder = shuffle(examSubjects);
  state.questions = subjectOrder.flatMap((subject) => questionBank.filter((question) => question.subject === subject));
  if (!state.questions.length) {
    window.parent.postMessage({
      type: "skilltester:exam-error",
      message: "Assigned exam mein questions nahi mile. Admin se rabta karein."
    }, "*");
    return;
  }
  state.answers = Array(state.questions.length).fill(null);
  state.flagged = {};
  state.activeFilter = "all";
  state.questionIndex = 0;
  state.secondsLeft = EXAM_MINUTES * 60;
  state.examActive = true;
  state.finishing = false;
  window.clearInterval(state.timerId);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ startedAt: Date.now() }));
  document.body.classList.add("exam-running");
  examElement("liveExamView").hidden = false;
  examElement("timer").classList.remove("timer-warning");

  window.parent.postMessage({
    type: "skilltester:exam-started",
    questionCount: state.questions.length
  }, "*");
  renderQuestion();

  const deadline = Date.now() + EXAM_MINUTES * 60 * 1000;
  const updateTimer = () => {
    state.secondsLeft = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    examElement("timer").textContent = formatTime(state.secondsLeft);
    if (state.secondsLeft <= 60) examElement("timer").classList.add("timer-warning");
    if (state.secondsLeft === 0) finishExam("Time expired.");
  };
  updateTimer();
  state.timerId = window.setInterval(() => {
    if (state.examActive) updateTimer();
  }, 1000);
}

function finishExam(reason, cheating = false) {
  if (!state.examActive || state.finishing) return;
  state.finishing = true;
  state.examActive = false;
  window.clearInterval(state.timerId);
  sessionStorage.removeItem(SESSION_KEY);

  const subjectBreakdown = {};
  EXAM_SUBJECTS.forEach((subj) => {
    const subjQuestions = state.questions.map((q, idx) => ({ ...q, originalIndex: idx })).filter((q) => q.subject === subj);
    if (subjQuestions.length > 0) {
      const correct = subjQuestions.reduce((acc, q) => {
        return acc + (state.answers[q.originalIndex] === q.answer ? 1 : 0);
      }, 0);
      subjectBreakdown[subj] = {
        correct,
        total: subjQuestions.length,
        percentage: Math.round((correct / subjQuestions.length) * 100)
      };
    }
  });

  window.parent.postMessage({
    type: "skilltester:exam-finished",
    reason,
    cheating,
    correctAnswers: calculateExamScore(),
    questionCount: state.questions.length,
    subjectBreakdown,
    answerReview: state.questions.map((question, index) => ({
      subject: question.subject,
      question: question.question,
      selectedAnswer: Number.isInteger(state.answers[index])
        ? `${String.fromCharCode(65 + state.answers[index])}. ${question.options[state.answers[index]]}`
        : null,
      correctAnswer: `${String.fromCharCode(65 + question.answer)}. ${question.options[question.answer]}`,
      isCorrect: state.answers[index] === question.answer
    }))
  }, "*");

  document.body.classList.remove("exam-running");
  examElement("liveExamView").hidden = true;
}

function renderSubjectTabs() {
  const tabs = examElement("subjectTabs");
  tabs.replaceChildren();
  EXAM_SUBJECTS.filter((subject) => state.questions.some((question) => question.subject === subject)).forEach((subject) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "subject-tab";
    button.textContent = subject;
    button.setAttribute("aria-label", `Open ${subject} questions`);
    button.addEventListener("click", () => {
      const firstQuestion = state.questions.findIndex((question) => question.subject === subject);
      if (firstQuestion !== -1) {
        state.questionIndex = firstQuestion;
        renderQuestion();
      }
    });
    tabs.appendChild(button);
  });
}

function updateQuestionCounts() {
  const total = state.questions.length;
  const answered = state.answers.filter((a) => a !== null).length;
  const flagged = Object.values(state.flagged).filter(Boolean).length;
  const unattempted = total - answered;

  const countAll = examElement("countAll");
  const countAnswered = examElement("countAnswered");
  const countFlagged = examElement("countFlagged");
  const countUnattempted = examElement("countUnattempted");

  if (countAll) countAll.textContent = String(total);
  if (countAnswered) countAnswered.textContent = String(answered);
  if (countFlagged) countFlagged.textContent = String(flagged);
  if (countUnattempted) countUnattempted.textContent = String(unattempted);
}

function renderQuestionMap(subjectQuestions) {
  const map = examElement("questionMap");
  map.replaceChildren();

  let displayIndices = subjectQuestions;
  if (state.activeFilter === "answered") {
    displayIndices = subjectQuestions.filter((idx) => state.answers[idx] !== null);
  } else if (state.activeFilter === "flagged") {
    displayIndices = subjectQuestions.filter((idx) => state.flagged[idx] === true);
  } else if (state.activeFilter === "unattempted") {
    displayIndices = subjectQuestions.filter((idx) => state.answers[idx] === null);
  }

  if (displayIndices.length === 0) {
    const emptyNotice = document.createElement("p");
    emptyNotice.className = "modal-copy";
    emptyNotice.style.margin = "4px 0";
    emptyNotice.textContent = `No questions found in "${state.activeFilter}" filter.`;
    map.appendChild(emptyNotice);
    return;
  }

  displayIndices.forEach((questionIndex) => {
    const localIndex = subjectQuestions.indexOf(questionIndex);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "question-map-button";
    button.textContent = String(localIndex + 1);
    button.setAttribute("aria-label", `Question ${localIndex + 1}`);

    const isAnswered = state.answers[questionIndex] !== null;
    const isFlagged = state.flagged[questionIndex] === true;
    const isCurrent = questionIndex === state.questionIndex;

    button.classList.toggle("answered", isAnswered);
    button.classList.toggle("flagged", isFlagged);
    button.classList.toggle("current", isCurrent);

    if (isCurrent) button.setAttribute("aria-current", "step");
    button.addEventListener("click", () => {
      state.questionIndex = questionIndex;
      renderQuestion();
    });
    map.appendChild(button);
  });
}

function renderQuestion() {
  const current = state.questions[state.questionIndex];
  if (!current) return;
  const subjectQuestions = state.questions.reduce((indices, question, index) => {
    if (question.subject === current.subject) indices.push(index);
    return indices;
  }, []);
  const localIndex = subjectQuestions.indexOf(state.questionIndex);

  examElement("subjectBadge").textContent = current.subject;
  examElement("questionNumber").textContent = `${current.subject} · Question ${localIndex + 1} of ${subjectQuestions.length} (Overall ${state.questionIndex + 1} of ${state.questions.length})`;
  examElement("questionTitle").textContent = current.question;
  examElement("score").textContent = `${state.answers.filter((answer) => answer !== null).length} / ${state.questions.length}`;
  examElement("timer").textContent = formatTime(state.secondsLeft);
  const answeredCount = state.answers.filter((answer) => answer !== null).length;
  examElement("questionProgress").style.width = `${(answeredCount / state.questions.length) * 100}%`;

  const flagBtn = examElement("flagQuestionBtn");
  const flagText = examElement("flagBtnText");
  const isFlagged = state.flagged[state.questionIndex] === true;
  flagBtn.classList.toggle("flagged", isFlagged);
  flagText.textContent = isFlagged ? "Flagged for Review (★)" : "Flag for Review";

  if (state.examActive) {
    window.parent.postMessage({
      type: "skilltester:exam-progress",
      correctAnswers: calculateExamScore(),
      questionCount: state.questions.length,
      currentQuestion: state.questionIndex + 1,
      secondsLeft: state.secondsLeft
    }, "*");
  }

  updateQuestionCounts();
  renderSubjectTabs();
  [...examElement("subjectTabs").children].forEach((button) => {
    button.classList.toggle("active", button.textContent === current.subject);
    if (button.textContent === current.subject) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
  });

  renderQuestionMap(subjectQuestions);
  examElement("previousQuestion").disabled = state.questionIndex === 0;
  examElement("nextQuestion").disabled = state.questionIndex === state.questions.length - 1;

  const options = examElement("options");
  options.replaceChildren();
  const selectedAnswer = state.answers[state.questionIndex];
  const answerFeedback = examElement("answerFeedback");
  answerFeedback.textContent = "";

  current.options.forEach((optionText, optionIndex) => {
    const button = document.createElement("button");
    button.className = "option";
    button.type = "button";
    button.textContent = `${String.fromCharCode(65 + optionIndex)}. ${optionText}`;
    const isSelected = selectedAnswer === optionIndex;
    button.classList.toggle("selected", isSelected);
    button.disabled = selectedAnswer !== null;
    button.setAttribute("aria-pressed", String(isSelected));
    button.addEventListener("click", () => {
      if (!state.examActive || state.answers[state.questionIndex] !== null) return;
      state.answers[state.questionIndex] = optionIndex;
      renderQuestion();
    });
    options.appendChild(button);
  });
  if (selectedAnswer !== null) {
    answerFeedback.textContent = "Answer locked. You can navigate freely or review other questions.";
  }
}

function calculateExamScore() {
  return state.questions.reduce((total, question, index) => {
    const selectedAnswer = state.answers?.[index];
    return total + (Number.isInteger(selectedAnswer) && selectedAnswer === question.answer ? 1 : 0);
  }, 0);
}

function goToQuestion(direction) {
  const nextIndex = state.questionIndex + direction;
  if (nextIndex < 0 || nextIndex >= state.questions.length) return;
  state.questionIndex = nextIndex;
  renderQuestion();
}

examElement("flagQuestionBtn").addEventListener("click", () => {
  if (!state.examActive) return;
  state.flagged[state.questionIndex] = !state.flagged[state.questionIndex];
  renderQuestion();
});

const filterButtons = [
  { id: "filterAll", filter: "all" },
  { id: "filterAnswered", filter: "answered" },
  { id: "filterFlagged", filter: "flagged" },
  { id: "filterUnattempted", filter: "unattempted" }
];

filterButtons.forEach(({ id, filter }) => {
  examElement(id)?.addEventListener("click", () => {
    state.activeFilter = filter;
    filterButtons.forEach(({ id: btnId }) => {
      examElement(btnId)?.classList.toggle("active", btnId === id);
    });
    renderQuestion();
  });
});

const scratchpadDrawer = examElement("scratchpadDrawer");
const scratchpadText = examElement("scratchpadText");
const scratchpadSavedNotice = examElement("scratchpadSavedNotice");

examElement("toggleScratchpadBtn")?.addEventListener("click", () => {
  scratchpadDrawer.classList.toggle("hidden");
  if (!scratchpadDrawer.classList.contains("hidden")) {
    scratchpadText.focus();
  }
});
examElement("closeScratchpadBtn")?.addEventListener("click", () => {
  scratchpadDrawer.classList.add("hidden");
});
scratchpadText?.addEventListener("input", (e) => {
  try {
    sessionStorage.setItem("skilltester_scratchpad", e.target.value);
    if (scratchpadSavedNotice) {
      scratchpadSavedNotice.textContent = "Saved";
      scratchpadSavedNotice.style.opacity = "1";
    }
  } catch (err) {}
});
examElement("clearScratchpadBtn")?.addEventListener("click", () => {
  if (scratchpadText) scratchpadText.value = "";
  try { sessionStorage.removeItem("skilltester_scratchpad"); } catch (e) {}
});

try {
  const savedNotes = sessionStorage.getItem("skilltester_scratchpad");
  if (savedNotes && scratchpadText) scratchpadText.value = savedNotes;
} catch (e) {}

examElement("dismissWarningBtn")?.addEventListener("click", () => {
  examElement("adminWarningBanner").classList.add("hidden");
});

examElement("beginExamButton")?.addEventListener("click", () => {
  if (window.top === window) {
    window.location.href = "index.html#examView";
    return;
  }
  window.parent.postMessage({ type: "skilltester:begin-exam" }, "*");
});
examElement("previousQuestion").addEventListener("click", () => goToQuestion(-1));
examElement("nextQuestion").addEventListener("click", () => goToQuestion(1));
examElement("finishExamButton").addEventListener("click", () => {
  const unanswered = state.answers.filter((answer) => answer === null).length;
  const flagged = Object.values(state.flagged).filter(Boolean).length;
  let confirmation = "Finish and submit your exam?";
  if (unanswered > 0 && flagged > 0) {
    confirmation = `You have ${unanswered} unanswered question(s) and ${flagged} question(s) flagged for review.\nSubmit exam anyway?`;
  } else if (unanswered > 0) {
    confirmation = `${unanswered} question(s) are unanswered and will count as incorrect.\nFinish the exam?`;
  } else if (flagged > 0) {
    confirmation = `You have ${flagged} question(s) flagged for review.\nFinish and submit now?`;
  }
  if (window.confirm(confirmation)) finishExam("Exam completed.");
});

window.addEventListener("message", (event) => {
  if (event.source !== window.parent || !event.data || typeof event.data !== "object") return;
  if (event.data.type === "skilltester:start-exam") startExam(event.data.exam);
  if (event.data.type === "skilltester:terminate-exam") finishExam(event.data.reason, true);
  if (event.data.type === "skilltester:admin-warning") {
    const banner = examElement("adminWarningBanner");
    const text = examElement("adminWarningText");
    if (banner && text) {
      text.textContent = `Warning from Admin Command Center: ${event.data.warning || "Please maintain full focus on the exam arena."}`;
      banner.classList.remove("hidden");
    }
  }
});

const blockKeyboard = (event) => {
  if (!state.examActive) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  return false;
};
document.addEventListener("keydown", blockKeyboard, true);
document.addEventListener("keypress", blockKeyboard, true);
document.addEventListener("keyup", blockKeyboard, true);

const blockNonLeftClick = (event) => {
  if (!state.examActive) return;
  if (event.button !== 0) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }
};
document.addEventListener("mousedown", blockNonLeftClick, true);
document.addEventListener("mouseup", blockNonLeftClick, true);
document.addEventListener("auxclick", blockNonLeftClick, true);
document.addEventListener("contextmenu", (event) => {
  if (state.examActive) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);
document.addEventListener("selectstart", (event) => {
  if (state.examActive) event.preventDefault();
}, true);
document.addEventListener("dragstart", (event) => {
  if (state.examActive) event.preventDefault();
}, true);