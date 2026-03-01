import { useState } from "react";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { useWindowManager } from "../../context/WindowManagerContext";
import { getAccountTotals } from "../../util/balanceCalculations";
import { toast } from "react-toastify";
import { hasAccess, useAppMode } from "../../context/AppModeContex";




export function ChartOfAccounts() {
    const { interactiveBalanceData, accountTotals, addNewAccount, assigendAccountIds } = useInteractiveBalanceData();
    const { openWindow, closeWindow } = useWindowManager();
    const { appMode } = useAppMode();

    const [newAccountId, setNewAccountId] = useState("")
    const [newAccountLabel, setNewAccountLabel] = useState("")

    const accounts = interactiveBalanceData.accounts;

    const handleAddAccount = () => {
        if (newAccountId.length <= 0 || newAccountLabel.length <= 0) {
            toast.error("Bitte Kontonummer und Beschreibung eingeben");
            return;
        }

        try {
            addNewAccount(newAccountId, newAccountLabel);

            openWindow({
                type: "Account",
                payload: {
                    id: newAccountId,
                    label: newAccountLabel
                }
            });

            setNewAccountId("");
            setNewAccountLabel("");
        } catch (error) {

        }
    }

    return (
        <div>
            <table className="w-full table-fixed">
                <thead>
                    <tr className="text-left">
                        <th className="w-1/12">Nr</th>
                        <th className="w-6/12">Bezeichnung</th>
                        <th className="w-2/12">&sum; Soll</th>
                        <th className="w-2/12">&sum; Haben</th>
                        {hasAccess(appMode, "edit") &&
                            <th className="w-1/12"></th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {accounts
                        .filter(a => assigendAccountIds.has(a.id))
                        .map(account => {
                            const accountTotal = getAccountTotals(accountTotals, account.id);
                            return (
                                //<tr key={account.id} className="cursor-pointer transition-all border duration-100 hover:scale-95"
                                <tr className="cursor-pointer border hover:bg-blue-50 transition-colors duration-100"
                                    onClick={() =>
                                        openWindow({
                                            type: "Account",
                                            payload: { id: account?.id, label: account?.label }
                                        })}>
                                    <td>{account.id}</td>
                                    <td>{account.label}</td>
                                    <td>{accountTotal.debit}</td>
                                    <td>{accountTotal.credit}</td>
                                    {hasAccess(appMode, "edit") &&
                                        <td className="px-1 py-0.5 text-center">
                                            <button
                                                className="px-2 py-0.5 rounded bg-red-100 hover:bg-red-200 text-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log("Remove account ", account.id);
                                                }}
                                            >
                                                -
                                            </button>
                                        </td>
                                    }
                                </tr>
                            )
                        })}
                    {hasAccess(appMode, "edit") &&
                        <tr className="border">
                            <td>
                                <input
                                    placeholder="Nr."
                                    className="border text-xs w-10/12"
                                    type="text"
                                    minLength={4}
                                    maxLength={4}
                                    value={newAccountId}
                                    onChange={(e) => setNewAccountId(e.target.value)} />
                            </td>
                            <td>
                                <input
                                    placeholder="Beschreibung"
                                    className="border text-xs w-10/12"
                                    type="text"
                                    value={newAccountLabel}
                                    onChange={(e) => setNewAccountLabel(e.target.value)} />
                            </td>
                            <td></td>
                            <td></td>
                            <td className="px-1 py-0.5 text-center">
                                <button
                                    className="px-2 py-0.5 rounded bg-green-100 hover:bg-green-200 text-sm"
                                    onClick={() => handleAddAccount()}
                                >
                                    +
                                </button>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}