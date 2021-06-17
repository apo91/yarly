import { EffectType } from "./EffectType";

export type Effect = {
    type: EffectType,
    amount?: number,
    duration?: number,
};
