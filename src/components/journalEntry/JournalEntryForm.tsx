import React, { useEffect, useRef, useState } from "react";
import { JournalEntryProps } from "./JournalEntryForm.types";
import { EntryLine, JournalEntry } from "../../types/InteractiveBalanceData";
import { InteractiveBalanceData } from "../../types/InteractiveBalanceData";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { useWindowManager } from "../../context/WindowManagerContext";
import { toast } from "react-toastify";

const sumLines = (lines: EntryLine[]) =>
    lines.reduce((sum, item) => sum + item.amount, 0);


export function JournalEntryForm({ entryId, isDraft = false }: JournalEntryProps) {

    const { interactiveBalanceData, draftEntry, setDraftEntry, cancelDraft, commitDraft } = useInteractiveBalanceData();
    const { openWindow, closeWindow } = useWindowManager();
    const [selectedDebitAccount, setSelectedDebitAccount] = useState("");
    const [selectedCreditAccount, setSelectedCreditAccount] = useState("");
    const [newDebitLineAmount, setNewDebitLineAmount] = useState("");
    const [newCreditLineAmount, setNewCreditLineAmount] = useState("");
    const debitAmountAsNumber = Number(newDebitLineAmount);
    const creditAmountAsNumber = Number(newCreditLineAmount);


    const originalEntry = interactiveBalanceData.journalEntries?.find(e => e.id === entryId) ?? null;

    useEffect(() => {

        console.log("effect runnung...");
        console.log("isDraft: ", isDraft);

        if (!isDraft) return;

        if (draftEntry) return;

        const highestId = (interactiveBalanceData.journalEntries ?? []).reduce(
            (max, entry) => Math.max(max, entry.id),
            0
        );
        const newId = highestId + 1;

        setDraftEntry({
            id: newId,
            description: "",
            entryLines: []
        });
    }, [isDraft, draftEntry, interactiveBalanceData.journalEntries, setDraftEntry])


    //if (isDraft && !draftEntry) return <div>Loading draft...</div>;

    if (isDraft) {
        if (!draftEntry) return <div>Loading draft...</div>;
    } else {
        if (!originalEntry) return <div>Loading entry...</div>;
    }

    const currentEntry = isDraft ? draftEntry! : originalEntry!;

    const removeLine = (accountId: string) => {
        const account = interactiveBalanceData.accounts.find(a => a.id === accountId);

        if (!draftEntry?.entryLines) return;
        setDraftEntry({
            ...draftEntry,
            entryLines: draftEntry.entryLines.filter(l => l.accountId !== accountId)
        });

        closeWindow({
            type: "Account",
            payload: { id: account?.id, label: account?.label }
        });
    };

    const addLine = (accountId: string, amount: number, entryType: "credit" | "debit") => {
        if (!draftEntry) return;

        const account = interactiveBalanceData.accounts.find(a => a.id === accountId);

        if (!account || amount <= 0) return;

        if (Number.isNaN(amount)) {
            toast.error("Bitte einen gültigen Betrag eingeben.");
            return;
        }

        setDraftEntry(prev => ({
            ...prev!,
            entryLines: [...(prev!.entryLines ?? []), {
                accountId: accountId,
                amount: amount,
                entryType: entryType
            }]
        }
        ));

        openWindow({
            type: "Account",
            payload: {
                id: account?.id,
                label: account?.label
            }
        });

        switch (entryType) {
            case "credit":
                setSelectedCreditAccount("");
                setNewCreditLineAmount("");
                break;
            case "debit":
                setSelectedDebitAccount("");
                setNewDebitLineAmount("");
                break;
        }
    }

    const handelCancel = () => {
        cancelDraft();

        closeWindow({
            type: "JournalEntry",
            payload: {
                id: "Neue Buchung"
            }
        });
        // if (originalEntry) {
        //     setDraftEntry({
        //         ...originalEntry,
        //         entryLines: [...originalEntry.entryLines]
        //     });
        // };
    };

    const handleCommit = () => {
        if (!draftEntry) return;

        if (balance !== 0) {
            toast.error("Ungültige Buchung. Saldo muss 0,00 betragen.");
            return;
        } else if (draftEntry?.entryLines.length === 0) {
            toast.error("Ungültige Buchung. Keine Buchungszeilen eingetrage.");
            return;
        } else if (draftEntry?.description.length === 0) {
            toast.error("Ungültige Buchung. Keine Buchungssatz eingetragen.");
            return;
        }

        commitDraft();

        closeWindow({
            type: "JournalEntry",
            payload: {
                id: "Neue Buchung"
            }
        });

        openWindow({
            type: "JournalEntry",
            payload: {
                id: draftEntry.id
            }
        })
        // if (!draftEntry.entryLines || draftEntry.entryLines.length === 0) {
        //     closeWindow({
        //         type: "JournalEntry",
        //         payload: { id: draftEntry.id }
        //     });
        // }
    }

    const debitLines = currentEntry.entryLines.filter(l => l.entryType === "debit");
    const debitSum = sumLines(debitLines);
    const creditLines = currentEntry.entryLines.filter(l => l.entryType === "credit");
    const creditSum = sumLines(creditLines);
    const balance = debitSum - creditSum;

    const usedAccountIds = new Set(
        draftEntry?.entryLines?.map(l => l.accountId) ?? []
    );

    return (
        <div className="max-w-2xl mx-auto my-2 rounded bg-white text-sm">
            {isDraft &&
                <textarea placeholder="Bitte Geschäftsvorfall eintragen"
                    name="description"
                    className="border w-full min-h-12"
                    value={currentEntry?.description ?? ""}
                    onChange={e =>
                        setDraftEntry(prev =>
                            prev
                                ? { ...prev, description: e.target.value }
                                : prev)} />
            }
            {!isDraft &&
                <span className="text-lg">{currentEntry.description}</span>
            }
            <div className="flex gap-4 pt-4">
                {/* Soll-Konten Table */}
                <div className="flex-1">
                    <div className="flex items-center mb-1">
                        <span className="font-semibold bg-yellow-100 rounded px-1 py-0.5">Soll</span>
                        {/* <button className="ml-1 px-1 py-0.5 rounded border bg-gray-100 text-xs">+ Soll</button> */}
                    </div>
                    <table className="w-full table-fixed border divide-y text-xs">
                        <thead className="bg-yellow-50">
                            <tr>
                                <th className="w-[50%] px-1 py-0.5 text-left">Konto</th>
                                <th className="w-[35%] px-1 py-0.5 text-left">Betrag</th>
                                <th className="w-[15%]" />
                            </tr>
                        </thead>
                        <tbody>
                            {debitLines.map((debitLine, i) => {
                                const account = interactiveBalanceData.accounts.find(a => a.id === debitLine.accountId);
                                return (
                                    <tr key={i} className="cursor-pointer transition-all border duration-100 hover:scale-95"
                                        onClick={() =>
                                            openWindow({
                                                type: "Account",
                                                payload: { id: account?.id, label: account?.label }
                                            })}>
                                        <td className="px-1 py-0.5">{debitLine.accountId} {account?.label}</td>
                                        <td className="px-1 py-0.5">{debitLine.amount} €</td>
                                        {isDraft &&
                                            <td className="px-1 py-0.5 text-center">
                                                <button className="px-2 py-0.5 rounded bg-red-100 hover:bg-red-200 text-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeLine(debitLine.accountId);
                                                    }}>-</button>
                                            </td>
                                        }
                                    </tr>
                                );
                            })}
                            {isDraft &&
                                <tr>
                                    <td className="px-1 py-0.5">
                                        <select
                                            className="w-full text-xs"
                                            value={selectedDebitAccount}
                                            onChange={e => setSelectedDebitAccount(e.target.value)}
                                        >
                                            <option value="">Konto auswählen</option>
                                            {interactiveBalanceData.accounts
                                                .filter(a => !usedAccountIds.has(a.id))
                                                .map(a => (
                                                    <option key={a.id} value={a.id}>
                                                        {a.id} {a.label}
                                                    </option>
                                                ))}
                                        </select>
                                    </td>

                                    <td className="px-1 py-0.5">
                                        <input
                                            className="w-full border text-xs"
                                            type="text"
                                            value={newDebitLineAmount}
                                            onChange={e => setNewDebitLineAmount(e.target.value)}
                                        />
                                    </td>

                                    <td className="px-1 py-0.5 text-center">
                                        <button
                                            className="px-2 py-0.5 rounded bg-green-100 hover:bg-green-200 text-sm"
                                            onClick={() => addLine(selectedDebitAccount, debitAmountAsNumber, "debit")}
                                        >
                                            +
                                        </button>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>

                {/* Haben-Konten Table */}
                <div className="flex-1">
                    <div className="flex items-center mb-1">
                        <span className="font-semibold bg-yellow-100 rounded px-1 py-0.5">Haben</span>
                        {/* <button className="ml-1 px-1 py-0.5 rounded border bg-gray-100 text-xs">+ Haben</button> */}
                    </div>
                    <table className="w-full table-fixed border divide-y text-xs">
                        <thead className="bg-yellow-50">
                            <tr>
                                <th className="w-[50%] px-1 py-0.5 text-left">Konto</th>
                                <th className="w-[35%] px-1 py-0.5 text-left">Betrag</th>
                                <th className="w-[15%]" />
                            </tr>
                        </thead>
                        <tbody>
                            {creditLines.map((creditLine, i) => {
                                const account = interactiveBalanceData.accounts.find(a => a.id === creditLine.accountId);
                                return (
                                    <tr key={`entryLine-${i}`} className="cursor-pointer border transition-all duration-100 hover:scale-95"
                                        onClick={() =>
                                            openWindow({
                                                type: "Account", payload: { id: account?.id, label: account?.label }
                                            })
                                        }>
                                        <td className="px-1 py-0.5">{creditLine.accountId} {account?.label}</td>
                                        <td className="px-1 py-0.5">{creditLine.amount} €</td>
                                        {isDraft &&
                                            <td className="px-1 py-0.5 text-center">
                                                <button className="px-2 py-0.5 rounded bg-red-100 hover:bg-red-200 text-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeLine(creditLine.accountId);
                                                    }}>-</button>
                                            </td>
                                        }
                                    </tr>
                                );
                            })}
                            {isDraft &&
                                <tr>
                                    <td className="px-1 py-0.5">
                                        <select
                                            className="w-full text-xs"
                                            value={selectedCreditAccount}
                                            onChange={e => setSelectedCreditAccount(e.target.value)}
                                        >
                                            <option value="">Konto auswählen</option>
                                            {interactiveBalanceData.accounts
                                                .filter(a => !usedAccountIds.has(a.id))
                                                .map(a => (
                                                    <option key={a.id} value={a.id}>
                                                        {a.id} {a.label}
                                                    </option>
                                                ))}
                                        </select>
                                    </td>

                                    <td className="px-1 py-0.5">
                                        <input
                                            className="w-full border text-xs"
                                            type="text"
                                            value={newCreditLineAmount}
                                            onChange={e => setNewCreditLineAmount(e.target.value)}
                                        />
                                    </td>

                                    <td className="px-1 py-0.5 text-center">
                                        <button
                                            className="px-2 py-0.5 rounded bg-green-100 hover:bg-green-200 text-sm"
                                            onClick={() => addLine(selectedCreditAccount, creditAmountAsNumber, "credit")}
                                        >
                                            +
                                        </button>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-between grid-cols-2 text-lg mt-2">
                <div className={`text-lg font-semibold ${balance !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                    Sollsumme {debitSum.toFixed(2)} €
                </div>
                <div className={`text-lg font-semibold ${balance !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                    Habensumme {creditSum.toFixed(2)} €
                </div>
            </div>

            <div className="flex justify-center  text-lg mt-2">
                <div className={`text-lg font-semibold ${balance !== 0 ? 'text-red-600' : 'text-green-600'}`}>Saldo: {(balance).toFixed(2)} €</div>
            </div>

            {/* Betrag & Actions */}
            {isDraft &&
                <div className="flex justify-end space-x-2 mt-2">
                    <button className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-xs"
                        onClick={() => handelCancel()}>Abbrechen</button>
                    <button className={`px-2 py-1 border rounded ${balance === 0 && draftEntry?.entryLines.length != 0 && draftEntry?.description.length != 0 ? 'bg-yellow-200 hover:bg-yellow-300' : 'bg-gray-400 '} text-xs font-semibold`} onClick={() => handleCommit()}>Buchen!</button>
                </div>
            }
        </div >
    );
}