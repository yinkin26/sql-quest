document.addEventListener("DOMContentLoaded", function () {
    const headerElement = document.getElementById("header") || document.getElementById("header-placeholder");
    const footerElement = document.getElementById("footer") || document.getElementById("footer-placeholder");
    const sidebarElement = document.getElementById("sidebar") || document.getElementById("sidebar-placeholder");

    if (headerElement) {
        fetch("/header.html")
            .then(response => response.text())
            .then(data => {
                headerElement.innerHTML = data;
                
                // Execute scripts that were loaded with the header
                executeHeaderScripts();

                setupMenuToggle();

                const currentPage = window.location.pathname;
                const protectedPages = ["challenges.html", "leaderboard.html", "profile.html"];

                // ✅ If page is protected, do session check
                if (protectedPages.some(p => currentPage.includes(p))) {
                    checkSessionAndProtect();
                } else {
                    // ✅ Public pages (index, lessons) just load header normally
                    if (typeof checkLoginStatus === "function") checkLoginStatus();
                }
            })
            .catch(error => {
                console.error("Failed to load header:", error);
            });
    }

    if (footerElement) {
        fetch("/footer.html")
            .then(response => response.text())
            .then(data => {
                footerElement.innerHTML = data;
            })
            .catch(error => {
                console.error("Failed to load footer:", error);
            });
    }

    if (sidebarElement) {
        fetch("/sidebar.html")
            .then(response => response.text())
            .then(data => {
                sidebarElement.innerHTML = data;
                
                // Set active lesson based on current page
                setActiveLessonInSidebar();
            })
            .catch(error => {
                console.error("Failed to load sidebar:", error);
            });
    }
});

function checkSessionAndProtect() {
    fetch("http://localhost:5000/check-session", {
        credentials: "include"
    })
        .then(res => res.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = "login.html";
            } else {
                const loadingEl = document.getElementById("authLoading");
                const protectedEl = document.getElementById("protectedContent");

                if (loadingEl) loadingEl.style.display = "none";
                if (protectedEl) protectedEl.style.display = "block";

                window.completedLevels = data.completedLevels || [];

                if (typeof checkLoginStatus === "function") checkLoginStatus();
                if (typeof initXPTracker === "function") initXPTracker();
                if (typeof styleCompletedButtons === "function") styleCompletedButtons();
                if (typeof disableLockedButtons === "function") disableLockedButtons();
            }
        })
        .catch(error => {
            console.error("Session check failed:", error);
        });
}

function executeHeaderScripts() {
    // Load and execute themeManager.js after header is loaded
    const themeScript = document.createElement('script');
    themeScript.src = 'javascripts/themeManager.js';
    themeScript.onload = function() {
        // Initialize theme manager after script loads
        if (typeof ThemeManager !== 'undefined') {
            window.themeManager = new ThemeManager();
        }
    };
    document.head.appendChild(themeScript);
}

function setupMenuToggle() {
    const menuButton = document.querySelector(".menu-button");
    const menuContainer = document.getElementById("menuContainer");

    if (!menuButton || !menuContainer) return;

    menuButton.addEventListener("click", function (event) {
        event.stopPropagation();
        menuContainer.classList.toggle("hidden");
    });

    document.addEventListener("click", function (event) {
        if (!menuButton.contains(event.target) && !menuContainer.contains(event.target)) {
            menuContainer.classList.add("hidden");
        }
    });
}

function checkLoginStatus() {
    fetch('http://localhost:5000/check-session', {
        credentials: 'include',
        method: 'GET'
    })
        .then(res => res.json())
        .then(data => {
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

function setActiveLessonInSidebar() {
    const currentPage = window.location.pathname.split('/').pop();
    const sidebarLinks = document.querySelectorAll('.lesson-sidebar a');
    
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
}
