import React, { useState } from "react";

import { BilanzNode } from "./BilanzInterfaces";

const BilanzItem: React.FC<{ node: BilanzNode; level?: number }> = ({
  node,
  level = 0,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`ml-${level * 4} mt-1`}>
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
              className="ml-4 mt-1 bg-gray-100 hover:bg-blue-200 border border-gray-300 rounded px-2 py-1 w-full text-left"
            >
              {konto.nr} {konto.name}
            </button>
          ))}

          {node.struktur.posten?.map((child, i) => (
            <BilanzItem key={i} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BilanzItem;
