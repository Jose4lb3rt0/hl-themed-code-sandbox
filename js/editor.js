import { AppConfig } from "./config.js"
import { createMenu } from "./menus.js"

const editors = {
    htmlEditor: {
        id: "menu-html",
        class: "editor",
        icon: "assets/icons/html.svg",
        title: "HTML",
        resizable: true,
        minWidth: 300,
        minHeight: 200,
        maxWidth: 1200,
        maxHeight: 900,
        x: 35,
        y: 25,
        spawnWidth: 600,
        spawnHeight: 270,
        layer: "editor",
        extraButtons: [
            { id: "hide-btn", icon: "🗕", title: "Ocultar" },
            { id: "reset-btn", icon: "↺", title: "Tamaño original" }
        ],
        content: `
            <div class="command-console-container">
                <div id="html-editor" class="monaco-editor"></div>
                <button class="scroll-btn scroll-up" data-editor="html">▲</button>
                <button class="scroll-btn scroll-down" data-editor="html">▼</button>
            </div>
        `,
    },
    cssEditor: {
        id: "menu-css",
        class: "editor",
        icon: "assets/icons/css.svg",
        title: "CSS",
        resizable: true,
        minWidth: 300,
        minHeight: 200,
        maxWidth: 1200,
        maxHeight: 900,
        x: 645,
        y: 25,
        spawnWidth: 600,
        spawnHeight: 270,
        layer: "editor",
        extraButtons: [
            { id: "hide-btn", icon: "🗕", title: "Ocultar" },
            { id: "reset-btn", icon: "↺", title: "Tamaño original" }
        ],
        content: `
            <div class="command-console-container">
                <div id="css-editor" class="monaco-editor"></div>
                <button class="scroll-btn scroll-up" data-editor="css">▲</button>
                <button class="scroll-btn scroll-down" data-editor="css">▼</button>
            </div>
        `,
    },
    jsEditor: {
        id: "menu-js",
        class: "editor",
        icon: "assets/icons/javascript.svg",
        title: "JavaScript",
        resizable: true,
        minWidth: 300,
        minHeight: 200,
        maxWidth: 1200,
        maxHeight: 900,
        x: 35,
        y: 305,
        spawnWidth: 600,
        spawnHeight: 270,
        layer: "editor",
        extraButtons: [
            { id: "hide-btn", icon: "🗕", title: "Ocultar" },
            { id: "reset-btn", icon: "↺", title: "Tamaño original" }
        ],
        content: `
            <div class="command-console-container">
                <div id="js-editor" class="monaco-editor"></div>
                <button class="scroll-btn scroll-up" data-editor="js">▲</button>
                <button class="scroll-btn scroll-down" data-editor="js">▼</button>
            </div>
        `,
    },
    output: {
        id: "menu-output",
        class: "editor",
        title: "Output",
        resizable: true,
        minWidth: 350,
        minHeight: 200,
        maxWidth: 1200,
        maxHeight: 900,
        x: 645,
        y: 305,
        spawnWidth: 600,
        spawnHeight: 270,
        layer: "editor",
        extraButtons: [
            { id: "hide-btn", icon: "🗕", title: "Ocultar" },
            { id: "reset-btn", icon: "↺", title: "Tamaño original" }
        ],
        content: `
            <div class="command-console-container">
                <iframe id="output-frame" sandbox="allow-scripts"></iframe>
            </div>
        `,
    },
}

// window.editorsReady = new Promise((resolve) => {
//     window.resolveEditorsReady = resolve
// })

