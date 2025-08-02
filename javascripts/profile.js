// Import progress tracking functionality
document.addEventListener("DOMContentLoaded", () => {
    // Initialize progress tracking
    const progressScript = document.createElement('script');
    progressScript.src = '/javascripts/progress.js';
    document.head.appendChild(progressScript);

    fetch("http://localhost:5000/check-session", {
        credentials: "include"
    })
        .then(res => res.json())
        .then(data => {
            if (!data.loggedIn) return window.location.href = "login.html";

            document.getElementById("profileUsername").textContent = data.username;
            document.getElementById("profileXP").textContent = data.userScore;

            // ?? XP Badge logic
            const totalXP = data.userScore;
            const level = Math.floor(totalXP / 300);
            const cappedXP = totalXP % 100;
            const levelInTier = Math.floor((totalXP % 300) / 100);
            const tiers = ["bronze", "silver", "gold", "platinium", "diamond", "champ"];
            const badge = level < tiers.length ? `${tiers[level]}${levelInTier + 1}` : "champ3";

            document.getElementById("profileBadge").src = `/images/${badge}.png`;
            document.getElementById("profileRank").textContent = badge.toUpperCase();

            loadBookmarkedLessons();
            loadCompletedLessons();
        });

    function loadBookmarkedLessons() {
        fetch("http://localhost:5000/bookmarks", {
            credentials: "include",
            headers: { "Accept": "application/json" } // Explicitly request JSON
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                const list = document.getElementById("bookmarkedList");
                if (!list) return;

                if (!data.lessonIds || data.lessonIds.length === 0) {
                    list.innerHTML = "<li>No bookmarked lessons.</li>";
                    return;
                }

                // Updated lesson names with proper emojis
                const lessonNames = {
                    Intro: "🎓 Introduction to SQL",
                    Syntax: "📝 SQL Syntax",
                    DataTypes: "🔢 SQL Data Types",
                    Table: "🗃️ SQL CREATE TABLE",
                    Insert_Into: "➕ SQL INSERT INTO",
                    Select: "🔍 SQL SELECT",
                    Select_Distinct: "🎯 SQL SELECT DISTINCT",
                    Where_Clause: "🔬 SQL WHERE Clause",
                    AND_OR_NOT: "🔗 SQL AND / OR / NOT",
                    OrderBy: "📊 SQL ORDER BY",
                    LimitOffset: "📏 SQL LIMIT / OFFSET",
                    NullAndIsNull: "❓ SQL NULL & IS NULL",
                    Alias: "🏷️ SQL Aliases"
                };


                list.innerHTML = "";
                data.lessonIds.forEach(id => {
                    const displayName = lessonNames[id] || id;
                    const item = document.createElement("li");
                    item.innerHTML = `<a href="${id}.html">${displayName}</a>`;
                    list.appendChild(item);
                });
            })
            .catch(err => {
                console.error("Error loading bookmarks:", err);
                const list = document.getElementById("bookmarkedList");
                if (list) list.innerHTML = "<li>Error loading bookmarks. Please try again.</li>";
            });
    }

    function loadCompletedLessons() {
        fetch("http://localhost:5000/completed-lessons", { credentials: "include" })
            .then(res => {
                if (!res.ok) {
                    console.error("Server response not ok:", res.status, res.statusText);
                    throw new Error(`Server error: ${res.status}`);
                }
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    console.error("Invalid content type:", contentType);
                    throw new Error("Invalid content type");
                }
                return res.json();
            })
            .then(data => {
                console.log("Completed lessons data:", data);
                const list = document.getElementById("completedList");
                if (!list) {
                    console.error("completedList element not found");
                    return;
                }

                list.innerHTML = "";
                if (!Array.isArray(data) || data.length === 0) {
                    console.log("No completed lessons found");
                    list.innerHTML = "<li>No completed lessons yet.</li>";
                } else {
                    // ✅ Add progress bar calculation here
                    const totalLessons = 13; // update if you change lesson count
                    const percent = Math.round((data.length / totalLessons) * 100);
                    document.getElementById("progressPercent").textContent = `${percent}%`;
                    document.getElementById("progressBar").style.width = `${percent}%`;

                    const lessonNames = {
                        Intro: "🎓 Introduction to SQL",
                        Syntax: "📝 SQL Syntax",
                        DataTypes: "🔢 SQL Data Types",
                        Table: "🗃️ SQL CREATE TABLE",
                        Insert_Into: "➕ SQL INSERT INTO",
                        Select: "🔍 SQL SELECT",
                        Select_Distinct: "🎯 SQL SELECT DISTINCT",
                        Where_Clause: "🔬 SQL WHERE Clause",
                        AND_OR_NOT: "🔗 SQL AND / OR / NOT",
                        OrderBy: "📊 SQL ORDER BY",
                        LimitOffset: "📏 SQL LIMIT / OFFSET",
                        NullAndIsNull: "❓ SQL NULL & IS NULL",
                        Alias: "🏷️ SQL Aliases"
                    };

                    data.forEach(lesson => {
                        const li = document.createElement("li");
                        const displayName = lessonNames[lesson] || lesson;
                        li.innerHTML = `<span class="completed-lesson">${displayName}</span>`;
                        list.appendChild(li);
                    });
                }
            })
            .catch(err => {
                console.error("Error loading completed lessons:", err);
                const list = document.getElementById("completedList");
                if (list) {
                    list.innerHTML = "<li class='error-message'>Error loading completed lessons. Please refresh the page or try again later.</li>";
                }
                document.dispatchEvent(new CustomEvent('lessonLoadError', {
                    detail: { error: err.message }
                }));
            });
    }
});
