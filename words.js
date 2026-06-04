const WORD_LIST_FILE = './words.txt';

export let wordList = [];

// Fetch Master Wordlist safely from local repository file tree
export async function fetchWordList() {
    try {
        const response = await fetch(WORD_LIST_FILE);
        if (!response.ok) throw new Error('Could not find local words.txt file');
        
        const rawText = await response.text();
        
        // Split by lines, remove whitespace, and filter out empty rows
        wordList = rawText
            .split('\n')
            .map(word => word.trim().toLowerCase())
            .filter(word => word.length === 5);

        if (wordList.length === 0) throw new Error('words.txt is empty');
    } catch (error) {
        console.error('Error fetching local words:', error);
        // Resilient hardcoded fallback list if the text file fails to load
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
