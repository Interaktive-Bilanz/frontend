import React, { useState } from "react";
import { Position } from "../../types/InteractiveBalanceData";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { useWindowManager } from "../../context/WindowManagerContext";
import { AccountTotal, getAccountTotals } from "../../util/balanceCalculations";

export function calculatePositionSaldo (
  position:Position,
  accountTotals: Record<string, AccountTotal>
): number {
  let sum = 0;

  for (const accountId of position.accounts ?? []) {
    sum += getAccountTotals(accountTotals, accountId).balance;
  }

  for (const child of position.positions ?? []) {
    sum += calculatePositionSaldo(child, accountTotals);
  }

  return sum;
}

const BilanzItem: React.FC<{
  position: Position;
  level?: number;
}> = ({ position, level = 0 }) => {
  const [open, setOpen] = useState(false);

  const { interactiveBalanceData, accountTotals } = useInteractiveBalanceData();

  const accounts = interactiveBalanceData.accounts;

  const { openWindow } = useWindowManager();

  const positionBalance = calculatePositionSaldo(position, accountTotals);

  const displaypositionBalance = Math.abs(positionBalance);


  return (
    <div className={`ml-${level} mt-1`}>
      <button
        className="bg-white hover:bg-blue-100 border border-gray-300 rounded px-2 py-1 w-full text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex justify-between">
        <div>{position.label}</div> <div>{displaypositionBalance.toFixed(2)} €</div>
        </div>
      </button>

      {open && (
        <div className="ml-4">
          {position.accounts?.map((accountId, i) => {
            const account = accounts.find(a => a.id === accountId)
            if (!account) return;
            return (<button
              key={i}
              className="mt-1 bg-green-100 hover:bg-green-400 border border-gray-300 rounded px-2 py-1 w-full text-left"
              onClick={() => openWindow({
                type: "Account",
                payload: {id: accountId, label: account.label}
              })}
            >
              <div className="flex justify-between gap-2">
              <div>{accountId} {account?.label}</div><div className="text-nowrap">{Math.abs(getAccountTotals(accountTotals, accountId).balance).toFixed(2)} €</div>
              </div>
            </button>);
          })}

          {position.positions?.map((child, i) => (
            <BilanzItem
              key={i}
              position={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BilanzItem;
