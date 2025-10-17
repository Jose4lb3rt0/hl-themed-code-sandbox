export let AppConfig = loadConfig()

export function saveConfig() {
    localStorage.setItem('appConfig', JSON.stringify(AppConfig))
}

function loadConfig() {
    try {
        const saved = localStorage.getItem("appConfig")
        if (saved) {
            const parsed = JSON.parse(saved)
            return { ...getDefaultConfig(), ...parsed }
        }
    } catch (error) {
        console.warn("Error al cargar la configuración., se usará la configuración por defecto.", error)
    }

    return getDefaultConfig()
}

function getDefaultConfig() {
    return {
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
    }
}

export function setConfig(path, value) {
    const keys = path.split('.')
    let obj = AppConfig
    while (keys.length > 1) obj = obj[keys.shift()]
    obj[keys[0]] = value
    // saveConfig()
}

export function getConfig(path) {
    const keys = path.split('.')
    return keys.reduce((acc, key) => acc?.[key], AppConfig)
}