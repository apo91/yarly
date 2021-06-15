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
export const RenderedTile = styled.div.attrs(props => ({
    style: {
        color: props.color,
        backgroundColor: props.backgroundColor || "default",
    }
}))`
    width: ${props => `${100 / props.tilesPerRow}%`};
    box-sizing: border-box;
`;

// export const RenderedTile = (props) => (
//     <div
//         style={{
//             color: props.color,
//             backgroundColor: props.backgroundColor || "black",
//             width: `${100 / props.tilesPerRow}%`,
//             boxSizing: "border-box"
//         }}
//     >
//         {props.children}
//     </div>
// );
