import styled from "styled-components";

export const PlayerInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    user-select: none;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    padding: 15px;
    padding-bottom: 16px;
`;

export const PlayerInfoTitle = styled.div`
    font-size: 16px;
    text-align: left;
    margin-bottom: 4px;
`;

export const PlayerInfoRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    margin-top: 4px;
`;

export const StatusbarLabel = styled.div`
    width: 20px;
    text-align: left;
    font-size: 14px;
    margin-right: 8px;
`;
