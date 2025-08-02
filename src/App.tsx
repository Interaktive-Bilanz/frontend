import React from "react";
import "./App.css";
import Workspace from "./pages/Workspace";
import BilanzComponent from "./components/bilanz/BilanzComponent";

function App() {
  return (
    <Workspace>
      <BilanzComponent></BilanzComponent>
    </Workspace>
  );
}

export default App;
