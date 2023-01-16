interface Options {
    timer?: number
}

export class Updater {
    before_scripts: string[] 
    current_scripts: string[] 
    dispatch: Record<string, Function[]>
    constructor(options: Options) {
        this.before_scripts = [];
        this.current_scripts = []
        this.dispatch = {}
        this.init() 
        this.timing(options?.timer)
    }

    async init() {
        const html: string = await this.fetchHomePage()
        this.before_scripts = this.parserScript(html)
    }

    async fetchHomePage() {
        return  await fetch('/').then(res => res.text());
    }

    parserScript(html: string) {
        const reg = new RegExp(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/ig) 
        return html.match(reg) as string[] 
    }

    on(key: 'noUpdate' | 'update', fn: Function) {
        (this.dispatch[key] || (this.dispatch[key] = [])).push(fn)  
        return this;
    }

    compare(before: string[], current: string[]) {
        const base = before.length
        const arr = Array.from(new Set(before.concat(current)))
        if (arr.length === base) {
            this.dispatch['no-update'].forEach(fn => {
                fn()
            })
        } else {
            this.dispatch['update'].forEach(fn => {
                fn()
            })
        }
    }

    timing(time = 10000) {
        setInterval(async () => {
            const newHtml = await this.fetchHomePage()
            this.current_scripts = this.parserScript(newHtml)
            this.compare(this.before_scripts, this.current_scripts)
        }, time)
    }
}