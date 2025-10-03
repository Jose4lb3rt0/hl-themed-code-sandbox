let openMenus = []
let zIndexCounter = 1000

const menus = {
    new: {
        id: "menu-new",
        title: "New Code",
        content: `
            <button class="contentBtn" onclick="newCode('html-css-js')">HTML + CSS + JavaScript</button>
            <button class="contentBtn vital-menu-button" style="margin-top: 7%; align-self: end;">Cancel</button>
        `,
    },
    load: {
        id: "menu-load",
        title: "Load Code",
        content: `
            <span>Cargar un archivo existente:</span>
            <button class="contentBtn">Subir archivo</button>
            <button class="contentBtn">Elegir de la lista</button>
        `,
    },
    loading: {
        id: "loading-bar",
        title: "Loading...",
        content: `
            <div style="width: 100; display: flex; flex-direction: column; gap: 0.5rem">
                <span id="loading-text" style="color: #a0ab95;"></span>
                <div style="width: 100; display: flex; gap: 0.5rem; align-items: center;">
                    <div id="bar-bg" style="width:100%; background: #3e4737; overflow:hidden; height: 28px; padding: 4px; box-sizing: border-box; display: flex; gap: 2px;">
                        <div id="progress-bar" style="width:0%; height:100%; background:#0f0; transition:width 0.3s;"></div>
                    </div>
                    <button class="contentBtn vital-menu-button" style="align-self: end;">Cancel</button>
                </div>
            </div>
        `,
    }
}

document.addEventListener('DOMContentLoaded', () => {
    //OPCIONES DEL MENÚ PRINCIPAL
    document.querySelectorAll(".option").forEach(option => {
        option.addEventListener("click", () => {
            const menuType = option.dataset.menu
            const menuData = menus[menuType]
            if (!menuData) return

            createMenu(menuData)
        })
    })
})

function createMenu(menuData) {
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
    menu.style.top = "50%"
    menu.style.left = "50%"
    menu.style.transform = "translate(-50%, -50%)"
    menu.style.zIndex = ++zIndexCounter

    menu.innerHTML = `
        <div class="menu-header">
            <span><img src="assets/icons/steam.svg" class="lang-logo">${menuData.title}</span>
            <button class="close-menu">✖</button>
        </div>
        <div class="menu-content">${menuData.content}</div>
    `

    document.body.appendChild(menu)
    openMenus.push(menu)

    menu.addEventListener("mousedown", () => {
        zIndexCounter++
        menu.style.zIndex = zIndexCounter
    })

    menu.querySelector(".close-menu").addEventListener('click', () => {
        menu.remove()
        openMenus = openMenus.filter(m => m !== menu)
    })

    let isDragging = false
    let offsetX, offsetY
    const header = menu.querySelector(".menu-header")

    header.addEventListener("mousedown", (e) => {
        isDragging = true
        offsetX = e.clientX - menu.offsetLeft
        offsetY = e.clientY - menu.offsetTop
        document.body.style.userSelect = "none"
    })

    header.addEventListener("mousemove", (e) => {
        if (!isDragging) return
        menu.style.left = `${e.clientX - offsetX}px`
        menu.style.top = `${e.clientY - offsetY}px`
    })

    header.addEventListener("mouseup", () => {
        isDragging = false
        document.body.style.userSelect = "auto"
    })
}

/* Por si se crean mas playgrounds */
function newCode(mode) {
    switch (mode) {
        case 'html-css-js':
            showLoadingBar("editor.html", "Starting new code ...")
            break
        default:
            break
    }
}