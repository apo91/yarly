import './App.css';
import { useEffect, useRef } from 'react';
import { Session } from './game/Session';
import { atom, useAtom } from "jotai";

const viewportHtmlAtom = atom(null);
const turnCounterAtom = atom(0);
const tileInfoAtom = atom("");
const inventoryAtom = atom([""]);

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

const Inventory = (props) =>
  <div style={{
    position: "fixed",
    top: "100px",
    right: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  }}>
    <b>Inventory</b>
    {props.children}
  </div>

function App() {
  const sessionRef = useRef(null);
  const [viewportHtml, setViewportHtml] = useAtom(viewportHtmlAtom);
  const [turnCounter, setTurnCounter] = useAtom(turnCounterAtom);
  const [tileInfo, setTileInfo] = useAtom(tileInfoAtom);
  const [inventory, setInventory] = useAtom(inventoryAtom);
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
      setViewportHtml(session.renderer.render());
      setTurnCounter(session.turnCounter);
      setTileInfo(session.tileInfo);
      setInventory(session.player.entityData.inventory.map(item => item.isConsumable() ? item.itemData.name : "?"))
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
      <Inventory>
        {inventory.map(itemName => <div>{itemName}</div>)}
      </Inventory>
      <div style={{ width: "1024px" }}>
        {viewportHtml}
      </div>
    </div>
  );
}

export default App;
