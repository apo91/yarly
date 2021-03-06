import seedrandom from "seedrandom";
import random from "random";
import EventEmitter from "events";
import { Creature, CreatureType } from "./creature";
import { PlayerInput } from "./PlayerInput";
import { Dungeon, DungeonConfig, MoveEntityResult } from "./dungeon";
import { Entity, EntityType } from "./entities";
import { AsciiRenderer } from "./rendering/AsciiRenderer";
import { Item, ItemRegistry, ItemType } from "./items";
import { TileType } from "./TileType";

/**
 * @typedef {Object} SessionConfig
 * @property {DungeonConfig} dungeonConfig
 * @property {ViewportConfig} viewportConfig
 */

export class Session extends EventEmitter {
    /**
     *
     * @param {SessionConfig} config
     */
    constructor(config) {
        super();
        this.rng = random.clone(seedrandom("1337e"));
        this.itemRegistry = new ItemRegistry(this.rng);
        /**
         * @type {Set<Item>}
         */
        this.identifiedItems = new Set();
        this.player = new Entity(EntityType.Creature,
            new Creature(CreatureType.PlayerElf, 0));
        this.dungeon = new Dungeon(this.rng, this.itemRegistry, this.player, config.dungeonConfig);
        this.isPlayerTurn = true;
        this.turnCounter = 0;
        this.tileInfo = "";
        this.gameLoop = new EventEmitter();
        this.input = new PlayerInput();
        this.renderer = new AsciiRenderer(this.rng, this.dungeon, config.viewportConfig);
        this.setupEventListeners();
        this.emit("log", "Your journey begins");
    }
    setupEventListeners = () => {
        this.input.on("move", this.handlePlayerMove);
        this.input.on("pickup", this.handlePlayerPickup);
        this.gameLoop.on("playerTurnEnd", this.performComputerTurn);
    }
    handlePlayerMove = (direction) => {
        if (!this.isPlayerTurn) return;
        const [status, _] = this.dungeon.tryMoveEntity(this.player, direction);
        switch (status) {
            case MoveEntityResult.MoveSuccess: {
                const [x, y] = this.dungeon.getEntityCoords(this.player);
                const tileType = this.dungeon.getTile(x, y);
                const entityLayers = this.dungeon.getEntityLayers(x, y);
                const topItemEntity = entityLayers.getTopEntityOfType(EntityType.Item);
                if (
                    topItemEntity &&
                    topItemEntity.entityData.itemType === ItemType.Consumable
                ) {
                    const visibleName = topItemEntity.entityData.initialName;
                    this.emit("log", `You see a ${visibleName}`);
                    this.tileInfo = visibleName;
                } else if (tileType === TileType.Exit) {
                    this.tileInfo = "A downward staircase";
                } else if (tileType === TileType.Entry) {
                    this.tileInfo = "An upward staircase";
                } else {
                    this.tileInfo = "";
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
    handlePlayerPickup = () => {
        const [x, y] = this.dungeon.getEntityCoords(this.player);
        const entityLayers = this.dungeon.getEntityLayers(x, y);
        const topItemEntity = entityLayers.getTopEntityOfType(EntityType.Item);
        if (topItemEntity) {
            if (this.player.entityData.inventory.tryAddItem(topItemEntity.entityData)) {
                this.dungeon.removeEntity(topItemEntity);
                const newTopItemEntity = entityLayers.getTopEntityOfType(EntityType.Item);
                this.tileInfo = newTopItemEntity
                    ? newTopItemEntity.entityData.initialName
                    : "";
                this.isPlayerTurn = false;
                this.gameLoop.emit("playerTurnEnd");
                this.emit("log", `You picked up a ${topItemEntity.entityData.initialName}`);
            }
        }
    }
    performComputerTurn = () => {
        this.turnCounter++;
        this.isPlayerTurn = true;
        this.gameLoop.emit("computerTurnEnd");
    }
    getInventoryItemNames = () => {
        return this.player.entityData.inventory.map((item, quantity) =>
            `${this.identifiedItems.has(item)
                ? item.identifiedName
                : item.initialName} x${quantity}`
        );
    }
}
