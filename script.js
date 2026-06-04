import { fetchWordList, getTargetWord, isValidWord, wordList } from './words.js';
import { loadStats, saveStats, resetStats } from './stats.js';

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

// Initialize Orchestration Loop
async function initApp() {
    loadStats();
    setupMenuEvents();
    await fetchWordList();
}

// In-site Custom Notification Engine
function showToast(message, type = 'normal') {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Remove element completely once CSS animation finishes
    setTimeout(() => {
        toast.remove();
    }, 2500);
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
    document.getElementById('btn-modded')?.addEventListener('click', () => showScreen(screenModded));
    
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
        showToast("Word list still loading...", "normal");
        return;
    }
    
    gameMode = mode;
    isGameOver = false;
    guessesRemaining = MAX_GUESSES;
    currentGuess = [];
    
    document.querySelectorAll('.key').forEach(k => {
        k.classList.remove('correct', 'present', 'absent');
    });

    if (mode === 'daily') {
        if (gameModeTitle) gameModeTitle.textContent = "DAILY MORDLE";
    } else {
        if (gameModeTitle) gameModeTitle.textContent = "RANDOM MORDLE";
    }

    targetWord = getTargetWord(mode);
    console.log('Target Word:', targetWord); 
    initBoard();
    showScreen(screenGame);
}

function initBoard() {
    if (!boardContainer) return;
    boardContainer.innerHTML = '';
    for (let i = 0; i < MAX_GUESSES; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < WORD_LENGTH; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            row.appendChild(tile);
        }
        boardContainer.appendChild(row);
    }
}

function updateGrid() {
    const rows = document.getElementsByClassName('row');
    const activeRow = rows[MAX_GUESSES - guessesRemaining];
    if (!activeRow) return;
    const tiles = activeRow.getElementsByClassName('tile');
    
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (currentGuess[i]) {
            tiles[i].textContent = currentGuess[i];
            tiles[i].classList.add('filled');
        } else {
            tiles[i].textContent = '';
            tiles[i].classList.remove('filled');
        }
    }
}

function checkGuess() {
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
        updateGrid();
    } 
    else if (key === 'ENTER') {
        checkGuess();
    } 
    else if (currentGuess.length < WORD_LENGTH && key.length === 1 && key.match(/[a-zA-Z]/)) {
        currentGuess.push(key.toUpperCase());
        updateGrid();
    }
}

// Input Event Triggers
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

// Launch App Execution Context
initApp();
