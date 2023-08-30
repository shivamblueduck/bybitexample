import React from "react";
import { PriceChart } from "./PriceChart";
import "./App.css";

const App = () => (
  <div style={{ height: "200vh" }}>
    <div style={{ backgroundColor: "#191c27", minHeight: "100vh" }}>
      <PriceChart />
    </div>
  </div>
);

export default App;
