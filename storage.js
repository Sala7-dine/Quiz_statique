const STORAGE_KEY = "quizHistory";
const SAVE_KEY = "quizInProgress";

export function saveGame(pseudo, score, theme, answers, timeGlobal) {
    const history = loadHistory();

    const newGame = {
        pseudo,
        score,
        theme,
        date: new Date().toISOString(),
        time: timeGlobal,
        answers
    };

    history.push(newGame);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

    localStorage.removeItem(SAVE_KEY);
}

export function loadHistory() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveInProgress(state) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadInProgress() {
    return JSON.parse(localStorage.getItem(SAVE_KEY));
}

export function clearInProgress() {
    localStorage.removeItem(SAVE_KEY);
}
