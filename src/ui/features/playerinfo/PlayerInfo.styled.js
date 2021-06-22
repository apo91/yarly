import styled from "styled-components";

export const PlayerInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    user-select: none;
`;

export const PlayerInfoRow = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
    /* justify-content: center; */
    align-items: center;
    margin: 2px;
`;

export const StatusbarLabel = styled.div`
    width: 60px;
    text-align: right;
    font-size: 14px;
    margin-right: 8px;
`;
