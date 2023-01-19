export type OnUpdate = () => void

export type IConfirm = () => Promise<boolean>

export interface I_CheckOptions {
    delay?: number
    confirm?: IConfirm
    path?: string
    message?: string
    retry?: number
}

function delay(timer = 5000) {
    return new Promise(resolve => {
        setTimeout(resolve, timer)
    })
}

function validTime(num: number): boolean {
    if (typeof num === 'number') {
        if (num <= 0) {
            return false
        }
        return true
    } else {
        return false
    }
}

const defaultOption: I_CheckOptions = {
    delay: 10000,
    retry: 120000,
    confirm: () => Promise.resolve(false),
    message: 'A new version is released and needs to be refreshed.'
}

class HtmlCheckUpdate_ {
    before_scripts: string[]
    current_scripts: string[]
    confirm: Function | undefined
    options: I_CheckOptions
    constructor(props: I_CheckOptions) {
        this.before_scripts = [];
        this.current_scripts = []
        if (props.retry && !validTime(props.retry)) {
            throw new Error('retey must be a number')
        }
        if (props.delay && !validTime(props.delay)) {
            throw new Error('retey must be a number')
        }
        this.options = { ...defaultOption, ...props }
        this.init()
        this.starting(this.options.delay!)
    }

    async init() {
        const html = await this.fetchHomePage() as string
        this.before_scripts = this.parserScript(html)
    }

    /**
     * @returns {string} home page html plain text
     */
    async fetchHomePage() {
        try {
            const now = Date.now()
            let path = (this.options.path ?? '/') + `?time=${now}`
            if (!path.match(/^\//)) {
                path = '/' + path
            }
            return await fetch(`${path}`).then(res => res.text());
        } catch (e) {
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
            const result = await showDialog({
                message: this.options.message!,
                confirmBtnText: 'Reload',
                delayBtnText: "Delay(120s)"
            })
            if (typeof result !== 'boolean') {
                throw new Error('comfirm function must return boolean')
            }
            if (result) {
                window.location.reload();
                return false
            } else {
                await delay(this.options.retry!)
                await this.starting()
            }
        } else {
            await this.starting(this.options.delay)
        }
    }

    async starting(timer?: number) {
        // console.log('timer', timer)
        !!timer && await delay(this.options.delay)
        const newHtml = await this.fetchHomePage() as string
        this.current_scripts = this.parserScript(newHtml)
        this.compare(this.before_scripts, this.current_scripts)
    }
}

export const HtmlCheckUpdate = HtmlCheckUpdate_

export const CheckHtml = HtmlCheckUpdate_


const tags = ['button', 'div', 'span'] as const

function serializeStyles(args: any[], props: any) {
    var styles = '';
    var strings = args[0];
    if (strings.raw === undefined) {
        styles += handleInterpolation(props, strings);
    } else {
        styles += strings[0];
    }
    for (var i = 1; i < args.length; i++) {
        styles += handleInterpolation(props, args[i]);
    }
    styles = styles.replace(/\r|\n/ig, "")
    return { styles }
}

function handleInterpolation(props: Record<any, any>, interpolation: object | Function | string): any {
    switch (typeof interpolation) {
        case 'object': {
            return createStringFromObject(props, interpolation);
        }
        case 'function': {
            if (props !== undefined) {
                var result = interpolation(props);
                return handleInterpolation(props, result);
            }
            break
        }
        default:
            return interpolation
    }
}

function createStringFromObject(obj: Record<any, any>, interpolation?: object | Function) {
    var string = '';
    for (var key in obj) {
        var value = obj[key];
        string += key + ":" + value + ";";
    }
    return string;
}
type GetArrayElementType<T extends readonly any[]> = T extends readonly (infer U)[] ? U : never;

type IStyled = GetArrayElementType<typeof tags>

const Styled = {} as { [key in IStyled]: Function }

tags.forEach(function (tagName) {
    Styled[tagName] = (...args: unknown[]) => {
        const { styles } = serializeStyles(args, {})
        return (children: string | undefined | HTMLElement | HTMLElement[], other?: { click?: Function, style?: string }): HTMLElement => {
            const el = document.createElement(tagName)
            const style = other?.style ? styles + other.style : styles
            el.setAttribute('style', style)
            const type = Object.prototype.toString.call(children)
            switch (type) {
                case '[object String]': {
                    el.innerHTML = children as string
                    break
                }
                case '[object Array]': {
                    (children as HTMLElement[]).forEach(element => {
                        el.append(element)
                    });
                    break
                }
                default: {
                    children && el.append(children as HTMLElement)
                    break
                }
            }
            if (other?.click) {
                el.addEventListener('click', () => {
                    other.click?.()
                })
            }
            return el
        }
    }
});

const container = Styled.div`
background-color: rgba(0,0,0,0.1); 
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
${getMaxZIndex()};
`

const dialogContianer = Styled.div`
background-color: white; 
width: 480px; 
height: 180px;
position: absolute;
left: calc(50% - 240px);
top: calc(50vh - 90px);
border-radius: 4px;
padding: 20px;
box-sizing: border-box;
display: flex;
flex-direction: column;
`

const dialogContent = Styled.div`
box-sizing: border-box;
background-color: #fff;
color: #555;
font-size: 16px;
`

const dialogFooter = Styled.div`
display: flex;
justify-content: flex-end;
align-items: flex-end;
flex:1;
`
const Button = Styled.button`
display: inline-block;
line-height: 1;
white-space: nowrap;
cursor: pointer;
background: #fff;
border: 1px solid #dcdfe6;
color: #606266;
-webkit-appearance: none;
text-align: center;
box-sizing: border-box;
outline: none;
margin: 0;
transition: .1s;
font-weight: 500;
-moz-user-select: none;
-webkit-user-select: none;
-ms-user-select: none;
padding: 8px 18px;
font-size: 14px;
border-radius: 4px;
margin-left: 14px;
`

const Title = Styled.div`
font-size: 18px;
font-weight: blod;
color: #333;
`

type IDialogPayload = {
    message: string
    confirmBtnText: string
    delayBtnText: string
}

function showDialog(payload: IDialogPayload) {
    return new Promise(resolve => {
        let box = container()

        const title = Title("Tip")

        const content = dialogContent(title)

        const message = Styled.div`padding:20px 0px;`(payload.message)

        content.append(message)

        const confirmBtn = Button(payload.confirmBtnText, {
            style: "background-color:#409eff; color: #fff;",
            click: () => {
                document.body.removeChild(box)
                return resolve(true)
            }
        })

        const delayBtn = Button(payload.delayBtnText, {
            click: () => {
                document.body.removeChild(box)
                return resolve(false)
            }
        })

        const footer = dialogFooter([delayBtn, confirmBtn])

        let dialog = dialogContianer([content, footer])

        box = container(dialog)

        document.body.append(box)
    })
}


function getMaxZIndex(): string {
    let arr = Array.from(document.querySelectorAll('body *')).map(e => + window.getComputedStyle(e).zIndex || 0);
    const r = arr.length ? Math.max(...arr) + 1 : 0
    return `z-index: ${r};`
}
