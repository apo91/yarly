import { useAtom } from "jotai";
import { inventoryAtom } from "./atoms";

const InventoryContainer = (props) =>
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

export const Inventory = (props) => {
    const [inventory] = useAtom(inventoryAtom);
    return (
        <InventoryContainer>
            {inventory.map(itemName => <div key={itemName}>{itemName}</div>)}
        </InventoryContainer>
    );
}
