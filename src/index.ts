export type OnUpdate = () => void

export type IConfirm = () => boolean

export interface Options {
    delay?: number
    confirm?: IConfirm
    path?: string
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
    path: string
    constructor(options: Options) {
        this.before_scripts = [];
        this.current_scripts = []
        this.confirm = options?.confirm
        this.delay = options?.delay || 10000
        this.path = options?.path || ''
        this.init() 
        this.timing()
    }

    async init() {
        const html = await this.fetchHomePage() as string
        this.before_scripts = this.parserScript(html)
    }

    /**
     * @returns {string} home page html plain text
     */
    async fetchHomePage() {
        try{
            const now = Date.now()
            const path = (this.path ?? '') + `?time=${now}` 
            return  await fetch(`/${path}`).then(res => res.text());
        }catch(e){
            console.log('check new version error', e)
        }
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
        const newHtml = await this.fetchHomePage() as string
        this.current_scripts = this.parserScript(newHtml)
        this.compare(this.before_scripts, this.current_scripts)
    }
}

export const HtmlCheckUpdate = HtmlCheckUpdate_

export const CheckHtml = HtmlCheckUpdate_