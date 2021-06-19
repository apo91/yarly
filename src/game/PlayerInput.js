import EventEmitter from "events";
import { Direction } from "./Direction";

export class PlayerInput extends EventEmitter {
    constructor() {
        super();
        this.setupEventListeners();
    }
    setupEventListeners() {
        window.addEventListener('keydown', this.handleWindowKeyDown);
    }
    clearEventListeners() {
        window.removeEventListener('keydown', this.handleWindowKeyDown);
    }
    /**
     *
     * @param {KeyboardEvent} e
     */
    handleWindowKeyDown = (e) => {
        e.stopImmediatePropagation();
        switch (e.code) {
            case "Numpad8":
            case "ArrowUp":
                this.emit("move", Direction.North);
                break;
            case "Numpad6":
            case "ArrowRight":
                this.emit("move", Direction.East);
                break;
            case "Numpad2":
            case "ArrowDown":
                this.emit("move", Direction.South);
                break;
            case "Numpad4":
            case "ArrowLeft":
                this.emit("move", Direction.West);
                break;
            case "Numpad9":
                this.emit("move", Direction.NorthEast);
                break;
            case "Numpad3":
                this.emit("move", Direction.SouthEast);
                break;
            case "Numpad1":
                this.emit("move", Direction.SouthWest);
                break;
            case "Numpad7":
                this.emit("move", Direction.NorthWest);
                break;
            case "Numpad5":
                this.emit("pickup");
                break;
        }
    }
}
