import React from "react";
import "./App.css";
import Workspace from "./pages/Workspace";
import BilanzComponent from "./components/BilanzComponent";

function App() {
  return (
    <Workspace>
      <BilanzComponent></BilanzComponent>
    </Workspace>
  );
}

export default App;

/*
<div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            React + TypeScript + Tailwind
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            Welcome to your new app!
          </h1>
          <p className="mt-2 text-gray-500">
            This is a React application with TypeScript and TailwindCSS
            configured and ready to use.
          </p>
          <div className="mt-4">
            <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  */
