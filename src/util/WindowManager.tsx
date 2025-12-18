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
import { useTeacherMode } from "../context/TeacherModeContext";
import { toast } from "react-toastify";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { validateJson } from "./validateJson";

type WindowContentType = "Account" | "JournalEntry" | "FileHandeling";

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
    default: return "No Title";
  }
}

const WindowManager = () => {
  const [windows, setWindows] = useState<WindowType[]>([]);
  const [topZ, setTopZ] = useState(1);
  const { cancelDraft } = useInteractiveBalanceData()
  const contentRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState<number>(0);
  const { teacherMode } = useTeacherMode();
  const { interactiveBalanceData, setInteractiveBalanceData } = useInteractiveBalanceData();
  const [teacherModeDraft, setTeacherModeDraft] = useState(JSON.stringify(interactiveBalanceData, null, 4));

  useEffect(() => {
    if (contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      setMinHeight(rect.height); // set min height to current content height
    }
  }, [windows]); // run whenever windows array changes or content changes

  useEffect(() => {
    if (teacherMode) {
      try {
        const parsedJson: unknown = JSON.parse(teacherModeDraft);

        //console.log("parsed");

        const isValid = validateJson(parsedJson);
        if (!isValid) return;

        //console.log("valid");

        // NOW we can safely assert the type
        setInteractiveBalanceData(parsedJson as unknown as InteractiveBalanceData);
        //toast.success("Änderung erfolgreich")
        //console.log("success");
      } catch (err) {
        console.error(err);
      }
    }

  }, [teacherModeDraft])

  const maxWindowCounts: Record<WindowContentType, number> = {
    "Account": 3,
    "JournalEntry": 1,
    "FileHandeling": 1,
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

    //if (windowData.type === "JournalEntry") cancelDraft();
    setWindows((prev) => prev.filter((w) => w.title !== generateTitle(windowData)));
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
      <div className="w-screen h-screen bg-gray-200 relative overflow-hidden p-4">
        {/* Top bar or main content container */}
        <div className="">
          {/* Left column: buttons */}
          <div className="space-x-2 flex-1 flex justify-center">
            <button
              className="bg-green-500 hover:bg-green-700 px-2 py-1 rounded w-60"
              onClick={() =>
                openWindow({ type: "JournalEntry", payload: { isDraft: true } })
              }
            >
              Neuer Buchungssatz
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 px-2 py-1 rounded w-60"
              onClick={() =>
                openWindow({ type: "FileHandeling", payload: {} })
              }
            >
              Up-/Download
            </button>
          </div>

          {/* Center column: balance sheet */}
          <div className={"flex-1 flex items-start p-8 h-full " + (teacherMode ? "justify-evenly" : "justify-center")}>
            <BilanzComponent />
            {teacherMode &&
              <div className="w-1/2">
                <CodeMirror
                  value={teacherModeDraft}
                  height="90vh"
                  width="full"
                  extensions={[json()]}
                  onChange={(value) => setTeacherModeDraft(value)}
                  theme="light"
                />
              </div>
            }
          </div>
        </div>

        {/* Floating windows */}
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
            </div>
          </Rnd>
        ))}
      </div>
    </WindowManagerContext.Provider >

  );
};

export default WindowManager;
