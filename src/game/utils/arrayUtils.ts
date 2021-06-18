import { Random } from "random";

export const shuffle = <T>(rng: Random, array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = rng.int(0, i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

export const randomElem = <T>(rng: Random, array: T[]): T | undefined => {
    const len = array.length;
    if (len > 0) {
        return array[rng.int(0, len - 1)];
    }
}
