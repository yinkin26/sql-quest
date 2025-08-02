import { challengeSet1 } from './challenge_set_1.js';
import { challengeSet2 } from './challenge_set_2.js';
import { challengeSet3 } from './challenge_set_3.js';
import { challengeSet4 } from './challenge_set_4.js';

const challengeSets = {
    set1: challengeSet1,
    set2: challengeSet2,
    set3: challengeSet3,
    set4: challengeSet4
};

let currentSet = null;
let currentSetKey = null;
let filteredChallenges = [];
let currentChallengeIndex = 0;
let userId = null;
let attemptCount = 0;
let currentLevel = null;

window.onload = () => {
    // Reset game state
    currentSet = null;
    currentSetKey = null;
    currentLevel = null;
    filteredChallenges = [];
    currentChallengeIndex = 0;
    attemptCount = 0;
    
    // Clear session storage
    sessionStorage.removeItem("currentSetKey");

    fetch("http://localhost:5000/check-session", { credentials: "include" })
        .then(res => res.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = "login.html";
            } else {
                userId = data.userId;
                window.userId = userId;
                window.completedLevels = data.completedLevels || {};

                // Show protected content and ensure set selector is visible
                document.getElementById("authLoading").style.display = "none";
                document.getElementById("protectedContent").style.display = "block";
                document.getElementById("setSelector").style.display = "grid";
                document.getElementById("difficultySelector").style.display = "none";
                document.getElementById("challengeSection").style.display = "none";

                styleCompletedButtons();
                disableLockedButtons();
            }
        });

    document.getElementById("nextChallengeBtn").addEventListener("click", () => {
        nextChallenge();
    });
};

function selectSet(setKey) {
    // Reset any existing challenge state
    currentChallengeIndex = 0;
    filteredChallenges = [];
    attemptCount = 0;
    
    // Update current set
    currentSet = challengeSets[setKey];
    currentSetKey = setKey;
    sessionStorage.setItem("currentSetKey", setKey);
    
    // Reset display states
    const setSelector = document.getElementById("setSelector");
    const difficultySelector = document.getElementById("difficultySelector");
    const challengeSection = document.getElementById("challengeSection");
    
    setSelector.style.display = "none";
    difficultySelector.style.display = "grid";
    challengeSection.style.display = "none";
    
    // Clear any existing challenge content
    document.getElementById("challengeContainer").innerHTML = "";
    document.getElementById("challengeFeedback").innerHTML = "";
    document.getElementById("nextChallengeBtn").style.display = "none";
    
    // Remove existing set title if present
    const existingTitle = document.querySelector(".current-set-title");
    if (existingTitle) existingTitle.remove();
    
    // Create new set title
    const setTitle = document.createElement("div");
    setTitle.className = "current-set-title";
    setTitle.innerHTML = `
        <h3>Challenge Set ${setKey.replace('set', '')}</h3>
        <button onclick="backToSetSelection()" class="back-btn">⬅ Back to Sets</button>
    `;
    difficultySelector.insertBefore(setTitle, difficultySelector.firstChild);
    
    // Add animation
    difficultySelector.classList.remove("fade-out");
    difficultySelector.classList.add("fade-in");
    
    // Update button states
    styleCompletedButtons();
    disableLockedButtons();
}

function getCurrentSetKey() {
    return currentSetKey;
}

function startLevel(level) {
    const btn = document.querySelector(`button[onclick="startLevel('${level}')"]`);
    if (btn.disabled || !currentSet) return;

    // Reset challenge state
    currentLevel = level;
    currentChallengeIndex = 0;
    attemptCount = 0;
    filteredChallenges = currentSet.filter(c => c.difficulty === level);

    // Update UI elements
    const difficultySelector = document.getElementById("difficultySelector");
    const challengeSection = document.getElementById("challengeSection");
    const gridContainer = document.querySelector(".grid-container");

    // Update title and hide/show sections
    document.getElementById("chapterTitle").textContent = `${level.toUpperCase()} LEVEL`;
    difficultySelector.style.display = "none";
    gridContainer.style.display = "none";
    challengeSection.style.display = "block";

    // Clear any existing challenge content
    document.getElementById("challengeContainer").innerHTML = "";
    document.getElementById("challengeFeedback").innerHTML = "";
    document.getElementById("nextChallengeBtn").style.display = "none";

    // Add animation
    challengeSection.classList.remove("fade-out");
    challengeSection.classList.add("fade-in");

    // Load first challenge
    loadChallenge();
}

