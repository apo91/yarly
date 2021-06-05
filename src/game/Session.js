import random from "random";
import EventEmitter from "events";
import { Creature, CREATURE_TYPE } from "./Creature";
import { PlayerInput } from "./PlayerInput";
import { Dungeon } from "./Dungeon";

export class Session {
    constructor() {
        this.rng = random.clone("1337");
        this.player = new Creature(CREATURE_TYPE.PLAYER_ELF, 0, [0, 0]);
        this.dungeon = new Dungeon(this.rng, 16, 32, 24, 10, this.player);
        this.isPlayerTurn = true;
        this.gameLoop = new EventEmitter();
        this.input = new PlayerInput();
    }
    setupEventListeners = () => {
        this.input.on("move", this.handlePlayerMove)
        this.gameLoop.on("playerTurnEnd", this.handlePlayerTurnEnd);
        this.gameLoop.on("computerTurnEnd", this.handleComputerTurnEnd);
    }
    handlePlayerMove = (direction) => {
        if (!this.isPlayerTurn) return;
        this.emit("playerTurnEnd");
    }
    handlePlayerTurnEnd = () => {
        this.isPlayerTurn = false;
    }
    handleComputerTurnEnd = () => {
        this.isPlayerTurn = true;
    }
    performComputerTurn = () => {
        this.emit("computerTurnEnd");
    }
}
