import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { useWindowManager } from "../../context/WindowManagerContext";
import { sumLines } from "../../util/sumEntryLines";




export function Journal() {
    const { interactiveBalanceData } = useInteractiveBalanceData();
    const { openWindow } = useWindowManager();

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
                        <th className="w-8/12">Beschreibung</th>
                        <th className="w-3/12 text-right">Buchungsbetrag</th>
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
                                <td>{entry.description}</td>
                                <td className="text-right pr-1">{debitSum.toFixed(2)} €</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )

}