import React from "react";
import "./App.css";
import Workspace from "./pages/Workspace";
import WindowManager from "./util/WindowManager";
import { InteractiveBalanceDataProvider } from "./context/InteractiveBalanceDataContext";

const App = () => {
  return (
    <InteractiveBalanceDataProvider>
      <Workspace>
        <WindowManager></WindowManager>
      </Workspace>
    </InteractiveBalanceDataProvider>
  );
};

export default App;
