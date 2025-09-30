document.addEventListener('DOMContentLoaded', () => {
    require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.53.0/min/vs' } })
    require(['vs/editor/editor.main'], function () {
        window.htmlEditor = monaco.editor.create(document.getElementById('html-editor'), {
            value: '<h1>Hello, world!</h1>',
            language: 'html',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontFamily: 'Verdana, TrebuchetCustom, monospace'
        })

        window.cssEditor = monaco.editor.create(document.getElementById('css-editor'), {
            value: 'h1 { color: orange }',
            language: 'css',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false }
        })

        window.jsEditor = monaco.editor.create(document.getElementById('js-editor'), {
            value: 'console.log("Hello Half-Life!")',
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false }
        })

        const runBtn = document.getElementById('runBtn')
        const outputFrame = document.getElementById('output-frame')

        runBtn.addEventListener('click', () => {
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
        })
    })
})

document.addEventListener('DOMContentLoaded', () => {
    startValveIntro()
})