import './App.css';
import { useEffect, useRef } from 'react';
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
        width: 64,
        height: 48,
        layoutSegmentsCount: 48,
        entitiesCount: 32,
      },
      viewportConfig: {
        width: 32,
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
      <div style={{ width: "1024px" }}>
        {viewportHtml}
      </div>
    </div>
  );
}

export default App;
