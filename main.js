const data = [
    {
        type: 'qcm',
        question: "Quelle méthode JavaScript ajoute un ou plusieurs éléments à la fin d'un tableau ?",
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 12,
        explanation: "push() ajoute un ou plusieurs éléments à la fin d'un tableau et retourne la nouvelle longueur."
    },
    {
        type: 'qcm',
        question: "Quelle méthode JavaScript supprime le dernier élément d'un tableau ?",
        options: ['pop()', 'shift()', 'slice()', 'splice()'],
        correctAnswer: 0,
        explanation: "pop() supprime le dernier élément d'un tableau et retourne cet élément."
    },
    {
        type: 'qcm',
        question: "Quelle structure permet de déclarer une variable dont la valeur ne change pas ?",
        options: ['let', 'const', 'var', 'static'],
        correctAnswer: 1,
        explanation: "const permet de déclarer une constante qui ne peut pas être réassignée."
    },
    {
        type: 'qcm',
        question: "Quelle méthode retourne la chaîne de caractères en majuscules ?",
        options: ['toUpperCase()', 'toLowerCase()', 'replace()', 'concat()'],
        correctAnswer: 0,
        explanation: "toUpperCase() retourne une nouvelle chaîne avec toutes les lettres en majuscules."
    },
    {
        type: 'qcm',
        question: "Quelle méthode permet de fusionner deux tableaux en JavaScript ?",
        options: ['concat()', 'merge()', 'combine()', 'join()'],
        correctAnswer: 0,
        explanation: "concat() retourne un nouveau tableau résultant de la fusion des tableaux donnés."
    },
    {
        type: 'qcm',
        question: "Quelle est la valeur par défaut de 'this' dans une fonction JavaScript en mode strict ?",
        options: ['window', 'undefined', 'null', 'objet vide'],
        correctAnswer: 1,
        explanation: "En mode strict, 'this' vaut undefined dans une fonction classique."
    },
    {
        type: 'qcm',
        question: "Quelle méthode JavaScript permet de trouver le premier élément d'un tableau qui satisfait une condition ?",
        options: ['find()', 'filter()', 'indexOf()', 'includes()'],
        correctAnswer: 0,
        explanation: "find() retourne le premier élément du tableau qui satisfait une condition."
    },
    {
        type: 'qcm',
        question: "Quel opérateur est utilisé pour vérifier l'égalité stricte en JavaScript ?",
        options: ['==', '!=', '===', '!=='],
        correctAnswer: 2,
        explanation: "=== compare la valeur ET le type, contrairement à ==."
    },
    {
        type: 'qcm',
        question: "Quelle méthode permet de transformer un objet JSON en chaîne de caractères ?",
        options: ['JSON.stringify()', 'JSON.parse()', 'toString()', 'Object.stringify()'],
        correctAnswer: 0,
        explanation: "JSON.stringify() convertit un objet JavaScript en chaîne JSON."
    },
    {
        type: 'qcm',
        question: "Quelle méthode permet de retarder l’exécution d’une fonction en JavaScript ?",
        options: ['setTimeout()', 'setInterval()', 'delay()', 'wait()'],
        correctAnswer: 0,
        explanation: "setTimeout() exécute une fonction après un délai en millisecondes."
    }
];

let welcomeSection = document.querySelector(".welcome-section");
let startBtn = document.querySelector(".start-button");
let quizSection = document.querySelector(".quiz-container");
let questionText = document.querySelector(".question-text");
let answers = document.querySelector(".answers");
let timer = document.querySelector(".timer");
let questionCounter = document.querySelector(".question-counter");
let nextBtn = document.querySelector("#next-btn");
let currentQuestion = document.querySelector("#current-question");

startBtn.addEventListener("click" , () => {

    welcomeSection.style.display = "none";
    quizSection.style.display = "block";
    HandleQuiz();

});

let actualeQuiz = 0;
let answersQuiz = [];
let timeLeft = 10;

const HandleQuiz = () => {

    answers.innerHTML = questionTemplate(data[actualeQuiz]);
    questionText.innerHTML = data[actualeQuiz].question;



}

const questionTemplate = (qs) => {

    return  `
             <label class="answer-option">
                <input type="radio" name="answer" value="0"> 
                ${qs.options[0]}
            </label>
            <label class="answer-option">
                <input type="radio" name="answer" value="1">
                ${qs.options[1]}
            </label>
            <label class="answer-option">
                <input type="radio" name="answer" value="2">
                ${qs.options[2]}
            </label>
            <label class="answer-option">
                <input type="radio" name="answer" value="3">
                ${qs.options[3]}
            </label>`;
}

const timerInterval = setInterval(() => {
    timer.innerHTML = timeLeft.toString();
    timeLeft--;

    if (timeLeft < 0) {
        clearInterval(timerInterval);
        timer.innerHTML = "⏰ Temps écoulé";
    }
} , 1000);


nextBtn.addEventListener("click", function () {

    let choice = document.querySelector('input[name="answer"]:checked');
    clearInterval(timerInterval);

    answersQuiz.push({
        choice : choice.value,
        correctAnswer: data[actualeQuiz].correctAnswer,
        timeLeft : timeLeft,
    });

    timeLeft = 10;
    console.log(answersQuiz);
    actualeQuiz++;
    HandleQuiz();
    let nbr = actualeQuiz;
    currentQuestion.innerHTML = (nbr + 1).toString();

});





