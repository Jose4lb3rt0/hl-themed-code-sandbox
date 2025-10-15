import { playSound, sounds } from "./sounds.js"
import { closeTopOverlayMenu, hideOverlayMenus, showOverlayMenus, getOverlayMenus } from "./menus.js"

document.addEventListener("DOMContentLoaded", () => {
    const pauseMenu = document.getElementById("pause-menu")
    const resumeBtn = document.getElementById("resume-btn")
    const exitBtn = document.getElementById("exit-btn")

    let isPaused = false

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") handleEscape()
    })

    function handleEscape() {
        const overlayMenus = getOverlayMenus()
        const hasOverlays = overlayMenus.length > 0

        if (isPaused) {
            if (hasOverlays) {
                closeTopOverlayMenu()
                hideOverlayMenus()
                togglePauseMenu(false)
            } else {
                togglePauseMenu(false)
            }
            playSound(sounds.cancel)
            return
        }

        if (!isPaused) {
            togglePauseMenu(true)
            playSound(sounds.option)
        }
    }

    function togglePauseMenu(forceState) {
        const newState = typeof forceState === "boolean" ? forceState : !isPaused
        isPaused = newState
        pauseMenu.classList.toggle("active", isPaused)

        if (isPaused) {
            document.activeElement.blur()
            showOverlayMenus()
        } else {
            hideOverlayMenus()
        }
    }

    resumeBtn.addEventListener("click", () => {
        playSound(sounds.option)
        hideOverlayMenus()
        togglePauseMenu(false)
    })

    exitBtn.addEventListener("click", () => {
        playSound(sounds.option)
        window.location.href = "index.html"
    })
})
