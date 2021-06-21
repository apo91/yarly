import { useAtom } from "jotai";
import { gameLogAtom } from "./atoms";
import { LogContainer, LogMessage } from "./GameLog.styled";

export const GameLog = (props) => {
    const [logMessages] = useAtom(gameLogAtom);
    return (
        <LogContainer>
            {logMessages.map(message => (
                <LogMessage>
                    {message}
                </LogMessage>
            ))}
        </LogContainer>
    );
}
