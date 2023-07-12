const tags = ["button", "div", "span", "p"] as const;

function serializeStyles(args: any[], props: any) {
    let styles = "";
    let strings = args[0];
    if (strings.raw === undefined) {
        styles += handleInterpolation(props, strings);
    } else {
        styles += strings[0];
    }
    for (let i = 1; i < args.length; i++) {
        styles += handleInterpolation(props, args[i]);
    }
    styles = styles.replace(/\r|\n/gi, "").trim();
    return { styles };
}

function handleInterpolation(
    props: Record<any, any>,
    interpolation: object | Function | string
): any {
    switch (typeof interpolation) {
        case "object": {
            return createStringFromObject(props, interpolation);
        }
        case "function": {
            if (props !== undefined) {
                const result = interpolation(props);
                return handleInterpolation(props, result);
            }
            break;
        }
        default:
            return interpolation;
    }
}

function createStringFromObject(
    obj: Record<any, any>,
    interpolation?: object | Function
) {
    let string = "";
    for (let key in obj) {
        let value = obj[key];
        string += key + ":" + value + ";";
    }
    return string;
}

type GetArrayElementType<T extends readonly any[]> =
    T extends readonly (infer U)[] ? U : never;

type IStyled = GetArrayElementType<typeof tags>;

const Styled = {} as { [key in IStyled]: Function };

tags.forEach(function (tagName) {
    Styled[tagName] = (...args: unknown[]) => {
        const { styles } = serializeStyles(args, {});
        return (
            children: string | undefined | HTMLElement | HTMLElement[],
            other?: { click?: Function; style?: string }
        ): HTMLElement => {
            const el = document.createElement(tagName);
            const style = other?.style ? styles + other.style : styles;
            el.setAttribute("style", style);
            const type = Object.prototype.toString.call(children);
            switch (type) {
                case "[object String]": {
                    el.innerHTML = children as string;
                    break;
                }
                case "[object Array]": {
                    (children as HTMLElement[]).forEach((element) => {
                        el.append(element);
                    });
                    break;
                }
                default: {
                    children && el.append(children as HTMLElement);
                    break;
                }
            }
            if (other?.click) {
                el.addEventListener("click", () => {
                    other.click?.();
                });
            }
            return el;
        };
    };
});

export {
    Styled
}

export function getMaxZIndex(): number {
    let arr = Array.from(document.querySelectorAll("body *")).map(
        (e) => +window.getComputedStyle(e).zIndex || 0
    );
    return arr.length ? Math.max(...arr) + 1 : 0;
}