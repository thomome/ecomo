class Dropzone {
    constructor(ele) {
        this.root = ele
        this.files = []

        this.container = document.createElement('div')
        this.container.classList.add('dropzone__container')
        this.root.appendChild(this.container)

        this.input = document.createElement('input')
				this.input.type = 'file'
				this.input.accept='.csv'
        this.input.multiple = true

        this.addEvents()
        this.update()
    }

    addEvents () {
        const dragEvents = ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'];
        dragEvents.forEach((event) => {
            this.root.addEventListener(event, (e) => {
                e.preventDefault()
                e.stopPropagation()

                if(event === 'dragover' || event === 'dragenter') {
                    input.classList.add('is-dragover')
                } else if(event === 'dragleave' || event === 'dragend' || event === 'drop') {
                    input.classList.remove('is-dragover')
                }
                
                if(event === 'drop') {
                    this.files = e.dataTransfer.files
                    this.update()
                }
            })
        })

        this.input.addEventListener('change', () => {
            this.files = this.input.files
            this.update()
        })

        this.root.addEventListener('click', () => {
            this.input.click()
        })
    }

    update () {
        this.container.innerHTML = '';
        if(this.files.length > 0) {
            for (const file of this.files) {
                this.container.innerHTML += `<div class="dropzone__file"><img src="./data/file.svg">${file.name}</div>`
            }
        } else {
            this.container.innerHTML = `<span>Wähle deine Dateien <br>oder ziehe sie in dieses Feld</span>`
        }
    }

    getFiles () {
        return this.files
    }

    clear() {
        this.files = []
        this.update()
    }
}