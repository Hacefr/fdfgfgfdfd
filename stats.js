export let stats = { played: 0, wins: 0, streak: 0, maxStreak: 0 };

// Synchronize state profiles matching local database storage records
export function loadStats() {
    const savedStats = localStorage.getItem('mordle_stats');
    if (savedStats) {
        stats = JSON.parse(savedStats);
    }
    updateStatsUI();
}

// Compute statistics calculations and store records back to disc profile
export function saveStats(isWin) {
    stats.played += 1;
    if (isWin) {
        stats.wins += 1;
        stats.streak += 1;
        if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;
    } else {
        stats.streak = 0;
    }
    localStorage.setItem('mordle_stats', JSON.stringify(stats));
    updateStatsUI();
}

// Handle layout variable value rendering logic directly matching DOM structures
export function updateStatsUI() {
    const playedEl = document.getElementById('stat-played');
    const winPctEl = document.getElementById('stat-win-pct');
    const streakEl = document.getElementById('stat-streak');
    const maxStreakEl = document.getElementById('stat-max-streak');

    if (playedEl) playedEl.textContent = stats.played;
    if (winPctEl) {
        const winPct = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
        winPctEl.textContent = winPct + '%';
    }
    if (streakEl) streakEl.textContent = stats.streak;
    if (maxStreakEl) maxStreakEl.textContent = stats.maxStreak;
}

// Complete removal execution purging local tracking records
export function resetStats() {
    stats = { played: 0, wins: 0, streak: 0, maxStreak: 0 };
    localStorage.setItem('mordle_stats', JSON.stringify(stats));
    updateStatsUI();
}
