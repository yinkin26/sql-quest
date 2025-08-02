// SQL Validator using Streaming Chat API
class SQLValidator {
    constructor() {
        this.apiEndpoint = '/api/chat';
        this.isValidating = false;
    }

    // Main validation function using streaming chat API
    async validateSQL(sqlCode) {
        if (this.isValidating) {
            return { error: 'Validation already in progress' };
        }

        this.isValidating = true;

        try {
            const messages = [
                {
                    role: "system",
                    content: `You are a SQL expert validator. Analyze SQL code for syntax errors, logical issues, and best practices. 

IMPORTANT: Respond with ONLY a valid JSON object in this exact format:
{
  "hasErrors": boolean,
  "errors": ["error1", "error2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "correctedCode": "corrected SQL or null"
}

Rules:
- Set hasErrors to true if there are ANY syntax errors, missing keywords, or logical issues
- Set hasErrors to false only if the SQL is completely valid
- Include specific error descriptions in the errors array
- Provide helpful suggestions for improvement
- If there are errors, provide corrected code; otherwise set to null
- Do not include any text outside the JSON object`
                },
                {
                    role: "user",
                    content: `Please analyze this SQL code for errors and improvements:\n\n${sqlCode}`
                }
            ];

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ messages })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle streaming response
            const reader = response.body.getReader();
            let fullResponse = "";
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                chunk.trim().split("\n").forEach(line => {
                    if (line.startsWith("data: ")) {
                        const data = line.replace("data: ", "");
                        if (data === "[DONE]") return;
                        try {
                            const content = JSON.parse(data);
                            fullResponse += content;
                        } catch (e) {
                            // Skip malformed JSON
                        }
                    } else if (line.startsWith("event: error")) {
                        const errorLine = chunk.split("\n").find(l => l.startsWith("data: "));
                        if (errorLine) {
                            const errorData = errorLine.replace("data: ", "");
                            try {
                                const errorMessage = JSON.parse(errorData);
                                throw new Error(errorMessage);
                            } catch (e) {
                                throw new Error("Validation service error");
                            }
                        }
                    }
                });
            }

            // Parse the AI response
            try {
                const parsedResponse = JSON.parse(fullResponse);
                
                // Validate the parsed response structure
                if (typeof parsedResponse.hasErrors !== 'boolean' || 
                    !Array.isArray(parsedResponse.errors) || 
                    !Array.isArray(parsedResponse.suggestions)) {
                    throw new Error('Invalid response format');
                }
                
                return parsedResponse;
            } catch (parseError) {
                console.log('AI Response parsing failed:', fullResponse);
                
                // Improved fallback logic for non-JSON responses
                const lowerResponse = fullResponse.toLowerCase();
                const errorKeywords = ['error', 'incorrect', 'invalid', 'wrong', 'syntax error', 'missing', 'unexpected', 'problem'];
                const successKeywords = ['correct', 'valid', 'good', 'no errors', 'looks good', 'properly formatted', 'well-formed'];
                
                const hasErrorKeywords = errorKeywords.some(keyword => lowerResponse.includes(keyword));
                const hasSuccessKeywords = successKeywords.some(keyword => lowerResponse.includes(keyword));
                
                // More intelligent error detection
                let hasErrors = false;
                let errors = [];
                let suggestions = [];
                
                if (hasErrorKeywords && !hasSuccessKeywords) {
                    hasErrors = true;
                    errors = [fullResponse];
                } else if (hasSuccessKeywords && !hasErrorKeywords) {
                    hasErrors = false;
                    suggestions = ['Your SQL code looks good!'];
                } else {
                    // Ambiguous response - treat as suggestion
                    hasErrors = false;
                    suggestions = [fullResponse];
                }
                
                return {
                    hasErrors,
                    errors,
                    suggestions,
                    correctedCode: null
                };
            }

        } catch (error) {
            console.error('SQL Validation Error:', error);
            return {
                error: error.message || 'Failed to validate SQL code'
            };
        } finally {
            this.isValidating = false;
        }
    }

    // Create validation UI component
    createValidationUI(containerId, textareaId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID '${containerId}' not found`);
            return;
        }

        const validationHTML = `
            <div class="sql-validator">
                <div class="validator-header">
                    <h4>🤖 AI SQL Validator</h4>
                    <button id="validateBtn" class="neon-button validate-btn">
                        <span class="btn-text">Check SQL</span>
                        <span class="btn-loading" style="display: none;">Checking...</span>
                    </button>
                </div>
                <div id="validationResults" class="validation-results" style="display: none;"></div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', validationHTML);

        // Add event listener
        const validateBtn = document.getElementById('validateBtn');
        const textarea = document.getElementById(textareaId);
        
        if (validateBtn && textarea) {
            validateBtn.addEventListener('click', () => {
                this.handleValidation(textarea.value);
            });
        }
    }

    // Handle validation and display results with streaming
    async handleValidation(sqlCode) {
        if (!sqlCode.trim()) {
            this.showResults({
                hasErrors: true,
                errors: ['Please enter some SQL code to validate'],
                suggestions: [],
                correctedCode: null
            });
            return;
        }

        this.showLoading(true);
        this.showStreamingIndicator();
        
        const result = await this.validateSQL(sqlCode);
        
        this.hideStreamingIndicator();
        this.showLoading(false);
        this.showResults(result);
    }

    // Show streaming indicator
    showStreamingIndicator() {
        const resultsContainer = document.getElementById('validationResults');
        if (!resultsContainer) return;

        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `
            <div class="validation-streaming">
                <div class="streaming-indicator">
                    <div class="streaming-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span class="streaming-text">AI is analyzing your SQL...</span>
                </div>
            </div>
        `;
    }

    // Hide streaming indicator
    hideStreamingIndicator() {
        const streamingElement = document.querySelector('.validation-streaming');
        if (streamingElement) {
            streamingElement.remove();
        }
    }

    // Show loading state
    showLoading(isLoading) {
        const btnText = document.querySelector('.btn-text');
        const btnLoading = document.querySelector('.btn-loading');
        const validateBtn = document.getElementById('validateBtn');

        if (btnText && btnLoading && validateBtn) {
            if (isLoading) {
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';
                validateBtn.disabled = true;
            } else {
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                validateBtn.disabled = false;
            }
        }
    }

    // Display validation results
    showResults(result) {
        const resultsContainer = document.getElementById('validationResults');
        if (!resultsContainer) return;

        resultsContainer.style.display = 'block';

        if (result.error) {
            resultsContainer.innerHTML = `
                <div class="validation-error">
                    <h5>❌ Validation Error</h5>
                    <p>${result.error}</p>
                </div>
            `;
            return;
        }

        let html = '';

        // Show errors
        if (result.hasErrors && result.errors && result.errors.length > 0) {
            html += `
                <div class="validation-errors">
                    <h5>❌ Errors Found</h5>
                    <ul>
                        ${result.errors.map(error => `<li>${error}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Show suggestions
        if (result.suggestions && result.suggestions.length > 0) {
            html += `
                <div class="validation-suggestions">
                    <h5>💡 Suggestions</h5>
                    <ul>
                        ${result.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Show corrected code
        if (result.correctedCode) {
            html += `
                <div class="validation-correction">
                    <h5>✅ Corrected Code</h5>
                    <pre><code>${result.correctedCode}</code></pre>
                    <button class="neon-button copy-btn" onclick="sqlValidator.copyToClipboard('${result.correctedCode.replace(/'/g, "\\'")}')">Copy</button>
                </div>
            `;
        }

        // Show success message if no errors
        if (!result.hasErrors && (!result.errors || result.errors.length === 0)) {
            html += `
                <div class="validation-success">
                    <h5>✅ SQL Looks Good!</h5>
                    <p>No syntax errors detected. Your SQL code appears to be valid.</p>
                </div>
            `;
        }

        resultsContainer.innerHTML = html;
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Copy text to clipboard
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Show temporary feedback
            const copyBtn = event.target;
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
}

// Create global instance
const sqlValidator = new SQLValidator();

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Look for code editors and add validation UI
    const codeEditors = document.querySelectorAll('.code-editor, textarea[id*="Input"], textarea[id*="query"]');
    
    codeEditors.forEach((editor, index) => {
        if (editor.id) {
            // Create a container for the validator if it doesn't exist
            let validatorContainer = editor.parentElement.querySelector('.validator-container');
            if (!validatorContainer) {
                validatorContainer = document.createElement('div');
                validatorContainer.className = 'validator-container';
                validatorContainer.id = `validator-container-${index}`;
                editor.parentElement.appendChild(validatorContainer);
            }
            
            // Initialize validator UI
            sqlValidator.createValidationUI(validatorContainer.id, editor.id);
        }
    });
});