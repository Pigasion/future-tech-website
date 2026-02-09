const rootSelector = '[data-js-like]'

class Like {
    selectors = {
        root: rootSelector,
    }

    stateClasses = {
        isActive: 'is-active'
    }

    constructor(rootElement) {
        this.rootElement = rootElement

        this.bindEvents()
    }

    onLike = () => {
        this.rootElement.classList.toggle(this.stateClasses.isActive)
    }

    bindEvents() {
        this.rootElement.addEventListener('click', this.onLike)
    }
}

class LikeCollection {
    constructor() {
        this.init()
    }

    init() {
        document.querySelectorAll(rootSelector).forEach(element => {
            new Like(element)
        })
    }
}

export default LikeCollection