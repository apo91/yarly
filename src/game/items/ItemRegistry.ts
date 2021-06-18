import { Random } from "random";
import { Effect } from "../effects/Effect";
import { randomElem, shuffle } from "../utils";
import { Item } from "./Item";
import { Potion, PotionGroup, PotionType, POTION_GROUP_BY_TYPE, POTION_VARIANTS_BY_GROUP, UNIDENTIFIED_POTION_NAME_BY_TYPE } from "./potions";

export class ItemRegistry {
    rng: Random;
    predefinedPotions: Potion[];
    constructor(rng: Random) {
        this.rng = rng;
        this.predefinedPotions = [];
        this.assignPredefinedPotionVariantsToColors();
    }
    assignPredefinedPotionVariantsToColors() {
        const potionColorTypes = Object.values(PotionType).filter(t => t !== PotionType.Other);
        const hotVariants = shuffle(this.rng, Array.from(POTION_VARIANTS_BY_GROUP[PotionGroup.HotColors]));
        const chillVariants = shuffle(this.rng, Array.from(POTION_VARIANTS_BY_GROUP[PotionGroup.ChillColors]));
        for (const potionColorType of potionColorTypes) {
            let variant: { name: string, effects: Effect[] } | undefined;
            switch (POTION_GROUP_BY_TYPE[potionColorType]) {
                case PotionGroup.HotColors:
                    variant = hotVariants.pop();
                    break;
                case PotionGroup.ChillColors:
                    variant = chillVariants.pop();
                    break;
            }
            if (variant) {
                this.predefinedPotions.push(new Potion({
                    potionType: potionColorType,
                    weight: 1,
                    effects: variant.effects,
                    initialName: UNIDENTIFIED_POTION_NAME_BY_TYPE[potionColorType],
                    identifiedName: variant.name,
                }));
            }
        }
        // const hot POTION_GROUP_BY_TYPE
        // shuffle(this.rng, )
    }
    generateItem(): Item {
        // decide generating weapon or armor or potion or food
        // const x = this.rng.next();
        // if (x > 0.2) {
        return this.generatePotion();
        // }
    }
    generatePotion(): Potion {
        if (this.rng.next() > 0) {
            // generate predefined potion
            const potion = randomElem(this.rng, this.predefinedPotions);
            if (potion) {
                return potion;
            } else {
                throw new Error("");
            }
        } else {
            // generate exotic potion
            throw new Error("");
        }
    }
}
