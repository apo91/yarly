import { EffectType } from "../../effects";
import { Effect } from "../../effects/Effect";
import { PotionGroup } from "./PotionGroup";
import { PotionType } from "./PotionType";

export const POTION_GROUP_BY_TYPE: {
    [type in PotionType]: PotionGroup
} = {
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

export const UNIDENTIFIED_POTION_NAME_BY_TYPE: {
    [type in PotionType]: string
} = {
    [PotionType.Red]: "red potion",
    [PotionType.Orange]: "orange potion",
    [PotionType.Yellow]: "yellow potion",
    [PotionType.Pink]: "pink potion",
    [PotionType.Magenta]: "magenta potion",
    [PotionType.Blue]: "blue potion",
    [PotionType.Cyan]: "cyan potion",
    [PotionType.Seagreen]: "seagreen potion",
    [PotionType.Other]: "weird potion",
}

export const POTION_VARIANTS_BY_GROUP: {
    [group in PotionGroup]: { name: string, effects: Effect[] }[]
} = {
    [PotionGroup.HotColors]: [
        {
            name: "potion of minor healing",
            effects: [{ type: EffectType.RestoreHealth, amount: 0.25 }],
        },
        {
            name: "potion of major healing",
            effects: [{ type: EffectType.RestoreHealth, amount: 0.5 }],
        },
        {
            name: "potion of flames",
            effects: [{ type: EffectType.SetOnFire, duration: 5 }],
        },
        {
            name: "potion of identification",
            effects: [{ type: EffectType.IdentificationAura, duration: 5 }],
        },
        {
            name: "grapefruit juice",
            effects: [
                { type: EffectType.IncreaseHealthRestorationRate, amount: 1.5, duration: 5 },
                { type: EffectType.IncreaseManaRestorationRate, amount: 1.5, duration: 5 },
            ]
        },
        {
            name: "wine",
            effects: [
                { type: EffectType.IncreasePoisonResistance, duration: 10 },
                { type: EffectType.RestoreMana, amount: 0.5 }
            ],
        }
    ],
    [PotionGroup.ChillColors]: [
        {
            name: "minor mana potion",
            effects: [{ type: EffectType.RestoreMana, amount: 0.25 }]
        },
        {
            name: "major mana potion",
            effects: [{ type: EffectType.RestoreMana, amount: 0.5 }]
        },
    ],
    [PotionGroup.Exotic]: [],
}
