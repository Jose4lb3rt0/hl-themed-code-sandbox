import { AppConfig } from "./config.js"

export const translations = {
    en: {
        "loading...": "Loading...",
        startingNewCode: "Starting new code ...",
        loadingProgress: "Loading...",

        resume: "Resume code",
        newcode: "New code",
        newcodeDesc: "Create a new code file.",
        options: "Options",
        optionsDesc: "Change settings.",
        exit: "Leave code",

        general: "General",
        language: "Language",
        en: "English",
        es: "Spanish",
        theme: "Theme",

        editor: "Editor",
        lineNumbers: "Line Numbers",
        relative: "Relative",
        interval: "Interval",
        wordWrap: "Word Wrap",
        fontSize: "Font Size",
        tabSize: "Tab Size",
        showMinimap: "Show Minimap",
        efLigatures: "Enable Font Ligatures",
        cBlinking: "Cursor Blinking",
        blink: "Blink",
        smooth: "Smooth",
        phase: "Phase",
        expand: "Expand",
        solid: "Solid",
        cscAnimation: "Cursor Smooth Caret Animation",
        explicit: "Explicit",

        audio: "Audio",
        sfxVolume: "Sound Effects Volume",
        musicVolume: "Music Volume",

        apply: "Apply",
        accept: "Accept",
        cancel: "Cancel",
        on: "On",
        off: "Off",
    },
    es: {
        "loading...": "Cargando...",
        startingNewCode: "Iniciando nuevo código ...",
        loadingProgress: "Cargando...",

        resume: "Reanudar código",
        newcode: "Nuevo código",
        newcodeDesc: "Crea un nuevo archivo de código.",
        options: "Opciones",
        optionsDesc: "Cambia la configuración.",
        exit: "Salir del código",

        general: "General",
        language: "Idioma",
        en: "Inglés",
        es: "Español",
        theme: "Tema",

        editor: "Editor",
        lineNumbers: "Números de línea",
        relative: "Relativo",
        interval: "Intervalo",
        wordWrap: "Ajuste de línea",
        fontSize: "Tamaño de fuente",
        tabSize: "Tamaño de tabulado",
        showMinimap: "Mostrar minimapa",
        efLigatures: "Habilitar ligaduras de fuentes",
        cBlinking: "Cursor parpadeante",
        blink: "Parpadear",
        smooth: "Liso",
        phase: "Fase",
        expand: "Expandir",
        solid: "Sólido",
        cscAnimation: "Animación de cursor suave",
        explicit: "Explícito",

        audio: "Audio",
        sfxVolume: "Volumen de efectos de sonido",
        musicVolume: "Volumen de música",

        apply: "Aplicar",
        accept: "Aceptar",
        cancel: "Cancelar",
        on: "Activado",
        off: "Desactivado",
    },
}

export function t(key) {
    const lang = AppConfig.language || "en"
    return translations[lang]?.[key] || translations["en"][key] || key
}

export function applyT(root = document) {
    root.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n")
        const text = t(key)

        if (el.tagName === "INPUT" && "placeholder" in el) {
            el.placeholder = text
        } else if (el.tagName === "OPTION") {
            el.textContent = ""
            el.appendChild(document.createTextNode(text))
        } else if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) {
            el.firstChild.nodeValue = text
        } else {
            el.textContent = text
        }
    })
}