import React from "react";
import "./App.css";
import Workspace from "./pages/Workspace";
import WindowManager from "./util/WindowManager";
import { InteractiveBalanceDataProvider } from "./context/InteractiveBalanceDataContext";
import { ToastContainer } from "react-toastify";
import { TeacherModeProvider } from "./context/TeacherModeContext";

const App = () => {
  return (
    <TeacherModeProvider>
      <InteractiveBalanceDataProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          theme="colored"
        />
        <Workspace>
          <WindowManager/>
        </Workspace>
      </InteractiveBalanceDataProvider>
    </TeacherModeProvider>
  );
};

export default App;
