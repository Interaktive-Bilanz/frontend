import React from "react";
import "./App.css";
import Workspace from "./pages/Workspace";
import BilanzComponent from "./components/bilanz/BilanzComponent";
import WindowManager from "./util/WindowManager";

const App = () => {
  return (
    <Workspace>
      <WindowManager></WindowManager>
    </Workspace>
  );
};

export default App;
