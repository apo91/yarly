import random from "random";
import EventEmitter from "events";
import { Creature, CREATURE_TYPE } from "./Creature";
import { PlayerInput } from "./PlayerInput";
import { Dungeon, DungeonConfig, MOVE_ENTITY_RESULT } from "./dungeon";
import { ENTITY_TYPE } from "./entities";
import { Entity } from "./entities/Entity";
import { AsciiRenderer } from "./rendering/AsciiRenderer";

/**
 * @typedef {Object} SessionConfig
 * @property {DungeonConfig} dungeonConfig
 * @property {ViewportConfig} viewportConfig
 */

export class Session {
    /**
     *
     * @param {SessionConfig} config
     */
    constructor(config) {
        this.rng = random.clone("1337");
        this.player = new Entity(ENTITY_TYPE.CREATURE,
            new Creature(CREATURE_TYPE.PLAYER_ELF, 0));
        this.dungeon = new Dungeon(this.rng, this.player, config.dungeonConfig);
        this.isPlayerTurn = true;
        this.turnCounter = 0;
        this.gameLoop = new EventEmitter();
        this.input = new PlayerInput();
        this.renderer = new AsciiRenderer(config.viewportConfig);
        this.setupEventListeners();
    }
    setupEventListeners = () => {
        this.input.on("move", this.handlePlayerMove)
        this.gameLoop.on("playerTurnEnd", this.performComputerTurn);
    }
    handlePlayerMove = (direction) => {
        if (!this.isPlayerTurn) return;
        const [status, _] = this.dungeon.tryMoveEntity(this.player, direction);
        switch (status) {
            case MOVE_ENTITY_RESULT.MOVE_SUCCESS: {
                break;
            }
            case MOVE_ENTITY_RESULT.MOVE_INTO_CREATURE: {
                // attack
                break;
            }
            case MOVE_ENTITY_RESULT.MOVE_INTO_OBSTACLE: {
                return;
            }
        }
        this.isPlayerTurn = false;
        this.gameLoop.emit("playerTurnEnd");

    }
    performComputerTurn = () => {
        this.turnCounter++;
        this.isPlayerTurn = true;
        this.gameLoop.emit("computerTurnEnd");
    }
}
