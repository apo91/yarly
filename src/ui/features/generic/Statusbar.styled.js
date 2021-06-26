// @ts-nocheck

import styled from "styled-components";

export const StatusbarContainer = styled.div`
    /* position: absolute; */
    position: relative;
    width: 300px;
    height: 24px;
    background-color: ${props => props.fillColor};
    border: 0px solid white;
    /* border-radius: 8px; */
    overflow: hidden;
`;

export const StatusbarIndicator = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    /* bottom: 0; */
    /* right: 0; */
    width: ${props => props.fillRatio * 100}%;
    height: 100%;
    background-color: ${props => props.fillColor};
    /* border-radius: 8px; */
`;

export const StatusbarText = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    /* text-align: center; */
    /* vertical-align: middle; */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    /* margin-left: 50%; */
    /* margin-right: 50%; */
`;
