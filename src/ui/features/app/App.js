import './App.css';
import { useAtom } from "jotai";
import { viewportHtmlAtom, turnCounterAtom, tileInfoAtom, inventoryAtom } from "./atoms";
import { useSession } from './useSession';
import { GameLog } from '../gamelog/GameLog';
import { PlayerInfo } from '../playerinfo/PlayerInfo';

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
  useSession();
  const [viewportHtml] = useAtom(viewportHtmlAtom);
  const [turnCounter] = useAtom(turnCounterAtom);
  const [tileInfo] = useAtom(tileInfoAtom);
  const [inventory] = useAtom(inventoryAtom);
  return (
    <div className="App">
      <div style={{ position: "fixed", width: "320px", height: "140px", top: "20px" }}>
        <PlayerInfo />
      </div>
      <TurnCounter>
        {turnCounter}
      </TurnCounter>
      <TileInfo>
        {tileInfo}
      </TileInfo>
      <Inventory>
        {inventory.map(itemName => <div key={itemName}>{itemName}</div>)}
      </Inventory>
      <div style={{ width: "1024px" }}>
        {viewportHtml}
      </div>
      <div style={{ position: "fixed", width: "1024px", height: "140px", bottom: "20px" }}>
        <GameLog />
      </div>
    </div>
  );
}

export default App;
