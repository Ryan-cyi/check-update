export type OnUpdate = () => void

export type IConfirm = () => boolean

export interface Options {
    delay?: number
    confirm?: IConfirm
}

function delay(timer = 5000){
    return new Promise(resolve=>{
        setTimeout(resolve,timer)
    })
}

 class HtmlCheckUpdate_ {
    before_scripts: string[] 
    current_scripts: string[] 
    confirm: Function | undefined
    delay: number
    constructor(options: Options) {
        this.before_scripts = [];
        this.current_scripts = []
        this.confirm = options?.confirm
        this.delay = options?.delay || 10000
        this.init() 
        this.timing()
    }

    async init() {
        const html: string = await this.fetchHomePage()
        this.before_scripts = this.parserScript(html)
    }

    /**
     * @author vincent <vincent.cy@foxmail.com>
     * @returns {string} home page html plain text
     */
    async fetchHomePage() {
        const now = Date.now()
        return  await fetch(`/?time=${now}`).then(res => res.text());
    }

    /**
     * 
     * @param {string} html html plain text
     * @returns {string} script plain text
     */
    parserScript(html: string) {
        const reg = new RegExp(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/ig) 
        return html.match(reg) as string[] 
    }

    /**
     * 
     * @param {} before 
     * @param {} current 
     * @returns {Promise<void>}
     */
   async compare(before: string[], current: string[]): Promise<any> {
        if (JSON.stringify(before) !== JSON.stringify(current)) {
            console.log('There is the latest version to update...')
            const result = this.confirm?.() || window.confirm('The current site has been updated, do you need to reload it?')
            if(typeof result !== 'boolean'){
                throw new Error('comfirm function must return boolean')
            }
            if(result){
                window.location.reload();
                return false
            }
        }
        await this.timing()
    }

    async timing() {
        await delay(this.delay)
        const newHtml = await this.fetchHomePage()
        this.current_scripts = this.parserScript(newHtml)
        this.compare(this.before_scripts, this.current_scripts)
    }
}

export const HtmlCheckUpdate = HtmlCheckUpdate_

export const CheckHtml = HtmlCheckUpdate_