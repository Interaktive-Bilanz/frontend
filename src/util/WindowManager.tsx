import React, { useState } from "react";
import { Rnd } from "react-rnd";
import BilanzComponent from "../components/bilanz/BilanzComponent";
import { TAccount } from "../components/tAccount/tAccountInterfaces";
import { TAccountComponent } from "../components/tAccount/tAccountComponent";
import { getTAccountByNr } from "../api/tAccountApi";
import { useInteractiveBalanceData } from "../context/InteractiveBalanceDataContext";
import { Account } from "../types/InteractiveBalanceData";
import Buchungsformular from "../components/buchungssatz/Formular";

interface WindowType {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  account?: Account; // not necessary for now
}

const WindowManager = () => {
  const [windows, setWindows] = useState<WindowType[]>([]);
  const { interactiveBalanceData } = useInteractiveBalanceData();

  const accounts = interactiveBalanceData.accounts;
  const journalEntries = interactiveBalanceData.journalEntries;

  const openWindow = (title: string) => {
    /* Opens a new window for windows arr
    preventing from opening more than 3 windows
    and window with same title */
    setWindows((prev) => {
      if (prev.length >= 3) return prev;

      if (prev.some((w) => w.title === title)) return prev;

      const id = parseInt(title.split(":")[0].trim());
      const account = accounts.find(a => a.id === id)
      // const account = getTAccountByNr(nr); // fetch TAccount object

      const newWindow: WindowType = {
        x: 100 + prev.length * 10,
        y: 100 + prev.length * 10,
        width: 500,
        height: 400,
        title,
        account,
      };

      return [...prev, newWindow];
    });
  };

  const closeWindow = (title: string) => {
    setWindows((prev) => prev.filter((w) => w.title !== title));
  };

  const bringToFront = (title: string) => {
    // changes array order to render in correct order
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
        <Buchungsformular></Buchungsformular>
      </div>

      {windows.map((w, index) => (
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
          <div className="p-4 text-sm text-gray-700">
            {w.account ? (
              <TAccountComponent account={w.account} />
            ) : (
              <div>Konto nicht gefunden</div>
            )}
          </div>
        </Rnd>
      ))}
    </div>
  );
};

export default WindowManager;
