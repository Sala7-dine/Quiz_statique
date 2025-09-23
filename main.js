let data = [];

// loading data
async function getData(them) {

    const them_ = `${them}.json`;

    try {

        let response = await fetch(them_);
        data = await response.json();

        console.log(`this is ${them} data : `, data);

    }catch (error) {
        console.log(error);

    }
}


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
let result = document.querySelector(".result");


let actualeQuiz = 0;
let answersQuiz = [];
let timeLeft = 5;
let timerInterval = null;
let pseudoArray = [];
let theme = 0;
let score = 0;


// choisi le thematique
btnChoice.forEach(btn => {
    btn.addEventListener("click", () => {
        theme = parseInt(btn.value);

        if (theme === 1) {
            data = getData("javascript");
        }else if (theme === 2) {
            data = getData("html");
        }else if (theme === 3) {
            data = getData("css");
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

// saisir le prenom
const Pseudo = () => {

    if(pseudo.value === ""){
        document.querySelector(".error").textContent = "le nom ne peut etre vide";
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

//
const HandleQuiz = () => {

    if (actualeQuiz >= data.length) {

        quizSection.style.display = "none";

        result.style = "block";

        answersQuiz.forEach((elem , i) => {

            let div = anwersQuestionTemplate(elem , i);
            result.innerHTML += div;


            if (elem.multiQuestion) {

                let userAnswers = elem.choix || [];
                let correctAnswers = data[i].correctAnswer;
                
                if (Array.isArray(userAnswers) && Array.isArray(correctAnswers)) {

                    let isCorrect = userAnswers.length === correctAnswers.length && 
                                   userAnswers.every(answer => correctAnswers.includes(answer)) &&
                                   correctAnswers.every(answer => userAnswers.includes(answer));
                    if (isCorrect) {
                        score++;
                    }
                }
            } else {

                if(elem.choix === data[i].correctAnswer){
                    score++;
                }
            }
        });

        document.querySelector("#score").textContent = score;

        return;
    }

    questionText.innerHTML = data[actualeQuiz].question;
    answers.innerHTML = questionTemplate(data[actualeQuiz]);
    currentQuestion.innerHTML = (actualeQuiz + 1).toString();


    setTimeout(() => {
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('correct', 'incorrect');
        });
    }, 100);

    timeLeft = 5;
    startTimer();
};


// result
const anwersQuestionTemplate = (elem, i) => {

    return `<main class="ans">
                <div class="question">
                    <h2 class="question-text">${elem.question}</h2>
                </div>
                <div class="answers">${questionTemplates(data[i] , elem.correctAnswer , elem.choix)}</div>
            </main>`
};


// check result
const questionTemplates = (qs, cor, cors) => {
    return qs.options.map((opt, i) => {

        let bg = "white";
        let cssClass = "";
        
        if (qs.multiQuestion) {

            let correctAnswers = Array.isArray(cor) ? cor : [cor];
            let userAnswers = Array.isArray(cors) ? cors : (cors !== null && cors !== undefined ? [cors] : []);
            
            if (correctAnswers.includes(i)) {

                cssClass = "correct";
                bg = "#d4edda";
            } else if (userAnswers.includes(i)) {

                cssClass = "incorrect";
                bg = "#f8d7da";
            }
        } else {

            if (cor === cors && i === cor) {
                bg = "#d4edda";
                cssClass = "correct";
            } else if (cor !== cors) {
                if (i === cors) {
                    bg = "#f8d7da";
                    cssClass = "incorrect";
                } else if (i === cor) {
                    bg = "#d4edda";
                    cssClass = "correct";
                } else if (cors === -1 || cors === null) {
                    bg = "#fff3cd";
                }
            }
        }

        return `
          <label class="answer-option ${cssClass}" style="background:${bg}">
            ${opt}
          </label>`;

    }).join("");
};

// options
const questionTemplate = (qs) => {
    return qs.options.map((opt, i) => {

        let type = "";
        if(data[actualeQuiz].multiQuestion){
            type = "checkbox";
        }else {
            type = "radio";
        }

       return `
       <label class="answer-option">
            <input type=${type} name="answer" value=${i}> 
            ${opt}
        </label>
    `}).join("");
};

// Timer
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

// save answers
const saveAnswer = (choice, timeSpent) => {

    answersQuiz.push({
        question: data[actualeQuiz].question,
        choix: choice,
        options : data[actualeQuiz].options,
        correctAnswer: data[actualeQuiz].correctAnswer,
        multiQuestion: data[actualeQuiz].multiQuestion || false,
        tempsPasse: timeSpent
    });

};


nextBtn.addEventListener("click", function () {

    clearInterval(timerInterval);
    let timeSpent = 5 - timeLeft;


    if (data[actualeQuiz].multiQuestion) {

        let checkedBoxes = document.querySelectorAll('input[name="answer"]:checked');
        let selectedAnswers = Array.from(checkedBoxes).map(box => parseInt(box.value));
        let correctAnswers = data[actualeQuiz].correctAnswer;

        document.querySelectorAll('input[name="answer"]').forEach(input => {
            let index = parseInt(input.value);
            let label = input.closest("label");
            
            if (correctAnswers.includes(index)) {

                label.classList.add("correct");
            } else if (selectedAnswers.includes(index)) {

                label.classList.add("incorrect");
            }
        });

        saveAnswer(selectedAnswers, timeSpent);

    } else {

        let choice = document.querySelector('input[name="answer"]:checked');

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

            saveAnswer(chosenIndex, timeSpent);
        } else {

            saveAnswer(null, timeSpent);
        }
    }


    setTimeout(() => {
        actualeQuiz++;
        HandleQuiz();
    }, 2000);
});




