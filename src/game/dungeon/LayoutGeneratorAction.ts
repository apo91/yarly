import { Random } from "random";

export enum LayoutGeneratorAction {
    AddSegment,
    AddLoop,
};

export const randomLayoutGeneratorAction = (rng: Random): LayoutGeneratorAction => {
    switch (rng.int(0, 1)) {
        case 0:
            return LayoutGeneratorAction.AddSegment;
        case 1:
            return LayoutGeneratorAction.AddLoop;
        default:
            throw new Error();
    }
}
