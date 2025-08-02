const sounds = {
    correct: new Audio("/sounds/win.wav"),
    wrong: new Audio("/sounds/notification.wav"),
    next: new Audio("/sounds/woosh.wav"),
    click: new Audio("/sounds/click.wav")
};

function playSound(type) {
    if (sounds[type]) {
        sounds[type].currentTime = 0;
        sounds[type].play();
    }
}

// Global click sound
window.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.tagName === "BUTTON") {
            playSound("click");
        }
    });
});
