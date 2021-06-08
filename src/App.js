import './App.css';
import random from "random";
import { useEffect, useRef, useState } from 'react';
import { TILE_TYPE } from "./game/tiles";
import { ENTITY_TYPE } from "./game/entities";
import { Session } from './game/Session';
import { atom, useAtom } from "jotai";

const viewportHtmlAtom = atom(<div>1</div>);
const turnCounterAtom = atom(0);

const TurnCounter = (props) =>
  <div style={{
    position: "fixed",
    top: "10px",
    right: "20px",
  }}>
    {props.children}
  </div>;

function App() {
  const sessionRef = useRef(null);
  const [viewportHtml, setViewportHtml] = useAtom(viewportHtmlAtom);
  const [turnCounter, setTurnCounter] = useAtom(turnCounterAtom);
  useEffect(() => {
    const session = new Session({
      dungeonConfig: {
        width: 16,
        height: 16,
        layoutSegmentsCount: 24,
        entitiesCount: 10,
      },
      viewportConfig: {
        width: 16,
        height: 16,
      },
    });
    sessionRef.current = session;
    const invalidateViewport = () => {
      setViewportHtml(session.renderer.render(session.dungeon));
      setTurnCounter(session.turnCounter);
    };
    session.gameLoop.on("playerTurnEnd", invalidateViewport);
    invalidateViewport();
  }, []);
  return (
    <div className="App">
      <TurnCounter>
        {turnCounter}
      </TurnCounter>
      <div style={{ width: "640px" }}>
        {viewportHtml}
      </div>
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
