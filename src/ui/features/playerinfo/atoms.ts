import { atom } from "jotai";

type PlayerInfo = {
    name: string;
    race: string;
    class: string;
    level: number;
    currentHP: number;
    maxHP: number;
    currentMP: number;
    maxMP: number;
    currentXP: number;
    maxXP: number;
};

export const playerInfoAtom = atom<PlayerInfo>({
    name: "Arkre",
    race: "elf",
    class: "rogue",
    level: 1,
    currentHP: 75,
    maxHP: 100,
    currentMP: 30,
    maxMP: 100,
    currentXP: 500,
    maxXP: 1000,
});
