import { DIRECTION } from "./direction";
import { EventEmitter } from "events";

export const CREATURE_TYPE = {
    PLAYER_HUMAN: 0,
    PLAYER_DWARF: 1,
    PLAYER_ELF: 2,
    GOBLIN: 3,
    KOBOLD: 4,
    ORC: 5,
};

const INITIAL_HP = {
    PLAYER_HUMAN: 50,
    PLAYER_DWARF: 60,
    PLAYER_ELF: 40,
    GOBLIN: 30,
    KOBOLD: 30,
    ORC: 40,
};

const LEVELUP_HP_BOOST = {
    PLAYER_HUMAN: 10,
    PLAYER_DWARF: 15,
    PLAYER_ELF: 5,
    GOBLIN: 5,
    KOBOLD: 5,
    ORC: 10,
};

const INITIAL_MP = {
    PLAYER_HUMAN: 50,
    PLAYER_DWARF: 60,
    PLAYER_ELF: 40,
    GOBLIN: 30,
    KOBOLD: 30,
    ORC: 40,
};

const LEVELUP_MP_BOOST = {
    PLAYER_HUMAN: 10,
    PLAYER_DWARF: 5,
    PLAYER_ELF: 15,
    GOBLIN: 5,
    KOBOLD: 5,
    ORC: 5,
};

const ACTION_TYPE = {
    IDLE: 0,
    WALK: 1,
    ATTACK: 2,
    CAST_SPELL: 3,
    USE_ITEM: 4,
};

const calcMaxHP = (type, level, effects) =>
    INITIAL_HP[type] + LEVELUP_HP_BOOST[type] * level + effects.reduce(_ => 0);

const calcMaxMP = (type, level, effects) =>
    INITIAL_MP[type] + LEVELUP_MP_BOOST[type] * level + effects.reduce(_ => 0);

export class Creature extends EventEmitter {
    constructor(type, level, position) {
        this.type = type;
        this.level = level;
        this.maxHP = calcMaxHP(type, level, []);
        this.maxMP = calcMaxMP(type, level, []);
        this.currentHP = this.maxHP;
        this.currentMP = this.maxMP;
        this.position = position;
        this.direction = DIRECTION.NORTH;
    }
    applyEffect() { }
    updateEffects() { }
    chooseAction() {
        return ACTION_TYPE.IDLE;
    }
    dealDamage(damage) {
        this.currentHP -= damage;
        if (this.currentHP <= 0) {
            this.emit("death");
        }
    }
}
