const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

// Create the row and tile divs inside the container
export function initBoard(boardContainer) {
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

// Draw typed letters into the active row tiles
export function updateGrid(currentGuess, guessesRemaining) {
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
