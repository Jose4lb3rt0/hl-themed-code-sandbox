document.addEventListener('DOMContentLoaded', () => {
    require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.53.0/min/vs' } })
    require(['vs/editor/editor.main'], function () {
        fetch('../assets/monaco/steam-classic.json')
            .then(res => res.json())
            .then(themeJson => {
                const monacoTheme = vscodeThemeToMonaco(themeJson)
                monaco.editor.defineTheme('steamClassic', monacoTheme)
                monaco.editor.setTheme('steamClassic')

                window.htmlEditor = monaco.editor.create(document.getElementById('html-editor'), {
                    value: '<h1>Hello, world!</h1>',
                    language: 'html',
                    theme: 'vs-dark',
                    automaticLayout: true,
                    minimap: { enabled: false },
                    theme: 'steamClassic',
                    lineNumbers: 'off' // Poner de vuelta si se quiere los numeros otra vez
                })

                window.cssEditor = monaco.editor.create(document.getElementById('css-editor'), {
                    value: 'h1 { color: orange }',
                    language: 'css',
                    theme: 'vs-dark',
                    automaticLayout: true,
                    minimap: { enabled: false },
                    theme: 'steamClassic',
                    lineNumbers: 'off'
                })

                window.jsEditor = monaco.editor.create(document.getElementById('js-editor'), {
                    value: 'console.log("Hello Half-Life!")',
                    language: 'javascript',
                    theme: 'vs-dark',
                    automaticLayout: true,
                    minimap: { enabled: false },
                    theme: 'steamClassic',
                    lineNumbers: 'off'
                })

                const editors = {
                    html: window.htmlEditor,
                    css: window.cssEditor,
                    js: window.jsEditor
                }

                document.querySelectorAll('.scroll-btn').forEach(btn => {
                    let intervalId = null // id para controlar el scroll de cada editor

                    const getEditor = () => {
                        const editorKey = btn.dataset.editor
                        return editors[editorKey] || null
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

                Object.values(editors).forEach(editor => {
                    editor.onDidChangeModelContent(() => {
                        updateOutput()
                    })
                })

                updateOutput()
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

document.addEventListener('DOMContentLoaded', () => {
    startValveIntro()
})