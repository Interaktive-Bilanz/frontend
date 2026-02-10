import BilanzItem, { calculatePositionSaldo } from "./BilanzItem";
import { BilanzProps } from "./BilanzInterfaces";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { useTeacherMode } from "../../context/TeacherModeContext";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useMemo, useState } from "react";
import { ValueScope } from "ajv/dist/compile/codegen";
import { useWindowManager } from "../../context/WindowManagerContext";
import { getAccountTotals } from "../../util/balanceCalculations";
import { getAssigendAccountIds } from "../../util/getAssignedAccountIds";
import { toast } from "react-toastify";

const BilanzColumn: React.FC<BilanzProps> = ({
  title,
  positions,
  accounts
}) => {
  let sum = 0;

  const { accountTotals, interactiveBalanceData, setInteractiveBalanceData, addAccountTo, removeAccountFrom } = useInteractiveBalanceData();
  const { teacherMode } = useTeacherMode();
  const { openWindow } = useWindowManager();

  const assigendAccountIds = useMemo(() => {
    return getAssigendAccountIds(interactiveBalanceData.balanceSheet);
  }, [interactiveBalanceData.balanceSheet]);

  const unassignedAccounts = useMemo(() => {
    return interactiveBalanceData.accounts.filter(a => !assigendAccountIds.has(a.id));
  }, [interactiveBalanceData.accounts, assigendAccountIds]);

  const [newAccountId, setNewAccountId] = useState(unassignedAccounts.length > 0 ? unassignedAccounts[0].id : "");

  useEffect(() => {
    if (unassignedAccounts.length > 0) {
      setNewAccountId(unassignedAccounts[0].id);
    } else {
      setNewAccountId("");
    }
  }, [unassignedAccounts]);

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
          <button className="bg-green-500 hover:bg-green-700 px-1 py-1 mt-1 mr-1 rounded" onClick={addPosition}>
            + Position
          </button>
          <div
            role="button"
            tabIndex={0}
            className="flex items-center bg-green-500 hover:bg-green-700 px-1 py-1 mt-1 mr-1 rounded gap-1"
            onClick={() => {
              if (newAccountId) {
                addAccountTo(title === "Aktiva" ? "assets" : "liabilitiesAndEquity", newAccountId);
              } else {
                toast.info("Bitte ein Konto auswählen.");
              }
            }}
          >
            <span>+ Konto</span>

            <select
              className="h-5 w-20 text-sm rounded"
              onClick={(e) => {
                if (unassignedAccounts.length === 0) toast.info("Kein verfügbares Konto. Bitte weitere Konten anlegen.");
                e.stopPropagation()
              }}
              onChange={(e) => {
                setNewAccountId(e.target.value);
              }}
            // disabled={unassignedAccounts.length === 0}
            >
              {unassignedAccounts.length > 0 ? unassignedAccounts.map((a) => (
                <option key={a.id} value={a.id}>{a.id} {a.label}</option>
              )
              ) : <option key={"noAccAvailable"} className="text-xs"></option>}
            </select>
          </div>

        </div>
      }

      {accounts?.map((accountId, i) => {
        const account = interactiveBalanceData.accounts.find(a => a.id === accountId)
        if (!account) return;
        return (<div className="flex">
          <button
            key={i}
            className="mt-1 bg-green-100 hover:bg-green-400 border border-gray-300 rounded px-2 py-1 w-full text-left"
            lang="de"
            onClick={() => openWindow({
              type: "Account",
              payload: { id: accountId, label: account.label }
            })}
          >
            <div className="flex justify-between items-center">
              <div
                lang="de"
                className="min-w-0 hyphens-auto break-words"
              >
                {accountId} {account?.label}
              </div>
              {teacherMode &&
                <button className="bg-transparent hover:bg-gray-100 mr-1 px-1 py-1 rounded" onClick={(e) => {
                  e.stopPropagation();
                  removeAccountFrom(title === "Aktiva" ? "assets" : "liabilitiesAndEquity", accountId);
                }}>&#x274C;</button>}
              <span className="text-nowrap whitespace-nowrap">
                {Math.abs(getAccountTotals(accountTotals, accountId).balance).toFixed(2)} €
              </span>
            </div>

          </button>
        </div>);
      })}

      {positions?.map((position, i) => (
        <BilanzItem key={i} position={position} />
      ))}
    </div>
  );
};

export default BilanzColumn;
