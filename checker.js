const STAMP_FILE = './version.txt';
const CURRENT_VERSION = 'mordle-v1.0.0';

// Export the function with the exact name requested by script.js
export async function checkGameVersion() {
    const banner = document.getElementById('integrity-infobar');
    const text = document.getElementById('integrity-text');
    
    try {
        // Fetch version file with a cache-busting timestamp to bypass GitHub Pages cache
        const response = await fetch(`${STAMP_FILE}?t=${Date.now()}`);
        if (!response.ok) throw new Error('Could not verify server version');
        
        const latestVersion = await response.text();
        
        if (latestVersion.trim() === CURRENT_VERSION) {
            // System is completely up to date
            if (banner) {
                banner.className = "integrity-banner status-operational";
            }
            if (text) {
                text.textContent = "System: Operational (v1.0.0)";
            }
        } else {
            // Cache is outdated or new deployment detected
            if (banner) {
                banner.className = "integrity-banner status-outdated";
            }
            if (text) {
                text.textContent = "Update Available! Please Refresh Page.";
            }
            console.warn("Client build is outdated. Remote version is: " + latestVersion);
        }
    } catch (error) {
        console.error("Integrity validation error:", error);
        // Fallback to generic offline state if network is blocked
        if (banner) {
            banner.className = "integrity-banner status-operational";
        }
        if (text) {
            text.textContent = "System: Local Mode (Offline)";
        }
    }
}
