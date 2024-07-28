let questions = [];
let currentQuestionIndex = 0;
let score = 0;

document.addEventListener("DOMContentLoaded", () => {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            displayQuestion();
        });

    document.getElementById("submit-btn").addEventListener("click", validateRegex);
});

function displayQuestion() {
    const questionContainer = document.getElementById("question-container");

    if (currentQuestionIndex < questions.length) {
        questionContainer.innerHTML = `
            <p>Question ${currentQuestionIndex + 1}: ${questions[currentQuestionIndex].question}</p>
        `;
    } else {
        questionContainer.innerHTML = `
            <p>Game Over!</p>
            <p>Final Score: ${score}</p>
        `;
        document.getElementById("user-regex").style.display = "none";
        document.getElementById("submit-btn").style.display = "none";
        document.getElementById("score").style.display = "none";
    }
}

function validateRegex() {
    const userRegex = new RegExp(document.getElementById("user-regex").value);
    const question = questions[currentQuestionIndex];
    const testCases = question.testCases;
    const expected = question.expected;

    let allPass = true;

    for (let i = 0; i < testCases.length; i++) {
        if (userRegex.test(testCases[i]) !== expected[i]) {
            allPass = false;
            break;
        }
    }

    if (allPass) {
        score++;
    }
     // Clear the input field
    document.getElementById("user-regex").value = '';

    // Optionally, hide any result messages or feedback here if you have them
    
    currentQuestionIndex++;
    displayQuestion();
}
