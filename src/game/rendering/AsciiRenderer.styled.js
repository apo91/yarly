// @ts-nocheck

import styled, { StyledComponent } from "styled-components";

export const TilesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

/**
 * @type {StyledComponent<"div", any, { tilesPerRow: number }, never>}
 */
export const RenderedTile = styled.div`
    width: ${props => `${100 / props.tilesPerRow}%`};
    box-sizing: border-box;
`;
