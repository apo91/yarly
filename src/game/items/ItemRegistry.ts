import { Random } from "random";
import { shuffle } from "../utils";
import { Potion, PotionGroup, PotionType, POTION_GROUP_BY_TYPE, POTION_VARIANTS_BY_GROUP, UNIDENTIFIED_POTION_NAME_BY_TYPE } from "./potions";

class ItemRegistry {
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
            switch (POTION_GROUP_BY_TYPE[potionColorType]) {
                case PotionGroup.HotColors: {
                    const variant = hotVariants.pop();
                    this.predefinedPotions.push(new Potion({
                        potionType: potionColorType,
                        weight: 1,
                        effects: variant.effects,
                        initialName: UNIDENTIFIED_POTION_NAME_BY_TYPE[potionColorType],
                        identifiedName: variant.name,
                    }))
                    break;
                }
                case PotionGroup.ChillColors: {
                    break;
                }
            }
        }
        // const hot POTION_GROUP_BY_TYPE
        // shuffle(this.rng, )
    }
    generateItem() {
        // decide generating weapon or armor or potion or food
        const x = this.rng.next();
        if (x > 0.2) {
            return this.generatePotion();
        }
    }
    generatePotion() {
        // decide if generating known or unknown
    }
}
