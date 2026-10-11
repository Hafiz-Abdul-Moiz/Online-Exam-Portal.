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

  // 4. WEB DEVELOPMENT TRACK QUESTION POOL (150 MCQs Total: 50 HTML5 + 50 CSS3 + 50 JavaScript)
  // Each student receives 60 randomly drawn MCQs (exactly 20 HTML5 + 20 CSS3 + 20 JavaScript).
  const webDevPool = [
    // ==========================================
    // --- HTML5 POOL (50 QUESTIONS: 41 Single + 9 Multi) ---
    // ==========================================
    // Aptech Learning Book Questions 1 - 25 (Single Select)
    { subject: "HTML5", section: "HTML5", difficulty: "Easy", question: "What does HTML stand for?", options: ["Hyperlinks and Text Markup Language", "Home Tool Markup Language", "High Tech Modern Language", "Hyper Text Markup Language"], answer: 3 },
    { subject: "HTML5", section: "HTML5", difficulty: "Easy", question: "Which element is used for the largest (most important) heading?", options: ["<h1>", "<head>", "<heading>", "<h6>"], answer: 0 },
    { subject: "HTML5", section: "HTML5", difficulty: "Easy", question: "Which tag is used to create a hyperlink?", options: ["<a>", "<link>", "<href>", "<url>"], answer: 0 },
    { subject: "HTML5", section: "HTML5", difficulty: "Easy", question: "Which attribute specifies the file path of an image in the <img> tag?", options: ["link", "alt", "src", "href"], answer: 2 },
    { subject: "HTML5", section: "HTML5", difficulty: "Easy", question: "Which is the correct HTML5 document type declaration?", options: ["<!HTML5>", "<doctype html5>", "<!DOCTYPE HTML5>", "<!DOCTYPE html>"], answer: 3 },
    { subject: "HTML5", section: "HTML5", difficulty: "Easy", question: "Which tag inserts a single line break?", options: ["<break>", "<lb>", "<br>", "<newline>"], answer: 2 },
    { subject: "HTML5", section: "HTML5", difficulty: "Easy", question: "Which semantic element is meant for a set of navigation links?", options: ["<links>", "<navigate>", "<nav>", "<menu-bar>"], answer: 2 },
    { subject: "HTML5", section: "HTML5", difficulty: "Easy", question: "Which tag defines an unordered (bulleted) list?", options: ["<ul>", "<list>", "<ol>", "<li>"], answer: 0 },
    { subject: "HTML5", section: "HTML5", difficulty: "Easy", question: "Which input type is used for email addresses in HTML5?", options: ["type='mail'", "type='email'", "type='text-email'", "type='address'"], answer: 1 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which HTML5 element embeds a video without any plugin?", options: ["<embed-video>", "<movie>", "<video>", "<media>"], answer: 2 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which attribute forces a user to fill an input before submitting a form?", options: ["needed", "required", "mandatory", "validate"], answer: 1 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which element provides a drawing surface that is controlled with JavaScript?", options: ["<svg-draw>", "<graphic>", "<canvas>", "<paint>"], answer: 2 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which tag defines a table row?", options: ["<tr>", "<row>", "<td>", "<th>"], answer: 0 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which element represents the footer of a page or section?", options: ["<end>", "<foot>", "<bottom>", "<footer>"], answer: 3 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which attribute gives alternative text for an image?", options: ["desc", "caption", "title-text", "alt"], answer: 3 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which element is used for independent, self-contained content such as a blog post?", options: ["<article>", "<post>", "<content>", "<blog>"], answer: 0 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which element holds the main, unique content of a page?", options: ["<main>", "<primary>", "<body-content>", "<central>"], answer: 0 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which tag is used to create an HTML form?", options: ["<input-form>", "<submit>", "<fieldset-form>", "<form>"], answer: 3 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which attribute opens a link in a new browser tab?", options: ["href='_blank'", "open='new'", "target='_blank'", "target='_new-tab'"], answer: 2 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which tag defines a table header cell?", options: ["<hd>", "<th>", "<thead-cell>", "<tc>"], answer: 1 },
    { subject: "HTML5", section: "HTML5", difficulty: "Hard", question: "Which attribute merges a table cell across multiple columns?", options: ["rowspan", "colmerge", "colspan", "cellspan"], answer: 2 },
    { subject: "HTML5", section: "HTML5", difficulty: "Hard", question: "Which element sets the text shown on the browser tab?", options: ["<title>", "<header>", "<tab>", "<caption>"], answer: 0 },
    { subject: "HTML5", section: "HTML5", difficulty: "Hard", question: "Which element is a generic inline container with no semantic meaning?", options: ["<span>", "<section>", "<inline>", "<div>"], answer: 0 },
    { subject: "HTML5", section: "HTML5", difficulty: "Hard", question: "Which HTML5 input type shows a date picker?", options: ["type='date'", "type='calendar'", "type='day'", "type='datetime-text'"], answer: 0 },
    { subject: "HTML5", section: "HTML5", difficulty: "Hard", question: "Which tag embeds sound content in HTML5?", options: ["<mp3>", "<audio>", "<sound>", "<music>"], answer: 1 },
    // Aptech Learning Book Questions 26 - 30 (Multi-Select)
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "[Multi-Select]: Which TWO of the following are semantic elements in HTML5?", options: ["<span>", "<header>", "<footer>", "<div>"], answers: [1, 2], isMultiSelect: true },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "[Multi-Select]: Which TWO of the following are valid values of the <input> type attribute?", options: ["textarea", "color", "paragraph", "range"], answers: [1, 3], isMultiSelect: true },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "[Multi-Select]: Which TWO of the following are block-level elements by default?", options: ["<em>", "<div>", "<p>", "<b>"], answers: [1, 2], isMultiSelect: true },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "[Multi-Select]: Which TWO of the following tags are used to embed multimedia?", options: ["<audio>", "<video>", "<li>", "<table>"], answers: [0, 1], isMultiSelect: true },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "[Multi-Select]: Which TWO of the following are valid attributes of the <img> tag?", options: ["src", "alt", "rel", "target"], answers: [0, 1], isMultiSelect: true },
    // Core Technical HTML5 Set (20 MCQs)
    { subject: "HTML5", section: "HTML5", difficulty: "Easy", question: "Which HTML5 element is used to define primary navigation links on a web page?", options: ["<navigate>", "<nav>", "<menu>", "<links>"], answer: 1 },
    { subject: "HTML5", section: "HTML5", difficulty: "Easy", question: "Which attribute provides descriptive alternate text for an image when it cannot be loaded?", options: ["title", "alt", "src", "caption"], answer: 1 },
    { subject: "HTML5", section: "HTML5", difficulty: "Easy", question: "What is the standard, modern HTML5 document type declaration?", options: ["<!DOCTYPE html>", "<!DOCTYPE HTML5>", "<!DOCTYPE html PUBLIC>", "<document type='html'>"], answer: 0 },
    { subject: "HTML5", section: "HTML5", difficulty: "Easy", question: "Which HTML5 input type automatically validates an email format prior to submission?", options: ["type='text'", "type='mail'", "type='email'", "type='check-email'"], answer: 2 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "[Multi-Select]: Which TWO of the following are valid HTML5 semantic block layout elements?", options: ["<article>", "<span>", "<section>", "<font>"], answers: [0, 2], isMultiSelect: true },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which HTML5 element is used to render 2D graphics and dynamic visual scripts via JavaScript?", options: ["<svg>", "<canvas>", "<graphic>", "<bitmap>"], answer: 1 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which boolean attribute specifies that an input field must be filled out before submitting the form?", options: ["validate", "must", "required", "mandatory"], answer: 2 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which native HTML5 element embeds audio files without requiring external Flash plugins?", options: ["<sound>", "<audio>", "<music>", "<media>"], answer: 1 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "In an HTML data table, which tag represents a standard data cell?", options: ["<tr>", "<th>", "<td>", "<cell>"], answer: 2 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "[Multi-Select]: Which TWO attributes are native to the HTML5 <video> element for media control?", options: ["controls", "autoplay", "stream", "run"], answers: [0, 1], isMultiSelect: true },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which element inside <head> specifies page metadata such as character encoding and viewport?", options: ["<data>", "<meta>", "<link>", "<header>"], answer: 1 },
    { subject: "HTML5", section: "HTML5", difficulty: "Medium", question: "Which HTML5 element represents self-contained illustrative content, optionally paired with <figcaption>?", options: ["<figure>", "<picture>", "<aside>", "<section>"], answer: 0 },
    { subject: "HTML5", section: "HTML5", difficulty: "Hard", question: "What is the primary role of the <picture> element in responsive web development?", options: ["To draw vector diagrams", "To serve multiple source image resolutions based on media queries", "To apply CSS filter effects", "To compress PNG uploads"], answer: 1 },
    { subject: "HTML5", section: "HTML5", difficulty: "Hard", question: "Which attribute supplies an accessible label for screen readers when visible text is missing?", options: ["tabindex", "aria-label", "role='hidden'", "alt-text"], answer: 1 },
    { subject: "HTML5", section: "HTML5", difficulty: "Hard", question: "[Multi-Select]: Which TWO storage interfaces are part of the standard HTML5 Web Storage API?", options: ["localStorage", "sessionStorage", "cloudStorage", "indexedCookie"], answers: [0, 1], isMultiSelect: true },
    { subject: "HTML5", section: "HTML5", difficulty: "Hard", question: "What security safeguard is enforced by applying the 'sandbox' attribute on an <iframe>?", options: ["Accelerates GPU acceleration", "Restricts scripts, form submission, and popups by default", "Enables cross-origin cookies", "Caches iframe content offline"], answer: 1 },
    { subject: "HTML5", section: "HTML5", difficulty: "Hard", question: "Which HTML5 element holds inert client-side template markup that is not rendered until instantiated via script?", options: ["<script type='template'>", "<template>", "<slot>", "<hidden>"], answer: 1 },
    { subject: "HTML5", section: "HTML5", difficulty: "Hard", question: "Which form input attribute checks the field value against a specified regular expression?", options: ["regex", "pattern", "validate", "match"], answer: 1 },
    { subject: "HTML5", section: "HTML5", difficulty: "Hard", question: "Which attribute downloads an external script asynchronously and runs it immediately once available without pausing parser?", options: ["defer", "async", "preload", "nowait"], answer: 1 },
    { subject: "HTML5", section: "HTML5", difficulty: "Hard", question: "[Multi-Select]: Which TWO tags are valid option grouping elements inside form dropdowns and datalists?", options: ["<option>", "<optgroup>", "<choice>", "<item>"], answers: [0, 1], isMultiSelect: true },

    // ==========================================
    // --- CSS3 POOL (50 QUESTIONS: 41 Single + 9 Multi) ---
    // ==========================================
    // Aptech Learning Book Questions 31 - 55 (Single Select)
    { subject: "CSS3", section: "CSS3", difficulty: "Easy", question: "What does CSS stand for?", options: ["Creative Style System", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Easy", question: "Which property changes the color of text?", options: ["color", "fg-color", "text-color", "font-color"], answer: 0 },
    { subject: "CSS3", section: "CSS3", difficulty: "Easy", question: "Which property sets the background color of an element?", options: ["background-style", "color-bg", "bgcolor", "background-color"], answer: 3 },
    { subject: "CSS3", section: "CSS3", difficulty: "Easy", question: "Which selector selects the element having id='main'?", options: ["*main", ".main", "#main", ""], answer: 2 },
    { subject: "CSS3", section: "CSS3", difficulty: "Easy", question: "Which selector selects all elements with class='box'?", options: ["*box", "#box", ".box", "&box"], answer: 2 },
    { subject: "CSS3", section: "CSS3", difficulty: "Easy", question: "Which property changes the size of text?", options: ["font-style", "font-size", "text-size", "size-font"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Easy", question: "Which property creates space INSIDE an element, between content and border?", options: ["padding", "outline", "border-spacing", "margin"], answer: 0 },
    { subject: "CSS3", section: "CSS3", difficulty: "Easy", question: "Which property creates space OUTSIDE the border of an element?", options: ["outline", "margin", "spacing", "padding"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "Which declaration turns an element into a flex container?", options: ["flex: container", "display: flexbox", "layout: flex", "display: flex"], answer: 3 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "Which flexbox property sets the direction of the main axis?", options: ["flex-align", "flex-axis", "flex-order", "flex-direction"], answer: 3 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "Which property aligns flex items along the MAIN axis?", options: ["flex-justify", "justify-axis", "justify-content", "align-content"], answer: 2 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "Which declaration creates a CSS Grid container?", options: ["display: grid", "display: table-grid", "layout: grid", "grid: on"], answer: 0 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "Which property defines the columns of a CSS Grid?", options: ["grid-column-count", "columns-grid", "grid-template-columns", "grid-columns"], answer: 2 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "Which property gives an element rounded corners?", options: ["corner-radius", "border-radius", "border-round", "radius"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "Which property adds a shadow around an element's box?", options: ["element-shadow", "box-shadow", "border-shadow", "shadow-box"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "Which unit is relative to the font size of the root (html) element?", options: ["pt", "em", "rem", "px"], answer: 2 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "Which at-rule is used to apply styles based on screen width (responsive design)?", options: ["@screen-size", "@viewport-width", "@media", "@responsive"], answer: 2 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "Which property controls the stacking order of positioned elements?", options: ["layer", "z-index", "stack-order", "order-z"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "Which position value places an element relative to its nearest positioned ancestor?", options: ["inline", "absolute", "sticky-parent", "static"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "Which property sets how long a CSS transition takes?", options: ["transition-time", "duration-transition", "animation-time", "transition-duration"], answer: 3 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "Which at-rule defines the steps of a CSS animation?", options: ["@motion", "@frames", "@animate", "@keyframes"], answer: 3 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "Which pseudo-class styles an element when the mouse pointer is over it?", options: [":over", ":mouse", ":pointer", ":hover"], answer: 3 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "Which property aligns text horizontally inside an element?", options: ["text-align", "font-align", "text-position", "align-text"], answer: 0 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "Which property sets the thickness of an element's border?", options: ["border-thickness", "border-width", "border-size", "outline-size"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "Which overflow value shows scrollbars only when the content is too big?", options: ["visible", "auto", "hidden", "clip-scroll"], answer: 1 },
    // Aptech Learning Book Questions 56 - 60 (Multi-Select)
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "[Multi-Select]: Which TWO of the following are valid CSS length units?", options: ["italic", "rem", "bold", "vh"], answers: [1, 3], isMultiSelect: true },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "[Multi-Select]: Which TWO values of the display property create a modern layout container?", options: ["flex", "grid", "round", "circle"], answers: [0, 1], isMultiSelect: true },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "[Multi-Select]: Which TWO of the following are CSS pseudo-classes?", options: [":first-child", ":hover", "::before", "::first-line"], answers: [0, 1], isMultiSelect: true },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "[Multi-Select]: Which TWO declarations hide an element on the page?", options: ["visibility: gone", "visibility: hidden", "display: show", "display: none"], answers: [1, 3], isMultiSelect: true },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "[Multi-Select]: Which TWO are valid ways to apply CSS to an HTML page?", options: ["External stylesheet using <link>", "Using a <css> tag", "Using a <design> attribute", "Inline style attribute"], answers: [0, 3], isMultiSelect: true },
    // Core Technical CSS3 Set (20 MCQs)
    { subject: "CSS3", section: "CSS3", difficulty: "Easy", question: "Which CSS property changes the background color of an element?", options: ["color", "background-color", "surface", "bgcolor"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Easy", question: "Which unit in CSS is relative to the font-size of the root <html> element?", options: ["em", "rem", "px", "%"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Easy", question: "Which display value establishes a Flexbox formatting context for a container?", options: ["display: block", "display: flex", "display: grid", "display: inline"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Easy", question: "Which CSS property is used to round the outer borders of an element?", options: ["corner-radius", "border-radius", "border-curve", "edge-round"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "[Multi-Select]: Which TWO properties align Flexbox items along the Main Axis and Cross Axis respectively?", options: ["justify-content", "align-items", "text-align", "float"], answers: [0, 1], isMultiSelect: true },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "In the CSS Box Model, what is the interior clearance space between the content boundary and the border?", options: ["Margin", "Padding", "Outline", "Gap"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "What does setting 'box-sizing: border-box' achieve?", options: ["Excludes padding from dimensions", "Includes padding and border within the element's total declared width and height", "Applies a 3D drop-shadow", "Centers content automatically"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "Which CSS property specifies the 3D stacking order of positioned elements along the z-axis?", options: ["layer-index", "z-index", "stack-order", "elevation"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "Which CSS Grid property creates three equal-width flexible columns?", options: ["grid-columns: 3", "grid-template-columns: repeat(3, 1fr)", "columns: 3 1fr", "grid-layout: 3fr"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "[Multi-Select]: Which TWO position values remove an element completely from normal document layout flow?", options: ["absolute", "fixed", "relative", "static"], answers: [0, 1], isMultiSelect: true },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "Which CSS property enables smooth property value transitions over a specified duration?", options: ["animation", "transition", "transform", "motion"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Medium", question: "Which CSS pseudo-class targets an element when the user points their mouse cursor over it?", options: [":active", ":hover", ":focus", ":visited"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "What is the correct CSS selector specificity order from highest to lowest priority?", options: ["Inline style > ID > Class/Pseudo-class > Element", "ID > Inline style > Element > Class", "Element > Class > ID > Inline style", "Class > ID > Inline style > Element"], answer: 0 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "Which at-rule enables conditional styles for responsive web layouts based on viewport width?", options: ["@viewport", "@media", "@supports", "@responsive"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "[Multi-Select]: Which TWO pseudo-elements insert generated decorative content before and after an element?", options: ["::before", "::after", "::first-child", "::inside"], answers: [0, 1], isMultiSelect: true },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "Which CSS math function clamps an expression between an absolute minimum, preferred, and maximum value?", options: ["minmax()", "clamp()", "bound()", "calc()"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "Which CSS at-rule defines keyframe animation sequences and keyframe stages?", options: ["@animate", "@keyframes", "@frames", "@motion"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "How does 'opacity: 0' differ fundamentally from 'display: none'?", options: ["It removes the element from DOM layout", "The element remains in layout and still captures pointer events unless pointer-events: none is set", "It hides the element without rendering", "It deletes child nodes"], answer: 1 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "Which CSS property prevents the candidate from selecting text highlighting across a container?", options: ["user-select: none", "pointer-events: none", "cursor: default", "text-decoration: none"], answer: 0 },
    { subject: "CSS3", section: "CSS3", difficulty: "Hard", question: "[Multi-Select]: Which TWO CSS transform functions allow 2D spatial modifications (rotation and translation)?", options: ["rotate()", "translate()", "colorize()", "filter()"], answers: [0, 1], isMultiSelect: true },

    // ==========================================
    // --- JAVASCRIPT POOL (50 QUESTIONS: 41 Single + 9 Multi) ---
    // ==========================================
    // Aptech Learning Book Questions 61 - 85 (Single Select)
    { subject: "JavaScript", section: "JavaScript", difficulty: "Easy", question: "Which keyword declares a block-scoped variable whose value can be reassigned?", options: ["const", "define", "var", "let"], answer: 3 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Easy", question: "Which keyword declares a variable that cannot be reassigned?", options: ["final", "const", "static", "fixed"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Easy", question: "Which statement prints a message to the browser console?", options: ["print.console()", "console.log()", "log.console()", "window.print()"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Easy", question: "Which operator checks BOTH value and data type?", options: ["!=", "===", "=", "=="], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Easy", question: "Which is the correct way to write a function in JavaScript?", options: ["fun myFunc() {}", "func myFunc() {}", "function myFunc() {}", "def myFunc() {}"], answer: 2 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Easy", question: "Which array method adds an element to the END of an array?", options: ["push()", "shift()", "pop()", "unshift()"], answer: 0 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Easy", question: "Which array method removes the LAST element of an array?", options: ["shift()", "push()", "pop()", "slice()"], answer: 2 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Easy", question: "Which property returns the number of characters in a string?", options: ["len", "size", "length", "count"], answer: 2 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "What does typeof null return in JavaScript?", options: ["'object'", "'undefined'", "'number'", "'null'"], answer: 0 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "Which method converts a JSON string into a JavaScript object?", options: ["JSON.parse()", "JSON.object()", "JSON.stringify()", "JSON.decode()"], answer: 0 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "Which method selects an HTML element by its id?", options: ["document.queryId()", "document.getElement()", "document.getElementById()", "document.findById()"], answer: 2 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "Which event fires when a user clicks an element?", options: ["onhit", "onclick", "onpress", "ontap"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "Which method attaches an event handler to an element?", options: ["addListener()", "listenEvent()", "addEventListener()", "onEvent()"], answer: 2 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "Which is the correct syntax for a single-line comment?", options: ["** comment", "# comment", "// comment", "<!-- comment -->"], answer: 2 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "Which loop always runs at least once?", options: ["do...while", "for", "while", "for...in"], answer: 0 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "What is the result of 5 + '5' in JavaScript?", options: ["10", "'55' (string)", "NaN", "5.5"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "Which function converts a string into an integer?", options: ["intval()", "Number.int()", "toInteger()", "parseInt()"], answer: 3 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "Which is the correct syntax of an arrow function that adds two numbers?", options: ["a, b -> a + b", "(a, b) => a + b", "function => (a, b)", "(a, b) -> a + b"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "Which method returns the FIRST element that matches a CSS selector?", options: ["document.getSelector()", "document.queryAll()", "document.select()", "document.querySelector()"], answer: 3 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "Which array method creates a NEW array by transforming every element?", options: ["map()", "splice()", "push()", "forEach()"], answer: 0 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "What does NaN stand for?", options: ["No assigned Number", "Not a Number", "New array Notation", "Null and None"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "Which statement is used to handle runtime errors?", options: ["handle...error", "check...catch", "try...except", "try...catch"], answer: 3 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "Which storage keeps data even after the browser is closed?", options: ["sessionStorage", "document.title", "localStorage", "window.status"], answer: 2 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "Inside an async function, which keyword pauses execution until a Promise settles?", options: ["stop", "wait", "yield", "await"], answer: 3 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "Which string method removes whitespace from both ends?", options: ["cut()", "strip()", "clean()", "trim()"], answer: 3 },
    // Aptech Learning Book Questions 86 - 90 (Multi-Select)
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "[Multi-Select]: Which TWO of the following are primitive data types in JavaScript?", options: ["boolean", "string", "object", "array"], answers: [0, 1], isMultiSelect: true },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "[Multi-Select]: Which TWO array methods are used to loop over the elements of an array?", options: ["push()", "forEach()", "map()", "pop()"], answers: [1, 2], isMultiSelect: true },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "[Multi-Select]: Which TWO keywords create block-scoped variables?", options: ["int", "let", "const", "var"], answers: [1, 2], isMultiSelect: true },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "[Multi-Select]: Which TWO of the following values are falsy in JavaScript?", options: ["[] (empty array)", "'0' (string)", "'' (empty string)", "0"], answers: [2, 3], isMultiSelect: true },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "[Multi-Select]: Which TWO methods select elements from the DOM?", options: ["document.querySelector()", "document.selectAll()", "document.getElementsByClassName()", "document.findElement()"], answers: [0, 2], isMultiSelect: true },
    // Core Technical JavaScript Set (20 MCQs)
    { subject: "JavaScript", section: "JavaScript", difficulty: "Easy", question: "Which keyword declares a block-scoped reassignable variable in modern ES6?", options: ["var", "let", "const", "static"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Easy", question: "What is the return value of the expression 'typeof null' in standard JavaScript?", options: ["'null'", "'undefined'", "'object'", "'boolean'"], answer: 2 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Easy", question: "Which operator tests strict equality between values without automatic type conversion?", options: ["==", "===", "!=", "="], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Easy", question: "Which native JSON method parses a valid JSON string into a JavaScript object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "JSON.decode()"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "[Multi-Select]: Which TWO Array methods do NOT mutate the original array and return a newly transformed array?", options: ["map()", "filter()", "push()", "splice()"], answers: [0, 1], isMultiSelect: true },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "What does the spread operator (...) do in an array literal such as [...arr1, ...arr2]?", options: ["Multiplies array elements", "Unpacks/expands iterable elements into individual items", "Converts the arrays into strings", "Sorts the arrays"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "What will '0.1 + 0.2 === 0.3' evaluate to in JavaScript due to IEEE 754 floating point arithmetic?", options: ["true", "false", "undefined", "NaN"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "Which ES6 function syntax provides concise syntax and lexically binds 'this' from surrounding scope?", options: ["Generator function", "Arrow function (() => {})", "Async function", "Constructor function"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "What is a Closure in JavaScript?", options: ["A fatal browser crash", "A function bundled together with references to its surrounding lexical environment", "A closed modal window", "A private class keyword"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "[Multi-Select]: Which TWO states are valid states of a JavaScript Promise lifecycle?", options: ["Pending (initial state)", "Fulfilled / Resolved", "Paused", "Archived"], answers: [0, 1], isMultiSelect: true },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "What is the primary benefit of ES8 async/await syntax over raw Promise .then() chains?", options: ["Executes code on multiple threads", "Allows writing asynchronous code in a clean, synchronous-looking style with try/catch", "Removes browser event loop", "Eliminates network latency"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Medium", question: "Which DOM method registers an event listener without removing previously attached handlers?", options: ["element.onclick = fn", "element.addEventListener('click', fn)", "element.attach('click', fn)", "element.listen('click', fn)"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "In the JavaScript Event Loop, which queue executes FIRST after the current synchronous script: Microtask queue or Macrotask queue?", options: ["Macrotask queue (setTimeout, setInterval)", "Microtask queue (Promise callbacks, queueMicrotask)", "Both execute simultaneously", "Determined randomly"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "How does variable hoisting operate for 'let' and 'const' declarations?", options: ["They are hoisted and initialized to undefined", "They are hoisted but reside in the Temporal Dead Zone (TDZ) until evaluation", "They are never hoisted at all", "They attach directly to window"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "[Multi-Select]: Which TWO primitive data types were introduced in modern ECMAScript standards (ES6+)?", options: ["Symbol", "BigInt", "Float", "Char"], answers: [0, 1], isMultiSelect: true },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "What does 'Object.freeze(obj)' accomplish on a target JavaScript object?", options: ["Prevents adding, removing, or modifying existing properties on the object (shallow freeze)", "Encrypts the object in memory", "Recursively deep freezes nested sub-objects", "Deletes undefined keys"], answer: 0 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "Which Object method returns an array of an object's own enumerable string-keyed [key, value] pairs?", options: ["Object.keys()", "Object.values()", "Object.entries()", "Object.pairs()"], answer: 2 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "What does the Optional Chaining operator (?.) do when a property reference is null or undefined?", options: ["Throws a TypeError immediately", "Short-circuits and safely returns undefined without throwing an exception", "Substitutes an empty string", "Logs a browser warning"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "Which method prevents an event from bubbling further up through ancestor DOM nodes?", options: ["event.preventDefault()", "event.stopPropagation()", "event.stopImmediate()", "event.cancel()"], answer: 1 },
    { subject: "JavaScript", section: "JavaScript", difficulty: "Hard", question: "[Multi-Select]: Which TWO keywords are used in standard ES6 Modules for sharing and importing code?", options: ["import", "export", "require", "module.exports"], answers: [0, 1], isMultiSelect: true }
  ];

  // Default webDevQuestions is the full 150 pool (subset generation happens per candidate in startExam)
  const webDevQuestions = webDevPool;
  // 5. DEDICATED SINGLE-SUBJECT EXAM: ENGLISH SPECIAL PAPER (27 Questions: 15 MCQs + 8 Short + 4 Long)
  const englishExam = [
    // Section A: 15 MCQs
    { subject: "English", section: "Section A", difficulty: "Easy", question: "Identify the part of speech of 'swiftly' in: 'The developer typed swiftly.'", options: ["Adjective", "Adverb", "Conjunction", "Noun"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Easy", question: "Which word is an abstract noun?", options: ["Computer", "Keyboard", "Wisdom", "Screen"], answer: 2 },
    { subject: "English", section: "Section A", difficulty: "Easy", question: "Choose the correct article: 'She is _____ honorable controller of the board.'", options: ["a", "an", "the", "no article"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Medium", question: "Choose the correct relative pronoun: 'This is the programmer _____ solved the bug.'", options: ["which", "who", "whom", "whose"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Medium", question: "What is the passive voice of: 'Ali wrote an elegant algorithm.'", options: ["An elegant algorithm wrote Ali", "An elegant algorithm was written by Ali", "An elegant algorithm has been written", "Ali was written by an algorithm"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Medium", question: "Identify the clause in: 'Although the exam was challenging, he passed.'", options: ["Noun clause", "Adverbial clause of concession", "Adjective clause", "Independent phrase"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Medium", question: "Select the synonym of 'Meticulous':", options: ["Careless", "Careful & Highly Precise", "Hesitant", "Slow"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Medium", question: "Choose the correct preposition: 'He is proficient _____ web engineering.'", options: ["with", "at", "in", "for"], answer: 2 },
    { subject: "English", section: "Section A", difficulty: "Medium", question: "Which sentence displays correct subject-verb agreement?", options: ["The list of items were verified.", "The list of items was verified.", "The list of items are verified.", "The list of items being verified."], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Hard", question: "Identify the correct conditional sentence (Type 3):", options: ["If he works hard, he will pass.", "If he worked hard, he would pass.", "If he had worked hard, he would have passed.", "If he had work hard, he passed."], answer: 2 },
    { subject: "English", section: "Section A", difficulty: "Hard", question: "The idiom 'To burn the midnight oil' means:", options: ["To waste expensive fuel", "To study or work diligently late into the night", "To initiate a heated debate", "To take an uncalculated risk"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Hard", question: "Select the direct antonym of the word 'Obsolete':", options: ["Ancient", "Current & Modern", "Outdated", "Traditional"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Hard", question: "Which of the following words is spelled correctly?", options: ["Definately", "Definitely", "Definetly", "Defanitely"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Hard", question: "Identify the figure of speech in: 'The firewall stood as a silent guardian against invaders.'", options: ["Simile", "Metaphor", "Hyperbole", "Oxymoron"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Hard", question: "Convert to indirect speech: The teacher said, 'Be honest.'", options: ["The teacher told to be honest.", "The teacher advised the students to be honest.", "The teacher says be honest.", "The teacher had said be honest."], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Hard", question: "Choose the correct preposition: 'She has been studying in this institute _____ three years.'", options: ["since", "for", "from", "during"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Hard", question: "Identify the tense in: 'By next December, we will have graduated from college.'", options: ["Future Continuous", "Future Perfect", "Future Simple", "Present Perfect"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Hard", question: "Which word is an antonym for 'Vague'?", options: ["Ambiguous", "Precise & Clear", "Cloudy", "Dull"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Hard", question: "Select the correct punctuation mark used to introduce a formal list or explanation:", options: ["Semicolon", "Colon", "Hyphen", "Comma"], answer: 1 },
    { subject: "English", section: "Section A", difficulty: "Hard", question: "Identify the gerund in: 'Mastering algorithmic problem solving requires persistent daily practice.'", options: ["Mastering", "Requires", "Practice", "Solving"], answer: 0 },

    // Section B: 8 Short Questions (Grammar, Sentences, Narration, Voice - Attempt any 5)
    { subject: "English", section: "Section B", difficulty: "Easy", type: "short", question: "Q1 [Narration & Indirect Speech]: Convert the following into Indirect Speech:\n(a) The proctor said to the student, 'Submit your paper immediately.'\n(b) Ahmad said, 'I have completed my program.'\n(c) The teacher said, 'The sun rises in the east.'", placeholder: "(a) Indirect Speech: ...\n(b) Indirect Speech: ...\n(c) Indirect Speech: ..." },
    { subject: "English", section: "Section B", difficulty: "Easy", type: "short", question: "Q2 [Active & Passive Voice]: Convert into Passive Voice:\n(a) The software engineer debugged the critical application.\n(b) Students are preparing their final projects.\n(c) Who organized the technical seminar?", placeholder: "(a) Passive Voice: ...\n(b) Passive Voice: ...\n(c) Passive Voice: ..." },
    { subject: "English", section: "Section B", difficulty: "Medium", type: "sentence_making", question: "Q3 [Sentence Construction - Cybersecurity & Tech]: Construct 5 meaningful, grammatically sound sentences using each of these 5 keywords:\n1. Algorithm\n2. Firewall\n3. Innovation\n4. Encryption\n5. Integrity", placeholder: "1. Algorithm: ...\n2. Firewall: ...\n3. Innovation: ...\n4. Encryption: ...\n5. Integrity: ..." },
    { subject: "English", section: "Section B", difficulty: "Medium", type: "short", question: "Q4 [Grammatical Error Correction]: Correct the grammatical errors in these 3 sentences:\n(a) Each of the candidates have brought their admit card.\n(b) She is senior than me in computer programming.\n(c) Neither the teacher nor the students was present in the lab.", placeholder: "(a) Corrected: ...\n(b) Corrected: ...\n(c) Corrected: ..." },
    { subject: "English", section: "Section B", difficulty: "Medium", type: "short", question: "Q5 [Idiomatic Phrasal Usage]: Use the following 3 idioms in meaningful contextual sentences:\n(a) Break the ice\n(b) Through thick and thin\n(c) A piece of cake", placeholder: "(a) Break the ice: ...\n(b) Through thick and thin: ...\n(c) A piece of cake: ..." },
    { subject: "English", section: "Section B", difficulty: "Hard", type: "short", question: "Q6 [Conditional Sentences]: Complete each conditional sentence according to its grammatical type:\n(a) Type 1 (Real): If you practice coding every day, ...\n(b) Type 2 (Hypothetical): If I had unlimited computational power, ...\n(c) Type 3 (Past Unreal): If they had tested the security system, ...", placeholder: "(a) Type 1: ...\n(b) Type 2: ...\n(c) Type 3: ..." },
    { subject: "English", section: "Section B", difficulty: "Hard", type: "short", question: "Q7 [Punctuation & Capitalization]: Punctuate and capitalize the following unpunctuated passage properly:\n'on monday morning dr ahmed arrived at the karachi institute of technology he asked the students are you ready for the skilltester certification'", placeholder: "Punctuated Passage:\n..." },
    { subject: "English", section: "Section B", difficulty: "Hard", type: "short", question: "Q8 [Vocabulary & Contextual Analysis]: Provide the contextual meaning and one antonym for each of the following academic words:\n(a) Diligent\n(b) Hostile\n(c) Authentic", placeholder: "(a) Diligent - Meaning: ... | Antonym: ...\n(b) Hostile - Meaning: ... | Antonym: ...\n(c) Authentic - Meaning: ... | Antonym: ..." },

    // Section C: 4 Long Questions (Attempt any 2)
    { subject: "English", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q1 [Formal Application to College Principal - 10 Marks]:\nWrite a formal application to your College Principal requesting 4 days medical leave of absence due to high viral fever. You must include:\n1. Formal Salutation & Address\n2. Clear Subject Line\n3. Respectful Body explaining symptoms and doctor's advice\n4. Formal Closing (Yours obediently) and Candidate credentials.", placeholder: "To,\nThe Principal,\n[College Name, City],\n\nSubject: Application for Leave of Absence due to Sickness\n\nRespected Sir,\nI beg to state that...\n\nYours obediently,\n[Student Name]\nRoll No: ..." },
    { subject: "English", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q2 [Formal Letter to Newspaper Editor - 10 Marks]:\nWrite a formal letter to the Editor of a renowned national newspaper highlighting the urgent need for digital literacy and cyber safety in colleges. Detail recent online scam risks and suggest proactive institutional measures.", placeholder: "To,\nThe Editor,\nThe Dawn / The News,\n\nSubject: Urgent Need for Digital Literacy and Cyber Safety in Colleges\n\nSir,\nThrough the columns of your esteemed newspaper...\n\nYours sincerely,\n[Your Name]" },
    { subject: "English", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q3 [Comprehensive Composition: Artificial Intelligence - 10 Marks]:\nWrite a well-structured essay (200-250 words) on 'The Impact of Artificial Intelligence on Future Education and Career Pathways'. (Use <h1>Introduction</h1>, <h2>Key Impacts</h2>, and <h3>Conclusion</h3> headings).", placeholder: "<h1>The Impact of Artificial Intelligence on Future Education and Careers</h1>\n\n<p>Artificial Intelligence is rapidly transforming...</p>\n\n<h2>Opportunities and Challenges</h2>\n<p>...</p>\n\n<h3>Conclusion</h3>\n<p>...</p>" },
    { subject: "English", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q4 [Descriptive Essay: Youth in Technology - 10 Marks]:\nWrite an analytical essay (200-250 words) on 'The Role of Pakistani Youth in Building a Global Digital and Software Economy'. Highlight freelancing, STEM innovation, and global competitiveness.", placeholder: "<h1>The Role of Youth in Building a Global Digital Economy</h1>\n\n<p>With a massive youth population, Pakistan stands on the verge of...</p>" }
  ];

  // 6. DEDICATED SINGLE-SUBJECT EXAM: COMPUTER SCIENCE (27 Questions: 15 MCQs + 8 Short + 4 Long)
  const csSoloExam = [
    // Section A: 15 MCQs
    { subject: "Computer Science", section: "Section A", difficulty: "Easy", question: "Which CPU component performs arithmetic and logical calculations?", options: ["Control Unit (CU)", "Arithmetic Logic Unit (ALU)", "Memory Data Register", "System Bus"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Easy", question: "The binary equivalent of decimal number 13 is:", options: ["1100", "1101", "1011", "1110"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Easy", question: "Which type of computer memory is non-volatile?", options: ["SRAM", "DRAM", "ROM", "Cache L1"], answer: 2 },
    { subject: "Computer Science", section: "Section A", difficulty: "Medium", question: "Which normal form eliminates partial functional dependency?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Medium", question: "Which data structure operates on a Last-In, First-Out (LIFO) order?", options: ["Queue", "Stack", "Binary Tree", "Linked List"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Medium", question: "In OOP, binding data members and functions into a single unit is called:", options: ["Abstraction", "Encapsulation", "Polymorphism", "Inheritance"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Medium", question: "Which SQL clause is used to extract only unique distinct records?", options: ["UNIQUE", "SELECT DISTINCT", "DIFFERENT", "FILTER"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Medium", question: "Which layer of the OSI model handles logical IP routing across networks?", options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Medium", question: "What is the output of an XOR logic gate when both inputs are 1 (True)?", options: ["1", "0", "Undefined", "High Impedance"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Hard", question: "What is the average time complexity of binary search on a sorted array?", options: ["O(n)", "O(n^2)", "O(log n)", "O(1)"], answer: 2 },
    { subject: "Computer Science", section: "Section A", difficulty: "Hard", question: "Which condition is NOT one of Coffman's four conditions for deadlock?", options: ["Mutual Exclusion", "Preemption allowed", "Hold and Wait", "Circular Wait"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Hard", question: "Which data structure is typically used for Breadth-First Search (BFS) graph traversal?", options: ["Stack", "Queue", "Priority Heap", "Array List"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Hard", question: "Which protocol translates human domain names into IP addresses?", options: ["DHCP", "DNS", "FTP", "ARP"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Hard", question: "What type of malware locks user files and demands payment for access?", options: ["Spyware", "Ransomware", "Worm", "Trojan"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Hard", question: "Which software development model follows iterative sprint cycles?", options: ["Waterfall", "Agile Scrum", "Big Bang", "V-Model"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Hard", question: "Which CPU register holds the memory address of the next instruction to be fetched?", options: ["Instruction Register (IR)", "Program Counter (PC)", "Memory Data Register (MDR)", "Accumulator (ACC)"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Hard", question: "In Python programming, which built-in data type is immutable?", options: ["List", "Tuple", "Dictionary", "Set"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Hard", question: "Which sorting algorithm guarantees a worst-case time complexity of O(n log n)?", options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Insertion Sort"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Hard", question: "Which protocol operates at the Transport Layer of OSI to provide reliable connection-oriented delivery?", options: ["UDP", "TCP", "ICMP", "IP"], answer: 1 },
    { subject: "Computer Science", section: "Section A", difficulty: "Hard", question: "In relational databases, which ACID property ensures transactions are all-or-nothing?", options: ["Atomicity", "Consistency", "Isolation", "Durability"], answer: 0 },

    // Section B: 8 Short Questions (Attempt any 5)
    { subject: "Computer Science", section: "Section B", difficulty: "Medium", type: "short", question: "Q1 [Language Translators]: Differentiate between a Compiler and an Interpreter with respect to execution speed, error reporting, and target binary generation.", placeholder: "Compiler:\n- ...\nInterpreter:\n- ..." },
    { subject: "Computer Science", section: "Section B", difficulty: "Medium", type: "short", question: "Q2 [Database Normalization]: Explain 1NF, 2NF, and 3NF database normalization rules. Differentiate between a Primary Key and a Foreign Key.", placeholder: "1NF: ...\n2NF: ...\n3NF: ...\nPrimary Key vs Foreign Key: ..." },
    { subject: "Computer Science", section: "Section B", difficulty: "Medium", type: "short", question: "Q3 [Data Structures]: Differentiate between Stack and Queue data structures (LIFO vs FIFO, operations Push/Pop vs Enqueue/Dequeue, and real-world applications).", placeholder: "Stack:\n- ...\nQueue:\n- ..." },
    { subject: "Computer Science", section: "Section B", difficulty: "Medium", type: "short", question: "Q4 [Operating Systems]: Differentiate between a Process and a Thread. Explain the difference between Multitasking and Multiprocessing.", placeholder: "Process vs Thread:\n...\nMultitasking vs Multiprocessing:\n..." },
    { subject: "Computer Science", section: "Section B", difficulty: "Hard", type: "short", question: "Q5 [OOP Principles]: Detail the Four Pillars of Object-Oriented Programming (Encapsulation, Inheritance, Polymorphism, Abstraction) with realistic software examples.", placeholder: "1. Encapsulation: ...\n2. Inheritance: ...\n3. Polymorphism: ...\n4. Abstraction: ..." },
    { subject: "Computer Science", section: "Section B", difficulty: "Hard", type: "short", question: "Q6 [Networking Protocols]: Differentiate between IPv4 and IPv6 addressing schemes. Compare TCP (Transmission Control Protocol) and UDP (User Datagram Protocol).", placeholder: "IPv4 vs IPv6:\n...\nTCP vs UDP:\n..." },
    { subject: "Computer Science", section: "Section B", difficulty: "Hard", type: "short", question: "Q7 [Algorithm Analysis]: Explain Big O notation. Provide clear examples for: (a) O(1) Constant Time, (b) O(log n) Logarithmic Time, and (c) O(n) Linear Time.", placeholder: "(a) O(1): ...\n(b) O(log n): ...\n(c) O(n): ..." },
    { subject: "Computer Science", section: "Section B", difficulty: "Hard", type: "short", question: "Q8 [Software Engineering]: Compare the Agile Scrum development lifecycle with the traditional Waterfall model regarding flexibility, testing, and client feedback.", placeholder: "Waterfall Model:\n...\nAgile Scrum:\n..." },

    // Section C: 4 Long Questions (Attempt any 2)
    { subject: "Computer Science", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q1 [System Architecture & Database Design - 10 Marks]:\nDesign an Entity-Relationship (ERD) Schema for an Online Proctored Examination System.\n(a) Identify the 4 primary entities and their attributes.\n(b) Specify the relationships (1-to-Many, Many-to-Many).\n(c) Write standard SQL DDL CREATE TABLE statements for Candidate and Exam_Result tables.", placeholder: "1. Entities & Attributes:\n...\n2. Relationships:\n...\n3. SQL DDL Statements:\nCREATE TABLE Candidate (...);\nCREATE TABLE Exam_Result (...);" },
    { subject: "Computer Science", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q2 [OOP Implementation & Design - 10 Marks]:\nExplain Polymorphism in depth. Contrast Compile-Time Polymorphism (Method Overloading) with Runtime Polymorphism (Method Overriding) using clean class structures or code examples.", placeholder: "<h1>Polymorphism in OOP</h1>\n\n<h2>1. Method Overloading (Compile-Time)</h2>\n...\n\n<h2>2. Method Overriding (Runtime)</h2>\n..." },
    { subject: "Computer Science", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q3 [Computer Networking & OSI Reference Model - 10 Marks]:\nDetail the 7 Layers of the OSI Model from Physical to Application Layer. Explain each layer's primary function, data unit (Bits, Frames, Packets, Segments), and prominent protocols.", placeholder: "<h1>The 7 Layers of OSI Model</h1>\n\n1. Physical Layer: ...\n2. Data Link Layer: ...\n3. Network Layer: ...\n4. Transport Layer: ...\n5. Session Layer: ...\n6. Presentation Layer: ...\n7. Application Layer: ..." },
    { subject: "Computer Science", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q4 [Cybersecurity & Cryptography - 10 Marks]:\n(a) Contrast Symmetric vs Asymmetric (Public Key) Encryption with diagrams or workflows.\n(b) Explain the role of Firewalls and the SSL/TLS Handshake protocol in establishing secure HTTPS communication.", placeholder: "Part (a): Symmetric vs Asymmetric Encryption:\n...\n\nPart (b): Firewalls and SSL/TLS Handshake:\n..." }
  ];

  // 7. DEDICATED SINGLE-SUBJECT EXAM: MATHEMATICS (27 Questions: 15 MCQs + 8 Short + 4 Long)
  const mathExam = [
    // Section A: 15 MCQs
    { subject: "Mathematics", section: "Section A", difficulty: "Easy", question: "If the determinant of square matrix A is zero (|A| = 0), matrix A is termed:", options: ["Identity matrix", "Singular matrix", "Symmetric matrix", "Non-singular matrix"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Easy", question: "The roots of the quadratic equation x^2 - 5x + 6 = 0 are:", options: ["1 and 6", "2 and 3", "-2 and -3", "3 and -2"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Easy", question: "What is the value of log10(1000)?", options: ["1", "2", "3", "10"], answer: 2 },
    { subject: "Mathematics", section: "Section A", difficulty: "Medium", question: "The derivative of f(x) = sin(2x) with respect to x is:", options: ["cos(2x)", "2 cos(2x)", "-2 cos(2x)", "2 sin(x)"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Medium", question: "Two non-zero vectors A and B are perpendicular if their dot product (A · B) equals:", options: ["1", "-1", "0", "A x B"], answer: 2 },
    { subject: "Mathematics", section: "Section A", difficulty: "Medium", question: "What is the limit of (sin x) / x as x approaches 0?", options: ["0", "1", "Infinity", "Undefined"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Medium", question: "For complex number z = 3 + 4i, what is the absolute modulus |z|?", options: ["7", "5", "25", "1"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Medium", question: "Which fundamental trigonometric identity is correct?", options: ["sin^2 θ - cos^2 θ = 1", "1 + tan^2 θ = sec^2 θ", "1 + cot^2 θ = tan^2 θ", "sin 2θ = 2 sin θ"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Medium", question: "What is the indefinite integral of e^(3x) dx?", options: ["3 e^(3x) + C", "(1/3) e^(3x) + C", "e^(3x) + C", "(1/3) e^x + C"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Hard", question: "The 10th term of an arithmetic progression with first term a = 3 and common difference d = 4 is:", options: ["36", "39", "40", "43"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Hard", question: "What is the discriminant formula for standard quadratic ax^2 + bx + c = 0?", options: ["b^2 - 4ac", "b^2 + 4ac", "-b / 2a", "2a / b"], answer: 0 },
    { subject: "Mathematics", section: "Section A", difficulty: "Hard", question: "If matrix A has order 2x3 and matrix B has order 3x4, the product AB has order:", options: ["2x3", "2x4", "3x3", "Product undefined"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Hard", question: "What is the first derivative of natural logarithm ln(x) with respect to x?", options: ["e^x", "1/x", "x", "ln(x)"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Hard", question: "What is the probability of rolling a prime number (2, 3, 5) on a standard 6-sided die?", options: ["1/6", "1/2 (3/6)", "2/3", "1/3"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Hard", question: "The slope of a line perpendicular to a line with slope m = 2 is:", options: ["2", "-1/2", "-2", "1/2"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Hard", question: "If a matrix has equal number of rows and columns (m = n), it is called a:", options: ["Row matrix", "Square matrix", "Column matrix", "Zero matrix"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Hard", question: "What is the first derivative of f(x) = e^(2x) with respect to x?", options: ["e^(2x)", "2 e^(2x)", "(1/2) e^(2x)", "2x e^(2x)"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Hard", question: "In coordinate geometry, what is the distance between points (0, 0) and (3, 4)?", options: ["7", "5", "25", "1"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Hard", question: "What is the trigonometric value of cos(0°)?", options: ["0", "1", "-1", "1/2"], answer: 1 },
    { subject: "Mathematics", section: "Section A", difficulty: "Hard", question: "What is the solution set of inequality 2x - 4 > 6?", options: ["x > 1", "x > 5", "x < 5", "x = 5"], answer: 1 },

    // Section B: 8 Short Questions (Attempt any 5)
    { subject: "Mathematics", section: "Section B", difficulty: "Easy", type: "short", question: "Q1 [Matrices & Inverses]: Given matrix A = [[3, 2], [1, 4]]:\n(a) Calculate determinant |A|.\n(b) State whether matrix A is singular or non-singular.\n(c) Find the inverse matrix A^(-1) using Adjoint formula.", placeholder: "Step 1: |A| = (3)(4) - (2)(1) = ...\nStep 2: Non-singular because |A| ≠ 0.\nStep 3: Adjoint(A) = ...\nStep 4: A^(-1) = Adj(A) / |A| = ..." },
    { subject: "Mathematics", section: "Section B", difficulty: "Easy", type: "short", question: "Q2 [Quadratic Algebra]: Solve the quadratic equation 2x^2 - 7x + 3 = 0 using the Quadratic Formula. Show all steps.", placeholder: "a = 2, b = -7, c = 3\nx = [-(-7) ± √((-7)^2 - 4(2)(3))] / (2*2) = ...\nx1 = ... , x2 = ..." },
    { subject: "Mathematics", section: "Section B", difficulty: "Medium", type: "short", question: "Q3 [Trigonometric Proofs]: Prove the fundamental identities:\n(a) sin^2 θ + cos^2 θ = 1\n(b) 1 + tan^2 θ = sec^2 θ", placeholder: "(a) In a right-angled triangle, a^2 + b^2 = c^2...\n(b) Dividing both sides by cos^2 θ gives: ..." },
    { subject: "Mathematics", section: "Section B", difficulty: "Medium", type: "short", question: "Q4 [Calculus Differentiation]: Find the first derivative dy/dx of the polynomial function:\nf(x) = 3x^4 - 5x^2 + 7x - 9", placeholder: "f'(x) = d/dx(3x^4) - d/dx(5x^2) + d/dx(7x) - d/dx(9)\nf'(x) = ..." },
    { subject: "Mathematics", section: "Section B", difficulty: "Medium", type: "short", question: "Q5 [Vector Algebra]: Given vectors A = 2i + 3j - k and B = i - 2j + 4k:\n(a) Calculate Dot Product A · B.\n(b) Determine whether the vectors are orthogonal.", placeholder: "A · B = (2)(1) + (3)(-2) + (-1)(4) = ...\nConclusion on orthogonality: ..." },
    { subject: "Mathematics", section: "Section B", difficulty: "Hard", type: "short", question: "Q6 [Logarithms]: Evaluate the logarithmic expression showing rules used:\nlog2(32) + log3(27) - log10(100)", placeholder: "log2(32) = log2(2^5) = 5\nlog3(27) = log3(3^3) = 3\nlog10(100) = log10(10^2) = 2\nResult = 5 + 3 - 2 = ..." },
    { subject: "Mathematics", section: "Section B", difficulty: "Hard", type: "short", question: "Q7 [Complex Numbers]: Express (3 + 4i) / (1 - 2i) in standard form a + bi by multiplying numerator and denominator by conjugate (1 + 2i).", placeholder: "[(3 + 4i)(1 + 2i)] / [(1 - 2i)(1 + 2i)] = ...\n= a + bi form: ..." },
    { subject: "Mathematics", section: "Section B", difficulty: "Hard", type: "short", question: "Q8 [Arithmetic Progression]: For the arithmetic progression 5, 9, 13, 17...:\n(a) Find the 15th term.\n(b) Calculate the sum of the first 15 terms.", placeholder: "a = 5, d = 4\nT15 = a + (15 - 1)d = ...\nS15 = (15/2)[2a + (15 - 1)d] = ..." },

    // Section C: 4 Long Questions (Attempt any 2)
    { subject: "Mathematics", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q1 [Definite Integration with Substitution - 10 Marks]:\nEvaluate the definite integral ∫ (2x + 3) / (x^2 + 3x + 5) dx showing all substitution steps.\n(a) State substitution variable u and differential du.\n(b) Integrate in terms of u.\n(c) Substitute back into original variable x.", placeholder: "<h1>Integration by Substitution</h1>\n\nLet u = x^2 + 3x + 5\nThen du = (2x + 3) dx\n\n∫ du / u = ln|u| + C\n= ln|x^2 + 3x + 5| + C" },
    { subject: "Mathematics", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q2 [Systems of Linear Equations & Cramer's Rule - 10 Marks]:\nSolve the system of three linear equations using Cramer's Rule:\n3x + y - z = 4\nx - 2y + z = 1\n2x + 3y + 2z = 9\nShow determinants |D|, |Dx|, |Dy|, and |Dz|.", placeholder: "<h1>Cramer's Rule Solution</h1>\n\nMatrix D = [[3, 1, -1], [1, -2, 1], [2, 3, 2]]\n|D| = ...\n|Dx| = ...\n|Dy| = ...\n|Dz| = ...\nx = |Dx| / |D|, y = |Dy| / |D|, z = |Dz| / |D|" },
    { subject: "Mathematics", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q3 [Vector Cross Product & Geometric Area - 10 Marks]:\nFor vectors A = 2i + 3j - k and B = i - 2j + 4k:\n(a) Calculate Vector Cross Product A × B using determinant expansion.\n(b) Calculate the magnitude |A × B|.\n(c) Determine the area of the parallelogram and triangle formed by A and B.", placeholder: "<h1>Vector Cross Product & Area</h1>\n\nA x B = | i  j  k |\n        | 2  3 -1 |\n        | 1 -2  4 |\n\nA x B = ...\n|A x B| = ...\nArea of Triangle = (1/2)|A x B| = ..." },
    { subject: "Mathematics", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q4 [Analytical Conics: Parabola & Circle - 10 Marks]:\n(a) For the parabola y^2 = 12x, determine the vertex, focus, axis, and directrix line.\n(b) For the circle x^2 + y^2 - 6x + 8y - 11 = 0, find the center (h, k) and radius r.", placeholder: "Part (a): Parabola y^2 = 4ax => 4a = 12 => a = 3\nVertex: (0, 0)\nFocus: (3, 0)\nDirectrix: x = -3\n\nPart (b): Circle completing square:\n(x - 3)^2 + (y + 4)^2 = ...\nCenter: (3, -4), Radius = ..." }
  ];

  // 8. DEDICATED SINGLE-SUBJECT EXAM: PHYSICS (27 Questions: 15 MCQs + 8 Short + 4 Long)
  const physicsExam = [
    // Section A: 15 MCQs
    { subject: "Physics", section: "Section A", difficulty: "Easy", question: "The rate of change of displacement is defined as:", options: ["Speed", "Acceleration", "Velocity", "Force"], answer: 2 },
    { subject: "Physics", section: "Section A", difficulty: "Easy", question: "The SI unit of work and energy is:", options: ["Watt", "Newton", "Joule", "Pascal"], answer: 2 },
    { subject: "Physics", section: "Section A", difficulty: "Easy", question: "Which quantity is a scalar quantity?", options: ["Velocity", "Acceleration", "Work", "Displacement"], answer: 2 },
    { subject: "Physics", section: "Section A", difficulty: "Medium", question: "Newton's Second Law of Motion is expressed mathematically as:", options: ["F = mv", "F = ma", "F = m/a", "W = Fd"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Medium", question: "The bending of light waves around corners of an obstacle is known as:", options: ["Refraction", "Polarization", "Diffraction", "Total Internal Reflection"], answer: 2 },
    { subject: "Physics", section: "Section A", difficulty: "Medium", question: "The energy of a photon of frequency f is given by Planck's equation:", options: ["E = mc^2", "E = hf", "E = h/f", "E = 1/2 mv^2"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Medium", question: "The acceleration due to gravity near Earth's surface is approximately:", options: ["9.8 m/s^2", "8.9 m/s^2", "9.8 km/s", "10.8 m/s^2"], answer: 0 },
    { subject: "Physics", section: "Section A", difficulty: "Medium", question: "Absolute zero on the Kelvin temperature scale corresponds in Celsius to:", options: ["0 °C", "-273.15 °C", "-100 °C", "273.15 °C"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Medium", question: "What is the SI unit of electrical capacitance?", options: ["Henry", "Farad", "Ohm", "Tesla"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Hard", question: "Which angle of projection provides the maximum horizontal range for a projectile?", options: ["30°", "45°", "60°", "90°"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Hard", question: "Total Internal Reflection occurs only when light travels from:", options: ["Rarer to denser medium", "Denser to rarer medium at angle > critical angle", "Any medium at 90°", "Vacuum to air"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Hard", question: "According to Hooke's Law within elastic limit, stress is directly proportional to:", options: ["Mass", "Strain", "Volume", "Density"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Hard", question: "In simple harmonic motion of a pendulum, acceleration is maximum at:", options: ["Mean position", "Extreme positions", "Midway", "Constant throughout"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Hard", question: "According to Coulomb's Law, electrostatic force between two point charges is proportional to:", options: ["1 / r", "1 / r^2 (inverse square)", "1 / r^3", "r^2"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Hard", question: "The phenomenon where current is induced by a changing magnetic field is termed:", options: ["Photoelectric effect", "Electromagnetic Induction", "Thermoelectricity", "Static Induction"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Hard", question: "What is the SI unit of electric potential difference (voltage)?", options: ["Ampere", "Volt", "Ohm", "Watt"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Hard", question: "The rate of doing work or rate of energy transfer is defined as:", options: ["Momentum", "Power", "Force", "Impulse"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Hard", question: "Which law states that the total electric flux through a closed surface is proportional to enclosed charge?", options: ["Coulomb's Law", "Gauss's Law", "Faraday's Law", "Ampere's Law"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Hard", question: "When a body moves in a circular path with constant speed, its acceleration is directed:", options: ["Tangentially forward", "Towards the center (Centripetal)", "Away from the center", "Zero"], answer: 1 },
    { subject: "Physics", section: "Section A", difficulty: "Hard", question: "What is the approximate speed of electromagnetic light waves in vacuum?", options: ["3 x 10^6 m/s", "3 x 10^8 m/s", "3 x 10^5 km/h", "330 m/s"], answer: 1 },

    // Section B: 8 Short Questions (Attempt any 5)
    { subject: "Physics", section: "Section B", difficulty: "Easy", type: "short", question: "Q1 [Mechanics & Momentum]: State Newton's Second Law of Motion in terms of rate of change of linear momentum (F = dp/dt). Show the relation F = ma.", placeholder: "Momentum p = mv\nF = dp/dt = d(mv)/dt = m(dv/dt) = ma..." },
    { subject: "Physics", section: "Section B", difficulty: "Easy", type: "short", question: "Q2 [Work-Energy Theorem]: State the Work-Energy Theorem. Write its mathematical formula and explain terms W = ΔK.", placeholder: "Work done on a body equals change in its kinetic energy:\nW = ΔK = (1/2)m(v_f^2 - v_i^2)..." },
    { subject: "Physics", section: "Section B", difficulty: "Medium", type: "short", question: "Q3 [Thermodynamics]: State the First Law of Thermodynamics (ΔQ = ΔU + ΔW). Differentiate between an Isothermal and an Adiabatic process.", placeholder: "1st Law of Thermodynamics: ΔQ = ΔU + ΔW\nIsothermal: Temperature constant (ΔT = 0)\nAdiabatic: No heat enters or leaves system (ΔQ = 0)" },
    { subject: "Physics", section: "Section B", difficulty: "Medium", type: "short", question: "Q4 [Simple Harmonic Motion]: Define Simple Harmonic Motion (SHM). Write the formula for the time period of a simple pendulum and state factors it depends upon.", placeholder: "Definition of SHM: Acceleration directly proportional to displacement...\nT = 2π√(L/g)\nDepends on: Length L, acceleration due to gravity g." },
    { subject: "Physics", section: "Section B", difficulty: "Medium", type: "short", question: "Q5 [Electrostatics]: State Coulomb's Law of Electrostatics and define the SI unit of electric charge (Coulomb). Write its mathematical formula.", placeholder: "F = (1 / 4πε0) * (q1 * q2 / r^2)\nDefinition of Coulomb: ..." },
    { subject: "Physics", section: "Section B", difficulty: "Hard", type: "short", question: "Q6 [Wave Optics & Total Internal Reflection]: Define Total Internal Reflection and Critical Angle. State the two necessary conditions for TIR to occur.", placeholder: "Critical Angle: Angle of incidence for which angle of refraction is 90°.\nConditions:\n1. Light must travel from denser to rarer medium.\n2. Angle of incidence must be greater than critical angle." },
    { subject: "Physics", section: "Section B", difficulty: "Hard", type: "short", question: "Q7 [Modern Physics]: State Einstein's Photoelectric Equation: E = hf = Φ + (1/2)m(v_max)^2. Define Work Function (Φ) and Threshold Frequency (f0).", placeholder: "Photoelectric Equation: hf = hf0 + K_max\nWork Function: Minimum energy required to eject an electron...\nThreshold Frequency: ..." },
    { subject: "Physics", section: "Section B", difficulty: "Hard", type: "short", question: "Q8 [Semiconductor Electronics]: Explain the working of a P-N Junction Diode in Forward Bias and Reverse Bias. Draw or describe depletion layer width.", placeholder: "Forward Bias: P connected to +, N to -. Depletion layer narrows, current flows.\nReverse Bias: P connected to -, N to +. Depletion layer widens, minimal leakage current." },

    // Section C: 4 Long Questions (Attempt any 2)
    { subject: "Physics", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q1 [Electrostatics & Electric Field Intensity - 10 Marks]:\nState Coulomb's Law of Electrostatics. Derive the mathematical expression for electric field intensity E at distance r from a point charge Q. Detail permittivity of free space ε0.", placeholder: "<h1>Electric Field Intensity Derivation</h1>\n\n1. Coulomb's Law Statement: F = (1 / 4πε0) * (q * q0 / r^2)\n2. Electric Field Intensity Definition: E = F / q0\n3. Derivation:\nE = (1 / 4πε0) * (Q / r^2) r̂" },
    { subject: "Physics", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q2 [Wave Optics: Young's Double Slit Experiment - 10 Marks]:\nExplain Young's Double Slit Experiment demonstrating interference of light. Derive the formula for fringe width β = λL / d for consecutive bright fringes.", placeholder: "<h1>Young's Double Slit Interference</h1>\n\n1. Experimental Setup: Monochromatic source, slits S1 and S2...\n2. Path Difference: Δx = d sin θ ≈ d(y / L)\n3. For Constructive Interference: d(y / L) = mλ => y_m = mλL / d\n4. Fringe Width β = y_(m+1) - y_m = λL / d" },
    { subject: "Physics", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q3 [Thermodynamics & Carnot Heat Engine - 10 Marks]:\nExplain the Carnot Cycle consisting of 4 reversible thermodynamic processes on a P-V indicator diagram. Derive the efficiency formula η = 1 - (T2 / T1).", placeholder: "<h1>Carnot Engine & Efficiency</h1>\n\n1. Process 1: Isothermal Expansion at T1\n2. Process 2: Adiabatic Expansion from T1 to T2\n3. Process 3: Isothermal Compression at T2\n4. Process 4: Adiabatic Compression from T2 to T1\n\nEfficiency η = W / Q1 = (Q1 - Q2) / Q1 = 1 - (T2 / T1)" },
    { subject: "Physics", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q4 [Mechanics: Projectile Motion Derivations - 10 Marks]:\nDefine Projectile Motion. Derive mathematical expressions for:\n(a) Maximum Height reached by projectile (H = v0^2 sin^2 θ / 2g)\n(b) Total Time of Flight (T = 2 v0 sin θ / g)\n(c) Horizontal Range (R = v0^2 sin 2θ / g)", placeholder: "<h1>Projectile Motion Derivations</h1>\n\nInitial velocity components: vx = v0 cos θ, vy = v0 sin θ\n\n(a) Maximum Height:\nvy^2 = voy^2 - 2gH => 0 = (v0 sin θ)^2 - 2gH => H = (v0^2 sin^2 θ) / 2g\n\n(b) Time of Flight:\ny = voy T - (1/2)gT^2 => 0 = v0 sin θ T - (1/2)gT^2 => T = (2 v0 sin θ) / g\n\n(c) Range:\nR = vx * T = (v0 cos θ) * (2 v0 sin θ / g) = (v0^2 sin 2θ) / g" }
  ];

  // 9. DEDICATED SINGLE-SUBJECT EXAM: PAKISTAN STUDIES (32 Questions: 20 MCQs + 8 Short + 4 Long)
  const pakStudyExam = [
    // Section A: 20 MCQs
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Easy", question: "Who presented the historic Two-Nation Theory at Aligarh?", options: ["Sir Syed Ahmad Khan", "Allama Iqbal", "Liaquat Ali Khan", "Maulana Shaukat Ali"], answer: 0 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Easy", question: "In which year did Quaid-e-Azam Muhammad Ali Jinnah present his famous Fourteen Points?", options: ["1927", "1929", "1930", "1935"], answer: 1 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Easy", question: "The historic Lahore Resolution (Pakistan Resolution) was passed on:", options: ["23rd March 1940", "14th August 1947", "21st April 1938", "3rd June 1947"], answer: 0 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Easy", question: "Who delivered the historic presidential address at Allahabad in 1930 outlining an independent Muslim state?", options: ["Sir Syed Ahmad Khan", "Allama Muhammad Iqbal", "Choudhry Rahmat Ali", "Maulana Muhammad Ali Jauhar"], answer: 1 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Medium", question: "When was the historic Objectives Resolution passed by the First Constituent Assembly of Pakistan?", options: ["March 12, 1949", "August 14, 1947", "March 23, 1956", "October 7, 1958"], answer: 0 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Medium", question: "Under the 1973 Constitution, what is the official state religion of the Islamic Republic of Pakistan?", options: ["Islam", "Secular", "Christianity", "No official religion"], answer: 0 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Medium", question: "What is the highest mountain peak in Pakistan and second highest on Earth?", options: ["Nanga Parbat", "K2 (Godwin-Austen)", "Broad Peak", "Rakaposhi"], answer: 1 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Medium", question: "Which is the longest and most significant river flowing through Pakistan?", options: ["Jhelum", "Indus (Sindh)", "Chenab", "Ravi"], answer: 1 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Medium", question: "Who authored the pamphlet 'Now or Never' in 1933 coining the name 'Pakistan'?", options: ["Allama Iqbal", "Choudhry Rahmat Ali", "Liaquat Ali Khan", "Sir Syed Ahmad Khan"], answer: 1 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Medium", question: "In which year was the All India Muslim League founded at Dhaka?", options: ["1905", "1906", "1913", "1919"], answer: 1 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Medium", question: "Which deep sea port in Balochistan serves as the flagship gateway of CPEC?", options: ["Karachi Port", "Gwadar Port", "Port Qasim", "Pasni Port"], answer: 1 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Medium", question: "What is the designated National Language of the Islamic Republic of Pakistan?", options: ["English", "Urdu", "Punjabi", "Sindhi"], answer: 1 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Hard", question: "The Simla Deputation met Viceroy Lord Minto in which year demanding separate electorates?", options: ["1904", "1906", "1909", "1911"], answer: 1 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Hard", question: "In which year was the current Constitution of the Islamic Republic of Pakistan promulgated?", options: ["1956", "1962", "1973", "1985"], answer: 2 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Hard", question: "Which major desert is situated across southeastern Sindh, Pakistan?", options: ["Thal Desert", "Thar Desert", "Cholistan Desert", "Kharan Desert"], answer: 1 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Hard", question: "Who served as the first Prime Minister of independent Pakistan?", options: ["Quaid-e-Azam", "Liaquat Ali Khan", "Khawaja Nazimuddin", "Malik Ghulam Muhammad"], answer: 1 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Hard", question: "What is the total number of members in the National Assembly of Pakistan under the current framework?", options: ["104", "336", "342", "200"], answer: 1 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Hard", question: "Which site in Balochistan holds one of the world's richest untapped copper and gold deposits?", options: ["Khewra", "Reko Diq", "Saindak", "Thar Coal"], answer: 1 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Hard", question: "The Indus Waters Treaty between Pakistan and India was brokered by the World Bank in:", options: ["1948", "1960", "1965", "1971"], answer: 1 },
    { subject: "Pakistan Studies", section: "Section A", difficulty: "Hard", question: "Which strategic mountain pass connects northern Pakistan with China through the Karakoram Highway?", options: ["Khyber Pass", "Khunjerab Pass", "Bolan Pass", "Tochi Pass"], answer: 1 },

    // Section B: 8 Short Questions (Attempt any 5)
    { subject: "Pakistan Studies", section: "Section B", difficulty: "Easy", type: "short", question: "Q1 [Ideology & Two-Nation Theory]: Explain the fundamental concept of the Two-Nation Theory and how it served as the ideological bedrock for Pakistan's creation.", placeholder: "Two-Nation Theory Statement:\n- Muslims and Hindus are two distinct nations with separate religions, customs, and civilizations...\n- Quaid-e-Azam & Sir Syed Ahmad Khan perspective: ..." },
    { subject: "Pakistan Studies", section: "Section B", difficulty: "Easy", type: "short", question: "Q2 [Quaid-e-Azam 14 Points - 1929]: State any 4 fundamental constitutional safeguards demanded in Quaid-e-Azam's 14 Points in response to the Nehru Report.", placeholder: "1. Federal system with residual powers to provinces\n2. Uniform measure of provincial autonomy\n3. Separate electorates for minorities\n4. One-third Muslim representation in central legislature..." },
    { subject: "Pakistan Studies", section: "Section B", difficulty: "Medium", type: "short", question: "Q3 [Objectives Resolution 1949]: State 4 key Islamic provisions laid down in the Objectives Resolution passed on 12th March 1949 under Prime Minister Liaquat Ali Khan.", placeholder: "1. Sovereignty belongs to Almighty Allah alone\n2. Authority delegated to the people as a sacred trust\n3. Principles of democracy, freedom, equality as enunciated by Islam\n4. Minorities free to profess their religion..." },
    { subject: "Pakistan Studies", section: "Section B", difficulty: "Medium", type: "short", question: "Q4 [1973 Constitution Features]: Highlight 4 salient Islamic features of the 1973 Constitution of the Islamic Republic of Pakistan.", placeholder: "1. State religion declared as Islam (Article 2)\n2. President and Prime Minister must be Muslim\n3. Definition of Muslim included\n4. Council of Islamic Ideology (CII) established to ensure laws conform to Quran and Sunnah..." },
    { subject: "Pakistan Studies", section: "Section B", difficulty: "Medium", type: "short", question: "Q5 [Geo-Strategic Importance & CPEC]: Explain the geo-strategic significance of Pakistan at the crossroads of South Asia, Central Asia, and the Middle East with Gwadar Port.", placeholder: "Geo-strategic Importance:\n1. Gateway to Central Asian Republics (CARs)\n2. Warm water port at Gwadar connecting Indian Ocean\n3. Key transit route for China via CPEC\n4. Proximity to oil-rich Persian Gulf..." },
    { subject: "Pakistan Studies", section: "Section B", difficulty: "Hard", type: "short", question: "Q6 [Aligarh Movement]: Detail the primary educational, political, and social objectives achieved by Sir Syed Ahmad Khan through the Aligarh Movement.", placeholder: "1. Modern Western scientific education alongside Islamic values\n2. Establishment of MAO College Aligarh (1875)\n3. Removal of British misunderstandings about Muslims\n4. Foundation of Two-Nation Theory consciousness..." },
    { subject: "Pakistan Studies", section: "Section B", difficulty: "Hard", type: "short", question: "Q7 [Natural Resources & Irrigation]: Name Pakistan's major river barrages and highlight the economic role of the Indus Basin Irrigation System in agricultural self-reliance.", placeholder: "Major Barrages: Sukkur Barrage, Guddu Barrage, Kotri Barrage, Taunsa Barrage...\nRole in Agriculture: Feeds over 80% of wheat, cotton, rice crops..." },
    { subject: "Pakistan Studies", section: "Section B", difficulty: "Hard", type: "short", question: "Q8 [National Integration & Urdu]: Discuss the role of Urdu as a cohesive national medium uniting diverse regional linguistic cultures across Pakistan.", placeholder: "1. Common medium of inter-provincial communication\n2. Official lingua franca bridging Punjabi, Pashto, Sindhi, Balochi\n3. Repository of freedom movement literature\n4. Symbol of sovereign Islamic identity..." },

    // Section C: 4 Long Questions (Attempt any 2)
    { subject: "Pakistan Studies", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q1 [Ideology of Pakistan & Quaid-e-Azam's Vision - 10 Marks]:\nAnalyze the Ideology of Pakistan in the light of the historic speeches and presidential addresses of Quaid-e-Azam Muhammad Ali Jinnah. Contrast with Allama Iqbal's Allahabad Address (1930).", placeholder: "<h1>Ideology of Pakistan & Quaid-e-Azam's Vision</h1>\n\n<h2>1. Definition & Foundations of Ideology</h2>\nIslam as a complete code of life...\n\n<h2>2. Quaid-e-Azam's Speeches (1940 & 1947)</h2>\n\"Hindus and Muslims belong to two different religious philosophies...\"\n\n<h2>3. Allama Iqbal's Allahabad Address (1930)</h2>\nVision of consolidated North-Western Muslim state...\n\n<h3>Conclusion</h3>\n..." },
    { subject: "Pakistan Studies", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q2 [Salient Features of the 1973 Constitution - 10 Marks]:\nExplain the comprehensive structure of the 1973 Constitution of Pakistan:\n(a) Written, rigid, federal and bicameral parliamentary democracy.\n(b) Fundamental Human Rights and Independence of Judiciary.\n(c) Islamic Provisions ensuring supremacy of Quran and Sunnah.", placeholder: "<h1>Salient Features of 1973 Constitution</h1>\n\n<h2>1. Federal & Bicameral System</h2>\nNational Assembly and Senate representation...\n\n<h2>2. Fundamental Rights & Independent Judiciary</h2>\nRight to life, fair trial, freedom of speech...\n\n<h2>3. Comprehensive Islamic Provisions</h2>\nInjunctions of Islam, Council of Islamic Ideology..." },
    { subject: "Pakistan Studies", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q3 [Comprehensive Essay: Geo-Strategic Position & Economic Horizons via CPEC - 10 Marks]:\nWrite an analytical essay (200-250 words) on 'The Geo-Strategic Significance of Pakistan in the 21st Century and the Economic Horizons of CPEC'. Use <h1>Title</h1>, <h2>Subheadings</h2>, and <h3>Strategic Outlook</h3> tags.", placeholder: "<h1>The Geo-Strategic Significance of Pakistan & CPEC Horizons</h1>\n\n<p>Positioned uniquely at the meeting point of South Asia, Central Asia, and the Middle East...</p>\n\n<h2>Gwadar Port and Regional Connectivity</h2>\n<p>Gwadar stands as the linchpin of trade corridor...</p>\n\n<h3>Strategic Outlook</h3>\n<p>With massive infrastructure investments...</p>" },
    { subject: "Pakistan Studies", section: "Section C", difficulty: "Hard", type: "long", question: "Long Q4 [Formal Application for Higher Secondary Domicile & Verification - 10 Marks]:\nDraft a formal official application to the Chairman of the Board of Secondary and Intermediate Education requesting urgent issuance and verification of candidate credentials for college admissions.", placeholder: "To,\nThe Chairman,\nBoard of Intermediate and Secondary Education,\n[City, Region],\n\nSubject: Application for Urgent Issuance of Migration & Verified Credential Certificate\n\nRespected Sir,\nI respectfully submit that I have passed...\n\nYours faithfully,\n[Student Full Name]\nRoll No: ...\nRegistration ID: ..." }
  ];

  return { sectionAMcqs, sectionBShorts, sectionCLongs, webDevQuestions, englishExam, csSoloExam, mathExam, physicsExam, pakStudyExam };
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
  finishModalOpen: false,
  aiWarningsCount: 0,
  maxAiWarnings: 6
};

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  if (hours > 0) return `${hours}:${minutes}:${seconds}`;
  return `${minutes}:${seconds}`;
}

// PRNG & Shuffling Engine for Randomized Exam Generation
function createPrng(seed) {
  let s = (Math.abs(seed) % 2147483647) || 1234567;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function stringToSeed(str) {
  let hash = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function shuffleArray(array, rng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

function shuffleOptionsForQuestion(q, rng) {
  const cloned = { ...q };
  if (!Array.isArray(q.options) || q.options.length < 2) return cloned;

  const indices = q.options.map((_, idx) => idx);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = indices[i];
    indices[i] = indices[j];
    indices[j] = temp;
  }

  cloned.options = indices.map((idx) => q.options[idx]);

  if (q.isMultiSelect && Array.isArray(q.answers)) {
    cloned.answers = q.answers.map((origAns) => indices.indexOf(origAns)).sort((a, b) => a - b);
  } else if (typeof q.answer === 'number') {
    cloned.answer = indices.indexOf(q.answer);
  }

  return cloned;
}

function generateWebDevExamQuestions(pool, seedInput) {
  let seed = 0;
  if (typeof seedInput === 'number') {
    seed = seedInput;
  } else if (typeof seedInput === 'string' && seedInput.trim()) {
    seed = stringToSeed(seedInput.trim());
  } else {
    seed = Math.floor(Math.random() * 2147483640) + 1;
  }

  const rng = createPrng(seed);

  const html5Pool = pool.filter((q) => q.subject === 'HTML5');
  const css3Pool = pool.filter((q) => q.subject === 'CSS3');
  const jsPool = pool.filter((q) => q.subject === 'JavaScript');

  const pickedHtml5 = shuffleArray(html5Pool, rng).slice(0, 20);
  const pickedCss3 = shuffleArray(css3Pool, rng).slice(0, 20);
  const pickedJs = shuffleArray(jsPool, rng).slice(0, 20);

  // Grouped by subject so each subject has exactly 20 questions, internally shuffled
  const combined = [
    ...shuffleArray(pickedHtml5, rng),
    ...shuffleArray(pickedCss3, rng),
    ...shuffleArray(pickedJs, rng)
  ];

  // Shuffle individual options (A, B, C, D) so adjacent students with same question see different option letters
  return combined.map((q) => shuffleOptionsForQuestion(q, rng));
}

function startExam(exam, durationMinutes = 60, candidateInfo = null) {
  if (state.examActive) return;
  state.exam = exam || "Computer Science Group";
  state.durationMinutes = Number(durationMinutes) || 60;
  
  const banks = buildQuestionBank();
  let selected = [];

  const examLower = state.exam.toLowerCase();
  if (examLower === "english" || (examLower.includes("english") && !examLower.includes("computer"))) {
    // English Special Paper (32 Questions: 20 MCQs + 8 Short + 4 Long)
    selected = [...banks.englishExam];
  } else if (examLower === "mathematics" || examLower.includes("math")) {
    // Mathematics Paper (32 Questions: 20 MCQs + 8 Short + 4 Long)
    selected = [...banks.mathExam];
  } else if (examLower === "physics" || examLower.includes("physic")) {
    // Physics Paper (32 Questions: 20 MCQs + 8 Short + 4 Long)
    selected = [...banks.physicsExam];
  } else if (examLower.includes("pakistan") || examLower.includes("pak study") || examLower.includes("pak studies")) {
    // Pakistan Studies Paper (32 Questions: 20 MCQs + 8 Short + 4 Long)
    selected = [...banks.pakStudyExam];
  } else if (examLower === "computer science" || (examLower.includes("computer science") && !examLower.includes("group"))) {
    // Computer Science Solo Paper (32 Questions: 20 MCQs + 8 Short + 4 Long)
    selected = [...banks.csSoloExam];
  } else if (examLower.includes("computer science group") || examLower === "cs group" || (examLower.includes("science") && !examLower.includes("web") && !examLower.includes("html"))) {
    // 20 Section A MCQs + 8 Section B Short Questions + 4 Section C Long Questions
    selected = [
      ...banks.sectionAMcqs,
      ...banks.sectionBShorts,
      ...banks.sectionCLongs
    ];
  } else {
    // Web Development Track (60 MCQs drawn from 150-question pool: exactly 20 HTML5 + 20 CSS3 + 20 JavaScript)
    const seed = (candidateInfo && (candidateInfo.studentId || candidateInfo.id))
      ? String(candidateInfo.studentId || candidateInfo.id)
      : Math.floor(Math.random() * 2147483640) + 1;
    selected = generateWebDevExamQuestions(banks.webDevQuestions, seed);
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

  const cfg = getSubjectConfig(state.exam);
  const marksSummaryEl = examElement("examSubjectMarksSummary");
  if (marksSummaryEl) {
    marksSummaryEl.textContent = `Total: ${cfg.totalMarks} Marks · Pass: ${cfg.passingMarks} Marks`;
  }

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

function getSubjectConfig(examName) {
  const name = (examName || "").toLowerCase();
  if (name.includes("english") && !name.includes("group")) {
    return {
      isBoardSubject: true,
      totalMarks: 100,
      passingMarks: 50,
      mcqWeight: 1,      // 20 MCQs x 1 = 20 Marks
      shortWeight: 6,    // 5 Short x 6 = 30 Marks
      longWeight: 25,    // 2 Long x 25 = 50 Marks (Total = 100)
      maxShort: 5,
      maxLong: 2
    };
  }
  if (name.includes("math") || name.includes("physic") || name.includes("pakistan") || name.includes("pak study") || (name.includes("computer science") && !name.includes("group"))) {
    return {
      isBoardSubject: true,
      totalMarks: 75,
      passingMarks: 25,
      mcqWeight: 1,      // 20 MCQs x 1 = 20 Marks
      shortWeight: 5,    // 5 Short x 5 = 25 Marks
      longWeight: 15,    // 2 Long x 15 = 30 Marks (Total = 75)
      maxShort: 5,
      maxLong: 2
    };
  }
  if (name.includes("computer science group") || name.includes("cs group") || (name.includes("science") && !name.includes("web") && !name.includes("html"))) {
    return {
      isBoardSubject: true,
      totalMarks: 75,
      passingMarks: 25,
      mcqWeight: 1,      // 20 MCQs x 1 = 20 Marks
      shortWeight: 5,    // 5 Short x 5 = 25 Marks
      longWeight: 15,    // 2 Long x 15 = 30 Marks (Total = 75)
      maxShort: 5,
      maxLong: 2
    };
  }
  // Web Development Track (HTML5 + CSS3 + JS: 60 MCQs)
  return {
    isBoardSubject: false,
    totalMarks: 100,
    passingMarks: 40,
    mcqWeight: 100 / 60, // 60 MCQs = 100 Marks (1.6667 per MCQ)
    shortWeight: 0,
    longWeight: 0,
    maxShort: 0,
    maxLong: 0
  };
}

function finishExam(reason, cheating = false) {
  if (!state.examActive || state.finishing) return;
  state.finishing = true;
  state.examActive = false;
  state.finishModalOpen = false;
  window.clearInterval(state.timerId);
  sessionStorage.removeItem(SESSION_KEY);

  const confirmModal = examElement("finishConfirmModal");
  if (confirmModal) confirmModal.classList.add("hidden");

  const cfg = getSubjectConfig(state.exam);
  const subjectBreakdown = {};

  if (cfg.isBoardSubject) {
    // Board Subject: Calculate exact Section A, Section B, Section C weighted totals
    const secA = state.questions
      .map((q, idx) => ({ q, idx }))
      .filter((item) => (item.q.section || "") === "Section A");
    const secAScore = secA.reduce((sum, item) => {
      return sum + (evaluateQuestionScore(item.q, state.answers[item.idx]) * cfg.mcqWeight);
    }, 0);

    const secB = state.questions
      .map((q, idx) => ({ q, idx }))
      .filter((item) => (item.q.section || "") === "Section B");
    const secBScores = secB
      .map((item) => evaluateQuestionScore(item.q, state.answers[item.idx]) * cfg.shortWeight)
      .sort((a, b) => b - a);
    const secBScore = secBScores.slice(0, cfg.maxShort).reduce((a, b) => a + b, 0);

    const secC = state.questions
      .map((q, idx) => ({ q, idx }))
      .filter((item) => (item.q.section || "") === "Section C");
    const secCScores = secC
      .map((item) => evaluateQuestionScore(item.q, state.answers[item.idx]) * cfg.longWeight)
      .sort((a, b) => b - a);
    const secCScore = secCScores.slice(0, cfg.maxLong).reduce((a, b) => a + b, 0);

    const maxSecA = 20;
    const maxSecB = cfg.maxShort * cfg.shortWeight; // 30 for English, 25 for 75-mark subjects
    const maxSecC = cfg.maxLong * cfg.longWeight;   // 50 for English, 30 for 75-mark subjects

    subjectBreakdown[`Section A: 20 MCQs (1 Mark each)`] = {
      correct: Math.round(secAScore * 10) / 10,
      total: maxSecA,
      percentage: Math.round((secAScore / maxSecA) * 100)
    };
    subjectBreakdown[`Section B: 8 Short Questions (Attempt 5)`] = {
      correct: Math.round(secBScore * 10) / 10,
      total: maxSecB,
      percentage: Math.round((secBScore / maxSecB) * 100)
    };
    subjectBreakdown[`Section C: 4 Long Questions (Attempt 2)`] = {
      correct: Math.round(secCScore * 10) / 10,
      total: maxSecC,
      percentage: Math.round((secCScore / maxSecC) * 100)
    };
  } else {
    // Multi-subject Exam (Web Dev)
    const allSubjects = [...new Set(state.questions.map((q) => q.subject))];
    allSubjects.forEach((subj) => {
      const subjQuestions = state.questions.map((q, idx) => ({ ...q, originalIndex: idx })).filter((q) => q.subject === subj);
      if (subjQuestions.length > 0) {
        const correct = subjQuestions.reduce((acc, q) => {
          const ans = state.answers[q.originalIndex];
          return acc + evaluateQuestionScore(q, ans);
        }, 0);
        subjectBreakdown[subj] = {
          correct: Math.round(correct * 10) / 10,
          total: subjQuestions.length,
          percentage: Math.round((correct / subjQuestions.length) * 100)
        };
      }
    });
  }

  // Run Autonomous AI Pedagogical Examiner Evaluation
  const aiEvaluation = runAiExaminerEvaluation(state.exam, state.questions, state.answers);
  const calculatedMarks = calculateExamScore();

  window.parent.postMessage({
    type: "skilltester:exam-finished",
    reason,
    cheating,
    correctAnswers: Math.round(calculatedMarks * 10) / 10,
    obtainedMarks: Math.round(calculatedMarks * 10) / 10,
    totalMarks: cfg.totalMarks,
    passingMarks: cfg.passingMarks,
    questionCount: state.questions.length,
    subjectBreakdown,
    aiEvaluation,
    answerReview: state.questions.map((q, index) => {
      const ans = state.answers[index];
      if (q.isMultiSelect) {
        const selected = Array.isArray(ans) ? ans : (ans && Array.isArray(ans.selected) ? ans.selected : []);
        const selectedStr = selected.length > 0
          ? selected.map((i) => `${String.fromCharCode(65 + i)}. ${q.options[i]}`).join(" & ")
          : "Not attempted";
        const correctStr = (q.answers || []).map((i) => `${String.fromCharCode(65 + i)}. ${q.options[i]}`).join(" & ");
        const qScore = evaluateQuestionScore(q, ans);
        return {
          subject: q.subject,
          question: q.question,
          selectedAnswer: selectedStr,
          correctAnswer: correctStr,
          isCorrect: qScore === 1.0,
          partialCredit: qScore === 0.5
        };
      } else if (q.options) {
        const chosen = typeof ans === "number" ? ans : (ans && typeof ans.selected === "number" ? ans.selected : null);
        return {
          subject: q.subject,
          question: q.question,
          selectedAnswer: Number.isInteger(chosen) ? `${String.fromCharCode(65 + chosen)}. ${q.options[chosen]}` : "Not attempted",
          correctAnswer: `${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}`,
          isCorrect: chosen === q.answer
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

// Autonomous AI Examiner Forensic Assessment & Verification Engine
function runAiExaminerEvaluation(exam, questions, answers) {
  const COMMON_SPELLING_ERRORS = {
    aplication: "application",
    recieved: "received",
    seperate: "separate",
    progam: "program",
    programing: "programming",
    techer: "teacher",
    beleive: "believe",
    computor: "computer",
    librari: "library",
    princple: "principal",
    writting: "writing",
    exampel: "example",
    definately: "definitely",
    ocured: "occurred",
    goverment: "government",
    untill: "until",
    enviroment: "environment",
    grammer: "grammar",
    knowlege: "knowledge",
    colledge: "college",
    sincerly: "sincerely",
    obediently: "obediently",
    foward: "forward",
    impliment: "implement",
    arguement: "argument",
    lenght: "length",
    truely: "truly",
    noticable: "noticeable",
    fourty: "forty",
    thier: "their",
    wierd: "weird",
    accross: "across",
    succesful: "successful",
    privicy: "privacy",
    defination: "definition",
    occurrance: "occurrence",
    begining: "beginning"
  };

  let attemptedCount = 0;
  let unattemptedCount = 0;
  let totalSpellingMistakes = 0;
  const allSpellingFound = [];
  const questionAudits = [];

  let applicationAudit = null;
  let essayAudit = null;

  questions.forEach((q, idx) => {
    const ans = answers[idx];
    const hasAnswer = isAnswerProvided(ans);
    if (hasAnswer) {
      attemptedCount++;
    } else {
      unattemptedCount++;
    }

    if (q.options) {
      // Multiple Choice Question Audit
      const qScore = evaluateQuestionScore(q, ans);
      let status = "SKIPPED";
      let aiDiagnosis = "";
      if (!hasAnswer) {
        status = "SKIPPED";
        aiDiagnosis = `⚪ Unattempted. The correct answer was: ${q.isMultiSelect ? (q.answers || []).map((i) => q.options[i]).join(" & ") : q.options[q.answer]}.`;
      } else if (q.isMultiSelect) {
        if (qScore === 1.0) {
          status = "APPROVED";
          aiDiagnosis = "✓ 100% Accurate Multi-Select! Both required options correctly identified.";
        } else if (qScore === 0.5) {
          status = "PARTIAL";
          aiDiagnosis = "⚠️ Partial Credit (50%). You selected 1 correct attribute, but missed the second required option.";
        } else {
          status = "REJECTED";
          aiDiagnosis = `❌ Incorrect selection. Correct options: ${(q.answers || []).map((i) => q.options[i]).join(" & ")}.`;
        }
      } else {
        if (qScore === 1.0) {
          status = "APPROVED";
          aiDiagnosis = "✓ 100% Accurate! Mastered the core concept.";
        } else {
          status = "REJECTED";
          aiDiagnosis = `❌ Concept Mistake. You selected '${ans !== null && ans !== undefined ? q.options[ans] : "None"}', whereas '${q.options[q.answer]}' is the standard verified answer.`;
        }
      }

      questionAudits.push({
        qIndex: idx + 1,
        subject: q.subject,
        section: q.section,
        question: q.question,
        type: q.isMultiSelect ? "multi_mcq" : "mcq",
        status,
        scoreAwarded: qScore,
        aiDiagnosis,
        spellingMistakes: []
      });
    } else {
      // Subjective Assessment Audit
      const textVal = typeof ans === "string" ? ans : (ans?.text || "");
      const isChoiceWriting = q.type === "choice_writing";
      const choiceIdx = typeof ans === "object" ? (ans?.choiceIdx || 0) : 0;
      const isApplication = q.question.toLowerCase().includes("application") || (isChoiceWriting && choiceIdx === 0 && q.choices && q.choices[0].toLowerCase().includes("letter"));
      const isEssay = q.question.toLowerCase().includes("essay") || (isChoiceWriting && choiceIdx === 1);

      // Check spelling errors
      const spottedWords = [];
      const words = textVal.toLowerCase().match(/\b[a-z]+\b/g) || [];
      words.forEach((w) => {
        if (COMMON_SPELLING_ERRORS[w] && !spottedWords.includes(w)) {
          spottedWords.push(`${w} -> ${COMMON_SPELLING_ERRORS[w]}`);
          allSpellingFound.push(`${w} -> ${COMMON_SPELLING_ERRORS[w]}`);
          totalSpellingMistakes++;
        }
      });

      const wordCount = words.length;
      let status = "SKIPPED";
      let aiDiagnosis = "";
      let scoreAwarded = 0;

      if (!hasAnswer || wordCount < 5) {
        status = "SKIPPED";
        aiDiagnosis = "❌ Unattempted / Blank Answer (0 Marks). Candidate skipped this required subjective assessment.";
      } else if (isApplication) {
        const hasSalutation = /(to\s+(the\s+)?(principal|editor|headmaster|director|controller|chairman|board)|respected\s+(sir|madam|teacher)|dear\s+(sir|madam|editor))/i.test(textVal);
        const hasSubject = /(subject\s*[:\-]|\bsub\s*[:\-])/i.test(textVal);
        const hasBody = /(humbly\s+(state|request|beg)|beg\s+to\s+state|state\s+that|leave\s+for|grant\s+me|cyber\s+safety|digital\s+literacy|draw\s+your\s+attention|bring\s+to\s+your\s+notice|migration|certificate|verification|issuance)/i.test(textVal);
        const hasClosing = /(yours\s+obediently|yours\s+sincerely|yours\s+faithfully|thanking\s+you|regards|yours\s+truly)/i.test(textVal);

        if (hasSalutation && hasSubject && hasBody && hasClosing && wordCount >= 30) {
          status = "APPROVED";
          scoreAwarded = 1.0;
          aiDiagnosis = "✅ OFFICIAL APPLICATION APPROVED! Complies with Board examination standards. Professional salutation, precise subject line, clear body context, and formal closing signature verified.";
        } else if ((hasSalutation || hasSubject) && (hasBody || hasClosing) && wordCount >= 20) {
          status = "PARTIAL";
          scoreAwarded = 0.7;
          aiDiagnosis = "⚠️ CONDITIONAL APPROVAL (Format Gaps): Content is partially structured, but missing formal standard elements (either Subject line or formal Closing).";
        } else {
          status = "REJECTED";
          scoreAwarded = 0.3;
          aiDiagnosis = "❌ APPLICATION REJECTED: Candidate submitted informal or fragmented text. Missing essential formal conventions: recipient address, subject, or closing signature.";
        }

        applicationAudit = {
          status,
          title: isChoiceWriting ? q.choices[choiceIdx] : "Formal Application / Letter",
          wordCount,
          hasSalutation,
          hasSubject,
          hasBody,
          hasClosing,
          spellingMistakes: spottedWords,
          feedback: aiDiagnosis
        };
      } else if (isEssay) {
        const hasHeadings = /<h[1-4]>.*?<\/h[1-4]>/i.test(textVal);
        if (wordCount >= 100) {
          status = "APPROVED";
          scoreAwarded = 1.0;
          aiDiagnosis = `★ EXCELLENT COMPOSITION (${wordCount} words): Comprehensive topic depth and paragraph structure. ${hasHeadings ? "✨ HTML Headings (<h1> to <h4>) detected and praised!" : ""}`;
        } else if (wordCount >= 40) {
          status = "PARTIAL";
          scoreAwarded = 0.6;
          aiDiagnosis = `⚠️ MODERATE LENGTH (${wordCount} words): Core points mentioned, but requires additional elaboration and supporting arguments to achieve full marks.`;
        } else {
          status = "REJECTED";
          scoreAwarded = 0.2;
          aiDiagnosis = `❌ UNDERLENGTH ESSAY (${wordCount} words): Essays require minimum 120-250 words covering Introduction, Body, and Conclusion.`;
        }

        essayAudit = {
          status,
          wordCount,
          hasHeadings,
          spellingMistakes: spottedWords,
          feedback: aiDiagnosis
        };
      } else {
        // Theory short / long / code / math
        if (wordCount >= 25) {
          status = "APPROVED";
          scoreAwarded = 1.0;
          aiDiagnosis = `✓ Verified Concept & Logic (${wordCount} words). Candidate provided adequate technical reasoning and key principles.`;
        } else if (wordCount >= 10) {
          status = "PARTIAL";
          scoreAwarded = 0.5;
          aiDiagnosis = `⚠️ Brief Answer (${wordCount} words). Essential concept touched upon, but missing detailed technical definitions or derivations.`;
        } else {
          status = "REJECTED";
          scoreAwarded = 0.2;
          aiDiagnosis = "❌ Insufficient depth (< 10 words). Question requires detailed multi-point comparative explanation.";
        }
      }

      questionAudits.push({
        qIndex: idx + 1,
        subject: q.subject,
        section: q.section,
        question: q.question,
        type: isApplication ? "application" : isEssay ? "essay" : "subjective",
        status,
        scoreAwarded,
        aiDiagnosis,
        studentAnswer: textVal || "Not attempted",
        spellingMistakes: spottedWords
      });
    }
  });

  // Generate overall pedagogical review
  let overallVerdict = "EXCELLENT";
  const attemptedRatio = questions.length > 0 ? (attemptedCount / questions.length) : 0;
  if (attemptedRatio < 0.5) {
    overallVerdict = "NEEDS_IMPROVEMENT";
  } else if (attemptedRatio < 0.8 || totalSpellingMistakes > 5) {
    overallVerdict = "SATISFACTORY";
  }

  let teacherNotes = `Paper audited by AI Academic Examiner. The candidate attempted ${attemptedCount} out of ${questions.length} questions (${Math.round(attemptedRatio * 100)}% coverage). `;
  if (applicationAudit) {
    teacherNotes += `Application / Letter Verdict: ${applicationAudit.status === "APPROVED" ? "APPROVED with standard formal etiquette" : applicationAudit.status === "PARTIAL" ? "Partially Approved with minor structural omissions" : "REJECTED due to informal formatting"}. `;
  }
  if (essayAudit) {
    teacherNotes += `Essay depth: ${essayAudit.wordCount} words (${essayAudit.status}). `;
  }
  if (totalSpellingMistakes > 0) {
    teacherNotes += `Spotted ${totalSpellingMistakes} potential spelling/typo errors across written responses. `;
  } else {
    teacherNotes += `Clean vocabulary with zero identified spelling anomalies. `;
  }
  teacherNotes += `Examiner Recommendation: ${attemptedRatio >= 0.75 ? "Strong academic competence and sound subject understanding." : "Focus on time pacing, comprehensive essay development, and formal letter structure."}`;

  return {
    overallVerdict,
    attemptedCount,
    unattemptedCount,
    totalQuestions: questions.length,
    totalSpellingMistakes,
    spellingErrors: allSpellingFound,
    applicationAudit: applicationAudit || { status: "NOT_APPLICABLE", feedback: "No formal application component in this exam track." },
    essayAudit: essayAudit || { status: "NOT_APPLICABLE", feedback: "No essay component in this exam track." },
    teacherNotes,
    questionAudits
  };
}

function evaluateQuestionScore(q, ans) {
  if (!isAnswerProvided(ans)) return 0;

  // Multi-Select Question
  if (q.isMultiSelect && Array.isArray(q.answers)) {
    const selected = Array.isArray(ans)
      ? ans
      : (ans && Array.isArray(ans.selected) ? ans.selected : []);
    if (selected.length === 0) return 0;

    // Rule: If an incorrect option is selected, assign 0 marks
    const hasIncorrect = selected.some((idx) => !q.answers.includes(idx));
    if (hasIncorrect) return 0;

    // Count correct selections
    const correctCount = selected.filter((idx) => q.answers.includes(idx)).length;
    if (correctCount === q.answers.length) {
      return 1.0; // 100% full weightage
    } else if (correctCount > 0) {
      return 0.5; // Partial credit (50% marks)
    }
    return 0;
  }

  // Single-Select MCQ
  if (q.options) {
    const chosen = typeof ans === "number" ? ans : (ans && typeof ans.selected === "number" ? ans.selected : null);
    return chosen === q.answer ? 1.0 : 0;
  }

  // Subjective Question
  const isAttempted = ans && (typeof ans === "string" ? ans.trim().length >= 15 : (ans.text && ans.text.trim().length >= 15));
  return isAttempted ? 1.0 : 0;
}

function calculateExamScore() {
  const cfg = getSubjectConfig(state.exam);
  if (!cfg.isBoardSubject) {
    const rawScore = state.questions.reduce((total, q, index) => {
      return total + evaluateQuestionScore(q, state.answers[index]);
    }, 0);
    return Math.min(cfg.totalMarks, Math.round(((rawScore / (state.questions.length || 60)) * cfg.totalMarks) * 10) / 10);
  }

  // Board Subject: Section A (MCQs 1 mark each) + Section B (Short best 5) + Section C (Long best 2)
  const secA = state.questions
    .map((q, idx) => ({ q, idx }))
    .filter((item) => (item.q.section || "") === "Section A");
  const secAScore = secA.reduce((sum, item) => {
    return sum + (evaluateQuestionScore(item.q, state.answers[item.idx]) * cfg.mcqWeight);
  }, 0);

  const secB = state.questions
    .map((q, idx) => ({ q, idx }))
    .filter((item) => (item.q.section || "") === "Section B");
  const secBScores = secB
    .map((item) => evaluateQuestionScore(item.q, state.answers[item.idx]) * cfg.shortWeight)
    .sort((a, b) => b - a);
  const secBScore = secBScores.slice(0, cfg.maxShort).reduce((a, b) => a + b, 0);

  const secC = state.questions
    .map((q, idx) => ({ q, idx }))
    .filter((item) => (item.q.section || "") === "Section C");
  const secCScores = secC
    .map((item) => evaluateQuestionScore(item.q, state.answers[item.idx]) * cfg.longWeight)
    .sort((a, b) => b - a);
  const secCScore = secCScores.slice(0, cfg.maxLong).reduce((a, b) => a + b, 0);

  return Math.min(cfg.totalMarks, Math.round((secAScore + secBScore + secCScore) * 10) / 10);
}

function renderSubjectTabs() {
  const tabs = examElement("subjectTabs");
  tabs.replaceChildren();

  const isWebDev = state.exam.toLowerCase().includes("web") || state.exam.toLowerCase().includes("all subjects") || state.questions.some((q) => q.subject === "HTML5");

  if (isWebDev) {
    const subjects = [...new Set(state.questions.map((q) => q.subject))];
    subjects.forEach((subj) => {
      const subjCount = state.questions.filter((q) => q.subject === subj).length;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "subject-tab";
      button.textContent = `${subj} (${subjCount})`;
      if (state.questions[state.questionIndex]?.subject === subj) {
        button.classList.add("active");
      }
      button.addEventListener("click", () => {
        const firstQ = state.questions.findIndex((q) => q.subject === subj);
        if (firstQ !== -1) {
          state.questionIndex = firstQ;
          renderQuestion();
        }
      });
      tabs.appendChild(button);
    });
  } else {
    // Academic CS Group: Sections
    const sections = [...new Set(state.questions.map((q) => q.section || "Section A"))];
    sections.forEach((sec) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "subject-tab";
      button.textContent = sec;
      if ((state.questions[state.questionIndex]?.section || "Section A") === sec) {
        button.classList.add("active");
      }
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
  if (Array.isArray(ans)) return ans.length > 0;
  if (typeof ans === "string") return ans.trim().length > 0;
  if (typeof ans === "object") {
    if (Array.isArray(ans.selected)) return ans.selected.length > 0;
    return (ans.text || "").trim().length > 0;
  }
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

  const cfg = getSubjectConfig(state.exam);
  const marksSummaryEl = examElement("examSubjectMarksSummary");
  if (marksSummaryEl) {
    marksSummaryEl.textContent = `Total: ${cfg.totalMarks} Marks · Pass: ${cfg.passingMarks} Marks`;
  }

  const answeredCount = state.answers.filter((a) => isAnswerProvided(a)).length;
  examElement("score").textContent = `${answeredCount} / ${state.questions.length}`;
  examElement("questionProgress").style.width = `${(answeredCount / state.questions.length) * 100}%`;

  // Section Badges & Choice Quotas
  const sectionTitle = examElement("sectionTitleText");
  const sectionChoice = examElement("sectionChoiceText");

  let secQuota = "";
  let questionMarksBadge = "";

  if (currentSection === "Section B") {
    const secBAnswered = state.questions.filter((q, i) => q.section === "Section B" && isAnswerProvided(state.answers[i])).length;
    secQuota = `Attempted: ${secBAnswered} / 5 Short Questions (Attempt any 5 out of 8 · ${cfg.shortWeight} Marks each = ${cfg.maxShort * cfg.shortWeight} Marks)`;
    if (sectionTitle) sectionTitle.innerHTML = `<span>📌</span> Section B: Short &amp; Composition Questions (${secQuota})`;
    if (sectionChoice) sectionChoice.textContent = "Attempt any 5 · 3 Choice Exempt";
    questionMarksBadge = `<span class="q-marks-pill">📝 ${cfg.shortWeight} Marks (Short Q · Attempt any 5 of 8)</span>`;
  } else if (currentSection === "Section C") {
    const secCAnswered = state.questions.filter((q, i) => q.section === "Section C" && isAnswerProvided(state.answers[i])).length;
    secQuota = `Attempted: ${secCAnswered} / 2 Long Questions (Attempt any 2 out of 4 · ${cfg.longWeight} Marks each = ${cfg.maxLong * cfg.longWeight} Marks)`;
    if (sectionTitle) sectionTitle.innerHTML = `<span>📌</span> Section C: Detailed Comprehensive Questions (${secQuota})`;
    if (sectionChoice) sectionChoice.textContent = "Attempt any 2 · 2 Choice Exempt";
    questionMarksBadge = `<span class="q-marks-pill">🖋️ ${cfg.longWeight} Marks (Long Q · Attempt any 2 of 4)</span>`;
  } else if (current.subject === "HTML5" || currentSection === "HTML5") {
    const htmlDone = state.questions.filter((q, i) => q.subject === "HTML5" && isAnswerProvided(state.answers[i])).length;
    if (sectionTitle) sectionTitle.innerHTML = `<span>🌐</span> HTML5: Semantic Structure, Forms &amp; Canvas (${htmlDone} / 20 Answered)`;
    if (sectionChoice) sectionChoice.textContent = "20 MCQs · 40/100 To Pass · Instant Locking";
    questionMarksBadge = `<span class="q-marks-pill">🎯 1.67 Marks (MCQ · Total 60 MCQs)</span>`;
  } else if (current.subject === "CSS3" || currentSection === "CSS3") {
    const cssDone = state.questions.filter((q, i) => q.subject === "CSS3" && isAnswerProvided(state.answers[i])).length;
    if (sectionTitle) sectionTitle.innerHTML = `<span>🎨</span> CSS3: Flexbox, Grid, Animations &amp; Responsive Layout (${cssDone} / 20 Answered)`;
    if (sectionChoice) sectionChoice.textContent = "20 MCQs · 40/100 To Pass · Instant Locking";
    questionMarksBadge = `<span class="q-marks-pill">🎯 1.67 Marks (MCQ · Total 60 MCQs)</span>`;
  } else if (current.subject === "JavaScript" || currentSection === "JavaScript") {
    const jsDone = state.questions.filter((q, i) => q.subject === "JavaScript" && isAnswerProvided(state.answers[i])).length;
    if (sectionTitle) sectionTitle.innerHTML = `<span>⚡</span> JavaScript ES6+: Syntax, Asynchronous Logic &amp; DOM (${jsDone} / 20 Answered)`;
    if (sectionChoice) sectionChoice.textContent = "20 MCQs · 40/100 To Pass · Instant Locking";
    questionMarksBadge = `<span class="q-marks-pill">🎯 1.67 Marks (MCQ · Total 60 MCQs)</span>`;
  } else {
    if (sectionTitle) sectionTitle.innerHTML = `<span>📌</span> Section A: Objective Multiple Choice Questions (20 MCQs · 1 Mark each = 20 Marks)`;
    if (sectionChoice) sectionChoice.textContent = "20 Compulsory MCQs (1 Mark each)";
    questionMarksBadge = `<span class="q-marks-pill">🎯 1 Mark (MCQ)</span>`;
  }

  // Difficulty badge & Multi-select indicator
  const diffClass = (current.difficulty || "medium").toLowerCase();
  const diffLabel = current.difficulty || "Medium";
  const questionTitle = examElement("questionTitle");
  const multiBadge = current.isMultiSelect
    ? `<span class="multiselect-badge">☑️ MULTI-SELECT (Select 2 Correct Options)</span>`
    : "";

  questionTitle.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
      <span class="difficulty-badge ${diffClass}">Difficulty: ${diffLabel}</span>
      ${questionMarksBadge}
      ${multiBadge}
    </div>
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
      correctAnswers: Math.round(calculateExamScore() * 10) / 10,
      questionCount: state.questions.length,
      currentQuestion: state.questionIndex + 1,
      secondsLeft: state.secondsLeft
    }, "*");
  }

  updateQuestionCounts();
  renderSubjectTabs();
  [...examElement("subjectTabs").children].forEach((button) => {
    button.classList.toggle("active", button.textContent.startsWith(current.subject) || button.textContent === currentSection);
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
    if (current.isMultiSelect) {
      // MULTI-SELECT MCQ (2 Correct Options)
      const currentAns = state.answers[state.questionIndex];
      const isLocked = currentAns && currentAns.locked === true;
      const selected = (currentAns && Array.isArray(currentAns.selected))
        ? currentAns.selected
        : (Array.isArray(currentAns) ? currentAns : []);

      current.options.forEach((optionText, optionIndex) => {
        const button = document.createElement("button");
        button.className = "option multiselect-option";
        button.type = "button";
        const isSelected = selected.includes(optionIndex);
        button.classList.toggle("selected", isSelected);
        button.classList.toggle("locked", isLocked);

        const checkIndicator = document.createElement("span");
        checkIndicator.className = "option-checkbox-indicator";
        checkIndicator.textContent = isSelected ? "✓" : "";

        const textSpan = document.createElement("span");
        textSpan.innerHTML = `<strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${optionText}`;

        button.appendChild(checkIndicator);
        button.appendChild(textSpan);

        button.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!state.examActive) return;

          if (isLocked) {
            answerFeedback.textContent = "🔒 Selection is locked! In accordance with strict examination rules, locked options cannot be modified.";
            return;
          }

          let newSelected = [...selected];
          if (newSelected.includes(optionIndex)) {
            newSelected = newSelected.filter((idx) => idx !== optionIndex);
          } else {
            if (newSelected.length >= 2) {
              answerFeedback.textContent = "⚠️ This question requires exactly 2 options. Deselect one option first to choose another.";
              return;
            }
            newSelected.push(optionIndex);
          }

          state.answers[state.questionIndex] = {
            selected: newSelected,
            locked: false
          };
          renderQuestion();
        });

        optionsContainer.appendChild(button);
      });

      // Multi-Select Lock Action Bar
      const lockBar = document.createElement("div");
      lockBar.className = "lock-multiselect-container";

      if (!isLocked) {
        const lockBtn = document.createElement("button");
        lockBtn.type = "button";
        lockBtn.className = "lock-multiselect-btn";
        lockBtn.innerHTML = `🔒 Confirm &amp; Lock Selection (${selected.length} / 2 Selected)`;
        lockBtn.disabled = selected.length === 0;

        lockBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (selected.length === 0) {
            answerFeedback.textContent = "⚠️ Please select at least 1 or 2 options before locking.";
            return;
          }
          state.answers[state.questionIndex] = {
            selected: [...selected],
            locked: true
          };
          renderQuestion();
        });

        const helperNote = document.createElement("span");
        helperNote.style.color = "#94a3b8";
        helperNote.style.fontSize = "0.82rem";
        helperNote.textContent = selected.length === 2
          ? "✓ 2 options selected. Click Lock to finalize."
          : `Select ${2 - selected.length} more option(s) or lock when ready.`;

        lockBar.appendChild(lockBtn);
        lockBar.appendChild(helperNote);
        optionsContainer.appendChild(lockBar);

        if (selected.length > 0) {
          answerFeedback.textContent = `${selected.length} of 2 options selected. Remember to click 'Confirm & Lock Selection' when done.`;
        }
      } else {
        const lockedNotice = document.createElement("div");
        lockedNotice.style.display = "inline-flex";
        lockedNotice.style.alignItems = "center";
        lockedNotice.style.gap = "8px";
        lockedNotice.style.color = "#38bdf8";
        lockedNotice.style.fontSize = "0.85rem";
        lockedNotice.style.fontWeight = "700";
        lockedNotice.innerHTML = `🔒 Multi-select answer locked (${selected.length} option(s) recorded). Full credit requires both correct options.`;
        lockBar.appendChild(lockedNotice);
        optionsContainer.appendChild(lockBar);

        answerFeedback.textContent = "Selection locked. AI Sentinel has recorded your submission.";
      }

    } else {
      // SINGLE-SELECT MCQ WITH ONE-CLICK IMMEDIATE LOCKING
      const selectedAnswer = state.answers[state.questionIndex];
      const isLocked = Number.isInteger(selectedAnswer);

      current.options.forEach((optionText, optionIndex) => {
        const button = document.createElement("button");
        button.className = "option";
        button.type = "button";
        button.textContent = `${String.fromCharCode(65 + optionIndex)}. ${optionText}`;
        const isSelected = selectedAnswer === optionIndex;
        button.classList.toggle("selected", isSelected);
        button.classList.toggle("locked", isLocked);

        button.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!state.examActive) return;

          if (isLocked) {
            answerFeedback.textContent = "🔒 Selection is locked! Changing answers or double-clicking is prevented by AI Proctor Sentinel.";
            return;
          }

          // One-click lock immediately
          state.answers[state.questionIndex] = optionIndex;
          renderQuestion();
        });

        optionsContainer.appendChild(button);
      });

      if (isLocked) {
        answerFeedback.textContent = "🔒 Answer locked immediately upon selection. Option is permanently recorded.";
      }
    }
  } else {
    // CASE 2: SUBJECTIVE WRITTEN QUESTION (Short, Letter/Essay Choice, Sentences, Long)
    const currentVal = state.answers[state.questionIndex] || (current.type === "choice_writing" ? { choiceIdx: current.defaultChoice || 0, text: "" } : "");
    const textValue = typeof currentVal === "string" ? currentVal : (currentVal.text || "");
    const choiceIdx = typeof currentVal === "object" ? (currentVal.choiceIdx || 0) : 0;

    const subjectiveWrap = document.createElement("div");
    subjectiveWrap.className = "subjective-answer-area";

    // Heading Helper Bar (VS Code style <h1> - <h4> tags)
    const helperBar = document.createElement("div");
    helperBar.className = "heading-helper-bar";
    helperBar.innerHTML = `
      <span class="heading-helper-label"><span>🏷️</span> HTML Headings (VS Code Style):</span>
    `;

    const tagList = ["h1", "h2", "h3", "h4"];
    tagList.forEach((tag) => {
      const tagBtn = document.createElement("button");
      tagBtn.type = "button";
      tagBtn.className = "heading-tag-btn";
      tagBtn.textContent = `<${tag}>`;
      tagBtn.title = `Insert <${tag}>...</${tag}> tag (Press Enter to render)`;
      tagBtn.addEventListener("click", () => {
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const val = textarea.value;
        const sel = val.substring(start, end) || `Heading ${tag.toUpperCase()}`;
        const snippet = `<${tag}>${sel}</${tag}>\n`;
        textarea.value = val.substring(0, start) + snippet + val.substring(end);
        textarea.focus();
        const cursor = start + snippet.length;
        textarea.setSelectionRange(cursor, cursor);
        textarea.dispatchEvent(new Event("input"));
      });
      helperBar.appendChild(tagBtn);
    });

    const helperTip = document.createElement("small");
    helperTip.style.color = "#94a3b8";
    helperTip.style.fontSize = "0.78rem";
    helperTip.style.marginLeft = "auto";
    helperTip.textContent = "💡 Type <h1>Title</h1> & hit Enter to preview";
    helperBar.appendChild(helperTip);
    subjectiveWrap.appendChild(helperBar);

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
    textarea.placeholder = current.placeholder || "Type your comprehensive answer here (e.g. <h1>Introduction</h1>)...";
    textarea.value = textValue;

    // Live HTML Heading Preview Box
    const previewPanel = document.createElement("div");
    previewPanel.className = "heading-preview-panel";
    previewPanel.innerHTML = `
      <div class="heading-preview-header">
        <span><strong>Live Output Preview:</strong> Headings &lt;h1&gt; to &lt;h4&gt; render below</span>
        <span style="font-family:monospace; color:#38bdf8;">VS Code Engine</span>
      </div>
      <div class="heading-preview-content" id="headingPreviewContent"></div>
    `;
    const previewContent = previewPanel.querySelector("#headingPreviewContent");

    const updateLivePreview = (text) => {
      if (!previewContent) return;
      previewContent.innerHTML = formatHeadingHtml(text);
    };

    textarea.addEventListener("input", (e) => {
      const newText = e.target.value;
      if (current.type === "choice_writing") {
        state.answers[state.questionIndex] = { choiceIdx, text: newText };
      } else {
        state.answers[state.questionIndex] = newText;
      }
      updateQuestionCounts();
      updateLivePreview(newText);
    });

    // Handle Enter key for fast heading completion
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        setTimeout(() => updateLivePreview(textarea.value), 10);
      }
    });

    updateLivePreview(textValue);

    subjectiveWrap.appendChild(textarea);
    subjectiveWrap.appendChild(previewPanel);
    optionsContainer.appendChild(subjectiveWrap);
    answerFeedback.textContent = "Your response is auto-saved as you type. Headings <h1> through <h4> render live in the preview.";
  }
}

function formatHeadingHtml(rawText) {
  if (!rawText || !rawText.trim()) {
    return `<div class="heading-preview-empty">Type your answer above. Any &lt;h1&gt;, &lt;h2&gt;, &lt;h3&gt;, or &lt;h4&gt; tags will automatically render as real headings here upon typing or pressing Enter.</div>`;
  }

  // Escape HTML characters for safety
  let safe = rawText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Re-enable safe h1, h2, h3, h4 tags (case-insensitive)
  safe = safe.replace(/&lt;h1&gt;(.*?)&lt;\/h1&gt;/gis, "<h1>$1</h1>");
  safe = safe.replace(/&lt;h2&gt;(.*?)&lt;\/h2&gt;/gis, "<h2>$1</h2>");
  safe = safe.replace(/&lt;h3&gt;(.*?)&lt;\/h3&gt;/gis, "<h3>$1</h3>");
  safe = safe.replace(/&lt;h4&gt;(.*?)&lt;\/h4&gt;/gis, "<h4>$1</h4>");

  // Convert line breaks
  safe = safe.replace(/\n/g, "<br>");
  return safe;
}

function goToQuestion(direction) {
  const nextIndex = state.questionIndex + direction;
  if (nextIndex < 0 || nextIndex >= state.questions.length) return;
  state.questionIndex = nextIndex;
  renderQuestion();
}

// AI Sentinel Cheating Interceptor
function triggerAiViolation(reason) {
  if (!state.examActive || state.finishing || state.finishModalOpen) return;
  state.aiWarningsCount += 1;
  const eye = examElement("aiEyeIndicator");
  if (eye) eye.classList.add("alert");

  if (state.aiWarningsCount >= state.maxAiWarnings) {
    const termReason = `AI Proctor Disqualification: Repeated integrity breaches detected (${state.aiWarningsCount} attempts: ${reason}).`;
    finishExam(termReason, true);
  } else {
    const remaining = 5 - state.aiWarningsCount;
    const remainingText = remaining <= 0 
      ? "FINAL CHANCE! 0 warnings left. Next breach will instantly disqualify you!" 
      : `${remaining} warning(s) left before instant disqualification on 6th breach!`;
    const warningText = `🚨 AI PROCTOR SENTINEL ALERT (Warning ${state.aiWarningsCount}/5): ${reason}! Restricted shortcuts are locked. ${remainingText}`;
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
  window.parent.postMessage({ type: "skilltester:begin-exam", exam: "Web Development" }, "*");
});

function openFinishConfirmModal() {
  if (!state.examActive || state.finishing) return;
  state.finishModalOpen = true;

  const total = state.questions.length;
  const answered = state.answers.filter((a) => isAnswerProvided(a)).length;
  const unattempted = total - answered;
  const cfg = getSubjectConfig(state.exam);

  const mTotal = examElement("fModalTotalQ");
  const mAns = examElement("fModalAttempted");
  const mUnans = examElement("fModalUnattempted");
  const mMarks = examElement("fModalSubjectMarks");
  const warnBox = examElement("fModalWarningBox");
  const warnCount = examElement("fModalUnattemptedCount");
  const modal = examElement("finishConfirmModal");

  if (mTotal) mTotal.textContent = String(total);
  if (mAns) mAns.textContent = String(answered);
  if (mUnans) mUnans.textContent = String(unattempted);
  if (mMarks) mMarks.textContent = `${cfg.totalMarks} (Pass: ${cfg.passingMarks})`;

  if (warnBox && warnCount) {
    if (unattempted > 0) {
      warnCount.textContent = String(unattempted);
      warnBox.classList.remove("hidden");
    } else {
      warnBox.classList.add("hidden");
    }
  }

  if (modal) modal.classList.remove("hidden");
}

function closeFinishConfirmModal() {
  state.finishModalOpen = false;
  const modal = examElement("finishConfirmModal");
  if (modal) modal.classList.add("hidden");
}

examElement("previousQuestion").addEventListener("click", () => goToQuestion(-1));
examElement("nextQuestion").addEventListener("click", () => goToQuestion(1));

examElement("finishExamButton")?.addEventListener("click", () => {
  openFinishConfirmModal();
});

examElement("cancelFinishBtn")?.addEventListener("click", () => {
  closeFinishConfirmModal();
});

examElement("finishModalBackdrop")?.addEventListener("click", () => {
  closeFinishConfirmModal();
});

examElement("confirmFinishBtn")?.addEventListener("click", () => {
  closeFinishConfirmModal();
  finishExam("Exam completed by candidate.");
});

window.addEventListener("message", (event) => {
  if (event.source !== window.parent || !event.data || typeof event.data !== "object") return;
  if (event.data.type === "skilltester:start-exam") {
    startExam(event.data.exam, event.data.durationMinutes, event.data.candidate || { studentId: event.data.studentId });
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
  if (!state.examActive || state.finishing || state.finishModalOpen) return;

  const key = event.key || "";
  const isEscape = key === "Escape" || key === "Esc" || event.keyCode === 27;
  const isPrintScreen = key === "PrintScreen" || event.keyCode === 44;
  const isFKey = /^F\d+$/.test(key) || (event.keyCode >= 112 && event.keyCode <= 123);
  const isAltCombo = event.altKey;
  const isMetaKey = event.metaKey;
  const isCtrlCombo = event.ctrlKey;

  if (isEscape || isPrintScreen || isFKey || isAltCombo || isMetaKey || isCtrlCombo) {
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    if (event.type === "keydown") {
      const violation = isEscape ? "Escape" : isAltCombo ? "Alt Shortcut" : isMetaKey ? "Windows Key" : isPrintScreen ? "Screenshot" : `Ctrl+${key}`;
      triggerAiViolation(violation);
    }
    return false;
  }

  // Allow normal typing inside subjective answer textareas or scratchpad ONLY if no shortcut modifiers held
  if (event.target && (event.target.tagName === "TEXTAREA" || event.target.tagName === "INPUT")) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  return false;
};
document.addEventListener("keydown", blockKeyboard, true);
document.addEventListener("keyup", blockKeyboard, true);
document.addEventListener("keypress", blockKeyboard, true);

// Mouse non-left click block
document.addEventListener("mousedown", (e) => {
  if (e.button !== 0) {
    e.preventDefault();
    e.stopPropagation();
    if (state.examActive && !state.finishing && !state.finishModalOpen) {
      triggerAiViolation("Right-Click / Aux Click attempt");
    }
    return false;
  }
}, true);
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (state.examActive && !state.finishing && !state.finishModalOpen) {
    triggerAiViolation("Right-Click context menu attempt");
  }
  return false;
}, true);

let lastFrameTopWarn = 0;
document.addEventListener("mousemove", (e) => {
  if (state.examActive && !state.finishing && e.clientY <= 15 && Date.now() - lastFrameTopWarn > 4000) {
    lastFrameTopWarn = Date.now();
    try {
      window.parent.postMessage({ type: "skilltester:top-edge-warning" }, "*");
    } catch (_) {}
  }
}, { passive: true });

// Window blur inside iframe: verify actual backgrounding/tab-switch before strike
window.addEventListener("blur", () => {
  if (state.examActive && !state.finishing && !state.finishModalOpen) {
    window.setTimeout(() => {
      if (document.hidden && state.examActive && !state.finishing && !state.finishModalOpen) {
        triggerAiViolation("Focus lost / Tab switched to background");
      }
    }, 500);
  }
});
