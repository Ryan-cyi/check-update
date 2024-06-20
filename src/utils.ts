export function delay(timer = 5000) {
    return new Promise((resolve) => {
        setTimeout(resolve, timer);
    });
}

export function validTime(num: number): boolean {
    return num > 0;
}

export function test(){
    return null
}