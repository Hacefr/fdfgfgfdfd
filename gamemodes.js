export let currentConfig = {
    modeName: 'random',
    maxGuesses: 6,
    displayName: 'RANDOM MORDLE'
};

// Update active rules based on player selection
export function selectGameMode(mode) {
    if (mode === 'daily') {
        currentConfig = {
            modeName: 'daily',
            maxGuesses: 6,
            displayName: 'DAILY MORDLE'
        };
    } else if (mode === 'hardcore') {
        currentConfig = {
            modeName: 'hardcore',
            maxGuesses: 4,
            displayName: 'HARDCORE MORDLE'
        };
    } else if (mode === 'sudden-death') {
        currentConfig = {
            modeName: 'sudden-death',
            maxGuesses: 1,
            displayName: 'SUDDEN DEATH'
        };
    } else {
        currentConfig = {
            modeName: 'random',
            maxGuesses: 6,
            displayName: 'RANDOM MORDLE'
        };
    }
    return currentConfig;
}
