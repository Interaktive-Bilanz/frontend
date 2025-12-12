import { Booking, EntryLinesProps, TAccountProps } from "./tAccountInterfaces";
import { BookingsListComponent } from "./entryListComponent";
import React from "react";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { EntryLine } from "../../types/InteractiveBalanceData";

const sumBookings = (lines: EntryLinesProps["lines"]) =>
    lines.reduce((sum, item) => sum + item.line.amount, 0);

export const TAccountComponent: React.FC<TAccountProps> = ({
    account,
}) => {

    const { interactiveBalanceData, draftEntry } = useInteractiveBalanceData();

    const journalEntries = interactiveBalanceData.journalEntries;

    const accountId = account.id;

    // const lines: EntryLinesProps["lines"] = journalEntries
    //     ?.flatMap(entry =>
    //         entry.entryLines
    //             ?.filter(line => line.accountId === accountId)
    //             .map(line => entry.id !== undefined ? { entryId: entry.id, line } : null)
    //     )
    //     .filter((x): x is { entryId: number; line: EntryLine } => x !== null) ?? [];

    // const mergedWithDraftlines = lines.map(line =>
    //     line.entryId === draftEntry?.id ? (() => {
    //         const foundLine = draftEntry.entryLines.find(el => el.accountId === accountId);
    //         if ( foundLine ) line.line = foundLine;
    //         return line;
    //     })() : line
    // )

    const lines: EntryLinesProps["lines"] = journalEntries
        ?.flatMap(entry => {
            if (!entry.entryLines) return [];

            // Only consider the line for this account
            const originalLine = entry.entryLines.find(line => line.accountId === accountId);

            // If there's a draft for this entry
            if (draftEntry?.id === entry.id) {
                const draftLine = draftEntry.entryLines?.find(dl => dl.accountId === accountId);
                // If draft line exists, render it
                if (draftLine) {
                    return [{ entryId: draftEntry.id!, line: draftLine }];
                }
                // If draftLine is undefined, the line was deleted => don't render
                return [];
            }

            // If no draft exists for this entry, render the original line
            if (originalLine) return [{ entryId: entry.id!, line: originalLine }];
            return [];
        }) ?? [];

    const debitLines = lines.filter(l => l.line.entryType === "debit");
    const creditLines = lines.filter(l => l.line.entryType === "credit");

    const sollSum = sumBookings(debitLines);
    const habenSum = sumBookings(creditLines)
    const sumDif = sollSum - habenSum;
    return (
        <div>
            <div className="flex justify-between">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">Soll</h3>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">Haben</h3>
            </div>
            <div className="grid grid-cols-2 border-t-4 border-solid border-black">
                <div className="pr-1 border-r-2 border-solid border-black w-full pb-1">
                    <BookingsListComponent lines={debitLines} />
                </div>
                <div className="pl-1 border-l-2 border-solid border-black w-full pb-1">
                    <BookingsListComponent lines={creditLines} />
                </div>
            </div>
            <div className="grid grid-cols-2 border-t-2 border-solid border-gray-300 -mt-1">
                <div className=" p-1 border-r-2 border-solid border-black">
                    <div className="flex justify-between items-center">
                        <div className="inline-flex items-center gap-1">
                            <span className="text-lg">Summe</span>
                            <span className="text-lg font-normal font-mono">∑</span>
                        </div>
                        <div className="text-lg">{sollSum.toFixed(2)} €</div>
                    </div>
                    {sumDif <= 0 && (
                        <div className="flex justify-between">
                            <div className="text-lg">Saldo</div>
                            <div className="text-lg">{(-1 * sumDif).toFixed(2)} €</div>
                        </div>
                    )}
                </div>
                <div className=" p-1 border-l-2 boder-solid border-black">
                    <div className="flex justify-between items-center">
                        <div className="inline-flex items-center gap-1">
                            <span className="text-lg">Summe</span>
                            <span className="text-lg font-normal font-mono">∑</span>
                        </div>
                        <div className="text-lg">{habenSum.toFixed(2)} €</div>
                    </div>
                    {sumDif > 0 && (
                        <div className="flex justify-between">
                            <div className="text-lg">Saldo</div>
                            <div className="text-lg">{sumDif.toFixed(2)} €</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}