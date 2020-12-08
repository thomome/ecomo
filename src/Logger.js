class Logger {
    constructor (element) {
        this.element = element
    }

    log (msg) {
        if(msg instanceof Object && msg.message) {
            msg = `Error: ${msg.message}`
        } 
        const now = new Date()
        this.element.innerHTML += `<span>${msg}</span><br>`
        
        this.scrollToEnd()
    }

    error (msg) {
        if(msg instanceof Object && msg.message) {
            msg = `Error: ${msg.message}`
        } 
        const now = new Date()
        this.element.innerHTML += `<span class="error">${msg}</span><br>`

        this.scrollToEnd()
    }

    scrollToEnd() {
        requestAnimationFrame(() => {
            this.element.scrollTop = this.element.scrollHeight
        })
    }
    
    clear () {
        this.element.innerHTML = ''
    }
}