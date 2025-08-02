// Progress tracking and achievement system
class ProgressTracker {
    constructor() {
        this.achievements = {
            beginner: { name: 'SQL Beginner', description: 'Complete your first lesson', icon: '🎯', unlocked: false },
            intermediate: { name: 'SQL Explorer', description: 'Complete 5 lessons', icon: '🚀', unlocked: false },
            advanced: { name: 'SQL Master', description: 'Complete all lessons', icon: '👑', unlocked: false },
            challenger: { name: 'Challenge Accepted', description: 'Complete your first challenge', icon: '⚔️', unlocked: false },
            expert: { name: 'SQL Expert', description: 'Complete 10 challenges', icon: '🏆', unlocked: false }
        };
        this.totalLessons = 13; // Update this based on total available lessons
        this.initializeProgress();
    }

    initializeProgress() {
        this.updateProgressBars();
        this.loadAchievements();
        this.setupEventListeners();
    }

    updateProgressBars() {
        fetch('http://localhost:5000/completed-lessons', { credentials: 'include' })
            .then(res => res.json())
            .then(completedLessons => {
                const progressPercentage = (completedLessons.length / this.totalLessons) * 100;
                this.updateProgressBar('lessonProgress', progressPercentage, 'Lessons Progress');
                this.checkAchievements(completedLessons.length);
            })
            .catch(err => console.error('Error loading progress:', err));

        // Update challenges progress
        fetch('http://localhost:5000/completed-challenges', { credentials: 'include' })
            .then(res => res.json())
            .then(completedChallenges => {
                const challengePercentage = (completedChallenges.length / 20) * 100; // Assuming 20 total challenges
                this.updateProgressBar('challengeProgress', challengePercentage, 'Challenges Progress');
                this.checkChallengeAchievements(completedChallenges.length);
            })
            .catch(err => console.error('Error loading challenge progress:', err));
    }

    updateProgressBar(elementId, percentage, label) {
        const progressBar = document.querySelector(`#${elementId} .progress-bar-fill`);
        const progressLabel = document.querySelector(`#${elementId} .progress-label`);
        const progressPercentage = document.querySelector(`#${elementId} .progress-percentage`);

        if (progressBar && progressLabel && progressPercentage) {
            progressBar.style.width = `${percentage}%`;
            progressLabel.textContent = label;
            progressPercentage.textContent = `${Math.round(percentage)}%`;
        }
    }

    checkAchievements(completedLessonsCount) {
        if (completedLessonsCount >= 1) this.unlockAchievement('beginner');
        if (completedLessonsCount >= 5) this.unlockAchievement('intermediate');
        if (completedLessonsCount >= this.totalLessons) this.unlockAchievement('advanced');
    }

    checkChallengeAchievements(completedChallengesCount) {
        if (completedChallengesCount >= 1) this.unlockAchievement('challenger');
        if (completedChallengesCount >= 10) this.unlockAchievement('expert');
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.saveAchievement(achievementId);
            this.displayAchievementUnlock(achievement);
        }
    }

    saveAchievement(achievementId) {
        fetch('http://localhost:5000/unlock-achievement', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ achievementId })
        }).catch(err => console.error('Error saving achievement:', err));
    }

    displayAchievementUnlock(achievement) {
        const achievementElement = document.querySelector(`[data-achievement="${achievement.name}"]`);
        if (achievementElement) {
            achievementElement.classList.add('achievement-unlocked');
            this.playUnlockAnimation(achievementElement);
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);

        // Play sound effect
        const unlockSound = new Audio('/sounds/win.wav');
        unlockSound.play();
    }

    playUnlockAnimation(element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'achievementUnlock 1s ease-out';
    }

    loadAchievements() {
        const achievementGrid = document.querySelector('.achievement-grid');
        if (!achievementGrid) return;

        Object.entries(this.achievements).forEach(([id, achievement]) => {
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement-item';
            achievementElement.dataset.achievement = achievement.name;
            achievementElement.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            `;
            achievementGrid.appendChild(achievementElement);
        });

        // Load unlocked achievements from server
        fetch('http://localhost:5000/achievements', { credentials: 'include' })
            .then(res => res.json())
            .then(unlockedAchievements => {
                unlockedAchievements.forEach(achievementId => {
                    if (this.achievements[achievementId]) {
                        this.achievements[achievementId].unlocked = true;
                        const element = document.querySelector(`[data-achievement="${this.achievements[achievementId].name}"]`);
                        if (element) element.classList.add('achievement-unlocked');
                    }
                });
            })
            .catch(err => console.error('Error loading achievements:', err));
    }

    setupEventListeners() {
        // Listen for lesson completion
        document.addEventListener('lessonCompleted', () => this.updateProgressBars());
        // Listen for challenge completion
        document.addEventListener('challengeCompleted', () => this.updateProgressBars());
    }
}

// Initialize progress tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const progressTracker = new ProgressTracker();
});