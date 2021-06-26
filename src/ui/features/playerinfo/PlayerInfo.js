import { useAtom } from "jotai";
import { Statusbar } from "../generic/Statusbar";
import { playerInfoAtom } from "./atoms";
import { PlayerInfoContainer, PlayerInfoRow, StatusbarLabel, PlayerInfoTitle } from "./PlayerInfo.styled";

export const PlayerInfo = (props) => {
    const [playerInfo] = useAtom(playerInfoAtom);
    return (
        <PlayerInfoContainer {...props}>
            <PlayerInfoTitle>
                {playerInfo.name} lvl {playerInfo.level} {playerInfo.race} {playerInfo.class}
            </PlayerInfoTitle>
            <PlayerInfoRow>
                <StatusbarLabel>
                    HP
                </StatusbarLabel>
                <Statusbar
                    primaryColor="red"
                    secondaryColor="pink"
                    value={playerInfo.currentHP}
                    maxValue={playerInfo.maxHP}
                />
            </PlayerInfoRow>
            <PlayerInfoRow>
                <StatusbarLabel>
                    MP
                </StatusbarLabel>
                <Statusbar
                    primaryColor="blue"
                    secondaryColor="seagreen"
                    value={playerInfo.currentMP}
                    maxValue={playerInfo.maxMP}
                />
            </PlayerInfoRow>
            <PlayerInfoRow>
                <StatusbarLabel>
                    XP
                </StatusbarLabel>
                <Statusbar
                    primaryColor="yellow"
                    secondaryColor="orange"
                    value={playerInfo.currentXP}
                    maxValue={playerInfo.maxXP}
                />
            </PlayerInfoRow>
        </PlayerInfoContainer>
    );
}
