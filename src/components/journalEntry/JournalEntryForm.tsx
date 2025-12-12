import React, { useEffect, useRef, useState } from "react";
import { JournalEntryProps } from "./JournalEntryForm.types";
import { EntryLine, JournalEntry } from "../../types/InteractiveBalanceData";
import { InteractiveBalanceData } from "../../types/InteractiveBalanceData";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { useWindowManager } from "../../context/WindowManagerContext";

const sumLines = (lines: EntryLine[]) =>
    lines.reduce((sum, item) => sum + item.amount, 0);


export function JournalEntryForm({ entryId, onClose }: JournalEntryProps) {

    const { interactiveBalanceData, draftEntry, setDraftEntry, cancelDraft, commitDraft } = useInteractiveBalanceData();
    const { openWindow, closeWindow } = useWindowManager();

    const originalEntry = interactiveBalanceData.journalEntries?.find(e => e.id === entryId) ?? null;

    const initializedRef = useRef(false);
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        if (originalEntry) {
            // create an independent copy so editing the draft won't mutate global state
            setDraftEntry({
                ...originalEntry,
                entryLines: originalEntry.entryLines ? [...originalEntry.entryLines] : []
            } as JournalEntry);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentEntry: JournalEntry | null = draftEntry ?? originalEntry;

    useEffect(() => {
        console.log("Draft updated:", draftEntry);
    }, [draftEntry]);

    const removeLine = (accountId: number) => {
        if (!draftEntry?.entryLines) return;
        setDraftEntry({
            ...draftEntry,
            entryLines: draftEntry.entryLines.filter(l => l.accountId !== accountId)
        });
    };

    const handelCancel = () => {
        cancelDraft();

        if (originalEntry) {
            setDraftEntry({
                ...originalEntry,
                entryLines: [...originalEntry.entryLines]
            });
        }
    };

    const handleCommit = () => {
        if (!draftEntry) return;

        commitDraft();

        console.log(draftEntry);

        console.log(draftEntry.entryLines);

        if (!draftEntry.entryLines || draftEntry.entryLines.length === 0) {
            closeWindow({
                type: "JournalEntry",
                payload: { id: draftEntry.id }
            });
        }
    }

    if (!currentEntry) return <div>Entry not found</div>;

    const debitLines = currentEntry.entryLines.filter(l => l.entryType === "debit");
    const debitSum = sumLines(debitLines);
    const creditLines = currentEntry.entryLines.filter(l => l.entryType === "credit");
    const creditSum = sumLines(creditLines);
    const balance = debitSum - creditSum;

    return (
        <div className="max-w-2xl mx-auto my-2 rounded bg-white text-sm">
            <div className="flex gap-4">
                {/* Soll-Konten Table */}
                <div className="flex-1">
                    <div className="flex items-center mb-1">
                        <span className="font-semibold bg-yellow-100 rounded px-1 py-0.5">Soll</span>
                        <button className="ml-1 px-1 py-0.5 rounded border bg-gray-100 text-xs">+ Soll</button>
                    </div>
                    <table className="w-full border divide-y text-xs">
                        <thead className="bg-yellow-50">
                            <tr>
                                <th className="px-1 py-0.5 text-left">Konto</th>
                                <th className="px-1 py-0.5 text-left">Betrag</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {debitLines.map((e, i) => {
                                const account = interactiveBalanceData.accounts.find(a => a.id === e.accountId);
                                return (
                                    <tr className="cursor-pointer transition-all duration-100 hover:scale-95"
                                        onClick={() => openWindow({
                                            type: "Account", payload: { id: account?.id, label: account?.label }
                                        })}>
                                        <td className="px-1 py-0.5">{e.accountId} {account?.label}</td>
                                        <td className="px-1 py-0.5">{e.amount}</td>
                                        <td className="px-1 py-0.5 text-center">
                                            <button className="px-1 py-0.5 rounded bg-red-100 hover:bg-red-200 text-xs"
                                                onClick={() => removeLine(e.accountId)}>-</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Haben-Konten Table */}
                <div className="flex-1">
                    <div className="flex items-center mb-1">
                        <span className="font-semibold bg-yellow-100 rounded px-1 py-0.5">Haben</span>
                        <button className="ml-1 px-1 py-0.5 rounded border bg-gray-100 text-xs">+ Haben</button>
                    </div>
                    <table className="w-full border divide-y text-xs">
                        <thead className="bg-yellow-50">
                            <tr>
                                <th className="px-1 py-0.5 text-left">Konto</th>
                                <th className="px-1 py-0.5 text-left">Betrag</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {creditLines.map((e, i) => {
                                const account = interactiveBalanceData.accounts.find(a => a.id === e.accountId);
                                return (
                                    <tr className="cursor-pointer transition-all duration-100 hover:scale-95"
                                        onClick={() => openWindow({
                                            type: "Account", payload: { id: account?.id, label: account?.label }
                                        })}>
                                        <td className="px-1 py-0.5">{e.accountId} {account?.label}</td>
                                        <td className="px-1 py-0.5">{e.amount}</td>
                                        <td className="px-1 py-0.5 text-center">
                                            <button className="px-1 py-0.5 rounded bg-red-100 hover:bg-red-200 text-xs"
                                                onClick={(event) => {
                                                    //event.stopPropagation()
                                                    removeLine(e.accountId);
                                                }}>-</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-between grid-cols-2 text-lg mt-2">
                <div className={`text-lg font-semibold ${balance !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                    Sollsumme: {debitSum.toFixed(2)} €
                </div>
                <div className={`text-lg font-semibold ${balance !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                    Habensumme: {creditSum.toFixed(2)} €
                </div>
            </div>

            <div className="flex justify-center  text-lg mt-2">
                <div className={`text-lg font-semibold ${balance !== 0 ? 'text-red-600' : 'text-green-600'}`}>Saldo: {(balance).toFixed(2)} €</div>
            </div>

            {/* Betrag & Actions */}
            <div className="flex justify-end space-x-2 mt-2">
                <button className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-xs"
                    onClick={() => handelCancel()}>Abbrechen</button>
                <button className={`px-2 py-1 border rounded ${balance === 0 ? 'bg-yellow-200 hover:bg-yellow-300' : 'bg-gray-400 cursor-not-allowed'} text-xs font-semibold`} disabled={balance !== 0} onClick={() => handleCommit()}>Buchen!</button>
            </div>
        </div >
    );
}