function loadChallenge() {
    attemptCount = 0;
    const ch = filteredChallenges[currentChallengeIndex];

    document.getElementById("progressInfo").textContent = `Challenge ${currentChallengeIndex + 1} of ${filteredChallenges.length}`;

    let html = `<div class="challenge-box"><h4>Challenge ${ch.id} (${ch.difficulty})</h4><p>${ch.question}</p>`;
    if (ch.type === "sql") {
        html += `<textarea id="challengeInput" class="code-editor"></textarea><br><button onclick="submitChallenge()">Submit</button>`;
    } else if (ch.type === "mcq") {
        html += ch.options.map(opt =>
            `<button class="mcq-btn" onclick="submitMCQ('${opt}', event)">${opt}</button>`
        ).join("<br>");
    }
    html += `</div>`;

    const container = document.getElementById("challengeContainer");
    container.innerHTML = html;
    container.classList.remove("fade-in");
    void container.offsetWidth;
    container.classList.add("fade-in");

    document.getElementById("challengeFeedback").innerHTML = "";
    document.getElementById("nextChallengeBtn").style.display = "none";
}

function submitMCQ(choice, event) {
    const ch = filteredChallenges[currentChallengeIndex];
    document.querySelectorAll('.mcq-btn').forEach(btn => btn.classList.remove("selected"));
    event.target.classList.add("selected");

    if (choice === ch.answer) {
        const earned = ch.score;
        updatePlayerXP(earned);
        showXPGain(`+${earned} XP`);
        showFeedback(true, earned);
    } else {
        handleWrongAttempt();
    }
}

function submitChallenge() {
    const userInput = document.getElementById("challengeInput").value.trim().toUpperCase();
    const expected = filteredChallenges[currentChallengeIndex].expectedQuery.trim().toUpperCase();

    if (userInput === expected) {
        const earned = filteredChallenges[currentChallengeIndex].score;
        updatePlayerXP(earned);
        showXPGain(`+${earned} XP`);
        showFeedback(true, earned);
    } else {
        handleWrongAttempt();
    }
}

function handleWrongAttempt() {
    attemptCount++;
    playSound("wrong");
    if (attemptCount >= 2) {
        document.getElementById("challengeFeedback").innerHTML = `? Incorrect. Moving to next...`;
        setTimeout(() => nextChallenge(), 2000);
    } else {
        document.getElementById("challengeFeedback").innerHTML = `? Incorrect. You have 1 more try.`;
    }
}

function showFeedback(success, points) {
    const feedback = document.getElementById("challengeFeedback");
    if (success) {
        playSound("correct");
        let countdown = 3;
        const updateCountdown = () => {
            feedback.innerHTML = `✓ Correct! You earned ${points} XP.<br>Next challenge in ${countdown}s...`;
            countdown--;
            if (countdown >= 0) {
                setTimeout(updateCountdown, 1000);
            } else {
                nextChallenge();
            }
        };
        feedback.classList.add("success");
        updateCountdown();
    } else {
        playSound("wrong");
        feedback.innerHTML = "✗ Incorrect.";
    }
}

function nextChallenge() {
    playSound("next");
    currentChallengeIndex++;

    if (currentChallengeIndex < filteredChallenges.length) {
        loadChallenge();
    } else {
        markLevelComplete(currentSetKey, currentLevel);
        document.getElementById("challengeContainer").innerHTML = "<h3>?? Chapter Complete!</h3><p>Returning to level selection...</p>";
        document.getElementById("nextChallengeBtn").style.display = "none";
        document.getElementById("progressInfo").textContent = `? Completed ${filteredChallenges.length} Challenges`;
        setTimeout(() => returnToLevelSelect(), 2500);
    }
}

