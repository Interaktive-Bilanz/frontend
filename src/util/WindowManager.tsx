import React, { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import BilanzComponent from "../components/bilanz/BilanzComponent";
import { TAccountComponent } from "../components/tAccount/tAccountComponent";
import { useInteractiveBalanceData } from "../context/InteractiveBalanceDataContext";
import { Account, InteractiveBalanceData } from "../types/InteractiveBalanceData";
import Buchungsformular from "../components/buchungssatz/Formular";
import { WindowManagerContext } from "../context/WindowManagerContext";
import { JournalEntryForm } from "../components/journalEntry/JournalEntryForm";
import { FileHandlerComponent } from "../components/fileHandler/FileHandlerComponent";
import { toast } from "react-toastify";
import JsonEditor from "../components/bilanz/JsonEditorComponent";
import { DragProvider } from "../context/DragContext";
import { AppMode, hasAccess, useAppMode } from "../context/AppModeContex";
import { Sidebar } from "../components/sidebar/Sidebar";
import { ChartOfAccounts } from "../components/chartOfAccounts/chartOfAccountsComponent";

type WindowContentType = "Account" | "JournalEntry" | "FileHandeling" | "ChartOfAccounts";

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
      if (data.payload.id && data.payload.id != "Neue Buchung") {
        return `Buchung ${data.payload.id}`;
      } else {
        return "Neue Buchung";
      }

    }
    case "FileHandeling": {
      return "File Handeling";
    }
    case "ChartOfAccounts": {
      return "Kontenplan";
    }
    default: return "No Title";
  }
}

const WindowManager = () => {
  const [windows, setWindows] = useState<WindowType[]>([]);
  const [topZ, setTopZ] = useState(1);
  const { cancelDraft } = useInteractiveBalanceData()
  const contentRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState<number>(0);
  const { appMode, isTeacherFromUrl, setAppMode } = useAppMode();
  const { interactiveBalanceData, setInteractiveBalanceData } = useInteractiveBalanceData();

  useEffect(() => {
    if (contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      setMinHeight(rect.height); // set min height to current content height
    }
  }, [windows]); // run whenever windows array changes or content changes

  const maxWindowCounts: Record<WindowContentType, number> = {
    "Account": 3,
    "JournalEntry": 1,
    "FileHandeling": 1,
    "ChartOfAccounts": 1
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
    const title = generateTitle(windowData);
    setWindows((prev) => prev.filter((w) => w.title !== title));
  };

  const closeAllWindowsExcept = (windowData: WindowData | null) => {
    if (windowData) {
      setWindows((prev) => prev.filter((w) => w.title === generateTitle(windowData)));
    } else {
      setWindows([]);
    }
  }

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
    <WindowManagerContext.Provider value={{ openWindow, closeWindow, closeAllWindowsExcept, bringToFront }}>
      <Sidebar></Sidebar>
      <div className="w-screen h-screen bg-gray-200 relative overflow-hidden p-1">
        <div>
          {isTeacherFromUrl && <div className="flex justify-center my-1"><div className="text-white font-bold bg-red-500 rounded-md px-2 py-1">Teacher Mode</div></div>}

          <div className={"flex-1 flex items-start p-8 h-full " + (hasAccess(appMode, "teacher") ? "justify-evenly gap-4" : "justify-center")}>
            <DragProvider>
              <BilanzComponent />
            </DragProvider>
            {hasAccess(appMode, "teacher") &&
              <div className="w-1/2 h-90vh">
                <JsonEditor />
              </div>
            }
          </div>
        </div>

        {windows.map((w) => (
          // add the json editor here?
          <Rnd
            key={w.title}
            default={{
              x: w.x,
              y: w.y,
              width: w.data.type === "FileHandeling" ? "auto" : w.width,
              height: "auto",
            }}
            minWidth={w.data.type === "FileHandeling" ? 400 : 550}
            minHeight={w.data.type === "FileHandeling" ? 250 : 400}
            enableResizing={w.data.type !== "FileHandeling"}
            bounds="window"
            style={{ zIndex: w.zIndex }}
            onMouseDown={() => bringToFront(w.data)}
            dragHandleClassName="window-drag-handle"
            cancel=".clickable, button, input, select, textarea"
            className="border border-gray-700 bg-white shadow-lg absolute flex flex-col"
          >
            <div className={`window-drag-handle 
              ${w.data.type === "Account" ? "bg-green-400 text-gray-800" : ""} 
              ${w.data.type === "JournalEntry" ? "bg-yellow-100 text-gray-800" : ""} 
              ${w.data.type != "JournalEntry" && w.data.type != "Account" ? "bg-gray-800 text-white" : ""} 
              px-3 py-2 flex justify-between items-center cursor-move`}>
              <span>{w.title}</span>
              <button
                onClick={() => closeWindow(w.data)}
                className="bg-red-700 hover:bg-red-500 text-white px-2 py-1 rounded"
              >
                X
              </button>
            </div>
            <div className="p-4 text-sm text-gray-700">
              {w.data.type === "Account" && (
                <TAccountComponent key={w.data.payload.id} {...w.data.payload} />
              )}
              {w.data.type === "JournalEntry" && (
                <JournalEntryForm
                  key={w.data.payload.id ?? "new"}
                  entryId={w.data.payload.id}
                  isDraft={w.data.payload.isDraft}
                />
              )}
              {w.data.type === "FileHandeling" && (
                <FileHandlerComponent key={w.data.type} />
              )}
              {w.data.type === "ChartOfAccounts" && (
                <ChartOfAccounts/>
              )}
            </div>
          </Rnd>
        ))}
      </div>
    </WindowManagerContext.Provider >

  );
};

export default WindowManager;
