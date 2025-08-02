function getBadgeFromXP(totalXP) {
    const tiers = ["bronze", "silver", "gold", "platinium", "diamond", "champ"];
    const tierIndex = Math.floor(totalXP / 300);
    const levelInTier = Math.floor((totalXP % 300) / 100);
    const tier = tiers[Math.min(tierIndex, tiers.length - 1)];
    const level = Math.min(levelInTier + 1, 3);
    return `images/${tier}${level}.png`;
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:5000/leaderboard")
        .then(res => res.json())
        .then(data => {
            const body = document.getElementById("leaderboardBody");
            body.innerHTML = "";

            data.forEach((player, index) => {
                const badge = getBadgeFromXP(player.score);

                const row = `
                    <tr>
                        <td>#${index + 1}</td>
                        <td><img src="${badge}" alt="Badge" class="badge-img" /></td>
                        <td>${player.username}</td>
                        <td>${player.score} XP</td>
                    </tr>
                `;
                body.insertAdjacentHTML("beforeend", row);
            });
        });
});
