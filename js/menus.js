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
                    <button class="contentBtn vital-menu-button tab" data-tab="general">General</button>
                    <button class="contentBtn vital-menu-button tab" data-tab="editor">Editor</button>
                    <button class="contentBtn vital-menu-button tab" data-tab="audio">Audio</button>
                </div>
                <div class="options-content">
                </div>
                <div style="width: 100%; display: flex; justify-content: flex-end; padding: 0.2rem 0; gap: 0.4rem;">
                    <button id="btn-accept-config" class="contentBtn vital-menu-button" data-tab="editor">Aceptar</button>
                    <button id="btn-cancel-config" class="contentBtn vital-menu-button" data-tab="editor">Cancelar</button>
                    <button id="btn-apply-config" class="contentBtn vital-menu-button" data-tab="audio">Aplicar</button>
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

let tempConfig = structuredClone(AppConfig)

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
        tempConfig = structuredClone(AppConfig)
        const tabContainer = menu.querySelector(".tab-container")
        const tabs = tabContainer.querySelectorAll(".tab")
        const optionsContent = menu.querySelector(".options-content")

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                tabs.forEach(t => t.classList.remove("active"))
                tab.classList.add("active")

                const selectedTab = tab.dataset.tab
                renderOptionsTab(selectedTab, optionsContent)
            })
        })

        tabs[0].classList.add("active")
        renderOptionsTab(tabs[0].dataset.tab, optionsContent)

        const btnAccept = menu.querySelector("#btn-accept-config")
        const btnCancel = menu.querySelector("#btn-cancel-config")
        const btnApply = menu.querySelector("#btn-apply-config")

        btnApply.addEventListener("click", () => {
            applyTempConfig()
            playSound(sounds.apply)
        })

        btnCancel.addEventListener("click", () => {
            tempConfig = structuredClone(AppConfig)
            playSound(sounds.cancel)
            closeMenu(menu)
        })

        btnAccept.addEventListener("click", () => {
            applyTempConfig()
            playSound(sounds.accept)
            closeMenu(menu)
        })
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

function applyTempConfig() {
    Object.assign(AppConfig, structuredClone(tempConfig))
    saveConfig()

    const editors = [window.htmlEditor, window.cssEditor, window.jsEditor]
    editors.forEach(editor => {
        if (editor && editor.updateOptions) {
            editor.updateOptions({
                lineNumbers: AppConfig.editor.lineNumbers,
                wordWrap: AppConfig.editor.wordWrap,
                fontSize: AppConfig.editor.fontSize,
                minimap: { enabled: AppConfig.editor.minimap },
                cursorBlinking: AppConfig.editor.cursorBlinking,
                cursorSmoothCaretAnimation: AppConfig.editor.cursorSmoothCaretAnimation,
                tabSize: AppConfig.editor.tabSize,
                fontLigatures: AppConfig.editor.fontLigatures,
            })
        }
    })
}

function renderOptionsTab(tabName, container) {
    container.innerHTML = ""

    switch (tabName) {
        case "general":
            container.appendChild(createGeneralTab())
            break
        case "editor":
            container.appendChild(createEditorTab())
            break
        case "audio":
            container.appendChild(createAudioTab())
            break
        default:
            container.textContent = "No content available."
            break
    }
}