function markLevelComplete(setKey, level) {
    fetch("http://localhost:5000/mark-completed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, setKey, level })
    })
        .then(() => fetch("http://localhost:5000/check-session", { credentials: "include" }))
        .then(res => res.json())
        .then(data => {
            window.completedLevels = data.completedLevels || {};
            styleCompletedButtons();
            disableLockedButtons();
        });
}

function styleCompletedButtons() {
    const setKey = getCurrentSetKey();
    const completed = (window.completedLevels && window.completedLevels[setKey]) || [];

    completed.forEach(level => {
        const btn = document.querySelector(`button[onclick="startLevel('${level}')"]`);
        if (btn) {
            btn.classList.add("glow-completed");
            btn.title = "? Completed";
        }
    });
}

function disableLockedButtons() {
    const setKey = getCurrentSetKey();
    const completed = (window.completedLevels && window.completedLevels[setKey]) || [];

    const lockRules = {
        easy: false,
        medium: !completed.includes("easy"),
        hard: !completed.includes("medium")
    };

    ["easy", "medium", "hard"].forEach(level => {
        const btn = document.querySelector(`button[onclick="startLevel('${level}')"]`);
        if (btn) {
            btn.textContent = capitalize(level);
            btn.disabled = false;
            btn.style.opacity = "1";

            if (lockRules[level]) {
                btn.disabled = true;
                btn.textContent += " ??";
                btn.style.opacity = "0.5";
                btn.title = `?? Complete ${level === "medium" ? "Easy" : "Medium"} to unlock`;
            }
        }
    });
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function returnToLevelSelect() {
    // Hide challenge section and show difficulty selector
    document.getElementById("challengeSection").style.display = "none";
    document.getElementById("difficultySelector").style.display = "grid";
    const gridContainer = document.querySelector(".grid-container");
    if (gridContainer) gridContainer.style.display = "grid";
    // Optionally clear challenge content
    document.getElementById("challengeContainer").innerHTML = "";
    document.getElementById("challengeFeedback").innerHTML = "";
    document.getElementById("nextChallengeBtn").style.display = "none";
    document.getElementById("progressInfo").textContent = "";

    document.querySelector(".grid-container").style.display = "grid";
    document.querySelector(".challenge-wrapper").scrollIntoView({ behavior: "auto" });
    document.querySelector(".challenge-wrapper").style.justifyContent = "flex-start";
    styleCompletedButtons();
    disableLockedButtons();
}

function backToSetSelection() {
    // Add fade-out animation to difficulty selector
    const difficultySelector = document.getElementById("difficultySelector");
    const setSelector = document.getElementById("setSelector");
    const challengeSection = document.getElementById("challengeSection");
    
    difficultySelector.classList.add("fade-out");
    
    // Reset game state
    currentSet = null;
    currentSetKey = null;
    currentLevel = null;
    filteredChallenges = [];
    currentChallengeIndex = 0;
    attemptCount = 0;
    
    // Clear session storage
    sessionStorage.removeItem("currentSetKey");
    
    // Wait for animation to complete before switching displays
    setTimeout(() => {
        // Remove the title and reset displays
        const setTitle = document.querySelector(".current-set-title");
        if (setTitle) setTitle.remove();
        
        // Reset all display states
        setSelector.style.display = "grid";
        difficultySelector.style.display = "none";
        challengeSection.style.display = "none";
        
        // Clear challenge content
        document.getElementById("challengeContainer").innerHTML = "";
        document.getElementById("challengeFeedback").innerHTML = "";
        document.getElementById("nextChallengeBtn").style.display = "none";
        
        // Reset animations
        difficultySelector.classList.remove("fade-out");
        setSelector.classList.add("fade-in");
        
        // Reset difficulty selector state
        difficultySelector.style.opacity = "1";
        
        // Play transition sound
        playSound("next");
    }, 300);
}

function showXPGain(text) {
    const popup = document.createElement("div");
    popup.textContent = text;
    popup.className = "xp-popup";
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
}

// Make functions globally accessible
window.selectSet = selectSet;
window.startLevel = startLevel;
window.submitMCQ = submitMCQ;
window.submitChallenge = submitChallenge;
window.backToSetSelection = backToSetSelection;
