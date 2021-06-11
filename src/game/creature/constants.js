import { CreatureType } from "./CreatureType";

export const INITIAL_HP = {
    [CreatureType.PlayerHuman]: 50,
    [CreatureType.PlayerDwarf]: 60,
    [CreatureType.PlayerElf]: 40,
    [CreatureType.Goblin]: 30,
    [CreatureType.Kobold]: 30,
    [CreatureType.Orc]: 40,
};

export const LEVELUP_HP_BOOST = {
    [CreatureType.PlayerHuman]: 10,
    [CreatureType.PlayerDwarf]: 15,
    [CreatureType.PlayerElf]: 5,
    [CreatureType.Goblin]: 5,
    [CreatureType.Kobold]: 5,
    [CreatureType.Orc]: 10,
};

export const INITIAL_MP = {
    [CreatureType.PlayerHuman]: 50,
    [CreatureType.PlayerDwarf]: 60,
    [CreatureType.PlayerElf]: 40,
    [CreatureType.Goblin]: 30,
    [CreatureType.Kobold]: 30,
    [CreatureType.Orc]: 40,
};

export const LEVELUP_MP_BOOST = {
    [CreatureType.PlayerHuman]: 10,
    [CreatureType.PlayerDwarf]: 5,
    [CreatureType.PlayerElf]: 15,
    [CreatureType.Goblin]: 5,
    [CreatureType.Kobold]: 5,
    [CreatureType.Orc]: 5,
};
