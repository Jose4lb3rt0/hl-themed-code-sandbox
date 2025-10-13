export const AppConfig = {
    language: 'en',
    audioVolume: 0.5,
    editor: {
        lineNumbers: 'off',
        wordWrap: 'off',
        fontSize: 14,
        minimap: true,
        theme: 'steamClassic'
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