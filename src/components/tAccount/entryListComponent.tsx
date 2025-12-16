import React, { useState } from "react";
import { BookingsListProps, EntryLinesProps } from "./tAccountInterfaces";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";

export const BookingsListComponent: React.FC<EntryLinesProps> = ({
    accountId,
    lines,
    type
}) => {

    const { openWindow } = useWindowManager();
    const { setDraftEntry, draftEntry, interactiveBalanceData } = useInteractiveBalanceData();
    const [newEntryLineAmount, setNewEntryLineAmount] = useState("");
    const amountAsNumber = Number(newEntryLineAmount);

    const addLine = (amount: number) => {

        if (amount <= 0) return;
        
        if (!draftEntry) {
            const highestId = (interactiveBalanceData.journalEntries ?? []).reduce(
                (max, entry) => Math.max(max, entry.id),
                0
            );
            const newId = highestId + 1;

            setDraftEntry({
                id: newId,
                description: "",
                entryLines: [{
                    accountId: accountId,
                    amount: amount,
                    entryType: type
                }],
            });
        } else {
            setDraftEntry(prev => ({
                ...prev!,
                entryLines: [...(prev!.entryLines ?? []), {
                    accountId: accountId,
                    amount: amount,
                    entryType: type
                }]
            }
            ));
        };

        setNewEntryLineAmount("");

        openWindow({
            type: "JournalEntry",
            payload: {
                isDraft: true,
            }
        })
    }

    const removeLine = () => {
        if (!draftEntry?.entryLines) return;

        setDraftEntry({
            ...draftEntry,
            entryLines: draftEntry.entryLines.filter(l => l.accountId !== accountId)
        });

        openWindow({
            type: "JournalEntry",
            payload: {
                isDraft: true,
            }
        })

    }

    console.log("lines changes: ", lines);

    return (
        <table className="w-full table-fixed border-collapse">
            <thead>
                <tr className="text-left border-b border-solid">
                    <th className="border-r w-[12%] px-1 border-solid">ID</th>
                    <th className="w-[45%] px-1">Beschreibung</th>
                    <th className="border-l w-[33%] px-1 border-solid">Betrag</th>
                    <th className="w-[10%]"></th>
                </tr>
            </thead>
            <tbody>
                {lines.map((l, index) => (
                    <tr
                        className="cursor-pointer align-top border-t boder-solid transition-all duration-100 hover:scale-95"
                        key={index}
                        onClick={() => openWindow({ type: "JournalEntry", payload: { isDraft: l.draft, id: l.draft ? "Neue Buchung" : l.entryId } })}
                    >
                        <td className="whitespace-nowrap border-r border-solid">{l.draft ? "Neu" : l.entryId}</td>
                        <td className="text-xs break-words">{l.description}</td>
                        <td className="whitespace-nowrap text-right border-l border-solid">{l.line.amount.toFixed(2)} €</td>
                        <td>
                            {l.draft &&
                                <button className="px-2 py-0.5 rounded bg-red-100 hover:bg-red-200 text-sm"
                                    onClick={() => removeLine()}>-</button>
                            }
                        </td>
                    </tr>
                ))}
                {!draftEntry?.entryLines.some(l => l.accountId === accountId) &&
                    <tr className="align-top border-t boder-solid">
                        <td className="px-1 py-0.5 whitespace-nowrap border-r border-solid">Neu</td>
                        <td></td>
                        <td className="px-1 py-0.5 whitespace-nowrap text-right border-l border-solid">
                            <input type="text"
                                className="w-full text-xs"
                                value={newEntryLineAmount}
                                onChange={e => setNewEntryLineAmount(e.target.value)} />
                        </td>
                        <td>
                            <button
                                className="px-2 py-0.5 rounded bg-green-100 hover:bg-green-200 text-sm"
                                onClick={() => addLine(amountAsNumber)}
                            >+</button>
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    )
}