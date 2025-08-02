import React, { useState } from "react";
import { Rnd } from "react-rnd";
import "../App.css";

interface WindowType {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function WindowManager() {
  const [windows, setWindows] = useState<WindowType[]>([]);
  const [zIndices, setZIndices] = useState<Record<number, number>>({});
  const [topZ, setTopZ] = useState<number>(1);

  const openWindow = () => {
    const id = Date.now();
    setWindows([...windows, { id, x: 100, y: 100, width: 300, height: 200 }]);
    setZIndices({ ...zIndices, [id]: topZ });
    setTopZ(topZ + 1);
  };

  const closeWindow = (id: number) => {
    setWindows(windows.filter((w) => w.id !== id));
  };

  const bringToFront = (id: number) => {
    setZIndices({ ...zIndices, [id]: topZ });
    setTopZ(topZ + 1);
  };

  return (
    <div className="container">
      <button onClick={openWindow} className="open-button">
        Open Window
      </button>

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
          className="window"
        >
          <div className="title-bar">
            <span>Window {w.id}</span>
            <button onClick={() => closeWindow(w.id)} className="close-button">
              X
            </button>
          </div>
          <div className="content">Content here...</div>
        </Rnd>
      ))}
    </div>
  );
}
