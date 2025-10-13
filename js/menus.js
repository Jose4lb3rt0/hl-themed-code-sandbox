import { sounds, playSequence, playSound } from "./sounds.js"
import { showLoadingBar } from "./loading.js"
import { AppConfig, setConfig } from "./config.js"

let openMenus = []
let zIndexCounter = 1000

export const menus = {
    new: {
        id: "menu-new",
        title: "New Code",
        resizable: false,
        minWidth: 300,
        minHeight: 135,
        content: `
            <button class="contentBtn" id="btn-new-code">HTML + CSS + JavaScript</button>
            <button class="contentBtn vital-menu-button" style="margin-top: 7%; align-self: end;">Cancel</button>
        `,
    },
    load: {
        id: "menu-load",
        title: "Load Code",
        resizable: false,
        minWidth: 300,
        content: `
        <span>Cargar un archivo existente:</span>
        <button class="contentBtn">Subir archivo</button>
        <button class="contentBtn">Elegir de la lista</button>
        `,
    },
    options: {
        id: "menu-options",
        title: "Options",
        resizable: false,
        minWidth: 500,
        minHeight: 400,
        content: `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
                <div class="tab-container">
                    <!--<button class="contentBtn vital-menu-button tab" data-tab="general">General</button>-->
                    <button class="contentBtn vital-menu-button tab" data-tab="editor">Editor</button>
                    <button class="contentBtn vital-menu-button tab" data-tab="audio">Audio</button>
                </div>
                <div class="options-content">
                </div>
            </div>
        `
    },
    loading: {
        id: "loading-bar",
        title: "Loading...",
        minWidth: 380,
        minHeight: 110,
        resizable: false,
        content: `
            <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem">
                <span id="loading-text" style="color: #a0ab95"></span>
                <div style="width: 100%; display: flex; gap: 0.5rem; align-items: center">
                    <div id="bar-bg" style="width:100%; background: #3e4737; overflow:hidden; height: 28px; padding: 4px; box-sizing: border-box; display: flex; gap: 2px">
                        <div id="progress-bar" style="width:0%; height:100%; background:#0f0; transition:width 0.3s"></div>
                    </div>
                    <button class="contentBtn vital-menu-button cancel" style="align-self: end">Cancel</button>
                </div>
            </div>
        `,
    },
}

export const optionsMenuContent = {
    general: `s`,
    editor: `
        <div id="editor-options" class="editor-options">
            <div class="option-row">
                <label>Language</label>
                <select id="lang-select">
                    <option value="en" selected>English</option>       
                    <option value="es">Español</option>       
                </select>
            </div>

            <div class="option-row">
                <label>Line Numbers</label>
                <select id="line-numbers-select">
                    <option value="on">On</option>       
                    <option value="off" selected>Off</option>       
                </select>
            </div>

            <div class="option-row">
                <label>Word Wrap</label>
                <select id="word-wrap-select">
                    <option value="on">On</option>       
                    <option value="off" selected>Off</option>       
                </select>
            </div>

            <div class="option-row">
                <label>Font Size</label>
                <input type="number" id="font-size-input" value="14">
            </div>

            <div class="option-row">
                <label>Show Minimap</label>
                <input type="checkbox" id="show-minimap" checked>
            </div>
        </div>
    `,
    audio: `a`,
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".option").forEach((option) => {
        option.addEventListener("click", () => {
            const menuType = option.dataset.menu
            const menuData = menus[menuType]
            if (!menuData) return

            createMenu(menuData)
            playSound(sounds.option)
        })
    })
})

