import EventEmitter from "events";
import { DIRECTION } from "./direction";

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
        switch (e.code) {
            case "Numpad8":
            case "ArrowUp":
                this.emit("move", DIRECTION.NORTH);
                break;
            case "Numpad6":
            case "ArrowRight":
                this.emit("move", DIRECTION.EAST);
                break;
            case "Numpad2":
            case "ArrowDown":
                this.emit("move", DIRECTION.SOUTH);
                break;
            case "Numpad4":
            case "ArrowLeft":
                this.emit("move", DIRECTION.WEST);
                break;
            case "Numpad9":
                this.emit("move", DIRECTION.NORTH_EAST);
                break;
            case "Numpad3":
                this.emit("move", DIRECTION.SOUTH_EAST);
                break;
            case "Numpad1":
                this.emit("move", DIRECTION.SOUTH_WEST);
                break;
            case "Numpad7":
                this.emit("move", DIRECTION.NORTH_WEST);
                break;
        }
    }
}
