import React, { useState } from "react";

import { BilanzNode } from "./BilanzInterfaces";
import { Position } from "../../types/InteractiveBalanceData";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";

const BilanzItem: React.FC<{
  position: Position;
  level?: number;
  openTAccWindow: (title: string) => void;
}> = ({ position, level = 0, openTAccWindow }) => {
  const [open, setOpen] = useState(false);

  const { interactiveBalanceData } = useInteractiveBalanceData();

  const accounts = interactiveBalanceData.accounts;

  return (
    <div className={`ml-${level} mt-1`}>
      <button
        className="bg-white hover:bg-blue-100 border border-gray-300 rounded px-2 py-1 w-full text-left"
        onClick={() => setOpen(!open)}
      >
        {position.label}
      </button>

      {open && (
        <div className="ml-4">
          {position.accounts?.map((accountId, i) => {
            const account = accounts.find(a => a.id === accountId)
            return (<button
              key={i}
              className="mt-1 bg-green-100 hover:bg-green-400 border border-gray-300 rounded px-2 py-1 w-full text-left"
              onClick={() => openTAccWindow(`${accountId}: ${account?.label}`)}
            >
              {accountId} {account?.label}
            </button>);
          })}

          {position.positions?.map((child, i) => (
            <BilanzItem
              key={i}
              position={child}
              level={level + 1}
              openTAccWindow={openTAccWindow}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BilanzItem;
