import random from "random";
import EventEmitter from "events";
import { Creature, CREATURE_TYPE } from "./Creature";
import { PlayerInput } from "./PlayerInput";
import { Dungeon, DungeonConfig, MoveEntityResult } from "./dungeon";
import { Entity, EntityType } from "./entities";
import { AsciiRenderer } from "./rendering/AsciiRenderer";
import { ITEM_TYPE } from "./Item";

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
        this.player = new Entity(EntityType.Creature,
            new Creature(CREATURE_TYPE.PLAYER_ELF, 0));
        this.dungeon = new Dungeon(this.rng, this.player, config.dungeonConfig);
        this.isPlayerTurn = true;
        this.turnCounter = 0;
        this.pickupItem = "";
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
            case MoveEntityResult.MoveSuccess: {
                const [x, y] = this.dungeon.getEntityCoords(this.player);
                const entityLayers = this.dungeon.getEntityLayers(x, y);
                const topItemEntity = entityLayers.getTopEntityOfType(EntityType.Item);
                // console.log("topEntity", topEntity);
                if (
                    topItemEntity &&
                    topItemEntity.entityData.type == ITEM_TYPE.CONSUMABLE
                ) {
                    this.pickupItem = topItemEntity.entityData.data.name;
                } else {
                    this.pickupItem = "";
                }
                break;
            }
            case MoveEntityResult.MoveIntoCreature: {
                // attack
                break;
            }
            case MoveEntityResult.MoveIntoObstacle: {
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
