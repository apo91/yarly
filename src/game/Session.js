import random from "random";
import EventEmitter from "events";
import { Creature, CREATURE_TYPE } from "./Creature";
import { PlayerInput } from "./PlayerInput";
import { Dungeon, MOVE_ENTITY_RESULT } from "./Dungeon";
import { ENTITY_TYPE } from "./entities";
import { Entity } from "./entities/Entity";
import { AsciiRenderer } from "./AsciiRenderer";


export class Session {
    constructor() {
        this.rng = random.clone("1337");
        this.player = new Entity(ENTITY_TYPE.CREATURE,
            new Creature(CREATURE_TYPE.PLAYER_ELF, 0, [0, 0]));
        this.dungeon = new Dungeon(this.rng, 16, 16, 24, 10, this.player);
        this.isPlayerTurn = true;
        this.gameLoop = new EventEmitter();
        this.input = new PlayerInput();
        this.renderer = new AsciiRenderer();
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
        console.log("performComputerTurn");
        this.isPlayerTurn = true;
        this.gameLoop.emit("computerTurnEnd");
    }
}
