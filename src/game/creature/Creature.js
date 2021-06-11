import { EventEmitter } from "events";
import { Direction } from "../Direction";
import { CreatureAction } from "./CreatureAction";
import { CreatureType } from "./CreatureType";
import * as constants from "./constants";

/**
 * @param {CreatureType} type
 * @param {number} level
 * @param {*} effects
 * @returns {number}
 */
const calcMaxHP = (type, level, effects) =>
    constants.INITIAL_HP[type] + constants.LEVELUP_HP_BOOST[type] * level + effects.reduce(_ => 0, 0);

/**
 * @param {CreatureType} type
 * @param {number} level
 * @param {*} effects
 * @returns {number}
 */
const calcMaxMP = (type, level, effects) =>
    constants.INITIAL_MP[type] + constants.LEVELUP_MP_BOOST[type] * level + effects.reduce(_ => 0, 0);

export class Creature extends EventEmitter {
    /**
     * @param {CreatureType} type
     * @param {number} level
     */
    constructor(type, level) {
        super();
        this.type = type;
        this.level = level;
        this.maxHP = calcMaxHP(type, level, []);
        this.maxMP = calcMaxMP(type, level, []);
        this.currentHP = this.maxHP;
        this.currentMP = this.maxMP;
        this.direction = Direction.North;
    }
    applyEffect() { }
    updateEffects() { }
    chooseAction() {
        return CreatureAction.Idle;
    }
    dealDamage(damage) {
        this.currentHP -= damage;
        if (this.currentHP <= 0) {
            this.emit("death");
        }
    }
}
