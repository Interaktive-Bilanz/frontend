import React from "react";
import "./App.css";
import Workspace from "./pages/Workspace";
import WindowManager from "./util/WindowManager";
import { InteractiveBalanceDataProvider } from "./context/InteractiveBalanceDataContext";
import { ToastContainer } from "react-toastify";
import { AppModeProvider } from "./context/AppModeContex";
import { DragProvider } from "./context/DragContext";

const App = () => {
  return (
    <AppModeProvider>
      <InteractiveBalanceDataProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          theme="colored"
        />
        <Workspace>
          <DragProvider>
            <WindowManager />
          </DragProvider>
        </Workspace>
      </InteractiveBalanceDataProvider>
    </AppModeProvider>
  );
};

export default App;
