import './App.css';
import { useEffect, useRef } from 'react';
import { Session } from './game/Session';
import { atom, useAtom } from "jotai";

const viewportHtmlAtom = atom(null);
const turnCounterAtom = atom(0);
const tileInfoAtom = atom("");

const TurnCounter = (props) =>
  <div style={{
    position: "fixed",
    top: "10px",
    right: "20px",
  }}>
    {props.children}
  </div>;

const TileInfo = (props) =>
  <div style={{
    position: "fixed",
    top: "40px",
    right: "20px",
  }}>
    {props.children}
  </div>;

function App() {
  const sessionRef = useRef(null);
  const [viewportHtml, setViewportHtml] = useAtom(viewportHtmlAtom);
  const [turnCounter, setTurnCounter] = useAtom(turnCounterAtom);
  const [tileInfo, setTileInfo] = useAtom(tileInfoAtom);
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
      setTileInfo(session.tileInfo);
    };
    session.gameLoop.on("playerTurnEnd", invalidateViewport);
    invalidateViewport();
  }, []);
  return (
    <div className="App">
      <TurnCounter>
        {turnCounter}
      </TurnCounter>
      <TileInfo>
        {tileInfo}
      </TileInfo>
      <div style={{ width: "1024px" }}>
        {viewportHtml}
      </div>
    </div>
  );
}

export default App;
