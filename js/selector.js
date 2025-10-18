let showMode = false
const ableIndexes = ["1", "2", "3", "4", "5"]

let weaponsContainer = document.getElementById("weapons-container")

const selectorElements = {
    1: {
        html: { name: 'HTML', icon: 'assets/icons/html.svg' },
        css: { name: 'CSS', icon: 'assets/icons/css.svg' },
        js: { name: 'JS', icon: 'assets/icons/js.svg' },
    },
}

document.addEventListener("keydown", (e) => {
    if (!ableIndexes.includes(e.key)) return

    const index = parseInt(e.key, 10)
    showingSelector(index)
})


function showingSelector(selectorIndex) {
    showMode = true
    checkContainerExists()

    console.log("Selector activado:", selectorIndex);
}

function checkContainerExists() {
    if (weaponsContainer === null) {
        weaponsContainer = document.createElement("div")
        weaponsContainer.id = "weapon-container"
        document.body.appendChild(weaponsContainer)
    }

    let selector = document.getElementById("weapon-selector")
    if (selector) return

    selector = document.createElement("div")
    selector.id = "weapon-selector"
    weaponsContainer.appendChild(selector)

    ableIndexes.forEach((key, i) => {
        const slot = document.createElement("div")
        slot.className = "selector"
        slot.textContent = key
        selector.appendChild(slot)
    })
}