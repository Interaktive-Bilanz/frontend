import BilanzItem, { calculatePositionSaldo } from "./BilanzItem";
import { BilanzProps } from "./BilanzInterfaces";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { useTeacherMode } from "../../context/TeacherModeContext";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { ValueScope } from "ajv/dist/compile/codegen";
import { useWindowManager } from "../../context/WindowManagerContext";
import { getAccountTotals } from "../../util/balanceCalculations";

const BilanzColumn: React.FC<BilanzProps> = ({
  title,
  positions,
  accounts
}) => {
  let sum = 0;

  const { accountTotals, interactiveBalanceData, setInteractiveBalanceData, addNewAccountTo } = useInteractiveBalanceData();
  const { teacherMode } = useTeacherMode();
  const [newAccountId, setNewAccountId] = useState("")
  const { openWindow } = useWindowManager();

  for (const position of positions ?? []) {
    sum += calculatePositionSaldo(position, accountTotals) ?? 0;
  }

  const addPosition = () => {
    const isAssets = title === "Aktiva";

    const newPosition = {
      label: "Neue Position",
      accounts: [],
      positions: [],
      id: uuidv4()
    };

    setInteractiveBalanceData(prev => {
      const targetKey = isAssets ? 'assets' : 'liabilitiesAndEquity';

      return {
        ...prev,
        balanceSheet: {
          ...prev.balanceSheet,
          [targetKey]: {
            ...prev.balanceSheet[targetKey],
            positions: [
              ...prev.balanceSheet[targetKey].positions ?? [],
              newPosition
            ]
          }
        }
      }
    })
  }

  //const addAccount

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {teacherMode &&
        <div className="flex">
          <button className="bg-green-500 hover:bg-green-700 px-1 py-1 mr-1 rounded mt" onClick={addPosition}>
            + Position
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 px-1 py-1 mr-1 rounded"
            onClick={() => addNewAccountTo(title === "Aktiva" ? "assets" : "liabilitiesAndEquity", newAccountId)}>
            <div className="flex items-center">
              + Konto
              <input
                value={newAccountId}
                type="text"
                size={4}
                maxLength={4}
                placeholder="1234"
                pattern="[0-9]{4}"
                className="ml-1 h-5 px-1 text-sm border border-gray-300 rounded box-border text-center"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  const value = e.target.value.replace('/[^0-9]/g', '');
                  if (value.length <= 4) setNewAccountId(value);
                }}
              />
            </div>
          </button>

        </div>
      }

      {accounts?.map((accountId, i) => {
        const account = interactiveBalanceData.accounts.find(a => a.id === accountId)
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
            </div>

            <span className="text-nowrap whitespace-nowrap">
              {Math.abs(getAccountTotals(accountTotals, accountId).balance).toFixed(2)} €
            </span>
          </div>

        </button>);
      })}

      {positions?.map((position, i) => (
        <BilanzItem key={i} position={position} />
      ))}
    </div>
  );
};

export default BilanzColumn;
