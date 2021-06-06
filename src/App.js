import './App.css';
import random from "random";
import { useEffect, useRef, useState } from 'react';
import { TILE_TYPE } from "./game/tiles";
import { ENTITY_TYPE } from "./game/entities";
import { Session } from './game/Session';
import { atom, useAtom } from "jotai";

const viewModelAtom = atom([]);

const TilesContainer = (props) =>
  <div style={{
    width: "1024px",
    display: "flex",
    flexWrap: "wrap"
  }}
  >
    {props.children}
  </div>;

const RenderedTile = ({ symbol, ...props }) =>
  <div
    style={{
      width: (100 / 16) + "%",
      boxSizing: "border-box",
    }}
    {...props}
  >
    {symbol}
  </div>;

function App() {
  const sessionRef = useRef(null); // useState(() => new Session());
  const [viewModel, setViewModel] = useAtom(viewModelAtom); // atom(this.renderer.render(this.dungeon));
  useEffect(() => {
    const session = new Session();
    sessionRef.current = session;
    const invalidateViewModel = () => {
      setViewModel(session.renderer.render(session.dungeon));
    };
    session.gameLoop.on("playerTurnEnd", invalidateViewModel);
    invalidateViewModel();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <TilesContainer>
          {viewModel.map((symbol, i) =>
            <RenderedTile
              key={i}
              symbol={symbol}
            />
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
