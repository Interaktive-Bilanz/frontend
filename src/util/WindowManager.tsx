import React, { useState } from "react";
import { Rnd } from "react-rnd";
import BilanzComponent from "../components/bilanz/BilanzComponent";

interface WindowType {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
}

const WindowManager = () => {
  const [windows, setWindows] = useState<WindowType[]>([]);

  const openWindow = (title: string) => {
    setWindows((prev) => {
      if (prev.length >= 3) return prev;

      if (prev.some((w) => w.title === title)) return prev;

      const newWindow: WindowType = {
        x: 100 + prev.length * 10,
        y: 100 + prev.length * 10,
        width: 500,
        height: 400,
        title,
      };

      return [...prev, newWindow];
    });
  };

  const closeWindow = (title: string) => {
    setWindows((prev) => prev.filter((w) => w.title !== title));
  };

  const bringToFront = (title: string) => {
    setWindows((prev) => {
      const windowToBring = prev.find((w) => w.title === title);
      if (!windowToBring) return prev;

      return [...prev.filter((w) => w.title !== title), windowToBring];
    });
  };

  return (
    <div className="w-screen h-screen bg-gray-200 relative overflow-hidden">
      <div className="flex justify-center p-8">
        <BilanzComponent openTAccWindow={openWindow} />
      </div>

      {windows.map((w, index) => (
        <Rnd
          key={w.title}
          default={{
            x: w.x,
            y: w.y,
            width: w.width,
            height: w.height,
          }}
          bounds="window"
          style={{
            zIndex: index + 1,
          }}
          onMouseDown={() => bringToFront(w.title)}
          className="border border-gray-700 bg-white shadow-lg absolute flex flex-col"
        >
          <div className="bg-gray-800 text-white px-3 py-2 flex justify-between items-center cursor-move">
            <span>{w.title}</span>
            <button
              onClick={() => closeWindow(w.title)}
              className="bg-red-700 hover:bg-red-500 text-white px-2 py-1 rounded"
            >
              X
            </button>
          </div>
          <div className="p-4 text-sm text-gray-700">Hier Konto Daten etc</div>
        </Rnd>
      ))}
    </div>
  );
};

export default WindowManager;
