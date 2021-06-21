import { atom } from "jotai";

const MAX_LOG_SIZE = 20;

export const gameLogAtom = atom<string[]>([]);

export const writeGameLogAtom = atom(null, (get, set, message: string) => {
    const messages = get(gameLogAtom);
    const offset = Math.max(0, messages.length - MAX_LOG_SIZE + 1);
    set(gameLogAtom, [...messages.slice(offset), message]);
});
