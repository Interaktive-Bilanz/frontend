import { hasAccess, useAppMode } from "../../context/AppModeContex";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { useWindowManager } from "../../context/WindowManagerContext";
import { formatCurrency } from "../../util/numberFormat";
import { sumLines } from "../../util/sumEntryLines";




export function Journal() {
    const { interactiveBalanceData } = useInteractiveBalanceData();
    const { openWindow } = useWindowManager();
    const { appMode } = useAppMode();

    const journalEntries = interactiveBalanceData.journalEntries;

    return (
        <div>
            <button
                className="h-8 xl:h-auto px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                onClick={() => openWindow({ type: "JournalEntry", payload: { isDraft: true } })}
            >
                Neue Buchung
            </button>
            <table className="w-full table-fixed">
                <thead>
                    <tr className="text-left">
                        <th className="w-1/12">ID</th>
                        <th className={hasAccess(appMode, "edit") ? "w-5/12" : "w-9/12"}>Beschreibung</th>
                        {hasAccess(appMode, "edit") && <th className="w-4/12">Buchungssatz</th>}
                        <th className="w-2/12 text-right">Betrag</th>
                    </tr>
                </thead>
                <tbody>
                    {journalEntries.map((entry) => {
                        const debitLines = entry.entryLines.filter(line => line.entryType === "debit");
                        const creditLines = entry.entryLines.filter(line => line.entryType === "credit");
                        const debitSum = sumLines(debitLines);
                        return (
                            <tr
                                className="h-8 xl:h-auto cursor-pointer border hover:bg-blue-50 transition-colors duration-100"
                                onClick={() => openWindow({ type: "JournalEntry", payload: { isDraft: false, id: entry.id } })}>
                                <td>{entry.id}</td>
                                <td className="align-top">{entry.description}</td>
                                {hasAccess(appMode, "edit") &&
                                    <td>
                                        <div className="text-xs font-mono">
                                            {/* Soll side - no indent */}
                                            {debitLines.map(line => (
                                                <div key={line.accountId}>
                                                    {line.accountId} {formatCurrency(line.amount)}
                                                </div>
                                            ))}

                                            {/* "an" + Haben side - indented as a group */}
                                            <div className="pl-2 mt-1">
                                                <div className="flex">
                                                    <span className="italic w-5 text-gray-400">an</span>
                                                    <span>{creditLines[0].accountId} {formatCurrency(creditLines[0].amount)}</span>
                                                </div>
                                            </div>
                                            {creditLines.slice(1).map(line => (
                                                <div key={line.accountId} className="pl-7">
                                                    {line.accountId} {formatCurrency(line.amount)}
                                                </div>
                                            ))}
                                        </div>

                                        {/* {debitLines.map((dl, i) => {
                                            if (i === debitLines.length - 1) return dl.accountId + " " + formatCurrency(dl.amount) + " "
                                            return dl.accountId + " " + formatCurrency(dl.amount) + <br></br>
                                        })}<br></br> {"     an "}
                                        {creditLines.map((cl, i) => {
                                            if (i === creditLines.length - 1) return cl.accountId + " " + formatCurrency(cl.amount) + " "
                                            return cl.accountId + " " + formatCurrency(cl.amount) + ", "
                                        })} */}
                                    </td>}
                                <td className="text-right pr-1">{formatCurrency(debitSum)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )

}