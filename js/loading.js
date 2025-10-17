import { menus, createMenu } from './menus.js'

export function showLoadingBar(nextPage, description) {
    const menuData = menus.loading
    createMenu(menuData)

    const barBg = document.getElementById("bar-bg")
    const loadingText = document.getElementById("loading-text")

    const totalBlocks = 20
    const blocks = []

    for (let i = 0; i < totalBlocks; i++) {
        const block = document.createElement("div")
        block.className = "bar-block"
        barBg.appendChild(block)
        blocks.push(block)
    }

    let progress = 0
    window.loadingInterval = setInterval(() => {
        if (progress < totalBlocks) {
            blocks[progress].classList.add("active")
            progress++

            loadingText.textContent = description || `${t("loadingProgress")} ${Math.round((progress / totalBlocks) * 100) + "%"}`
        } else {
            clearInterval(window.loadingInterval)
            window.loadingInterval = null
            setTimeout(() => {
                window.location.href = nextPage
            }, 100)
        }
    }, 100)
}