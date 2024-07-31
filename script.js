let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let hintVisible = false;

document.addEventListener("DOMContentLoaded", () => {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            displayQuestion();
        })
        .catch(error => {
            console.error("Error loading questions:", error);
        });

    document.getElementById("submit-btn").addEventListener("click", validateRegex);
    document.getElementById("hint-btn").addEventListener("click", showHint);
    document.getElementById("return-btn").addEventListener("click", returnToQuestion);
});

function displayQuestion() {
    const questionContainer = document.getElementById("question-container");
    const userRegex = document.getElementById("user-regex");
    const submitBtn = document.getElementById("submit-btn");
    const hintBtn = document.getElementById("hint-btn");
    const returnBtn = document.getElementById("return-btn");

    // Reset hint visibility and button display
    hintBtn.style.display = "none";
    returnBtn.style.display = "none";

    if (currentQuestionIndex < questions.length) {
        questionContainer.innerHTML = `
            <p>Question ${currentQuestionIndex + 1}: ${questions[currentQuestionIndex].question}</p>
        `;
        userRegex.style.display = "block";
        submitBtn.style.display = "block";
    } else {
        const percentage = (score / questions.length) * 100;
        questionContainer.innerHTML = `
            <p>Game Over!</p>
            <p>Final Score: ${score} of ${questions.length}</p>
            <p>Percentage: ${percentage.toFixed(2)}%</p>
        `;
        userRegex.style.display = "none";
        submitBtn.style.display = "none";
        hintBtn.style.display = "none";
        returnBtn.style.display = "none";
    }
}

function validateRegex() {
    const userRegexInput = document.getElementById("user-regex").value;
    let userRegex;

    try {
        userRegex = new RegExp(userRegexInput);
    } catch (e) {
        alert("Invalid regular expression.");
        return;
    }

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
        currentQuestionIndex++;
        displayQuestion();
    } else {
        document.getElementById("hint-btn").style.display = "block"; // Show hint button
        hintVisible = true; // Mark hint as visible
    }

    // Clear the input field
    document.getElementById("user-regex").value = '';
}

function showHint() {
    if (hintVisible) {
        const question = questions[currentQuestionIndex];
        const questionContainer = document.getElementById("question-container");

        // Update the container with hint and return button
        questionContainer.innerHTML = `
            <p>${question.hint}</p>
            <button id="return-btn">Return to Question</button>
        `;
        document.getElementById("user-regex").style.display = "none";
        document.getElementById("submit-btn").style.display = "none";
        document.getElementById("hint-btn").style.display = "none";
        document.getElementById("return-btn").style.display = "block";

        // Hide the hint after showing it
        hintVisible = false;
        document.getElementById("return-btn").addEventListener("click", returnToQuestion);
    }
}

function returnToQuestion() {

    // Restore input field and buttons visibility
    document.getElementById("user-regex").style.display = "block";
    document.getElementById("submit-btn").style.display = "block";
    document.getElementById("hint-btn").style.display = "block";
    document.getElementById("return-btn").style.display = "none";
    // Redisplay the current question
    displayQuestion();
}
