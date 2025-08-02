let totalXP = 0;
let currentBadge = "none";

function updateXPBarVisual() {
    const xpBar = document.getElementById("xpBar");
    const xpLabel = document.getElementById("xpLabel");
    const badgeIcon = document.getElementById("badgeIcon");

    const cappedXP = totalXP % 100;
    xpBar.style.width = cappedXP + "%";
    xpLabel.textContent = `${totalXP} XP`;
    xpLabel.title = `Progress: ${cappedXP}/100 XP to next badge`;

    // Rank tiers with 3 levels per 300 XP
    const tiers = ["bronze", "silver", "gold", "platinium", "diamond", "champ"];
    const tier = Math.floor(totalXP / 300);
    const levelInTier = Math.floor((totalXP % 300) / 100); // 0, 1, 2

    let badge = "none";
    if (tier < tiers.length) {
        badge = `${tiers[tier]}${levelInTier + 1}`;
    } else {
        badge = "champ3"; // Max cap
    }

    if (badge !== currentBadge) {
        currentBadge = badge;
        badgeIcon.src = `/images/${badge}.png`; // No "badges" folder in your structure
        document.getElementById("badgeName").textContent = badge.replace("-", " ").toUpperCase();
        badgeIcon.alt = `${badge} badge`;
        badgeIcon.title = `Rank: ${badge.toUpperCase()}`;
    }
}

function updatePlayerXP(amount) {
    totalXP += amount;
    showXPGain(`+${amount} XP`);
    updateXPBarVisual();
    syncXPToDatabase();
}

function syncXPToDatabase() {
    fetch("http://localhost:5000/updateScore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ playerId: userId, newScore: totalXP })
    });
}

function showXPGain(text) {
    const popup = document.createElement("div");
    popup.textContent = text;
    popup.className = "xp-popup";
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
}

function initXPTracker() {
    const xpBar = document.getElementById("xpBar");
    const xpLabel = document.getElementById("xpLabel");
    const badgeIcon = document.getElementById("badgeIcon");

    if (!xpBar || !xpLabel || !badgeIcon) {
        console.warn("XP elements not found — skipping XP update.");
        return;
    }

    fetch('http://localhost:5000/check-session', {
        credentials: 'include',
    })
        .then(res => res.json())
        .then(data => {
            if (data.loggedIn && data.userScore !== undefined) {
                totalXP = data.userScore;
                updateXPBarVisual();
            }
        });
}

// ? Preload badge images
["bronze", "silver", "gold", "platinium", "diamond", "champ"].forEach(tier => {
    for (let i = 1; i <= 3; i++) {
        const img = new Image();
        img.src = `/images/${tier}${i}.png`;
    }
});
