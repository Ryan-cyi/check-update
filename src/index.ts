import { showDialog } from "./dialog";

export type IConfirm = () => Promise<boolean>;

export interface I_CheckOptions {
    /**
     * When the delay prompt is selected, the delay of the next check
     */
    delay?: number;
    confirm?: IConfirm;
    /**
     * Subsite paths for micro frontend sites
     */
    path?: string;
    /**
     * Updated message detected
     */
    message?: string;
    /**
     * Check interval for updates
     */
    interval?: number;
    /**
     *  Ignore this check text
     */
    ignoreText?: string;
    confirmText?: string;
}

function delay(timer = 5000) {
    return new Promise((resolve) => {
        setTimeout(resolve, timer);
    });
}

function validTime(num: number): boolean {
    return num > 0;
}

const defaultOption: I_CheckOptions = {
    delay: 10000,
    interval: 4000,
    confirm: () => Promise.resolve(false),
    message: "A new version is released and needs to be refreshed.",
    ignoreText: "Ignore",
    confirmText: "Reload",
};

class HtmlCheckUpdate_ {
    before_scripts: string[];

    current_scripts: string[];

    confirm: Function | undefined;

    options: I_CheckOptions;
    
    constructor(props: I_CheckOptions) {
        this.before_scripts = [];
        this.current_scripts = [];
        if (props.interval && !validTime(props.interval)) {
            throw new Error("interval must be a number");
        }
        if (props.delay && !validTime(props.delay)) {
            throw new Error("delay must be a number");
        }
        this.options = { ...defaultOption, ...props };
        this.init();
        this.run(this.options.interval!);
    }

    async init() {
        const html = (await this.fetchHomePage()) as string;
        this.before_scripts = this.parserScript(html);
    }

    /**
     * @returns {string} home page html plain text
     */
    async fetchHomePage() {
        try {
            const now = Date.now();
            let path = (this.options.path ?? "/") + `?time=${now}`;
            if (!path.match(/^\//)) {
                path = "/" + path;
            }
            return await fetch(`${path}`).then((res) => res.text());
        } catch (e) {
            console.log("check new version error", e);
        }
    }

    /**
     * @param {string} html html plain text
     * @returns {string} script plain text
     */
    parserScript(html: string) {
        const reg = new RegExp(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/gi);
        return html.match(reg) as string[];
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
                confirmBtnText: this.options.confirmText!,
                delayBtnText: this.options.ignoreText!,
            });
            if (result) {
                window.location.reload();
                return false;
            } else {
                await delay(this.options.delay!);
                await this.run();
            }
        } else {
            await this.run(this.options.interval);
        }
    }

    async run(timer?: number) {
        !!timer && (await delay(this.options.interval));
        const newHtml = (await this.fetchHomePage()) as string;
        this.current_scripts = this.parserScript(newHtml);
        await this.compare(this.before_scripts, this.current_scripts);
    }
}

export const HtmlCheckUpdate = HtmlCheckUpdate_;

export const CheckHtml = HtmlCheckUpdate_;