/* SkillTester Proctored Exam Arena with AI Sentinel, Multi-Level Questions & Subjective Choice */

function buildQuestionBank() {
  // 1. SECTION A: OBJECTIVE MULTIPLE CHOICE QUESTIONS (Easy, Medium, Hard)
  const sectionAMcqs = [
    // English MCQs
    { subject: "English", section: "Section A", difficulty: "Easy", question: "Identify the part of speech of 'swiftly' in: 'The developer typed swiftly.'", options: ["Adjective", "Adverb", "Conjunction", "Noun"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Easy", question: "Which word is an abstract noun?", options: ["Computer", "Keyboard", "Wisdom", "Screen"], answer: 2 },
    { subject: "English", section: "Section A", difficulty: "Medium", question: "Choose the correct relative pronoun: 'This is the programmer _____ solved the bug.'", options: ["which", "who", "whom", "whose"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Medium", question: "What is the passive voice of: 'Ali wrote an elegant algorithm.'", options: ["An elegant algorithm wrote Ali", "An elegant algorithm was written by Ali", "An elegant algorithm has been written", "Ali was written by an algorithm"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Hard", question: "Identify the clause in: 'Although the exam was challenging, he passed.'", options: ["Noun clause", "Adverbial clause of concession", "Adjective clause", "Independent phrase"], answer: 1 },

    // Computer Science MCQs
    { subject: "Computer Science", section: "Section A", difficulty: "Easy", question: "Which CPU component performs arithmetic and logical calculations?", options: ["Control Unit (CU)", "Arithmetic Logic Unit (ALU)", "Memory Data Register", "System Bus"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Easy", question: "The binary equivalent of decimal number 13 is:", options: ["1100", "1101", "1011", "1110"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Medium", question: "Which normal form eliminates partial functional dependency?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Medium", question: "Which data structure operates on a Last-In, First-Out (LIFO) order?", options: ["Queue", "Stack", "Binary Tree", "Linked List"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Hard", question: "What is the time complexity of binary search on a sorted array of size n?", options: ["O(n)", "O(n^2)", "O(log n)", "O(1)"], answer: 2 },

    // Mathematics MCQs
    { subject: "Mathematics", section: "Section A", difficulty: "Easy", question: "If the determinant of a square matrix A is 0 (|A| = 0), the matrix is termed:", options: ["Identity matrix", "Singular matrix", "Symmetric matrix", "Non-singular matrix"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Easy", question: "The roots of the quadratic equation x^2 - 5x + 6 = 0 are:", options: ["1 and 6", "2 and 3", "-2 and -3", "3 and -2"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Medium", question: "The derivative of f(x) = sin(2x) with respect to x is:", options: ["cos(2x)", "2 cos(2x)", "-2 cos(2x)", "2 sin(x)"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Medium", question: "Two non-zero vectors A and B are perpendicular if their dot product (A · B) equals:", options: ["1", "-1", "0", "A x B"], answer: 2 },
    { subject: "Mathematics", section: "Section A", difficulty: "Hard", question: "What is the limit of (sin x) / x as x approaches 0?", options: ["0", "1", "Infinity", "Undefined"], answer: 1 },

    // Physics MCQs
    { subject: "Physics", section: "Section A", difficulty: "Easy", question: "The rate of change of displacement is defined as:", options: ["Speed", "Acceleration", "Velocity", "Force"], answer: 2 },
    { subject: "Physics", section: "Section A", difficulty: "Easy", question: "The SI unit of work and energy is:", options: ["Watt", "Newton", "Joule", "Pascal"], answer: 2 },
    { subject: "Physics", section: "Section A", difficulty: "Medium", question: "Newton's Second Law of Motion is expressed mathematically as:", options: ["F = mv", "F = ma", "F = m/a", "W = Fd"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Medium", question: "The bending of light waves around corners of an obstacle is known as:", options: ["Refraction", "Polarization", "Diffraction", "Total Internal Reflection"], answer: 2 },
    { subject: "Physics", section: "Section A", difficulty: "Hard", question: "The energy of a photon of frequency f is given by Planck's equation:", options: ["E = mc^2", "E = hf", "E = h/f", "E = 1/2 mv^2"], answer: 1 }
  ];

  // 2. SECTION B: SHORT QUESTIONS & COMPOSITION (8 Questions total -> Attempt 6)
  const sectionBShorts = [
    {
      subject: "English",
      section: "Section B",
      difficulty: "Easy",
      type: "short",
      question: "Q1 [Formal Application to Principal]: Write a formal application to your College Principal requesting 3 days leave of absence due to high fever. Include formal salutation, dates of leave, and respectful conclusion.",
      placeholder: "To,\nThe Principal,\n...\nSubject: Application for Leave of Absence\nRespected Sir,\n...\nYours obediently,\n[Student Name]"
    },
    {
      subject: "English",
      section: "Section B",
      difficulty: "Hard",
      type: "choice_writing",
      question: "Q2 [Choice: Formal Letter vs Essay Composition - Attempt Any One]:\nChoice 1 (Formal Letter): Write a letter to the Newspaper Editor highlighting the urgent need for digital literacy and cyber safety in colleges.\nChoice 2 (Essay): Write a comprehensive essay (200-250 words) on 'The Impact of Artificial Intelligence on Future Education and Careers'.",
      choices: [
        "Choice 1: Formal Letter to Editor (Cyber Safety)",
        "Choice 2: Essay on AI in Education & Careers"
      ],
      defaultChoice: 0,
      placeholder: "Click Choice 1 or Choice 2 above to select your topic, then type your complete letter or essay here..."
    },
    {
      subject: "English",
      section: "Section B",
      difficulty: "Medium",
      type: "sentence_making",
      question: "Q3 [Sentence Construction - Topic: Cybersecurity & Information Technology]: Construct 5 meaningful, grammatically sound sentences on the topic using each of the following 5 keywords:\n1. Algorithm\n2. Firewall\n3. Innovation\n4. Encryption\n5. Integrity",
      placeholder: "1. Algorithm: ...\n2. Firewall: ...\n3. Innovation: ...\n4. Encryption: ...\n5. Integrity: ..."
    },
    {
      subject: "English",
      section: "Section B",
      difficulty: "Medium",
      type: "short",
      question: "Q4 [Grammar, Narration & Voice Transformation]:\n(a) Convert to Indirect Speech: The teacher said to the students, 'Complete your examination honestly before time expires.'\n(b) Convert to Passive Voice: 'The software engineer deployed the secure database.'\n(c) Correct the grammatical error: 'Each of the computer systems were infected by malware.'",
      placeholder: "(a) Indirect Speech: ...\n(b) Passive Voice: ...\n(c) Corrected Sentence: ..."
    },
    {
      subject: "Computer Science",
      section: "Section B",
      difficulty: "Medium",
      type: "short",
      question: "Q5 [CS Theory]: Differentiate between a Compiler and an Interpreter with respect to execution speed, error reporting, and target binary generation.",
      placeholder: "Compiler:\n- ...\nInterpreter:\n- ..."
    },
    {
      subject: "Computer Science",
      section: "Section B",
      difficulty: "Hard",
      type: "short",
      question: "Q6 [Database]: Explain 1NF, 2NF, and 3NF database normalization rules. Differentiate between a Primary Key and a Foreign Key.",
      placeholder: "1NF: ...\n2NF: ...\n3NF: ...\nPrimary Key vs Foreign Key: ..."
    },
    {
      subject: "Mathematics",
      section: "Section B",
      difficulty: "Medium",
      type: "short",
      question: "Q7 [Matrices & Algebra]: Given matrix A = [[3, 2], [1, 4]]:\n(a) Calculate determinant |A|.\n(b) Determine whether matrix A is singular or non-singular.\n(c) Find the inverse matrix A^(-1) using Adjoint formula.",
      placeholder: "Step 1: |A| = (3)(4) - (2)(1) = ...\nStep 2: Adjoint(A) = ...\nStep 3: A^(-1) = ..."
    },
    {
      subject: "Physics",
      section: "Section B",
      difficulty: "Medium",
      type: "short",
      question: "Q8 [Mechanics & Energy]:\n(a) State Newton's Second Law of Motion in terms of rate of change of linear momentum.\n(b) State the Work-Energy Theorem and write its mathematical formula.",
      placeholder: "(a) Newton's 2nd Law in momentum terms: ...\n(b) Work-Energy Theorem: W = ΔK = ..."
    }
  ];

  // 3. SECTION C: LONG QUESTIONS (4 Questions total -> Attempt 2)
  const sectionCLongs = [
    {
      subject: "Computer Science",
      section: "Section C",
      difficulty: "Hard",
      type: "long",
      question: "Long Q1 [System Architecture & Database Design - 10 Marks]:\nDesign an Entity-Relationship (ERD) Schema for an Online Proctored Examination System.\n(a) Identify the 4 primary entities and their attributes.\n(b) Specify the relationships (1-to-Many, Many-to-Many).\n(c) Write standard SQL DDL CREATE TABLE statements for Candidate and Exam_Result tables.",
      placeholder: "1. Entities & Attributes:\n- Candidate (id, name, ...)\n- Exam (id, title, ...)\n\n2. SQL DDL Statements:\nCREATE TABLE Candidate (\n  ...\n);\n\nCREATE TABLE Exam_Result (\n  ...\n);"
    },
    {
      subject: "Computer Science",
      section: "Section C",
      difficulty: "Hard",
      type: "long",
      question: "Long Q2 [OOP Principles & Data Structures - 10 Marks]:\n(a) Detail the Four Pillars of Object-Oriented Programming (Encapsulation, Inheritance, Polymorphism, Abstraction) with realistic software examples.\n(b) Compare Stack vs Queue data structures with diagrams or operation algorithms (Push/Pop vs Enqueue/Dequeue).",
      placeholder: "Part (a): 4 Pillars of OOP:\n1. Encapsulation: ...\n2. Inheritance: ...\n3. Polymorphism: ...\n4. Abstraction: ...\n\nPart (b): Stack vs Queue comparison: ..."
    },
    {
      subject: "Mathematics",
      section: "Section C",
      difficulty: "Hard",
      type: "long",
      question: "Long Q3 [Calculus & Analytical Vectors - 10 Marks]:\n(a) Evaluate the definite integral ∫ (2x + 3) / (x^2 + 3x + 5) dx showing all substitution steps.\n(b) For vectors A = 2i + 3j - k and B = i - 2j + 4k, determine the dot product A · B and cross product A × B.",
      placeholder: "Part (a): Let u = x^2 + 3x + 5, then du = (2x + 3)dx...\n\nPart (b): A · B = (2)(1) + (3)(-2) + (-1)(4) = ...\nCross product A x B = ..."
    },
    {
      subject: "Physics",
      section: "Section C",
      difficulty: "Hard",
      type: "long",
      question: "Long Q4 [Electromagnetism & Wave Optics - 10 Marks]:\n(a) State Coulomb's Law of Electrostatics and derive the expression for electric field intensity at distance r from a point charge Q.\n(b) Explain Young's Double Slit experiment for interference of light and write the formula for fringe width.",
      placeholder: "Part (a): F = (1 / 4πε₀) * (q₁q₂ / r²)...\nElectric field E = F / q = ...\n\nPart (b): Young's Double Slit Interference: ..."
    }
  ];

  // 4. WEB DEVELOPMENT TRACK (HTML, CSS, JS - 20 MCQs each)
  const webDevQuestions = [
    // HTML
    { subject: "HTML", section: "Section A", difficulty: "Easy", question: "Sab se bari heading ke liye kaunsa element hota hai?", options: ["<h6>", "<heading>", "<h1>", "<head>"], answer: 2 },
    { subject: "HTML", section: "Section A", difficulty: "Easy", question: "Image ke alternative text ke liye kaunsa attribute hota hai?", options: ["title", "alt", "src", "label"], answer: 1 },
    { subject: "HTML", section: "Section A", difficulty: "Easy", question: "Hyperlink banane ke liye kaunsa element hota hai?", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1 },
    { subject: "HTML", section: "Section A", difficulty: "Medium", question: "Site navigation ke liye semantic element kaunsa hai?", options: ["<navigate>", "<menu>", "<nav>", "<links>"], answer: 2 },
    { subject: "HTML", section: "Section A", difficulty: "Medium", question: "Email address ke liye behtareen input type kaunsa hai?", options: ["mail", "email", "text-email", "address"], answer: 1 },
    { subject: "HTML", section: "Section A", difficulty: "Medium", question: "Video embed karne ke liye kaunsa element hota hai?", options: ["<media>", "<movie>", "<video>", "<play>"], answer: 2 },
    { subject: "HTML", section: "Section A", difficulty: "Medium", question: "<!DOCTYPE html> kya declare karta hai?", options: ["CSS file", "HTML version aur mode", "JavaScript function", "Browser plugin"], answer: 1 },
    { subject: "HTML", section: "Section A", difficulty: "Hard", question: "Table ki row ko represent karne wala element kaunsa hai?", options: ["<td>", "<th>", "<tr>", "<row>"], answer: 2 },
    { subject: "HTML", section: "Section A", difficulty: "Hard", question: "Metadata kis tag ke andar hota hai?", options: ["<body>", "<meta>", "<head>", "<data>"], answer: 2 },
    { subject: "HTML", section: "Section A", difficulty: "Hard", question: "Form control ko lazmi banane ke liye kaunsa attribute hota hai?", options: ["needed", "validate", "required", "must"], answer: 2 },

    // CSS
    { subject: "CSS", section: "Section A", difficulty: "Easy", question: "Text ka color change karne wali property kaunsi hai?", options: ["font-color", "color", "text-color", "foreground"], answer: 1 },
    { subject: "CSS", section: "Section A", difficulty: "Easy", question: "Flex formatting context banane wala display mode kaunsa hai?", options: ["display: flex", "position: flex", "layout: flex", "flex: display"], answer: 0 },
    { subject: "CSS", section: "Section A", difficulty: "Medium", question: "Root font size ke relative kaunsi unit hoti hai?", options: ["em", "rem", "%", "vh"], answer: 1 },
    { subject: "CSS", section: "Section A", difficulty: "Medium", question: "Corners ko round karne wali property kaunsi hai?", options: ["corner-radius", "border-radius", "round", "radius"], answer: 1 },
    { subject: "CSS", section: "Section A", difficulty: "Hard", question: "Grid columns control karne wali property kaunsi hai?", options: ["grid-template-columns", "grid-columns", "columns-grid", "template-columns"], answer: 0 },

    // JavaScript
    { subject: "JavaScript", section: "Section A", difficulty: "Easy", question: "Block-scoped variable declare karne wala keyword kaunsa hai?", options: ["var", "let", "define", "value"], answer: 1 },
    { subject: "JavaScript", section: "Section A", difficulty: "Easy", question: "Value aur type dono check karne wala operator kaunsa hai?", options: ["==", "=", "===", "equals"], answer: 2 },
    { subject: "JavaScript", section: "Section A", difficulty: "Medium", question: "JSON text ko object mein convert karne wala method kaunsa hai?", options: ["JSON.parse", "JSON.stringify", "JSON.object", "parse.JSON"], answer: 0 },
    { subject: "JavaScript", section: "Section A", difficulty: "Medium", question: "Array ke end mein item add karne wala method kaunsa hai?", options: ["push", "append", "addEnd", "insert"], answer: 0 },
    { subject: "JavaScript", section: "Section A", difficulty: "Hard", question: "Closure kya hota hai?", options: ["CSS rule", "Aisa function jo apne lexical scope ko retain kare", "Closed tab", "Private HTML tag"], answer: 1 }
  ];

  return { sectionAMcqs, sectionBShorts, sectionCLongs, webDevQuestions };
}

const examElement = (id) => document.getElementById(id);
const SESSION_KEY = "skilltester_session";

const state = {
  exam: "Computer Science Group",
  durationMinutes: 60,
  questions: [],
  answers: [], // stores integer index for MCQ, or object { choiceIdx, text } for subjective
  flagged: {},
  activeFilter: "all",
  questionIndex: 0,
  secondsLeft: 3600,
  timerId: null,
  examActive: false,
  finishing: false,
  aiWarningsCount: 0,
  maxAiWarnings: 3
};

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  if (hours > 0) return `${hours}:${minutes}:${seconds}`;
  return `${minutes}:${seconds}`;
}

function startExam(exam, durationMinutes = 60) {
  if (state.examActive) return;
  state.exam = exam || "Computer Science Group";
  state.durationMinutes = Number(durationMinutes) || 60;
  
  const banks = buildQuestionBank();
  let selected = [];

  const examLower = state.exam.toLowerCase();
  if (examLower.includes("computer science group") || examLower === "cs group" || (examLower.includes("science") && !examLower.includes("web") && !examLower.includes("html"))) {
    // 20 Section A MCQs + 8 Section B Short Questions + 4 Section C Long Questions
    selected = [
      ...banks.sectionAMcqs,
      ...banks.sectionBShorts,
      ...banks.sectionCLongs
    ];
  } else {
    // Web Development
    selected = [...banks.webDevQuestions];
  }

  state.questions = selected;
  state.answers = Array(state.questions.length).fill(null);
  state.flagged = {};
  state.activeFilter = "all";
  state.questionIndex = 0;
  state.secondsLeft = state.durationMinutes * 60;
  state.examActive = true;
  state.finishing = false;
  state.aiWarningsCount = 0;

  window.clearInterval(state.timerId);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ startedAt: Date.now() }));
  document.body.classList.add("exam-running");

  const overviewCard = examElement("examOverviewCard");
  if (overviewCard) overviewCard.hidden = true;

  examElement("liveExamView").hidden = false;
  examElement("timer").classList.remove("timer-warning");

  const headerBadge = examElement("examGroupHeaderBadge");
  if (headerBadge) headerBadge.textContent = state.exam;

  window.parent.postMessage({
    type: "skilltester:exam-started",
    questionCount: state.questions.length
  }, "*");

  renderQuestion();

  const deadline = Date.now() + state.secondsLeft * 1000;
  const updateTimer = () => {
    state.secondsLeft = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    examElement("timer").textContent = formatTime(state.secondsLeft);
    if (state.secondsLeft <= 120) examElement("timer").classList.add("timer-warning");
    if (state.secondsLeft === 0) finishExam("Time expired.");
  };
  updateTimer();
  state.timerId = window.setInterval(() => {
    if (state.examActive) updateTimer();
  }, 1000);
}

function resetToOverview() {
  state.examActive = false;
  state.finishing = false;
  window.clearInterval(state.timerId);
  sessionStorage.removeItem(SESSION_KEY);
  document.body.classList.remove("exam-running");

  const liveView = examElement("liveExamView");
  if (liveView) liveView.hidden = true;

  const overviewCard = examElement("examOverviewCard");
  if (overviewCard) {
    overviewCard.hidden = false;
    overviewCard.removeAttribute("hidden");
    overviewCard.classList.remove("hidden");
  }

  const warnBanner = examElement("adminWarningBanner");
  if (warnBanner) warnBanner.classList.add("hidden");

  const aiChat = examElement("aiChatDrawer");
  if (aiChat) aiChat.classList.add("hidden");

  const scratch = examElement("scratchpadDrawer");
  if (scratch) scratch.classList.add("hidden");

  const eye = examElement("aiEyeIndicator");
  if (eye) eye.classList.remove("alert");

  const timer = examElement("timer");
  if (timer) {
    timer.textContent = "60:00";
    timer.classList.remove("timer-warning");
  }
}

function finishExam(reason, cheating = false) {
  if (!state.examActive || state.finishing) return;
  state.finishing = true;
  state.examActive = false;
  window.clearInterval(state.timerId);
  sessionStorage.removeItem(SESSION_KEY);

  const subjectBreakdown = {};
  const allSubjects = [...new Set(state.questions.map((q) => q.subject))];
  allSubjects.forEach((subj) => {
    const subjQuestions = state.questions.map((q, idx) => ({ ...q, originalIndex: idx })).filter((q) => q.subject === subj);
    if (subjQuestions.length > 0) {
      const correct = subjQuestions.reduce((acc, q) => {
        const ans = state.answers[q.originalIndex];
        if (q.options) {
          return acc + (ans === q.answer ? 1 : 0);
        } else {
          const isAttempted = ans && (typeof ans === "string" ? ans.trim().length >= 15 : (ans.text && ans.text.trim().length >= 15));
          return acc + (isAttempted ? 1 : 0);
        }
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
    answerReview: state.questions.map((q, index) => {
      const ans = state.answers[index];
      if (q.options) {
        return {
          subject: q.subject,
          question: q.question,
          selectedAnswer: Number.isInteger(ans) ? `${String.fromCharCode(65 + ans)}. ${q.options[ans]}` : null,
          correctAnswer: `${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}`,
          isCorrect: ans === q.answer
        };
      } else {
        const textVal = typeof ans === "string" ? ans : (ans?.text || "Not attempted");
        return {
          subject: q.subject,
          question: q.question,
          selectedAnswer: `[${q.section}] ${textVal}`,
          correctAnswer: "Subjective Evaluation / Model Answer Reviewed",
          isCorrect: textVal.length >= 15
        };
      }
    })
  }, "*");

  resetToOverview();
}

function calculateExamScore() {
  return state.questions.reduce((total, q, index) => {
    const ans = state.answers[index];
    if (q.options) {
      return total + (Number.isInteger(ans) && ans === q.answer ? 1 : 0);
    } else {
      const isAttempted = ans && (typeof ans === "string" ? ans.trim().length >= 15 : (ans.text && ans.text.trim().length >= 15));
      return total + (isAttempted ? 1 : 0);
    }
  }, 0);
}

function renderSubjectTabs() {
  const tabs = examElement("subjectTabs");
  tabs.replaceChildren();

  // Allow switching by Sections or Subjects
  const sections = [...new Set(state.questions.map((q) => q.section || "Section A"))];
  sections.forEach((sec) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "subject-tab";
    button.textContent = sec;
    button.addEventListener("click", () => {
      const firstQ = state.questions.findIndex((q) => (q.section || "Section A") === sec);
      if (firstQ !== -1) {
        state.questionIndex = firstQ;
        renderQuestion();
      }
    });
    tabs.appendChild(button);
  });
}

function updateQuestionCounts() {
  const total = state.questions.length;
  const answered = state.answers.filter((a) => {
    if (a === null) return false;
    if (typeof a === "number") return true;
    if (typeof a === "string") return a.trim().length > 0;
    if (typeof a === "object") return (a.text || "").trim().length > 0;
    return false;
  }).length;
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

function renderQuestionMap(currentSectionQuestions) {
  const map = examElement("questionMap");
  map.replaceChildren();

  let displayIndices = currentSectionQuestions;
  if (state.activeFilter === "answered") {
    displayIndices = currentSectionQuestions.filter((idx) => isAnswerProvided(state.answers[idx]));
  } else if (state.activeFilter === "flagged") {
    displayIndices = currentSectionQuestions.filter((idx) => state.flagged[idx] === true);
  } else if (state.activeFilter === "unattempted") {
    displayIndices = currentSectionQuestions.filter((idx) => !isAnswerProvided(state.answers[idx]));
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
    const localIndex = currentSectionQuestions.indexOf(questionIndex);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "question-map-button";
    button.textContent = String(localIndex + 1);

    const isAnswered = isAnswerProvided(state.answers[questionIndex]);
    const isFlagged = state.flagged[questionIndex] === true;
    const isCurrent = questionIndex === state.questionIndex;

    button.classList.toggle("answered", isAnswered);
    button.classList.toggle("flagged", isFlagged);
    button.classList.toggle("current", isCurrent);

    button.addEventListener("click", () => {
      state.questionIndex = questionIndex;
      renderQuestion();
    });
    map.appendChild(button);
  });
}

function isAnswerProvided(ans) {
  if (ans === null || ans === undefined) return false;
  if (typeof ans === "number") return true;
  if (typeof ans === "string") return ans.trim().length > 0;
  if (typeof ans === "object") return (ans.text || "").trim().length > 0;
  return false;
}

function renderQuestion() {
  const current = state.questions[state.questionIndex];
  if (!current) return;

  const currentSection = current.section || "Section A";
  const sectionQuestions = state.questions.reduce((indices, q, index) => {
    if ((q.section || "Section A") === currentSection) indices.push(index);
    return indices;
  }, []);
  const localIndex = sectionQuestions.indexOf(state.questionIndex);

  examElement("subjectBadge").textContent = `${current.subject} · ${currentSection}`;
  examElement("questionNumber").textContent = `${current.subject} · Question ${localIndex + 1} of ${sectionQuestions.length} (Overall Q${state.questionIndex + 1} of ${state.questions.length})`;
  examElement("timer").textContent = formatTime(state.secondsLeft);

  const answeredCount = state.answers.filter((a) => isAnswerProvided(a)).length;
  examElement("score").textContent = `${answeredCount} / ${state.questions.length}`;
  examElement("questionProgress").style.width = `${(answeredCount / state.questions.length) * 100}%`;

  // Section Badges & Choice Quotas
  const sectionTitle = examElement("sectionTitleText");
  const sectionChoice = examElement("sectionChoiceText");

  let secQuota = "";
  if (currentSection === "Section B") {
    const secBAnswered = state.questions.filter((q, i) => q.section === "Section B" && isAnswerProvided(state.answers[i])).length;
    secQuota = `Attempted: ${secBAnswered} / 6 Short Questions (Attempt any 6 out of 8)`;
    if (sectionTitle) sectionTitle.innerHTML = `<span>📌</span> Section B: Short &amp; Composition Questions (${secQuota})`;
    if (sectionChoice) sectionChoice.textContent = "6 Compulsory · 2 Choice Exempt";
  } else if (currentSection === "Section C") {
    const secCAnswered = state.questions.filter((q, i) => q.section === "Section C" && isAnswerProvided(state.answers[i])).length;
    secQuota = `Attempted: ${secCAnswered} / 2 Long Questions (Attempt any 2 out of 4)`;
    if (sectionTitle) sectionTitle.innerHTML = `<span>📌</span> Section C: Detailed Comprehensive Questions (${secQuota})`;
    if (sectionChoice) sectionChoice.textContent = "2 Compulsory · 2 Choice Exempt";
  } else {
    if (sectionTitle) sectionTitle.innerHTML = `<span>📌</span> Section A: Objective Multiple Choice Questions (20 MCQs)`;
    if (sectionChoice) sectionChoice.textContent = "All Compulsory";
  }

  // Difficulty badge
  const diffClass = (current.difficulty || "medium").toLowerCase();
  const diffLabel = current.difficulty || "Medium";
  const questionTitle = examElement("questionTitle");
  questionTitle.innerHTML = `
    <span class="difficulty-badge ${diffClass}">Difficulty: ${diffLabel}</span>
    <div>${current.question.replace(/\n/g, "<br>")}</div>
  `;

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
    button.classList.toggle("active", button.textContent === currentSection);
  });

  renderQuestionMap(sectionQuestions);
  examElement("previousQuestion").disabled = state.questionIndex === 0;
  examElement("nextQuestion").disabled = state.questionIndex === state.questions.length - 1;

  const optionsContainer = examElement("options");
  optionsContainer.replaceChildren();
  const answerFeedback = examElement("answerFeedback");
  answerFeedback.textContent = "";

  // CASE 1: OBJECTIVE MCQ
  if (current.options) {
    const selectedAnswer = state.answers[state.questionIndex];
    current.options.forEach((optionText, optionIndex) => {
      const button = document.createElement("button");
      button.className = "option";
      button.type = "button";
      button.textContent = `${String.fromCharCode(65 + optionIndex)}. ${optionText}`;
      const isSelected = selectedAnswer === optionIndex;
      button.classList.toggle("selected", isSelected);
      button.disabled = selectedAnswer !== null;
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!state.examActive || state.answers[state.questionIndex] !== null) return;
        state.answers[state.questionIndex] = optionIndex;
        renderQuestion();
      });
      optionsContainer.appendChild(button);
    });
    if (selectedAnswer !== null) {
      answerFeedback.textContent = "Answer locked. You can navigate freely or review other questions.";
    }
  } else {
    // CASE 2: SUBJECTIVE WRITTEN QUESTION (Short, Letter/Essay Choice, Sentences, Long)
    const currentVal = state.answers[state.questionIndex] || (current.type === "choice_writing" ? { choiceIdx: current.defaultChoice || 0, text: "" } : "");
    const textValue = typeof currentVal === "string" ? currentVal : (currentVal.text || "");
    const choiceIdx = typeof currentVal === "object" ? (currentVal.choiceIdx || 0) : 0;

    const subjectiveWrap = document.createElement("div");
    subjectiveWrap.className = "subjective-answer-area";

    if (current.type === "choice_writing" && current.choices) {
      const switchRow = document.createElement("div");
      switchRow.className = "choice-switch-container";
      current.choices.forEach((choiceLabel, idx) => {
        const choiceBtn = document.createElement("button");
        choiceBtn.type = "button";
        choiceBtn.className = `choice-switch-btn ${choiceIdx === idx ? "active" : ""}`;
        choiceBtn.textContent = choiceLabel;
        choiceBtn.addEventListener("click", () => {
          state.answers[state.questionIndex] = { choiceIdx: idx, text: textValue };
          renderQuestion();
        });
        switchRow.appendChild(choiceBtn);
      });
      subjectiveWrap.appendChild(switchRow);
    }

    const textarea = document.createElement("textarea");
    textarea.className = "subjective-textarea";
    textarea.placeholder = current.placeholder || "Type your comprehensive answer here...";
    textarea.value = textValue;
    textarea.addEventListener("input", (e) => {
      const newText = e.target.value;
      if (current.type === "choice_writing") {
        state.answers[state.questionIndex] = { choiceIdx, text: newText };
      } else {
        state.answers[state.questionIndex] = newText;
      }
      updateQuestionCounts();
    });

    subjectiveWrap.appendChild(textarea);
    optionsContainer.appendChild(subjectiveWrap);
    answerFeedback.textContent = "Your response is auto-saved as you type. You can return anytime to edit.";
  }
}

function goToQuestion(direction) {
  const nextIndex = state.questionIndex + direction;
  if (nextIndex < 0 || nextIndex >= state.questions.length) return;
  state.questionIndex = nextIndex;
  renderQuestion();
}

// AI Sentinel Cheating Interceptor
function triggerAiViolation(reason) {
  if (!state.examActive || state.finishing) return;
  state.aiWarningsCount += 1;
  const eye = examElement("aiEyeIndicator");
  if (eye) eye.classList.add("alert");

  if (state.aiWarningsCount >= state.maxAiWarnings) {
    const termReason = `AI Proctor Disqualification: Repeated integrity breaches detected (${state.aiWarningsCount} attempts: ${reason}).`;
    finishExam(termReason, true);
  } else {
    const remaining = state.maxAiWarnings - state.aiWarningsCount;
    const warningText = `🚨 AI PROCTOR SENTINEL ALERT (Warning ${state.aiWarningsCount}/${state.maxAiWarnings}): ${reason}! Restricted shortcuts and window switching are locked. ${remaining} chance left before instant termination!`;
    const banner = examElement("adminWarningBanner");
    const bannerTxt = examElement("adminWarningText");
    if (banner && bannerTxt) {
      bannerTxt.textContent = warningText;
      banner.classList.remove("hidden");
    }
    window.parent.postMessage({
      type: "skilltester:shortcut-attempt",
      key: reason
    }, "*");
  }
}

// AI Chatbot Interface
examElement("aiSentinelBadge")?.addEventListener("click", () => {
  examElement("aiChatDrawer")?.classList.toggle("hidden");
});
examElement("closeAiChatBtn")?.addEventListener("click", () => {
  examElement("aiChatDrawer")?.classList.add("hidden");
});

document.querySelectorAll(".btn-ai-prompt").forEach((btn) => {
  btn.addEventListener("click", () => {
    const promptType = btn.dataset.prompt;
    const body = examElement("aiChatBody");
    if (!body) return;

    let userMsg = "";
    let aiReply = "";

    if (promptType === "time") {
      userMsg = "How much time is left in the exam?";
      aiReply = `You have exactly ${formatTime(state.secondsLeft)} remaining. Pace yourself across sections.`;
    } else if (promptType === "rules") {
      userMsg = "What are the examination rules?";
      aiReply = "Section A has 20 MCQs. Section B requires attempting any 6 out of 8 short questions. Section C requires attempting any 2 out of 4 long questions. Cheating attempts result in immediate disqualification.";
    } else if (promptType === "passing") {
      userMsg = "What is the passing score?";
      aiReply = "Passing score is 50% (50/100 marks). Qualified students receive the VVIP Merit Marksheet & Certificate.";
    } else if (promptType === "help") {
      userMsg = "How do choice questions work?";
      aiReply = "In Section B, you have a choice between Letter vs Essay, and you only need to attempt 6 of the 8 questions total. In Section C, attempt any 2 of the 4 long questions.";
    }

    body.innerHTML += `
      <div class="ai-msg user">${userMsg}</div>
      <div class="ai-msg system"><strong>AI Sentinel:</strong> ${aiReply}</div>
    `;
    body.scrollTop = body.scrollHeight;
  });
});

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

examElement("toggleScratchpadBtn")?.addEventListener("click", () => {
  examElement("scratchpadDrawer").classList.toggle("hidden");
  if (!examElement("scratchpadDrawer").classList.contains("hidden")) {
    examElement("scratchpadText").focus();
  }
});
examElement("closeScratchpadBtn")?.addEventListener("click", () => {
  examElement("scratchpadDrawer").classList.add("hidden");
});
examElement("scratchpadText")?.addEventListener("input", (e) => {
  try {
    sessionStorage.setItem("skilltester_scratchpad", e.target.value);
    const saved = examElement("scratchpadSavedNotice");
    if (saved) saved.style.opacity = "1";
  } catch (err) {}
});
examElement("clearScratchpadBtn")?.addEventListener("click", () => {
  if (examElement("scratchpadText")) examElement("scratchpadText").value = "";
  try { sessionStorage.removeItem("skilltester_scratchpad"); } catch (e) {}
});

examElement("dismissWarningBtn")?.addEventListener("click", () => {
  examElement("adminWarningBanner").classList.add("hidden");
});

examElement("beginCsExamBtn")?.addEventListener("click", () => {
  window.parent.postMessage({ type: "skilltester:begin-exam", exam: "Computer Science Group" }, "*");
});

examElement("beginWebExamBtn")?.addEventListener("click", () => {
  window.parent.postMessage({ type: "skilltester:begin-exam", exam: "All Subjects" }, "*");
});

examElement("previousQuestion").addEventListener("click", () => goToQuestion(-1));
examElement("nextQuestion").addEventListener("click", () => goToQuestion(1));
examElement("finishExamButton").addEventListener("click", () => {
  const unanswered = state.answers.filter((a) => !isAnswerProvided(a)).length;
  let confirmMsg = "Finish and submit your examination?";
  if (unanswered > 0) {
    confirmMsg = `You have ${unanswered} unattempted question(s).\nFinish and submit now?`;
  }
  if (window.confirm(confirmMsg)) finishExam("Exam completed by candidate.");
});

window.addEventListener("message", (event) => {
  if (event.source !== window.parent || !event.data || typeof event.data !== "object") return;
  if (event.data.type === "skilltester:start-exam") {
    startExam(event.data.exam, event.data.durationMinutes);
  }
  if (event.data.type === "skilltester:terminate-exam") {
    finishExam(event.data.reason, true);
  }
  if (event.data.type === "skilltester:reset-overview") {
    resetToOverview();
  }
  if (event.data.type === "skilltester:admin-warning") {
    const banner = examElement("adminWarningBanner");
    const text = examElement("adminWarningText");
    if (banner && text) {
      text.textContent = event.data.warning || "Please maintain full focus on the exam arena.";
      banner.classList.remove("hidden");
    }
  }
});

// Anti-Cheat & Keyboard guard inside iframe
const blockKeyboard = (event) => {
  if (!state.examActive) return;

  const key = event.key || "";
  const isEscape = key === "Escape" || key === "Esc" || event.keyCode === 27;
  const isPrintScreen = key === "PrintScreen" || event.keyCode === 44;
  const isFKey = /^F\d+$/.test(key) || (event.keyCode >= 112 && event.keyCode <= 123);
  const isAltCombo = event.altKey;
  const isMetaKey = event.metaKey;
  const isDangerousCtrl = event.ctrlKey && ["u", "s", "p", "r", "w", "i", "j", "c", "v"].includes(key.toLowerCase());

  if (isEscape || isPrintScreen || isFKey || isAltCombo || isMetaKey || isDangerousCtrl) {
    event.preventDefault();
    event.stopPropagation();
    const violation = isEscape ? "Escape" : isAltCombo ? "Alt+Shortcut" : isMetaKey ? "Windows Key" : isPrintScreen ? "Screenshot" : `Ctrl+${key}`;
    triggerAiViolation(violation);
    return false;
  }

  // Allow normal typing inside subjective answer textareas or scratchpad
  if (event.target && (event.target.tagName === "TEXTAREA" || event.target.tagName === "INPUT")) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  return false;
};
document.addEventListener("keydown", blockKeyboard, true);

// Mouse non-left click block
document.addEventListener("mousedown", (e) => {
  if (e.button !== 0) {
    e.preventDefault();
    e.stopPropagation();
    if (state.examActive) {
      triggerAiViolation("Right-Click / Aux Click attempt");
    }
    return false;
  }
}, true);
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (state.examActive) {
    triggerAiViolation("Right-Click context menu attempt");
  }
  return false;
}, true);

// Window blur inside iframe
window.addEventListener("blur", () => {
  if (state.examActive && !state.finishing) {
    triggerAiViolation("Focus lost / Window switched");
  }
});
