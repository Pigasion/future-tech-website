const rootSelector = '[data-js-blog-card]'

class Like {
    selectors = {
        root: rootSelector,
        button: '[data-js-blog-button]',
        likesAmount: '[data-js-blog-likes]'
    }

    stateClasses = {
        isActive: 'is-active'
    }

    stateAttributes = {
        ariaLabel: 'aria-label',
        title: 'title'
    }

    constructor(rootElement) {
        this.rootElement = rootElement
        this.cardId = rootElement.dataset.blogId 

        this.localStorageKey = `like-states-${this.cardId}`
        // localStorage.clear()
        this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button)
        this.likesAmountElements = this.rootElement.querySelectorAll(this.selectors.likesAmount)
        this.state = {
            likes: this.getLikeStates()
        }

        this.applyStates()
        this.bindEvents()
    }

    applyStates() {
        this.state.likes.forEach(({ index, isActive, likesCount }) => {
            if (this.buttonElements[index]) {
                const button = this.buttonElements[index]
                const likesSpan = button.querySelector(this.selectors.likesAmount)

                if (isActive) {
                    button.classList.add(this.stateClasses.isActive)
                }

                if (likesSpan && likesCount !== undefined) {
                    likesSpan.textContent = likesCount
                }
            }
        })
    }

    getLikeStates() {
        const rawData = localStorage.getItem(this.localStorageKey)

        if (!rawData) {
            return []
        }

        try {
            const parsedData = JSON.parse(rawData)

            return Array.isArray(parsedData) ? parsedData : []
        } catch (error) {
            console.error('Buttons state parse error');

            return []
        }
    }

    saveLikeStates() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.state.likes))
    }

    updateLikesStates() {
        this.state.likes = Array.from(this.buttonElements).map((button, index) => {
            const likesSpan = button.querySelector(this.selectors.likesAmount)
            const likesCount = likesSpan ? parseInt(likesSpan.textContent) || 0 : 0

            return {
                index,
                isActive: button.classList.contains(this.stateClasses.isActive),
                likesCount: likesCount
            }
        })

        this.saveLikeStates()
    }//узнать почему каждый обьект не перезаписывается

    updateUI(event) {
        const { currentTarget } = event
        currentTarget.classList.toggle(this.stateClasses.isActive)
        
        const isActive = currentTarget.classList.contains(this.stateClasses.isActive)

        if (isActive) {
            currentTarget.setAttribute(this.stateAttributes.ariaLabel, 'Dislike')
            currentTarget.setAttribute(this.stateAttributes.title, "Dislike")
        } else {
            currentTarget.setAttribute(this.stateAttributes.ariaLabel, 'Like')
            currentTarget.setAttribute(this.stateAttributes.title, "Like")
        }
    }

    putLike(event) {
        const { currentTarget } = event
        const likesSpan = currentTarget.querySelector(this.selectors.likesAmount)

        if (!likesSpan) return

        let count = parseInt(likesSpan.textContent) || 0

        const isActive = currentTarget.classList.contains(this.stateClasses.isActive)

        likesSpan.textContent = isActive ? count + 1 : count - 1
    }
//объединить с updateUI
    onClick = (event) => {
        this.updateUI(event)
        this.putLike(event)
        this.updateLikesStates()
    }

    bindEvents() {
        this.buttonElements.forEach((button) => {
            button.addEventListener('click', this.onClick)
        })
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