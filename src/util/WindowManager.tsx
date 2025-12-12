import React, { useState } from "react";
import { Rnd } from "react-rnd";
import BilanzComponent from "../components/bilanz/BilanzComponent";
import { TAccountComponent } from "../components/tAccount/tAccountComponent";
import { useInteractiveBalanceData } from "../context/InteractiveBalanceDataContext";
import { Account } from "../types/InteractiveBalanceData";
import Buchungsformular from "../components/buchungssatz/Formular";
import { WindowManagerContext } from "../context/WindowManagerContext";
import { JournalEntryForm } from "../components/journalEntry/JournalEntryForm";

type WindowContentType = "Account" | "JournalEntry";

export interface WindowData {
  type: WindowContentType;
  payload: any;
}

interface WindowType {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  data: WindowData;
  zIndex: number;
}

function generateTitle(data: WindowData) {
  switch (data.type) {
    case "Account": return `${data.payload.id} ${data.payload.label}`;
    case "JournalEntry": {
      console.log(data.payload.id);
      return `Buchung ${data.payload.id}`;
    }
    default: return "No Title";
  }
}

const initialJournalEntry: WindowData = {
    type: "JournalEntry",
    payload: {
      id: 1
    },
  };

  const initialWindow: WindowType = {
    x: 100,
    y: 100,
    width: 500,
    height: 400,
    title: "Initial Journal Entry",
    data: initialJournalEntry,
    zIndex: 1,
  };

const WindowManager = () => {
  const [windows, setWindows] = useState<WindowType[]>([]);
  const [topZ, setTopZ] = useState(1);
  const { cancelDraft } = useInteractiveBalanceData()

  const maxWindowCounts: Record<WindowContentType, number> = {
    "Account": 3,
    "JournalEntry": 1,
  }

  const openWindow = (windowData: WindowData) => {

    setWindows((prev) => {

      const sameTypeCount = prev.filter(w => w.data.type === windowData.type).length;

      const existingWindow = prev.find((w) => w.title === generateTitle(windowData));

      if (existingWindow) {
        bringToFront(existingWindow.data);
        return prev;
      }

      if (sameTypeCount >= maxWindowCounts[windowData.type]) return prev;

      const newWindow: WindowType = {
        x: 100 + prev.length * 200,
        y: 100 + prev.length * 50,
        width: 500,
        height: 400,
        title: generateTitle(windowData),
        data: windowData,
        zIndex: topZ + 1,
      };

      return [...prev, newWindow];
    });
  };

  const closeWindow = (windowData: WindowData) => {
    if (windowData.type === "JournalEntry") cancelDraft();
    setWindows((prev) => prev.filter((w) => w.title !== generateTitle(windowData)));
  };

  const bringToFront = (windowData: WindowData) => {
    setWindows(prev => {
      const title = generateTitle(windowData);
      return prev.map(w =>
        w.title === title ? { ...w, zIndex: topZ + 1 } : w
      );
    });
    setTopZ(prev => prev + 1);
  };

  return (
    <WindowManagerContext.Provider value={{ openWindow, closeWindow, bringToFront }}>
      <div className="w-screen h-screen bg-gray-200 relative overflow-hidden">
        <div className="flex justify-center p-8">
          <BilanzComponent />
        </div>

        {windows.map((w) => (
          <Rnd
            key={w.title}
            default={{
              x: w.x,
              y: w.y,
              width: w.width,
              height: "auto",
            }}
            minWidth={550}
            minHeight={400}
            bounds="window"
            style={{
              zIndex: w.zIndex,
            }}
            onMouseDown={() => bringToFront(w.data)}
            dragHandleClassName="window-drag-handle"
            cancel=".clickable, button, input, select, textarea"
            className="border border-gray-700 bg-white shadow-lg absolute flex flex-col"
          >
            <div className="window-drag-handle bg-gray-800 text-white px-3 py-2 flex justify-between items-center cursor-move">
              <span>{w.title}</span>
              <button
                onClick={() => closeWindow(w.data)}
                className="bg-red-700 hover:bg-red-500 text-white px-2 py-1 rounded"
              >
                X
              </button>
            </div>
            <div className="p-4 text-sm text-gray-700">
              {w.data.type === "Account" && <TAccountComponent {...w.data.payload} />}
              {w.data.type === "JournalEntry" && <JournalEntryForm entryId={w.data.payload.id}/>}
            </div>
          </Rnd>
        ))}
      </div>
    </WindowManagerContext.Provider>
  );
};

export default WindowManager;