export function createMenu(menuData) {
    let existingMenu = document.getElementById(menuData.id)

    if (existingMenu) {
        zIndexCounter++
        existingMenu.style.zIndex = zIndexCounter
        return
    }

    const menu = document.createElement("div")
    menu.className = "floating-menu"
    menu.id = menuData.id
    menu.classList.add(menuData.id)
    menu.style.position = "absolute"

    //tamaño
    const startW = menuData.spawnWidth || menuData.minWidth || 300
    const startH = menuData.spawnHeight || menuData.minHeight || 200
    menu.style.width = `${startW}px`
    menu.style.height = `${startH}px`

    //posición
    if (menuData.x != null && menuData.y != null) {
        menu.style.left = menuData.x + "px"
        menu.style.top = menuData.y + "px"
        menu.style.transform = "none"
    } else {
        //centro
        menu.style.left = "50%"
        menu.style.top = "50%"
        menu.style.transform = "translate(-50%, -50%)"
    }

    menu.style.zIndex = ++zIndexCounter
    const hasMultipleButtons = menuData.class !== ("" || null) ? true : false

    let headerHTML = `
        <div class="menu-header">
            <span>
                <img src="${menuData.icon ? menuData.icon : 'assets/icons/steam.svg'}" class="lang-logo">
                ${menuData.title}
            </span>
            <div class="header-buttons">
                ${menuData.extraButtons ? menuData.extraButtons.map(btn =>
        `<button class="header-btn" id="${btn.id}" title="${btn.title}">${btn.icon}</button>`
    ).join('') : ''}
                    ${menuData.id !== 'loading-bar' ? `<button class="close-menu">✖</button>` : ''}
                </div>
        </div>
    `

    menu.innerHTML = `
        ${headerHTML}
        <div class="menu-content">${menuData.content}</div>
    `

    if (menuData.resizable) {
        const sides = [
            "top", "right", "bottom", "left",
            "top-right", "top-left", "bottom-right", "bottom-left"
        ]
        sides.forEach((side) => {
            const resizer = document.createElement("div")
            resizer.className = `resizer ${side}`
            menu.appendChild(resizer)
            makeResizable(menu, resizer, side, menuData)
        })
    }

    document.body.appendChild(menu)

    //Parte del resizable
    const rect = menu.getBoundingClientRect()
    menu.style.top = rect.top + "px"
    menu.style.left = rect.left + "px"
    menu.style.transform = ""

    openMenus.push(menu)

    menu.addEventListener("mousedown", () => {
        zIndexCounter++
        menu.style.zIndex = zIndexCounter
    })

    if (menuData.id !== "loading-bar") {
        menu.querySelector(".close-menu").addEventListener("click", () => {
            closeMenu(menu)
        })
    }

    const cancelBtn = menu.querySelector(".vital-menu-button.cancel")
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            closeMenu(menu)
            if (menuData.id === "loading-bar" && window.loadingInterval) {
                clearInterval(window.loadingInterval)
                window.loadingInterval = null
            }
        })
    }

    const header = menu.querySelector(".menu-header")
    let offsetX, offsetY
    let isDragging = false

    header.addEventListener("mousedown", (e) => {
        isDragging = true
        offsetX = e.clientX - menu.offsetLeft
        offsetY = e.clientY - menu.offsetTop

        menu.style.transition = "none"
        document.body.style.userSelect = "none"

        document.addEventListener("mousemove", onDrag)
        document.addEventListener("mouseup", stopDrag)
    })

    function onDrag(e) {
        if (!isDragging) return
        menu.style.left = `${e.clientX - offsetX}px`
        menu.style.top = `${e.clientY - offsetY}px`
    }

    function stopDrag() {
        if (!isDragging) return
        isDragging = false
        document.body.style.userSelect = "auto"
        document.removeEventListener("mousemove", onDrag)
        document.removeEventListener("mouseup", stopDrag)
    }

    const originalWidth = menu.offsetWidth
    const originalHeight = menu.offsetHeight

    const btn = menu.querySelector("#btn-new-code")
    if (btn) {
        btn.addEventListener("click", () => newCode('html-css-js'))
    }

    const hideBtn = menu.querySelector("#hide-btn")
    if (hideBtn) {
        hideBtn.addEventListener("click", () => {
            // menu.style.display = menu.style.display === "none" ? "flex" : "none"
            menu.classList.toggle("minimized")
        })
    }

    const resetBtn = menu.querySelector("#reset-btn")
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            playSound(sounds.click_release, 0.5)
            menu.style.width = originalWidth + "px"
            menu.style.height = originalHeight + "px"
        })
    }

    if (menuData.id === "menu-options") {
        const tabContainer = menu.querySelector(".tab-container")
        const tabs = tabContainer.querySelectorAll(".tab")
        const optionsContent = menu.querySelector(".options-content")

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                tabs.forEach(t => t.classList.remove("active"))
                tab.classList.add("active")

                const selectedTab = tab.dataset.tab
                optionsContent.innerHTML = optionsMenuContent[selectedTab] || "<p>No content available.</p>"

                if (selectedTab === "editor") attachEditorOptionEvents()
            })
        })

        tabs[0].classList.add("active")
        const defaultTab = tabs[0].dataset.tab
        optionsContent.innerHTML = optionsMenuContent[defaultTab] || "<p>No content available.</p>"

        if (defaultTab === "editor") attachEditorOptionEvents()
    }
}

/* Por si se crean mas playgrounds */
function newCode(mode) {
    switch (mode) {
        case "html-css-js":
            showLoadingBar("editor.html", "Starting new code ...")
            break
        default:
            break
    }
}

