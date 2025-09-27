import { saveGame , saveInProgress , clearInProgress , loadInProgress } from "./storage.js";
import { themes } from "./dashboard/stats.js";

let data = [];

// loading data
async function getData(them) {

    console.log(them);
    const them_ = `${them}.json`;
    try {
        let response = await fetch(them_);
        data = await response.json();
        return data;
    }catch (error) {
        console.log(error);
    }
}

let welcomeSection = document.querySelector(".welcome-section");
let quizSection = document.querySelector(".quiz-container");
let answers = document.querySelector(".answers");
let timerEl = document.querySelector("#timer");
let modal = document.getElementById("modal");
let close = document.querySelector(".close");
let pseudo = document.querySelector(".pseudo");
let cardsContainer = document.querySelector(".cards-container");
let result = document.querySelector(".result");


let actualeQuiz = 0;
let answersQuiz = [];
let timeLeft = 5;
let timeGlobal = 0;
let timerGlobalInterval = null;
let timerInterval = null;
let pseudoArray = [];
let theme = 0;
let score = 0;


const themesTemplate = (theme) => {
    return `
    <div class="card">
    <h3>${theme.titre}</h3>
    <p>${theme.description}</p>
    <button class="btn-choice" value="${theme.id}">Choisir</button>
    </div>
    `
}


themes.forEach(theme => {
    cardsContainer.innerHTML +=  themesTemplate(theme); 
})


let btnChoice = document.querySelectorAll(".btn-choice");


window.addEventListener("DOMContentLoaded", async () => {
    const inProgress = loadInProgress();
    if (inProgress) {
        if (confirm("Voulez-vous reprendre votre partie précédente ?")) {
            pseudo.value = inProgress.pseudo;
            theme = inProgress.theme;
            actualeQuiz = inProgress.actualeQuiz;
            answersQuiz = inProgress.answersQuiz;
            timeGlobal = inProgress.timeGlobal;

            modal.style.display = "none";
            welcomeSection.style.display = "none";
            cardsContainer.style.display = "none";
            quizSection.style.display = "block";

            if (theme === 1) {
                await getData("javascript");
            }else if (theme === 2) {
                await getData("html");
            }else if (theme === 3) {
                await getData("css");
            }

            console.log("data : " , data);

            startGlobalTime();
            HandleQuiz();
        } else {
            clearInProgress();
        }
    }
});


// choisi le thematique
btnChoice.forEach(btn => {
    btn.addEventListener("click", async () => {

        theme = parseInt(btn.value);

        if (theme === 1) {
            await getData("javascript");
        }else if (theme === 2) {
            await getData("html");
        }else if (theme === 3) {
            await getData("css");
        }

        cardsContainer.style.display = "none";

        modal.style.display = "flex";

    });

});


document.querySelector(".start-button").addEventListener("click", () => {
    modal.style.display = "flex";
});

// saisir le prenom

document.querySelector(".submit-btn").addEventListener("click" , () => {
    if(pseudo.value === ""){
        document.querySelector(".error").textContent = "le nom ne peut etre vide";
        return;
    }

     if (!data || data.length === 0) {
        document.querySelector(".error").textContent = "Erreur de chargement des données";
        return;
    }

    modal.style.display = "none";
    pseudoArray.push(pseudo.value);

    // localStorage.setItem("pseudo", JSON.stringify(pseudoArray));

    welcomeSection.style.display = "none";
    quizSection.style.display = "block";
    actualeQuiz = 0;
    answersQuiz = [];

    startGlobalTime();
    HandleQuiz();

});

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

        console.log("actule quiz : " , actualeQuiz);
        console.log("data.length" ,data.length);

        quizSection.style.display = "none";

        result.style.display = "block";

        clearInterval(timerGlobalInterval);

        answersQuiz.forEach((elem , i) => {

            let div = anwersQuestionTemplate(elem , i);
            result.innerHTML += div;


            if (elem.multiQuestion) {

                let userAnswers = elem.choix || [];
                let correctAnswers = elem.correctAnswer;

                if (Array.isArray(userAnswers) && Array.isArray(correctAnswers)) {

                    let isCorrect = userAnswers.length === correctAnswers.length &&
                                   userAnswers.every(answer => correctAnswers.includes(answer)) &&
                                   correctAnswers.every(answer => userAnswers.includes(answer));
                    if (isCorrect) {
                        score++;
                    }
                }
            } else {

                if(elem.choix === elem.correctAnswer){
                    score++;
                }
            }
        });

        document.querySelector("#score").textContent = `${score} / ${data.length}`;
        document.querySelector("#globalTime").textContent = formatSecondsToHMS(timeGlobal);
        
        // Calculer et afficher le pourcentage
        const percentage = Math.round((score / data.length) * 100);
        document.querySelector("#percentage").textContent = `${percentage}%`;

        saveGame(pseudo.value, score, theme, answersQuiz, timeGlobal);

        return;
    }

    document.querySelector(".question-text").innerHTML = data[actualeQuiz].question;
    answers.innerHTML = questionTemplate(data[actualeQuiz]);
    document.querySelector("#current-question").innerHTML = (actualeQuiz + 1).toString();


    setTimeout(() => {
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('correct', 'incorrect');
        });
    }, 100);

    timeLeft = 5;
    startTimer();
};

// format time
function formatSecondsToHMS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// Global Timer
const startGlobalTime = () => {

    timerGlobalInterval = setInterval(() => {
        timeGlobal++;
    }, 1000);

};


function escapeHTML(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// result
const anwersQuestionTemplate = (elem, i) => {

    if (!data[i]) {
        return "";
    }

    return `<main class="ans">
                <div class="question">
                    <h2 class="question-text">${elem.question}</h2>
                </div>
                <div class="answers"> ${questionTemplates(data[i] , elem.correctAnswer , elem.choix)}</div>
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
            ${ escapeHTML(opt) }
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
             ${ escapeHTML(opt) } 
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

    saveInProgress({
        pseudo: pseudo.value,
        theme,
        actualeQuiz,
        answersQuiz,
        timeGlobal
    });

};

document.querySelector("#next-btn").addEventListener("click", function () {

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




