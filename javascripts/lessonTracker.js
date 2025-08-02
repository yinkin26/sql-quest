// public/javascripts/lessonTracker.js
class LessonTracker {
    constructor() {
        this.currentLesson = this.getLessonId();
        if (!this.currentLesson) return;
        this.injectButton();
        this.listenToScroll();
        this.listenToQuerySuccess();
    }

    getLessonId() {
        const path = window.location.pathname;
        const file = path.substring(path.lastIndexOf("/") + 1);
        return file.replace(".html", "");
    }

    injectButton() {
        const btn = document.createElement("button");
        btn.id = "markComplete";
        btn.className = "completion-button neon-button";
        btn.innerText = "✓ Mark Lesson Complete";
        btn.style.marginTop = "40px";
        btn.onclick = () => this.markAsDone();
        document.querySelector(".lesson-content")?.appendChild(btn);
    }

    listenToScroll() {
        window.addEventListener("scroll", () => {
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 10) {
                this.markAsDone();
            }
        });
    }

    listenToQuerySuccess() {
        document.addEventListener("querySuccess", () => this.markAsDone());
    }

    markAsDone() {
        if (this.marked) return; // prevent re-marking
        this.marked = true;

        fetch("http://localhost:5000/complete-lesson", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ lesson: this.currentLesson })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const btn = document.getElementById("markComplete");
                    if (btn) {
                        btn.disabled = true;
                        btn.innerText = "✓ Lesson Completed";
                    }
                }
            });
    }
}

document.addEventListener("DOMContentLoaded", () => new LessonTracker());
