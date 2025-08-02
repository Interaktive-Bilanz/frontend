import React, { useState } from "react";

import { BilanzNode } from "./BilanzInterfaces";

const BilanzItem: React.FC<{
  node: BilanzNode;
  level?: number;
  openTAccWindow: (title: string) => void;
}> = ({ node, level = 0, openTAccWindow }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`ml-${level} mt-1`}>
      <button
        className="bg-white hover:bg-blue-100 border border-gray-300 rounded px-2 py-1 w-full text-left"
        onClick={() => setOpen(!open)}
      >
        {node.label}
      </button>

      {open && (
        <div className="ml-4">
          {node.struktur.konto?.map((konto, i) => (
            <button
              key={i}
              className="mt-1 bg-green-100 hover:bg-green-400 border border-gray-300 rounded px-2 py-1 w-full text-left"
              onClick={() => openTAccWindow(node.label)}
            >
              {konto.nr} {konto.name}
            </button>
          ))}

          {node.struktur.posten?.map((child, i) => (
            <BilanzItem
              key={i}
              node={child}
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
