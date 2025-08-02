// Global Theme Manager for SQL Learning Platform
// Handles theme switching across all pages

class ThemeManager {
    constructor() {
        this.isLightTheme = false;
        this.init();
    }

    init() {
        // Load saved theme preference
        this.loadTheme();
        
        // Set up theme toggle listeners
        this.setupThemeToggle();
        
        // Apply theme to body
        this.applyTheme();
    }

    setupThemeToggle() {
        // Global theme toggle (in header)
        const globalToggle = document.getElementById('globalThemeToggle');
        if (globalToggle) {
            globalToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Chat page specific toggle
        const chatToggle = document.getElementById('themeToggle');
        if (chatToggle) {
            chatToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.isLightTheme = !this.isLightTheme;
        this.applyTheme();
        this.updateToggleButtons();
        this.saveTheme();
    }

    applyTheme() {
        const body = document.body;
        
        if (this.isLightTheme) {
            body.classList.add('light-theme');
        } else {
            body.classList.remove('light-theme');
        }
    }

    updateToggleButtons() {
        const toggles = [
            document.getElementById('globalThemeToggle'),
            document.getElementById('themeToggle')
        ];

        toggles.forEach(toggle => {
            if (!toggle) return;
            
            const themeIcon = toggle.querySelector('.theme-icon');
            const themeText = toggle.querySelector('.theme-text');
            
            if (themeIcon && themeText) {
                if (this.isLightTheme) {
                    themeIcon.textContent = '🌞';
                    themeText.textContent = 'Cyber Mode';
                } else {
                    themeIcon.textContent = '🌙';
                    themeText.textContent = 'Plain Mode';
                }
            }
        });
    }

    saveTheme() {
        localStorage.setItem('sqlQuestTheme', this.isLightTheme ? 'light' : 'cyber');
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('sqlQuestTheme');
        this.isLightTheme = savedTheme === 'light';
    }

    // Public method to get current theme
    getCurrentTheme() {
        return this.isLightTheme ? 'light' : 'cyber';
    }

    // Public method to set theme programmatically
    setTheme(theme) {
        this.isLightTheme = theme === 'light';
        this.applyTheme();
        this.updateToggleButtons();
        this.saveTheme();
    }
}

// Theme manager will be initialized by loadComponents.js
// after the header is loaded and DOM elements are available

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}