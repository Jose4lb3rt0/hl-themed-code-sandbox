import { getConfig } from "./config.js"

export const sounds = {
    option: "assets/sounds/launch_option.wav",
    close: "assets/sounds/close_menu.wav",
    click_release: "assets/sounds/click_release.wav",

    s02: "assets/sounds/music/Half-Life02.mp3",
    // select: "assets/sounds/launch_option.wav",
    // openMenu: "assets/sounds/launch_upmenu1.wav",
}

let musicPlayer = null

export function playSound(src, customVolume) {
    const audio = new Audio(src)
    const sfxColume = getConfig("audio.sfxVolume") ?? 0.5
    audio.volume = customVolume ?? sfxColume
    audio.play()
    return audio
}

export function playMusic(src, loop = true) {
    stopMusic()

    musicPlayer = new Audio(src)
    musicPlayer.loop = loop
    musicPlayer.volume = getConfig("audio.musicVolume") ?? 0.1
    musicPlayer.play()

    return musicPlayer
}

export function stopMusic() {
    if (musicPlayer) {
        musicPlayer.pause()
        musicPlayer.currentTime = 0
        musicPlayer = null
    }
}


//la musica tiene metodo para actualizar volumen porque suena de forma continua, no como los efectos de sonido
export function updateMusicVolume(value) {
    if (musicPlayer) {
        musicPlayer.volume = value
    }
}