function createEditorTab() {
    const wrapper = document.createElement("div")
    wrapper.className = "editor-options"

    wrapper.innerHTML = `
        <div class="option-row">
            <label>Line Numbers</label>
            <select id="line-numbers-select">
                <option value="on">On</option>       
                <option value="off" >Off</option>       
                <option value="relative">Relative</option>       
                <option value="interval">Interval</option>       
            </select>
        </div>

        <div class="option-row">
            <label>Word Wrap</label>
            <select id="word-wrap-select">
                <option value="on">On</option>       
                <option value="off">Off</option>       
            </select>
        </div>

        <div class="option-row">
            <label>Font Size</label>
            <input type="number" id="font-size-input">
        </div>

        <div class="option-row">
            <label>Tab Size</label>
            <input type="number" id="tab-size-input">
        </div>

        <div class="option-row">
            <label>Show Minimap</label>
            <input type="checkbox" id="show-minimap">
        </div>

        <div class="option-row">
            <label>Enable Font Ligatures</label>
            <input type="checkbox" id="enable-font-ligatures">
        </div>

        <div class="option-row">
            <label>Cursor Blinking</label>
            <select id="cursor-blinking-select">
                <option value="blink">Blink</option>       
                <option value="smooth">Smooth</option>       
                <option value="phase">Phase</option>       
                <option value="expand">Expand</option>       
                <option value="solid">Solid</option>       
            </select>
        </div>

        <div class="option-row">
            <label>Cursor Smooth Caret Animation</label>
            <select id="cursor-caret-select">
                <option value="on">On</option>       
                <option value="explicit">Explicit</option>       
                <option value="off">Off</option>       
            </select>
        </div>
    `
    //Asignar los valores de tempConfig a los elementos
    wrapper.querySelector("#line-numbers-select").value = tempConfig.editor.lineNumbers
    wrapper.querySelector("#word-wrap-select").value = tempConfig.editor.wordWrap
    wrapper.querySelector("#font-size-input").value = tempConfig.editor.fontSize
    wrapper.querySelector("#tab-size-input").value = tempConfig.editor.tabSize ?? 4
    wrapper.querySelector("#show-minimap").checked = tempConfig.editor.minimap
    wrapper.querySelector("#enable-font-ligatures").checked = tempConfig.editor.fontLigatures
    wrapper.querySelector("#cursor-blinking-select").value = tempConfig.editor.cursorBlinking ?? "blink"
    wrapper.querySelector("#cursor-caret-select").value = tempConfig.editor.cursorSmoothCaretAnimation ?? "on"

    //Enlazar los eventos que actualizan tempConfig en vivo
    wrapper.querySelector("#line-numbers-select").addEventListener("change", e => tempConfig.editor.lineNumbers = e.target.value)
    wrapper.querySelector("#word-wrap-select").addEventListener("change", e => tempConfig.editor.wordWrap = e.target.value)
    wrapper.querySelector("#font-size-input").addEventListener("input", e => tempConfig.editor.fontSize = parseInt(e.target.value))
    wrapper.querySelector("#tab-size-input").addEventListener("input", e => tempConfig.editor.tabSize = parseInt(e.target.value))
    wrapper.querySelector("#show-minimap").addEventListener("change", e => tempConfig.editor.minimap = e.target.checked)
    wrapper.querySelector("#enable-font-ligatures").addEventListener("change", e => tempConfig.editor.fontLigatures = e.target.checked)
    wrapper.querySelector("#cursor-blinking-select").addEventListener("change", e => tempConfig.editor.cursorBlinking = e.target.value)
    wrapper.querySelector("#cursor-caret-select").addEventListener("change", e => tempConfig.editor.cursorSmoothCaretAnimation = e.target.value)

    return wrapper
}

function createGeneralTab() {
    const wrapper = document.createElement("div")
    wrapper.className = "general-options"

    wrapper.innerHTML = `
        <div class="option-row">
            <label>Language</label>
            <select id="lang-select">
                <option value="en">English</option>
                <option value="es">Español</option>
            </select>
        </div>

        <div class="option-row">
            <label>Theme</label>
            <select id="theme-select">
                <option value="steamClassic">Steam Classic</option>
            </select>
        </div>
    `

    wrapper.querySelector("#lang-select").value = tempConfig.language || "en"
    wrapper.querySelector("#theme-select").value = tempConfig.editor.theme || "steamClassic"

    wrapper.querySelector("#lang-select").addEventListener("change", e => tempConfig.language = e.target.value)
    wrapper.querySelector("#theme-select").addEventListener("change", e => tempConfig.editor.theme = e.target.value)

    return wrapper
}
