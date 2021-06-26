import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { Session } from "../../../game/Session";
import { writeGameLogAtom } from "../gamelog/atoms";
import { inventoryAtom } from "../inventory/atoms";
// import { playerInfoAtom } from "../playerinfo/atoms";
import { viewportHtmlAtom, turnCounterAtom, tileInfoAtom } from "./atoms";

export const useSession = () => {
    const [, setViewportHtml] = useAtom(viewportHtmlAtom);
    const [, setTurnCounter] = useAtom(turnCounterAtom);
    const [, setTileInfo] = useAtom(tileInfoAtom);
    const [, setInventory] = useAtom(inventoryAtom);
    // const [, setPlayerInfo] = useAtom(playerInfoAtom);
    const [, writeLogMessage] = useAtom(writeGameLogAtom);
    const invalidateViewport = useCallback((session) => {
        setViewportHtml(session.renderer.render());
        setTurnCounter(session.turnCounter);
        setTileInfo(session.tileInfo);
        setInventory(session.getInventoryItemNames());
    }, [setViewportHtml, setTurnCounter, setTileInfo, setInventory]);
    const [session] = useState(() => {
        const session = new Session({
            dungeonConfig: {
                width: 64,
                height: 48,
                layoutSegmentsCount: 48,
                entitiesCount: 32,
            },
            viewportConfig: {
                width: 32,
                height: 16,
            },
        });
        session.gameLoop.on("playerTurnEnd", () => invalidateViewport(session));
        session.on("log", writeLogMessage);
        return session;
    });
    useEffect(() => {
        invalidateViewport(session);
    }, []);
    return session;
}
