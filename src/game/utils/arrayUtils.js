import { Random } from "random";

/**
 * 
 * @param {Random} rng 
 * @param {*} array 
 */
export const shuffle = (rng, array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = rng.int(0, i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};
