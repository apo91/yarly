import { generateDungeon } from "./game/dungeon";
import './App.css';
import random from "random";
import { useState } from 'react';
import { TILE_TYPE } from "./game/tiles";

const TilesContainer = (props) =>
  <div style={{
    width: "1024px",
    display: "flex",
    flexWrap: "wrap"
  }}
  >
    {props.children}
  </div>;

const RenderedTile = ({ tileType, style, ...props }) =>
  <div
    style={{
      width: (100 / 32) + "%",
      boxSizing: "border-box",
      ...style
    }}
    {...props}
  >
    {tileType === TILE_TYPE.WALL ? "#" : "."}
  </div>;

function App() {
  const rng = random.clone("1337");
  const [dungeon] = useState(() => generateDungeon(rng, 16, 32, 24));
  return (
    <div className="App">
      <header className="App-header">
        <TilesContainer>
          {dungeon.map((tileType, i) =>
            <RenderedTile key={i} tileType={tileType} />
          )}
        </TilesContainer>
      </header>
    </div>
  );
}

export default App;


// function App() {
//   const rng = random.clone("1337");
//   const [segments] = useState(() => generateDungeon(rng, 10, 16, 16));
//   const canvas = useRef();
//   /**
//    * 
//    * @param {CanvasRenderingContext2D} ctx 
//    */
//   const draw = (ctx) => {
//     const w = ctx.canvas.width;
//     const h = ctx.canvas.height;
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     ctx.strokeStyle = "white";
//     for (const [[x1, y1], [x2, y2]] of segments) {
//       ctx.beginPath();
//       ctx.moveTo(x1 * w, y1 * h);
//       ctx.lineTo(x2 * w, y2 * h);
//       ctx.stroke();
//       ctx.closePath();
//     }
//   };
//   useEffect(() => {
//     const ctx = canvas.current.getContext('2d');
//     draw(ctx);
//   });
//   return (
//     <div className="App">
//       <header className="App-header">
//         <canvas width="640" height="480" ref={canvas} />
//       </header>
//     </div>
//   );
// }

// export default App;
