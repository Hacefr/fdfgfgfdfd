const WORD_LIST_URL = 'https://githubusercontent.com';

export let wordList = [];

// Fetch Master Wordlist safely from remote source
export async function fetchWordList() {
    try {
        const response = await fetch(WORD_LIST_URL);
        if (!response.ok) throw new Error('Network error parsing repository');
        wordList = await response.json();
    } catch (error) {
        console.error('Error fetching words:', error);
        // Resilient hardcoded fallback list
        wordList = ["apple", "house", "train", "plant", "cyber", "robot", "laser"];
    }
}

// Validation logic verifying word dictionary inclusion
export function isValidWord(guessString) {
    return wordList.map(w => w.toUpperCase()).includes(guessString.toUpperCase());
}

// Logic routing to return target text solutions matching designated paths
export function getTargetWord(mode) {
    if (wordList.length === 0) return '';

    if (mode === 'daily') {
        const today = new Date();
        const seedValue = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        let pseudoRandomIdx = Math.floor(Math.abs(Math.sin(seedValue) * wordList.length));
        return wordList[pseudoRandomIdx].toUpperCase();
    } else {
        return wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    }
}
