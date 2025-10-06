let openMenus = []
let zIndexCounter = 1000

const menus = {
    new: {
        id: "menu-new",
        title: "New Code",
        resizable: false,
        minWidth: 300,
        minHeight: 135,
        content: `
            <button class="contentBtn" onclick="newCode('html-css-js')">HTML + CSS + JavaScript</button>
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
                    <button class="contentBtn vital-menu-button" style="align-self: end">Cancel</button>
                </div>
            </div>
        `,
    },
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".option").forEach((option) => {
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

    let headerHTML = `
        <div class="menu-header">
            <span><img src="${menuData.icon ? menuData.icon : "assets/icons/steam.svg"}" class="lang-logo">${menuData.title}</span>
    `
    if (menuData.id !== "loading-bar") {
        headerHTML += `<button class="close-menu">✖</button>`
    }
    headerHTML += `</div>`

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

    const cancelBtn = menu.querySelector(".vital-menu-button")
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            closeMenu(menu)
            if (menuData.id === "loading-bar" && window.loadingInterval) {
                clearInterval(window.loadingInterval)
                window.loadingInterval = null
            }
        })
    }

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
        case "html-css-js":
            showLoadingBar("editor.html", "Starting new code ...")
            break
        default:
            break
    }
}

function closeMenu(menu) {
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
