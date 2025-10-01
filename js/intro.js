function startValveIntro() {
    document.body.classList.add('intro-active')
    const overlay = document.getElementById('valve-intro-overlay')
    const bg = document.getElementById('valve-bg')
    const logo = document.getElementById('valve-logo')
    const audio = document.getElementById('valve-intro-audio')

    if (overlay && bg && logo && audio) {
        overlay.classList.add('show-bg')
        audio.play().catch(() => {
            const playOnUserAction = () => {
                audio.play()
                window.removeEventListener('click', playOnUserAction)
            }
            window.addEventListener('click', playOnUserAction)
        })

        setTimeout(() => {
            overlay.classList.add('show-logo')
        }, 3000)

        setTimeout(() => {
            overlay.classList.add('hide')
        }, 6000)

        setTimeout(() => {
            overlay.remove()
            document.body.classList.remove('intro-active')
        }, 10000)
    }

    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Escape') && overlay) {
            overlay.remove()
            document.body.classList.remove('intro-active')
            audio.pause()
        }
    })
}