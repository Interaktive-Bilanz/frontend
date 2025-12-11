import React, { useState } from "react";
import { JournalEntryProps } from "./JournalEntryForm.types";
import { JournalEntry } from "../../types/InteractiveBalanceData";
import { InteractiveBalanceData } from "../../types/InteractiveBalanceData";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";


export function JournalEntryForm({ entryId, onClose }: JournalEntryProps) {

    const { interactiveBalanceData } = useInteractiveBalanceData();

    console.log(entryId);

    const entry = interactiveBalanceData.journalEntries?.find(e => e.id === entryId);

    if (!entry) return <div>Entry not found</div>;

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
                            {entry.entryLines?.filter(e => e.entryType === "debit").map((e) => (
                                <tr>
                                    <td className="px-1 py-0.5">{e.accountId}</td>
                                    <td className="px-1 py-0.5">{e.amount}</td>
                                    <td className="px-1 py-0.5 text-center">
                                        <button className="px-1 py-0.5 rounded bg-red-100 hover:bg-red-200 text-xs">-</button>
                                    </td>
                                </tr>
                            ))}
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
                            {entry.entryLines?.filter(e => e.entryType === "credit").map((e) => (
                                <tr>
                                    <td className="px-1 py-0.5">{e.accountId}</td>
                                    <td className="px-1 py-0.5">{e.amount}</td>
                                    <td className="px-1 py-0.5 text-center">
                                        <button className="px-1 py-0.5 rounded bg-red-100 hover:bg-red-200 text-xs">-</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Betrag & Actions */}
            <div className="flex items-center gap-2 mt-2 text-sm">
                <div className="ml-auto font-semibold">Betrag</div>
                <input
                    className="border rounded px-1 py-0.5 text-xs w-20"
                    placeholder="Betrag"
                />
            </div>

            <div className="flex justify-end space-x-2 mt-2">
                <button className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-xs">Abbrechen</button>
                <button className="px-2 py-1 border rounded bg-yellow-200 hover:bg-yellow-300 text-xs font-semibold">Buchen!</button>
            </div>
        </div>
    );
}