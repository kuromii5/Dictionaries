export function measureExecutionTime(func: (...args: number[]) => void): number {
    const startTime = performance.now();
    func();
    const endTime = performance.now();

    const executionTime = endTime - startTime;
    return executionTime;
}

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomData(length: number): number[] {
    const data = new Set<number>();
    while (data.size < length) 
        data.add(getRandomNumber(1, length * 10));
    return Array.from(data);
}

function getRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

export function generateStrings(length: number): string[] {
    const data = new Set<string>();
    while (data.size < length)
        data.add(getRandomString(10));
    return Array.from(data);
}