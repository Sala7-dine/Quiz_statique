const jsdata = [
    {
    type: 'qcm',
    question: "Quelle méthode JavaScript ajoute un ou plusieurs éléments à la fin d'un tableau ?",
    options: ['push()', 'pop()', 'shift()', 'unshift()'],
    correctAnswer: 3,
    explanation: "push() ajoute un ou plusieurs éléments à la fin d'un tableau et retourne la nouvelle longueur."
    }, {
        type: 'qcm',
        question: "Quelle méthode JavaScript supprime le dernier élément d'un tableau ?",
        options: ['pop()', 'shift()', 'slice()', 'splice()'],
        correctAnswer: 0,
        explanation: "pop() supprime le dernier élément d'un tableau et retourne cet élément."
    }, {
        type: 'qcm',
        question: "Quelle structure permet de déclarer une variable dont la valeur ne change pas ?",
        options: ['let', 'const', 'var', 'static'],
        correctAnswer: 1,
        explanation: "const permet de déclarer une constante qui ne peut pas être réassignée."
}];

const htmldata = [
    {
        type: 'qcm',
        question: "Quelle méthode html ajoute un ou plusieurs éléments à la fin d'un tableau ?",
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 3,
        explanation: "push() ajoute un ou plusieurs éléments à la fin d'un tableau et retourne la nouvelle longueur."
    }, {
        type: 'qcm',
        question: "Quelle méthode JavaScript supprime le dernier élément d'un tableau ?",
        options: ['pop()', 'shift()', 'slice()', 'splice()'],
        correctAnswer: 0,
        explanation: "pop() supprime le dernier élément d'un tableau et retourne cet élément."
    }, {
        type: 'qcm',
        question: "Quelle structure permet de déclarer une variable dont la valeur ne change pas ?",
        options: ['let', 'const', 'var', 'static'],
        correctAnswer: 1,
        explanation: "const permet de déclarer une constante qui ne peut pas être réassignée."
    }];

const cssdata = [
    {
        type: 'qcm',
        question: "Quelle méthode css ajoute un ou plusieurs éléments à la fin d'un tableau ?",
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 3,
        explanation: "push() ajoute un ou plusieurs éléments à la fin d'un tableau et retourne la nouvelle longueur."
    }, {
        type: 'qcm',
        question: "Quelle méthode JavaScript supprime le dernier élément d'un tableau ?",
        options: ['pop()', 'shift()', 'slice()', 'splice()'],
        correctAnswer: 0,
        explanation: "pop() supprime le dernier élément d'un tableau et retourne cet élément."
    }, {
        type: 'qcm',
        question: "Quelle structure permet de déclarer une variable dont la valeur ne change pas ?",
        options: ['let', 'const', 'var', 'static'],
        correctAnswer: 1,
        explanation: "const permet de déclarer une constante qui ne peut pas être réassignée."
    }];

let welcomeSection = document.querySelector(".welcome-section");
let startBtn = document.querySelector(".start-button");
let quizSection = document.querySelector(".quiz-container");
let questionText = document.querySelector(".question-text");
let answers = document.querySelector(".answers");
let timerEl = document.querySelector("#timer");
let questionCounter = document.querySelector(".question-counter");
let nextBtn = document.querySelector("#next-btn");
let currentQuestion = document.querySelector("#current-question");
let modal = document.getElementById("modal");
let close = document.querySelector(".close");
let pseudo = document.querySelector(".pseudo");
let btnChoice = document.querySelectorAll(".btn-choice");
let cardsContainer = document.querySelector(".cards-container");

let actualeQuiz = 0;
let answersQuiz = [];
let timeLeft = 5;
let timerInterval = null;
let pseudoArray = [];
let theme = 0;

let data = [];

btnChoice.forEach(btn => {
    btn.addEventListener("click", () => {
        theme = parseInt(btn.value);

        if (theme === 1) {
            data = jsdata;
        }else if (theme === 2) {
            data = htmldata;
        }else if (theme === 3) {
            data = cssdata;
        }

        cardsContainer.style.display = "none";

        modal.style.display = "flex";

    });
});


if (localStorage.getItem("pseudo")) {
    pseudoArray = JSON.parse(localStorage.getItem("pseudo"));
}

startBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});


const Pseudo = () => {

    if (pseudoArray.includes(pseudo.value)){
        if(pseudo.value === ""){
            document.querySelector(".error").textContent = "le nom ne peut etre vide";
            return;
        }
        document.querySelector(".error").textContent = "le nom deja existe";
        return;
    }

    modal.style.display = "none";
    pseudoArray.push(pseudo.value);

    localStorage.setItem("pseudo", JSON.stringify(pseudoArray));

    welcomeSection.style.display = "none";
    quizSection.style.display = "block";
    actualeQuiz = 0;
    answersQuiz = [];

    HandleQuiz();
}

close.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



const HandleQuiz = () => {

    if (actualeQuiz >= data.length) {
        answersQuiz.innerHTML = "<h2>Quiz Termine</h2>"

        console.log(answersQuiz);
        return;
    }

    questionText.innerHTML = data[actualeQuiz].question;
    answers.innerHTML = questionTemplate(data[actualeQuiz]);
    currentQuestion.innerHTML = (actualeQuiz + 1).toString();

    timeLeft = 5;
    startTimer();
};


const questionTemplate = (qs) => {
    return qs.options.map((opt, i) => `
        <label class="answer-option">
            <input type="radio" name="answer" value=${i}> 
            ${opt}
        </label>
    `).join("");
};


const startTimer = () => {
    clearInterval(timerInterval);
    timerEl.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            saveAnswer(-1, 5);
            actualeQuiz++;
            HandleQuiz();
        }
    }, 1000);
};


const saveAnswer = (choice, timeSpent) => {

    answersQuiz.push({
        question: data[actualeQuiz].question,
        choix: Number(choice),
        correctAnswer: data[actualeQuiz].correctAnswer,
        tempsPasse: timeSpent
    });


};


nextBtn.addEventListener("click", function () {
    let choice = document.querySelector('input[name="answer"]:checked');
    clearInterval(timerInterval);

    if (choice) {
        let timeSpent = 5 - timeLeft;

        let chosenIndex = parseInt(choice.value);
        let correctIndex = data[actualeQuiz].correctAnswer;

        let chosenLabel = choice.closest("label");
        let correctLabel = document.querySelector(`input[value="${correctIndex}"]`).closest("label");

        if (chosenIndex === correctIndex) {
            chosenLabel.classList.add("correct");
        } else {
            chosenLabel.classList.add("incorrect");
            correctLabel.classList.add("correct");
        }

        saveAnswer(choice.value, timeSpent);

        setTimeout(() => {
            actualeQuiz++;
            HandleQuiz();
        }, 1000);

    } else {
        saveAnswer(null, 10);
        actualeQuiz++;
        HandleQuiz();
    }
});
