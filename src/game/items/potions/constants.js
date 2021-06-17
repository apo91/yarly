import { EffectType } from "../../effects";
import { PotionGroup } from "./PotionGroup";
import { PotionType } from "./PotionType";

export const POTION_GROUP_BY_TYPE = {
    [PotionType.Red]: PotionGroup.HotColors,
    [PotionType.Orange]: PotionGroup.HotColors,
    [PotionType.Yellow]: PotionGroup.HotColors,
    [PotionType.Pink]: PotionGroup.HotColors,
    [PotionType.Magenta]: PotionGroup.HotColors,
    [PotionType.Blue]: PotionGroup.ChillColors,
    [PotionType.Cyan]: PotionGroup.ChillColors,
    [PotionType.Seagreen]: PotionGroup.ChillColors,
    [PotionType.Other]: PotionGroup.Exotic,
};

// export const CONSUMABLE_TYPE = {
//     POTION: 0,
//     FOOD: 1,
// };

// const POTION_COLORS = ["red", "pink", "magenta", "blue", "cyan", "seagreen"];

// const FOOD_STATUSES = ["fresh", "rotten"];

// const FOOD_NAMES = ["banana", "apple", "cheese", "yogurt"];

export const POTION_VARIANTS_BY_GROUP = {
    [PotionGroup.HotColors]: [
        {
            name: "potion of minor healing",
            effects: [{ type: EffectType.RestoreHealth, amount: [2, 4, [0, 1]] }],
        },
        {
            name: "potion of major healing",
            effects: [{ type: EffectType.RestoreHealth, amount: [4, 6, [0, 2]] }],
        },
        {
            name: "potion of flames",
            effects: [{ type: EffectType.SetOnFire }],
        },
        {
            name: "potion of identification",
            effects: [{ type: EffectType.IdentificationAura }],
        },
        {
            name: "grapefruit juice",
            effects: [
                { type: EffectType.IncreaseHealthRestorationRate, amount: [1, 2], duration: 5 },
                { type: EffectType.IncreaseManaRestorationRate, amount: [1, 2], duration: 5 },
            ]
        },
        {
            name: "wine",
            effects: [
                { type: EffectType.IncreasePoisonResistance, duration: [10, 10, [0, 0]] },
                { type: EffectType.RestoreMana, min: 4, max: 6, delta: [0, 2] }
            ],
        }
    ],
    [PotionGroup.ChillColors]: [
        { name: "minor mana potion", type: EffectType.RestoreMana, min: 2, max: 4, delta: [0, 1] },
        { name: "major mana potion", type: EffectType.RestoreMana, min: 4, max: 6, delta: [0, 2] },
    ]
}