document.addEventListener('DOMContentLoaded', () => {
    ["htmlEditor", "cssEditor", "jsEditor", "output"].forEach((id) => {
        createMenu(editors[id])
    })

    require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.53.0/min/vs' } })
    require(['vs/editor/editor.main'], function () {
        fetch('../libs/steam-classic.json')
            .then(res => res.json())
            .then(themeJson => {
                const monacoTheme = vscodeThemeToMonaco(themeJson)
                monaco.editor.defineTheme('steamClassic', monacoTheme)
                monaco.editor.setTheme('steamClassic')

                window.htmlEditor = monaco.editor.create(document.getElementById('html-editor'), {
                    value: '<h1>Hello, world!</h1>',
                    language: 'html',
                    theme: AppConfig.editor.theme,
                    automaticLayout: true,
                    lineNumbers: AppConfig.editor.lineNumbers,
                    wordWrap: AppConfig.editor.wordWrap,
                    minimap: { enabled: AppConfig.editor.minimap },
                    fontSize: AppConfig.editor.fontSize,
                    fontLigatures: AppConfig.editor.fontLigatures,
                    cursorBlinking: AppConfig.editor.cursorBlinking,
                    cursorSmoothCaretAnimation: AppConfig.editor.cursorSmoothCaretAnimation,
                    tabSize: AppConfig.editor.tabSize,
                })

                window.cssEditor = monaco.editor.create(document.getElementById('css-editor'), {
                    value: 'h1 { color: orange }',
                    language: 'css',
                    theme: AppConfig.editor.theme,
                    automaticLayout: true,
                    lineNumbers: AppConfig.editor.lineNumbers,
                    wordWrap: AppConfig.editor.wordWrap,
                    minimap: { enabled: AppConfig.editor.minimap },
                    fontSize: AppConfig.editor.fontSize
                })

                window.jsEditor = monaco.editor.create(document.getElementById('js-editor'), {
                    value: 'console.log("Hello Half-Life!")',
                    language: 'javascript',
                    theme: AppConfig.editor.theme,
                    automaticLayout: true,
                    lineNumbers: AppConfig.editor.lineNumbers,
                    wordWrap: AppConfig.editor.wordWrap,
                    minimap: { enabled: AppConfig.editor.minimap },
                    fontSize: AppConfig.editor.fontSize
                })

                const editorInstances = {
                    html: window.htmlEditor,
                    css: window.cssEditor,
                    js: window.jsEditor
                }

                document.querySelectorAll('.scroll-btn').forEach(btn => {
                    let intervalId = null // id para controlar el scroll de cada editor

                    const getEditor = () => {
                        const editorKey = btn.dataset.editor
                        return editorInstances[editorKey] || null
                    }

                    const scrollEditor = (editor, direction) => {
                        const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight)
                        const scrollTop = editor.getScrollTop()
                        editor.setScrollTop(scrollTop + direction * lineHeight * 3)
                    }

                    const startScroll = () => {
                        const editor = getEditor()
                        if (!editor) return

                        const direction = btn.classList.contains('scroll-up') ? -1 : 1

                        intervalId = setInterval(() => {
                            scrollEditor(editor, direction)
                        }, 100)
                    };

                    const stopScroll = () => {
                        if (intervalId) {
                            clearInterval(intervalId)
                            intervalId = null
                        }
                    }


                    btn.addEventListener('mousedown', startScroll)
                    document.addEventListener('mouseup', stopScroll)

                    btn.addEventListener('touchstart', startScroll)
                    document.addEventListener('touchend', stopScroll)

                    btn.addEventListener('click', () => {
                        const editor = getEditor()
                        if (!editor) return
                        const direction = btn.classList.contains('scroll-up') ? -1 : 1
                        scrollEditor(editor, direction)
                    })
                })

                const outputFrame = document.getElementById('output-frame')

                const updateOutput = () => {
                    const html = window.htmlEditor.getValue()
                    const css = window.cssEditor.getValue()
                    const js = window.jsEditor.getValue()

                    outputFrame.srcdoc = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                        <style>${css}</style>
                        </head>
                        <body>
                            ${html}
                            <script>
                                try {
                                    ${js}
                                } catch(e) {
                                 document.body.innerHTML += "<pre style='color:red'>" + e + "</pre>"
                                }
                            </script>
                        </body>
                        </html>
                    `
                }

                Object.values(editorInstances).forEach(editor => {
                    editor.onDidChangeModelContent(() => {
                        updateOutput()
                    })
                })

                updateOutput()
                // window.resolveEditorsReady()
            })
    })
})

function vscodeThemeToMonaco(themeJson) {
    const rules = []

    themeJson.tokenColors.forEach(tc => {
        if (!tc.scope) return
        const scopes = Array.isArray(tc.scope) ? tc.scope : tc.scope.split(',')
        scopes.forEach(scope => {
            rules.push({
                token: scope.trim(),
                foreground: tc.settings.foreground?.replace('#', '') || undefined,
                fontStyle: tc.settings.fontStyle || ''
            })
        })
    })

    return {
        base: themeJson.type === "dark" ? "vs-dark" : "vs",
        inherit: true,
        rules,
        colors: themeJson.colors || {}
    }
}
