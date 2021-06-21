import styled, { StyledComponent } from "styled-components";

export const LogContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow-y: scroll;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
`;

export const LogMessage = styled.div`
    color: seagreen;
    font-size: 12px;
`;
