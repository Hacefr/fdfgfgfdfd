const CURRENT_CLIENT_VERSION = "mordle-v1.0.0";
const VERSION_FILE_URL = "./version.txt";

export async function verifyGameIntegrity(onProgress) {
    try {
        // Step 1: Simulate network handshakes and dictionary lookups (0% to 40%)
        for (let pct = 0; pct <= 40; pct += 5) {
            onProgress(pct, "Connecting to repository servers...");
            await new Promise(r => setTimeout(r, 80));
        }

        // Step 2: Fetch the live version file using a timestamp parameters to kill browser cache
        const cacheBusterUrl = `${VERSION_FILE_URL}?t=${Date.now()}`;
        const response = await fetch(cacheBusterUrl);
        
        if (!response.ok) throw new Error("Could not ping master version registry");
        const serverVersionText = (await response.text()).trim();

        // Step 3: Run reading calculations step animations (45% to 85%)
        for (let pct = 45; pct <= 85; pct += 8) {
            onProgress(pct, "Evaluating component files...");
            await new Promise(r => setTimeout(r, 60));
        }

        // Step 4: Perform comparison validation checks
        const isUpToDate = (serverVersionText === CURRENT_CLIENT_VERSION);

        if (isUpToDate) {
            onProgress(100, `Operational (${CURRENT_CLIENT_VERSION})`);
            return { status: "success", version: CURRENT_CLIENT_VERSION };
        } else {
            return { status: "outdated", current: CURRENT_CLIENT_VERSION, latest: serverVersionText };
        }

    } catch (error) {
        console.error("System Check Error:", error);
        return { status: "offline", current: CURRENT_CLIENT_VERSION };
    }
}
