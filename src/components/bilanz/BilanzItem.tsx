import React, { useState } from "react";
import { Position } from "../../types/InteractiveBalanceData";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { useWindowManager } from "../../context/WindowManagerContext";
import { AccountTotal, getAccountTotals } from "../../util/balanceCalculations";
import { useTeacherMode } from "../../context/TeacherModeContext";

export function calculatePositionSaldo(
  position: Position,
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

  const { teacherMode } = useTeacherMode();


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
          {teacherMode &&
            <div className="flex">
              <button className="bg-green-500 hover:bg-green-700 px-1 py-1 mt-1 mr-1 rounded mt">
                + Position
              </button>
              <button className="bg-green-500 hover:bg-green-700 px-1 py-1  mt-1 mr-1 rounded">
                + Konto
              </button>
            </div>
          }
          {position.accounts?.map((accountId, i) => {
            const account = accounts.find(a => a.id === accountId)
            if (!account) return;
            return (<button
              key={i}
              className="mt-1 bg-green-100 hover:bg-green-400 border border-gray-300 rounded px-2 py-1 w-full text-left"
              lang="de"
              onClick={() => openWindow({
                type: "Account",
                payload: { id: accountId, label: account.label }
              })}
            >
              <div className="grid grid-cols-[1fr_auto] gap-2 items-start">
                <div
                  lang="de"
                  className="min-w-0 hyphens-auto"
                >
                  <span className="break-words">
                    {accountId} {account?.label}
                  </span>
                  {/* <span className="inline-flex flex-wrap items-baseline">
                    <span className="whitespace-nowrap mr-1">
                      {accountId}
                    </span>

                    <span className="break-words">
                      {account?.label}
                    </span>
                  </span> */}
                </div>

                <div className="text-nowrap">
                  {Math.abs(getAccountTotals(accountTotals, accountId).balance).toFixed(2)} €
                </div>
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
