import { useContext } from "react";
import {storeContext }from "../context/storeContext";

function StoreList() {

const { storeList } =
  useContext(storeContext)

  return <div>{storeList.map((item) => {
    <div key={item.id}>{item}</div>
  })}</div>;
}
export default StoreList;
