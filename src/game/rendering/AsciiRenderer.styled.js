// @ts-nocheck

import styled, { StyledComponent } from "styled-components";

export const TilesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

/**
 * @type {StyledComponent<"div", any, { tilesPerRow: number, opacity: number }, never>}
 */
export const RenderedTile = styled.div`
    width: ${props => `${100 / props.tilesPerRow}%`};
    opacity: ${props => props.opacity};
    box-sizing: border-box;
`;
