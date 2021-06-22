import { StatusbarContainer, StatusbarIndicator, StatusbarText } from "./Statusbar.styled";

export const Statusbar = (props) => {
    return (
        <StatusbarContainer
            fillColor={props.secondaryColor}
        >
            <StatusbarIndicator
                fillColor={props.primaryColor}
                fillRatio={props.value / props.maxValue}
            />
            <StatusbarText>
                {props.value}/{props.maxValue}
            </StatusbarText>
        </StatusbarContainer>
    );
}
