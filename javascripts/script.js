// Menu functionality is now handled by loadComponents.js
// Removed duplicate menu initialization to prevent conflicts



// ? Query Execution Function
function runQuery() {
    let query = document.getElementById("sqlInput").value.trim();
    let resultContainer = document.getElementById("queryResult");

    if (!query) {
        resultContainer.innerHTML = "<p style='color: red;'>? Please enter a valid SQL query.</p>";
        return;
    }

    // ?? Show a loading message
    resultContainer.innerHTML = "<p style='color: yellow;'>? Executing query...</p>";

    fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ query })
    })

        .then(response => response.json())
        .then(data => {
            if (data.error) {
                resultContainer.innerHTML = `<p style="color: red;">? Error: ${data.error}</p>`;
            } else {
                if (Array.isArray(data.result) && data.result.length > 0) {
                    renderTable(data.result);
                    // Dispatch success event for lesson tracking
                    document.dispatchEvent(new Event('querySuccess'));
                } else if (data.message) {
                    resultContainer.innerHTML = `<p style="color: green;">? ${data.message}</p>`;
                    // Dispatch success event for lesson tracking
                    document.dispatchEvent(new Event('querySuccess'));
                } else {
                    resultContainer.innerHTML = "<p style='color: orange;'>? Query executed successfully, but no records were found.</p>";
                    // Dispatch success event for lesson tracking
                    document.dispatchEvent(new Event('querySuccess'));
                }
            }
        })
        .catch(error => {
            console.error("?? Query Execution Error:", error);
            resultContainer.innerHTML = "<p style='color: red;'>? An error occurred while executing the query.</p>";
        });
}

// ? Render Query Results as a Table
function renderTable(data) {
    let resultContainer = document.getElementById("queryResult");

    if (data.length === 0) {
        resultContainer.innerHTML = "<p style='color: orange;'>? No records found.</p>";
        return;
    }

    let table = `
        <table style="width:100%; text-align:left; border-collapse: collapse; border: 2px solid #ff00ff; font-size: 14px;">
            <thead>
                <tr style="background-color:#ff00ff; color:white;">
    `;

    // ?? Generate Table Headers
    Object.keys(data[0]).forEach(column => {
        table += `<th style="padding:10px; border:1px solid white;">${column}</th>`;
    });
    table += `</tr></thead><tbody>`;

    // ?? Populate Table Rows
    data.forEach(row => {
        table += `<tr>`;
        Object.values(row).forEach(value => {
            table += `<td style="padding:10px; border:1px solid white;">${value !== null ? value : 'NULL'}</td>`;
        });
        table += `</tr>`;
    });

    table += `</tbody></table>`;
    resultContainer.innerHTML = table;
}
// ? Floating Pixel Particles
document.addEventListener("DOMContentLoaded", function () {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.classList.add("pixel-particles");

        const x = Math.random();
        const y = Math.random();
        const duration = 2 + Math.random() * 3;

        // ? FIX: Set CSS variables for positioning
        particle.style.setProperty('--x', x);
        particle.style.setProperty('--y', y);
        particle.style.animationDuration = `${duration}s`;

        document.body.appendChild(particle);
    }
});

// ? Run buttons in Syntax.html
document.addEventListener("DOMContentLoaded", function () {
    // Loop through all .run-btn buttons
    document.querySelectorAll(".run-btn").forEach(button => {
        button.addEventListener("click", function () {
            const codeBlock = this.closest(".code-block");
            const textarea = codeBlock.querySelector("textarea");
            const outputDiv = codeBlock.querySelector(".query-output");

            const query = textarea.value.trim();

            if (!query) {
                outputDiv.innerHTML = "<p style='color: red;'>? Please enter a query.</p>";
                return;
            }

            outputDiv.innerHTML = "<p style='color: yellow;'>? Executing...</p>";

            fetch('http://localhost:5000/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ query })
            })

                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        outputDiv.innerHTML = `<p style='color: red;'>? Error: ${data.error}</p>`;
                    } else if (Array.isArray(data.result) && data.result.length > 0) {
                        outputDiv.innerHTML = renderMiniTable(data.result);
                        // Dispatch success event for lesson tracking
                        document.dispatchEvent(new Event('querySuccess'));
                    } else if (data.message) {
                        outputDiv.innerHTML = `<p style='color: green;'>? ${data.message}</p>`;
                        // Dispatch success event for lesson tracking
                        document.dispatchEvent(new Event('querySuccess'));
                    } else {
                        outputDiv.innerHTML = "<p style='color: orange;'>? Query executed, no records returned.</p>";
                        // Dispatch success event for lesson tracking
                        document.dispatchEvent(new Event('querySuccess'));
                    }
                })
                .catch(error => {
                    console.error("Execution Error:", error);
                    outputDiv.innerHTML = "<p style='color: red;'>? Failed to execute query.</p>";
                });
        });
    });
});

// ? Render mini tables inside Syntax.html
function renderMiniTable(data) {
    let table = "<table><thead><tr>";
    Object.keys(data[0]).forEach(col => {
        table += `<th>${col}</th>`;
    });
    table += "</tr></thead><tbody>";

    data.forEach(row => {
        table += "<tr>";
        Object.values(row).forEach(val => {
            table += `<td>${val !== null ? val : 'NULL'}</td>`;
        });
        table += "</tr>";
    });

    table += "</tbody></table>";
    return table;
}
// Header, footer, and menu functionality is now handled by loadComponents.js
// Removed duplicate component loading and menu setup to prevent conflicts

function checkLoginStatus() {
    fetch('http://localhost:5000/check-session', {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            console.log("SESSION DEBUG:", data);

            const loginLink = document.getElementById('loginLink');
            const registerLink = document.getElementById('registerLink');
            const logoutLink = document.getElementById('logoutLink');
            const profileLink = document.getElementById('profileLink');

            if (data.loggedIn) {
                if (loginLink) loginLink.style.display = 'none';
                if (registerLink) registerLink.style.display = 'none';
                if (logoutLink) logoutLink.style.display = 'inline-block';
                if (profileLink) profileLink.style.display = 'inline-block';
            } else {
                if (loginLink) loginLink.style.display = 'inline-block';
                if (registerLink) registerLink.style.display = 'inline-block';
                if (logoutLink) logoutLink.style.display = 'none';
                if (profileLink) profileLink.style.display = 'none';
            }
        })
        .catch(error => {
            console.error("Check-session failed:", error);
        });
}

function logout() {
    fetch('http://localhost:5000/logout', {
        credentials: 'include',
        method: 'GET'
    })
        .then(() => {
            localStorage.clear();
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
}



