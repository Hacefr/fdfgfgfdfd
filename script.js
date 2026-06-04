import { fetchWordList, getTargetWord, isValidWord, wordList } from './words.js';
import { loadStats, saveStats, resetStats } from './stats.js';
import { checkGameVersion } from './checker.js';
import { initBoard, updateGrid } from './board.js';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
let targetWord = '';
let currentGuess = [];
let guessesRemaining = MAX_GUESSES;
let isGameOver = false;
let gameMode = 'random'; 

// DOM Screen Elements
const screenMenu = document.getElementById('main-menu');
const screenGame = document.getElementById('active-game');
const screenStats = document.getElementById('stats-screen');
const screenSettings = document.getElementById('settings-screen');
const screenModded = document.getElementById('modded-screen');
const boardContainer = document.getElementById('board-container');
const gameModeTitle = document.getElementById('game-mode-title');
const toastContainer = document.getElementById('toast-container');

// Launch Application Instantly
async function initApp() {
    loadStats();
    setupMenuEvents();
    
    // Background execution operations run smoothly without blocking inputs
    try {
        await fetchWordList();
        await checkGameVersion();
    } catch (e) {
        console.error("Silent asset setup encounter error:", e);
    }
}

export function showToast(message, type = 'normal') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function showScreen(screenToShow) {
    [screenMenu, screenGame, screenStats, screenSettings, screenModded].forEach(s => {
        if (s) s.classList.add('hidden');
    });
    if (screenToShow) screenToShow.classList.remove('hidden');
}

function setupMenuEvents() {
    document.getElementById('btn-random')?.addEventListener('click', () => startNewGame('random'));
    document.getElementById('btn-daily')?.addEventListener('click', () => startNewGame('daily'));
    document.getElementById('btn-stats')?.addEventListener('click', () => showScreen(screenStats));
    document.getElementById('btn-settings')?.addEventListener('click', () => showScreen(screenSettings));
    
    // Play Modded now links to your upcoming sub-folder game structure safely
    document.getElementById('btn-modded')?.addEventListener('click', () => {
        window.location.href = './chaos-mode/chaos.html';
    });
    
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => showScreen(screenMenu));
    });
    document.getElementById('btn-home')?.addEventListener('click', () => showScreen(screenMenu));

    document.getElementById('btn-reset-data')?.addEventListener('click', () => {
        if (confirm("Are you absolutely sure you want to erase all your stats?")) {
            resetStats();
            showToast("Statistics reset successfully!", "error");
        }
    });
}

function startNewGame(mode) {
    if (!wordList || wordList.length === 0) {
        showToast("Word list missing!", "error");
        return;
    }
    
    gameMode = mode;
    isGameOver = false;
    guessesRemaining = MAX_GUESSES;
    currentGuess = [];
    
    document.querySelectorAll('.key').forEach(k => k.classList.remove('correct', 'present', 'absent'));
    if (gameModeTitle) gameModeTitle.textContent = mode === 'daily' ? "DAILY MORDLE" : "RANDOM MORDLE";

    targetWord = getTargetWord(mode);
    console.log('Target Word:', targetWord); 
    initBoard(boardContainer);
    showScreen(screenGame);
}

function handleGuessChecking() {
    if (currentGuess.length !== WORD_LENGTH) {
        showToast("Not enough letters!", "error");
        return;
    }

    const guessString = currentGuess.join('');
    if (!isValidWord(guessString)) {
        showToast("Not in word list!", "error");
        return;
    }

    const rows = document.getElementsByClassName('row');
    const activeRow = rows[MAX_GUESSES - guessesRemaining];
    if (!activeRow) return;
    const tiles = activeRow.getElementsByClassName('tile');
    let targetWordArr = targetWord.split('');
    
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (currentGuess[i] === targetWordArr[i]) {
            tiles[i].classList.add('correct');
            updateKeyboardColor(currentGuess[i], 'correct');
            targetWordArr[i] = null;
        }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (!tiles[i].classList.contains('correct')) {
            const letter = currentGuess[i];
            const letterIndex = targetWordArr.indexOf(letter);
            if (letterIndex > -1) {
                tiles[i].classList.add('present');
                updateKeyboardColor(letter, 'present');
                targetWordArr[letterIndex] = null;
            } else {
                tiles[i].classList.add('absent');
                updateKeyboardColor(letter, 'absent');
            }
        }
    }

    if (guessString === targetWord) {
        showToast("You win! 🎉 Splendid!", "success");
        isGameOver = true;
        saveStats(true);
        return;
    }

    guessesRemaining--;
    currentGuess = [];

    if (guessesRemaining === 0) {
        showToast(`Game over! Word: ${targetWord}`, "error");
        isGameOver = true;
        saveStats(false);
    }
}

function updateKeyboardColor(letter, status) {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        if (key.getAttribute('data-key').toUpperCase() === letter) {
            const currentClass = key.classList.contains('correct') ? 'correct' : 
                                 (key.classList.contains('present') ? 'present' : '');
            if (currentClass === 'correct') return; 
            if (status === 'present' && currentClass === 'present') return; 
            key.classList.remove('present', 'absent', 'correct');
            key.classList.add(status);
        }
    });
}

function handleKeyPress(key) {
    if (isGameOver || !screenGame || screenGame.classList.contains('hidden')) return;

    if (key === 'BACKSPACE' && currentGuess.length > 0) {
        currentGuess.pop();
        updateGrid(currentGuess, guessesRemaining);
    } 
    else if (key === 'ENTER') {
        handleGuessChecking();
    } 
    else if (currentGuess.length < WORD_LENGTH && key.length === 1 && key.match(/[a-zA-Z]/)) {
        currentGuess.push(key.toUpperCase());
        updateGrid(currentGuess, guessesRemaining);
    }
}

document.addEventListener('keydown', (e) => {
    let key = e.key.toUpperCase();
    if (key === 'ENTER') handleKeyPress('ENTER');
    if (key === 'BACKSPACE') handleKeyPress('BACKSPACE');
    if (key.match(/^[A-Z]$/)) handleKeyPress(key);
});

const keyboardKeys = document.querySelectorAll('.key');
keyboardKeys.forEach(key => {
    key.addEventListener('click', () => {
        const keyValue = key.getAttribute('data-key').toUpperCase();
        handleKeyPress(keyValue);
    });
});

initApp();
