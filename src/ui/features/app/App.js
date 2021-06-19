import './App.css';
import { useAtom } from "jotai";
import { viewportHtmlAtom, turnCounterAtom, tileInfoAtom, inventoryAtom } from "./atoms";
import { useSession } from './useSession';

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
    </div>
  );
}

export default App;
