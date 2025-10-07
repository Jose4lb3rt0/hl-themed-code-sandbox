export const sounds = {
    option: "assets/sounds/launch_option.wav",
    close: "assets/sounds/close_menu.wav",
    // select: "assets/sounds/launch_option.wav",
    // openMenu: "assets/sounds/launch_upmenu1.wav",
}

export function playSound(src, volume = 0.5) {
    const audio = new Audio(src)
    audio.volume = volume
    audio.play()
    return audio
}

export function playSequence(firstSrc, secondSrc, volume = 0.5, delay = 0, callback) {
    const first = new Audio(firstSrc)
    first.volume = volume
    first.play()

    first.addEventListener("ended", () => {
        setTimeout(() => {
            const second = new Audio(secondSrc)
            second.volume = volume
            second.play()
            if (callback) callback()
        }, delay)
    })
}
