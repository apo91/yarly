import { Effect } from "../../effects/Effect";
import { Consumable } from "../Consumable";
import { ConsumableType } from "../ConsumableType";
import { PotionType } from "./PotionType";

type PotionOptions = {
    potionType: PotionType;
    effects: Effect[];
    weight: number;
    initialName: string;
    identifiedName: string;
};

export class Potion extends Consumable {
    potionType: PotionType;
    effects: Effect[];
    constructor({ potionType, effects, ...consumableOptions }: PotionOptions) {
        super({ consumableType: ConsumableType.Potion, ...consumableOptions });
        this.potionType = potionType;
        this.effects = effects;
    }
}
