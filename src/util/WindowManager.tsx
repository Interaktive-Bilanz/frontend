import React, { ReactNode, useState } from "react";
import { Rnd } from "react-rnd";
import BilanzComponent from "../components/bilanz/BilanzComponent";

interface WindowType {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
}

const WindowManager = () => {
  const [windows, setWindows] = useState<WindowType[]>([]);
  const [zIndices, setZIndices] = useState<Record<number, number>>({});
  const [topZ, setTopZ] = useState<number>(1);

  const openWindow = (title: string) => {
    const id = Date.now();
    setWindows((prev) => [
      ...prev,
      { id, x: 100, y: 100, width: 500, height: 400, title: title },
    ]);
    setZIndices((prev) => ({ ...prev, [id]: topZ }));
    setTopZ((prev) => prev + 1);
  };

  const closeWindow = (id: number) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const bringToFront = (id: number) => {
    setZIndices((prev) => ({ ...prev, [id]: topZ }));
    setTopZ((prev) => prev + 1);
  };

  return (
    <div className="w-screen h-screen bg-gray-200 relative overflow-hidden">
      <div className="flex justify-center p-8">
        <BilanzComponent openTAccWindow={openWindow}></BilanzComponent>
      </div>

      {windows.map((w) => (
        <Rnd
          key={w.id}
          default={{
            x: w.x,
            y: w.y,
            width: w.width,
            height: w.height,
          }}
          bounds="window"
          style={{
            zIndex: zIndices[w.id] || 1,
          }}
          onMouseDown={() => bringToFront(w.id)}
          className="border border-gray-700 bg-white shadow-lg absolute flex flex-col"
        >
          <div className="bg-gray-800 text-white px-3 py-2 flex justify-between items-center cursor-move">
            <span>{w.title}</span>
            <button
              onClick={() => closeWindow(w.id)}
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
