// @ts-nocheck

import styled, { StyledComponent } from "styled-components";

export const TilesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    user-select: none;
`;

/**
 * @type {StyledComponent<"div", any, { tilesPerRow: number, color: string, backgroundColor?: string }, never>}
 */
export const RenderedTile = styled.div`
    width: ${props => `${100 / props.tilesPerRow}%`};
    color: ${props => props.color};
    background-color: ${props => props.backgroundColor || "default"};
    box-sizing: border-box;
`;