function closeMenu(menu) {
    playSound(sounds.close)
    menu.remove()
    openMenus = openMenus.filter((m) => m !== menu)
}

function makeResizable(menu, resizer, lado, menuData) {
    resizer.addEventListener("mousedown", (e) => {
        e.preventDefault()
        document.body.style.userSelect = "none"

        let startX = e.clientX
        let startY = e.clientY
        let startWidth = parseInt(window.getComputedStyle(menu).width, 10)
        let startHeight = parseInt(window.getComputedStyle(menu).height, 10)
        let startLeft = menu.offsetLeft
        let startTop = menu.offsetTop

        function mousemove(e) {
            let newWidth = startWidth
            let newHeight = startHeight
            let newLeft = startLeft
            let newTop = startTop

            if (lado.includes("right")) {
                newWidth = Math.min(
                    Math.max(startWidth + (e.clientX - startX), menuData.minWidth || 100),
                    menuData.maxWidth || 1000
                )
            }

            if (lado.includes("left")) {
                const diffX = e.clientX - startX
                newWidth = Math.min(
                    Math.max(startWidth - diffX, menuData.minWidth || 100),
                    menuData.maxWidth || 1000
                )
                newLeft = startLeft + diffX
            }

            if (lado.includes("bottom")) {
                newHeight = Math.min(
                    Math.max(startHeight + (e.clientY - startY), menuData.minHeight || 100),
                    menuData.maxHeight || 800
                )
            }

            if (lado.includes("top")) {
                const diffY = e.clientY - startY
                newHeight = Math.min(
                    Math.max(startHeight - diffY, menuData.minHeight || 100),
                    menuData.maxHeight || 800
                )
                newTop = startTop + diffY
            }

            menu.style.width = newWidth + "px"
            menu.style.height = newHeight + "px"
            menu.style.left = newLeft + "px"
            menu.style.top = newTop + "px"
        }

        function mouseup() {
            document.removeEventListener("mousemove", mousemove)
            document.removeEventListener("mouseup", mouseup)
            document.body.style.userSelect = "auto"
        }

        document.addEventListener("mousemove", mousemove)
        document.addEventListener("mouseup", mouseup)
    })
}

function saveConfig() {
    localStorage.setItem('appConfig', JSON.stringify(AppConfig))
}

function attachEditorOptionEvents() {
    const lineNumbersSelect = document.getElementById("line-numbers-select")
    const wordWrapSelect = document.getElementById("word-wrap-select")
    const fontSizeInput = document.getElementById("font-size-input")
    const showMinimap = document.getElementById("show-minimap")

    if (!lineNumbersSelect || !wordWrapSelect || !fontSizeInput || !showMinimap) return

    lineNumbersSelect.value = AppConfig.editor.lineNumbers || "off"
    wordWrapSelect.value = AppConfig.editor.wordWrap || "off"
    fontSizeInput.value = AppConfig.editor.fontSize || 14
    showMinimap.checked = AppConfig.editor.minimap ?? true

    async function updateAllEditors(updateFn) {
        await window.editorsReady

        const editors = [window.htmlEditor, window.cssEditor, window.jsEditor]

        if (!editors || editors.length === 0) {
            console.warn('Editors not found')
            return
        }

        editors.forEach(editor => {
            if (editor && typeof editor.updateOptions === 'function') {
                try {
                    updateFn(editor)
                } catch (error) {
                    console.warn('Error updating editor:', error)
                }
            }
        })
    }

    lineNumbersSelect.addEventListener("change", (e) => {
        const value = e.target.value
        console.log("Line numbers set to: ", value)
        setConfig('editor.lineNumbers', value)
        updateAllEditors(editor => editor.updateOptions({ lineNumbers: value }))
        saveConfig()
    })

    wordWrapSelect.addEventListener("change", (e) => {
        const value = e.target.value
        setConfig('editor.wordWrap', value)
        updateAllEditors(editor => editor.updateOptions({ wordWrap: value }))
        saveConfig()
    })

    fontSizeInput.addEventListener("change", (e) => {
        const value = parseInt(e.target.value, 10)
        setConfig('editor.fontSize', value)
        updateAllEditors(editor => editor.updateOptions({ fontSize: value }))
        saveConfig()
    })

    showMinimap.addEventListener("change", (e) => {
        const value = e.target.checked
        setConfig('editor.minimap', value)
        updateAllEditors(editor => editor.updateOptions({ minimap: { enabled: value } }))
        saveConfig()
    })
}

