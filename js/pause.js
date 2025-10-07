import { playSound, sounds } from "./sounds.js"

document.addEventListener("DOMContentLoaded", () => {
    const pauseMenu = document.getElementById("pause-menu")
    const resumeBtn = document.getElementById("resume-btn")
    const exitBtn = document.getElementById("exit-btn")

    let isPaused = false

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            togglePauseMenu()
        }
    })

    function togglePauseMenu() {
        isPaused = !isPaused
        pauseMenu.classList.toggle("active", isPaused)

        if (isPaused) {
            document.activeElement.blur()
        }
    }

    resumeBtn.addEventListener("click", () => {
        togglePauseMenu()
    })

    exitBtn.addEventListener("click", () => {
        window.location.href = "index.html"
    })
})

//pronto necesitara otro lugar
document.addEventListener("DOMContentLoaded", () => {
    const resumeBtn = document.getElementById("resume-btn")
    if (resumeBtn) {
        resumeBtn.addEventListener("click", () => {
            playSound(sounds.option)
        })
    }
})
