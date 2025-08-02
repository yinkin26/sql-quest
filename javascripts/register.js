// Form validation constants
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;
const MIN_PASSWORD_LENGTH = 8;

// Show error message in specific container
function showError(fieldId, message) {
    const errorDiv = document.getElementById(fieldId + 'Error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
    }
}

// Clear error message for specific field
function clearError(fieldId) {
    const errorDiv = document.getElementById(fieldId + 'Error');
    if (errorDiv) {
        errorDiv.textContent = '';
    }
}

// Validate username
function validateUsername(username) {
    if (username.length < MIN_USERNAME_LENGTH || username.length > MAX_USERNAME_LENGTH) {
        return `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters`;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
}

// Validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return null;
}

// Validate password
function validatePassword(password) {
    if (password.length < MIN_PASSWORD_LENGTH) {
        return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Real-time validation
    usernameInput.addEventListener('input', () => {
        const error = validateUsername(usernameInput.value);
        if (error) {
            showError('username', error);
        } else {
            clearError('username');
        }
    });

    emailInput.addEventListener('input', () => {
        const error = validateEmail(emailInput.value);
        if (error) {
            showError('email', error);
        } else {
            clearError('email');
        }
    });

    passwordInput.addEventListener('input', () => {
        const error = validatePassword(passwordInput.value);
        if (error) {
            showError('password', error);
        } else {
            clearError('password');
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;

        // Validate all fields
        const usernameError = validateUsername(username);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        // Show all validation errors
        if (usernameError) showError('username', usernameError);
        if (emailError) showError('email', emailError);
        if (passwordError) showError('password', passwordError);

        if (usernameError || emailError || passwordError) {
            return;
        }

        // Clear all errors
        clearError('username');
        clearError('email');
        clearError('password');

        // Submit the form
        fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Registration successful') {
                window.location.href = 'login.html';
            } else {
                showError(data.error || 'Registration failed');
            }
        })
        .catch(error => {
            showError('An error occurred during registration');
            console.error('Registration error:', error);
        });
    });
});