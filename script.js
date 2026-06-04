// REPLACE THIS WITH YOUR EXACT RAW GITHUB LINK
// Make sure the file contains an array of 5-letter words, e.g., ["apple", "house", "train"]
const GITHUB_WORD_LIST_URL = 'https://githubusercontent.com';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
let wordList = [];
let targetWord = '';
let currentGuess = [];
let guessesRemaining = MAX_GUESSES;
let isGameOver = false;

const boardContainer = document.getElementById('board-container');

// Initialize Board UI
function initBoard() {
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

// Fetch word list from GitHub
async function fetchWordList() {
    try {
        const response = await fetch(GITHUB_WORD_LIST_URL);
        if (!response.ok) throw new Error('Failed to fetch word list');
        
        wordList = await response.json();
        
        // Pick a random word from the fetched list
        targetWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
        console.log('Target Word:', targetWord); // For testing purposes
    } catch (error) {
        console.error('Error fetching words:', error);
        alert('Could not load word list. Please check your GitHub link.');
    }
}

// Update the grid with current guess
function updateGrid() {
    const rows = document.getElementsByClassName('row');
    const activeRow = rows[MAX_GUESSES - guessesRemaining];
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

// Validate and process the guess
function checkGuess() {
    if (currentGuess.length !== WORD_LENGTH) {
        alert('Not enough letters!');
        return;
    }

    const guessString = currentGuess.join('');
    
    // Check if the word is in the allowed list
    if (!wordList.map(w => w.toUpperCase()).includes(guessString)) {
        alert('Not in word list!');
        return;
    }

    const rows = document.getElementsByClassName('row');
    const activeRow = rows[MAX_GUESSES - guessesRemaining];
    const tiles = activeRow.getElementsByClassName('tile');
    let targetWordArr = targetWord.split('');
    
    // First pass: Mark correct letters (Green)
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (currentGuess[i] === targetWordArr[i]) {
            tiles[i].classList.add('correct');
            updateKeyboardColor(currentGuess[i], 'correct');
            targetWordArr[i] = null; // Mark as accounted for
        }
    }

    // Second pass: Mark present (Yellow) and absent (Gray)
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (!tiles[i].classList.contains('correct')) {
            const letter = currentGuess[i];
            const letterIndex = targetWordArr.indexOf(letter);
            
            if (letterIndex > -1) {
                tiles[i].classList.add('present');
                updateKeyboardColor(letter, 'present');
                targetWordArr[letterIndex] = null; // Mark as accounted for
            } else {
                tiles[i].classList.add('absent');
                updateKeyboardColor(letter, 'absent');
            }
        }
    }

    // Check Win/Loss
    if (guessString === targetWord) {
        alert('You win!');
        isGameOver = true;
        return;
    }

    guessesRemaining--;
    currentGuess = [];

    if (guessesRemaining === 0) {
        alert(`Game over! The word was: ${targetWord}`);
        isGameOver = true;
    }
}

// Update colors on the physical on-screen keyboard
function updateKeyboardColor(letter, status) {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        if (key.getAttribute('data-key').toUpperCase() === letter) {
            // Priority: correct > present > absent
            const currentClass = key.classList.contains('correct') ? 'correct' : 
                                 (key.classList.contains('present') ? 'present' : '');
            
            if (currentClass === 'correct') return; // Don't override green
            if (status === 'present' && currentClass === 'present') return; // Don't override yellow with yellow
            
            // Apply new class
            key.classList.remove('present', 'absent', 'correct');
            key.classList.add(status);
        }
    });
}

// Handle key presses
function handleKeyPress(key) {
    if (isGameOver) return;

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

// Event Listeners
document.addEventListener('keydown', (e) => {
    let key = e.key.toUpperCase();
    if (key === 'ENTER') handleKeyPress('ENTER');
    if (key === 'BACKSPACE') handleKeyPress('BACKSPACE');
    if (key.match(/^[A-Z]$/)) handleKeyPress(key);
});

const keys = document.querySelectorAll('.key');
keys.forEach(key => {
    key.addEventListener('click', () => {
        const keyValue = key.getAttribute('data-key').toUpperCase();
        if (keyValue === 'ENTER') handleKeyPress('ENTER');
        else if (keyValue === 'BACKSPACE') handleKeyPress('BACKSPACE');
        else handleKeyPress(keyValue);
    });
});

// Start Game
initBoard();
fetchWordList();
