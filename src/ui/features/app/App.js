import './App.css';
import { useAtom } from "jotai";
import { viewportHtmlAtom, turnCounterAtom, tileInfoAtom } from "./atoms";
import { useSession } from './useSession';
import { GameLog } from '../gamelog/GameLog';
import { PlayerInfo } from '../playerinfo/PlayerInfo';
import { PlayerInfoWrapper, UpperComponentsRow } from './App.styled';
import { Inventory } from '../inventory/Inventory';

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
  useSession();
  const [viewportHtml] = useAtom(viewportHtmlAtom);
  const [turnCounter] = useAtom(turnCounterAtom);
  const [tileInfo] = useAtom(tileInfoAtom);
  return (
    <div className="App">
      <UpperComponentsRow>
        <PlayerInfoWrapper>
          <PlayerInfo />
        </PlayerInfoWrapper>
      </UpperComponentsRow>
      <TurnCounter>
        {turnCounter}
      </TurnCounter>
      <TileInfo>
        {tileInfo}
      </TileInfo>
      <Inventory />
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
