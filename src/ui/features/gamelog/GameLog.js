import { useEffect } from "react";

export const GameLog = (props) => {
    // useState()
    // useEffect()
    return (
        <div>
            {props.messages.map(message => (
                <div>
                    {message}
                </div>
            ))}
        </div>
    );
}
