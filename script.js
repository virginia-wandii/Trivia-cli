const readline = require('readline-sync');

// 1. Data Store: Array of question objects
const triviaDatabase = [
    {
        question: "What does DOM stand for in JavaScript?",
        options: ["Document Object Model", "Data Object Management", "Digital Optimal Matrix", "Desktop Operation Module"],
        answer: 0, 
        points: 10
    },
    {
        question: "Which keyword is used to declare a block-scoped variable?",
        options: ["var", "let", "assign", "set"],
        answer: 1,
        points: 10
    },
    {
        question: "What is the correct syntax for a multi-line comment in JS?",
        options: ["// comment", "<!-- comment -->", "/* comment */", "# comment"],
        answer: 2,
        points: 10
    }
];

// 2. Global Game State Tracking
let score = 0;
let currentQuestionIndex = 0;
let gameTimer;
let timeLeft = 45; // Global countdown timer in seconds
let isGameOver = false;
let userAnswers = []; // Stores true/false for each question to use with array iteration later

// 3. Asynchronous Feature: Global Countdown Timer
function startTimer() {
    gameTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            if (!isGameOver) {
                console.log("\n\n⏱️  Time's up! The game has ended.");
                endGame();
            }
        }
    }, 1000);
}

// 4. Core Game Loop & Sequential Question Handling
function askQuestion() {
    if (timeLeft <= 0 || currentQuestionIndex >= triviaDatabase.length) {
        endGame();
        return;
    }

    const currentQuestion = triviaDatabase[currentQuestionIndex];
    
    console.log(`\n--------------------------------------------`);
    console.log(`⏳ Time Remaining: ${timeLeft}s | Current Score: ${score}`);
    console.log(`Question ${currentQuestionIndex + 1}: ${currentQuestion.question}\n`);

    // --- Array Iteration Method (.map) ---
    // Transforms the options array into a user-friendly numbered list format
    const formattedOptions = currentQuestion.options.map((option, index) => {
        return `  [${index + 1}] ${option}`;
    });
    
    // Use a standard loop/forEach to print the mapped options
    formattedOptions.forEach(displayOption => console.log(displayOption));
    console.log(`--------------------------------------------`);

    // User Interaction: Accept answer input via CLI
    const userInput = readline.question('\nYour selection (or type 0 to quit): ');

    if (userInput.trim() === '0') {
        endGame();
        return;
    }

    const parsedSelection = parseInt(userInput) - 1;

    // Instant Feedback System
    if (parsedSelection === currentQuestion.answer) {
        console.log("✅ Correct answer!");
        score += currentQuestion.points;
        userAnswers.push(true); 
    } else if (parsedSelection >= 0 && parsedSelection < currentQuestion.options.length) {
        console.log(`❌ Incorrect. The correct answer was: ${currentQuestion.options[currentQuestion.answer]}`);
        userAnswers.push(false);
    } else {
        console.log("⚠️ Invalid selection! Counts as incorrect.");
        userAnswers.push(false);
    }

    // Move sequentially to the next item
    currentQuestionIndex++;
    
    // Async scheduling for the next question view
    setTimeout(askQuestion, 1000); 
}

// 5. Game Over & Final Summary View
function endGame() {
    if (isGameOver) return; 
    isGameOver = true;
    clearInterval(gameTimer);

    // --- Array Iteration Method (.filter) ---
    // Filters out only the correct answers to show statistical breakdown
    const correctCount = userAnswers.filter(answer => answer === true).length;

    console.log(`\n============================================`);
    console.log(`🏁 GAME OVER 🏁`);
    console.log(`Final Score: ${score} points`);
    console.log(`Accuracy Profile: ${correctCount} correctly answered out of ${userAnswers.length} attempts`);
    console.log(`Thank you for playing our CLI Trivia Game!`);
    console.log(`============================================\n`);
    
    process.exit(0);
}

// 6. Game Initialization
function initGame() {
    console.log(`============================================`);
    console.log(`🧠 Welcome to the Interactive JS CLI Quiz! 🧠`);
    console.log(`Rules: Answer sequential questions before the clock expires.`);
    console.log(`============================================`);
    readline.question('Press Enter to initialize the game and start the clock...');
    
    startTimer();
    askQuestion();
}

// Launch application
initGame();
