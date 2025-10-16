export const AppConfig = {
    language: 'en',
    audio: {
        sfxVolume: 0.5,
        musicVolume: 0.1,
    },
    editor: {
        lineNumbers: 'off',
        wordWrap: 'off',
        fontSize: 14,
        minimap: true,
        theme: 'steamClassic',
        fontLigatures: true,
        cursorBlinking: 'blink',
        cursorSmoothCaretAnimation: 'on',
        tabSize: 4
    },
    otherSettings: {}
}

export function setConfig(path, value) {
    const keys = path.split('.')
    let obj = AppConfig
    while (keys.length > 1) obj = obj[keys.shift()]
    obj[keys[0]] = value
}

export function getConfig(path) {
    const keys = path.split('.')
    return keys.reduce((acc, key) => acc?.[key], AppConfig)
}