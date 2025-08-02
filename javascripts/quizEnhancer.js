/**
 * Quiz Enhancer - Allows users to keep trying until they get the correct answer
 * This script modifies existing quiz functions to disable incorrect answers and allow retries
 */

class QuizEnhancer {
    constructor() {
        this.originalCheckAnswer = null;
        this.quizCompleted = new Set(); // Track completed quizzes
    }

    /**
     * Enhanced checkAnswer function that allows retries
     * @param {HTMLElement} button - The clicked button
     * @param {string|boolean} answer - The answer value (can be option letter or boolean)
     * @param {string} correctAnswer - The correct answer to compare against
     * @param {Function} originalLogic - Original quiz logic function
     */
    enhancedCheckAnswer(button, answer, correctAnswer, originalLogic) {
        const quizContainer = button.closest('.quiz');
        const quizId = this.getQuizId(quizContainer);
        
        // If quiz is already completed, don't allow further clicks
        if (this.quizCompleted.has(quizId)) {
            return;
        }

        const isCorrect = (answer === correctAnswer) || 
                         (typeof answer === 'boolean' && answer === true) ||
                         (Array.isArray(correctAnswer) && correctAnswer.includes(answer));

        if (isCorrect) {
            // Correct answer - mark quiz as completed and disable all buttons
            this.quizCompleted.add(quizId);
            this.disableAllButtons(quizContainer);
            button.classList.add('correct-answer');
            
            // Execute original logic for correct answer
            originalLogic(button, answer, true);
        } else {
            // Incorrect answer - disable this button and show feedback
            button.disabled = true;
            button.classList.add('incorrect-answer');
            
            // Execute original logic for incorrect answer
            originalLogic(button, answer, false);
            
            // Add retry message
            this.showRetryMessage(quizContainer);
        }
    }

    /**
     * Generate a unique ID for each quiz
     */
    getQuizId(quizContainer) {
        if (!quizContainer.id) {
            quizContainer.id = 'quiz-' + Math.random().toString(36).substr(2, 9);
        }
        return quizContainer.id;
    }

    /**
     * Disable all buttons in the quiz container
     */
    disableAllButtons(quizContainer) {
        const buttons = quizContainer.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.disabled = true;
        });
    }

    /**
     * Show retry message for incorrect answers
     */
    showRetryMessage(quizContainer) {
        let retryMsg = quizContainer.querySelector('.retry-message');
        if (!retryMsg) {
            retryMsg = document.createElement('p');
            retryMsg.className = 'retry-message';
            retryMsg.style.color = '#ffd700';
            retryMsg.style.fontWeight = 'bold';
            retryMsg.style.marginTop = '10px';
            retryMsg.innerHTML = '💡 Try again! Choose another answer.';
            
            const feedback = quizContainer.querySelector('.quiz-feedback');
            if (feedback) {
                feedback.parentNode.insertBefore(retryMsg, feedback.nextSibling);
            } else {
                quizContainer.appendChild(retryMsg);
            }
        }
    }

    /**
     * Wrap existing checkAnswer functions to add retry functionality
     */
    enhanceExistingQuizzes() {
        // Store original function if it exists
        if (typeof window.checkAnswer === 'function') {
            this.originalCheckAnswer = window.checkAnswer;
            
            // Replace with enhanced version
            window.checkAnswer = (button, answer) => {
                // Try to determine correct answer based on common patterns
                let correctAnswer = this.detectCorrectAnswer(button);
                
                this.enhancedCheckAnswer(button, answer, correctAnswer, (btn, ans, isCorrect) => {
                    // Call original function
                    this.originalCheckAnswer(btn, ans);
                });
            };
        }
    }

    /**
     * Attempt to detect the correct answer from button attributes or content
     */
    detectCorrectAnswer(button) {
        const quizContainer = button.closest('.quiz');
        const buttons = quizContainer.querySelectorAll('button');
        
        // Look for data attributes that might indicate correct answer
        for (let btn of buttons) {
            if (btn.dataset.correct === 'true' || btn.classList.contains('correct')) {
                return btn.onclick.toString().match(/checkAnswer\(this,\s*['"]?([^'"\)]+)['"]?\)/)?.[1];
            }
        }
        
        // Default patterns for common quiz types
        const buttonText = button.textContent.trim();
        if (buttonText.startsWith('A)')) return 'A';
        if (buttonText.startsWith('B)')) return 'B';
        if (buttonText.startsWith('C)')) return 'C';
        if (buttonText.startsWith('D)')) return 'D';
        
        return null; // Let original logic handle it
    }

    /**
     * Add CSS styles for enhanced quiz appearance
     */
    addQuizStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .quiz button.incorrect-answer {
                background-color: #ff4444 !important;
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .quiz button.correct-answer {
                background-color: #44ff44 !important;
                box-shadow: 0 0 15px rgba(68, 255, 68, 0.5);
            }
            
            .quiz button:disabled {
                pointer-events: none;
            }
            
            .retry-message {
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initialize the quiz enhancer
     */
    init() {
        this.addQuizStyles();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.enhanceExistingQuizzes();
            });
        } else {
            this.enhanceExistingQuizzes();
        }
    }
}

// Auto-initialize when script loads
const quizEnhancer = new QuizEnhancer();
quizEnhancer.init();

// Export for manual use
window.QuizEnhancer = QuizEnhancer;