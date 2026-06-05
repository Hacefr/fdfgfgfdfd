import { gameState, renderActiveGuessRow, processGuessSubmission } from './chaos.js';
import { isSymbolActive, triggerSymbolScramble } from './entities.js';

export function setupKeyboardListeners() {
    document.addEventListener('keydown', (e) => handleInputPipeline(e.key));
    
    document.querySelectorAll('.key').forEach(keyNode => {
        keyNode.addEventListener('click', () => {
            const dataKey = keyNode.getAttribute('data-key');
            handleInputPipeline(dataKey);
        });
    });
}

function handleInputPipeline(key) {
    if (gameState.isRoundOver || gameState.isRunDead) return;
    
    // Scramble standard mapping arrays if SYMBOL module is actively looping
    const targetKey = isSymbolActive() ? triggerSymbolScramble(key) : key.toUpperCase();

    if (targetKey === 'BACKSPACE') {
        if (gameState.currentGuess.length > 0) {
            gameState.currentGuess.pop();
            renderActiveGuessRow();
        }
    } else if (targetKey === 'ENTER') {
        processGuessSubmission();
    } else if (gameState.currentGuess.length < 5 && targetKey.length === 1 && targetKey.match(/[A-Z]/)) {
        gameState.currentGuess.push(targetKey);
        renderActiveGuessRow();
    }
}
