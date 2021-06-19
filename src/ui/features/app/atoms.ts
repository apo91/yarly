import * as React from "react";
import { atom } from "jotai";

export const viewportHtmlAtom = atom<React.ReactNode>(null);
export const turnCounterAtom = atom(0);
export const tileInfoAtom = atom("");
export const inventoryAtom = atom([""]);
