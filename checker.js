// Change this exact string whenever you update your code or words.txt
const CLIENT_BUILD_KEY = 'mordle-v1.0.0'; 
const VERSION_FILE_URL = './version.txt';

const loaderOverlay = document.getElementById('loading-screen');
const loaderStatus = document.getElementById('loading-status');
const skipLoadingBtn = document.getElementById('btn-skip-loading');
const integrityBadge = document.getElementById('integrity-badge');

// Perform cache-busting sync verification on asset loading
export async function verifyBuildIntegrity() {
    // Reveal backup skip switch if network hangs longer than 3.5s
    const fallbackTimer = setTimeout(() => {
        if (skipLoadingBtn) skipLoadingBtn.classList.remove('hidden');
        if (loaderStatus) loaderStatus.textContent = 'Server taking too long. Continue?';
    }, 3500);

    try {
        // Force server to read active files by injecting unique time queries
        const response = await fetch(`${VERSION_FILE_URL}?t=${Date.now()}`);
        if (!response.ok) throw new Error('File lookup failure');
        
        const rawText = await response.text();
        const currentServerKey = rawText.trim();

        clearTimeout(fallbackTimer);

        if (currentServerKey === CLIENT_BUILD_KEY) {
            setIntegrityUI('valid', `● System: Operational (${CLIENT_BUILD_KEY})`);
            dismissLoadingScreen();
        } else {
            setIntegrityUI('outdated', `▲ Build Outdated. Click to Update`);
            handleOutdatedBuild(currentServerKey);
        }
    } catch (error) {
        console.error('Integrity audit encountered an error:', error);
        clearTimeout(fallbackTimer);
        setIntegrityUI('error', '● System: Local Mode');
        dismissLoadingScreen();
    }
}

function setIntegrityUI(className, textContent) {
    if (!integrityBadge) return;
    integrityBadge.className = className;
    integrityBadge.textContent = textContent;

    if (className === 'outdated') {
        integrityBadge.addEventListener('click', () => {
            window.location.reload(true); // Hard clear reset
        });
    }
}

function handleOutdatedBuild(newVersion) {
    if (loaderStatus) {
        loaderStatus.innerHTML = `New Update Found (${newVersion})!<br><span style="color:#d97706; font-weight:bold;">Refreshing game workspace...</span>`;
    }
    setTimeout(() => {
        window.location.reload(true);
    }, 1500);
}

function dismissLoadingScreen() {
    if (loaderOverlay) {
        loaderOverlay.classList.add('fade-out');
    }
}

// Hook core backup interactions
skipLoadingBtn?.addEventListener('click', () => {
    setIntegrityUI('error', '● System: Skipped Audit');
    dismissLoadingScreen();
});

// Run audit instantly when script is evaluated
verifyBuildIntegrity();
