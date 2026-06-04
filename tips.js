export const MORDLE_TIPS = [
    "Tip: Gray letters aren't in the secret target word at all.",
    "Tip: Yellow letters are correct, but positioned in the wrong tile slot.",
    "Tip: Green letters mean you nailed both the letter and its exact location!",
    "Tip: Play Daily resets every single midnight with an identical word for everyone.",
    "Tip: Experiencing glitches? Head to Settings and click Reset All Stats.",
    "Tip: Mordle is open source and hosted completely for free via GitHub Pages!",
    "Tip: Try starting with high-vowel guess words like AROUSE, ADIEU, or AUDIO."
];

// Return a randomized single string entry from the database pool
export function getRandomTip() {
    const randomIndex = Math.floor(Math.random() * MORDLE_TIPS.length);
    return MORDLE_TIPS[randomIndex];
}
