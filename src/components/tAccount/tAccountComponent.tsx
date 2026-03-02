import { Booking, EntryLinesProps, TAccountProps } from "./tAccountInterfaces";
import { EntriesListComponent } from "./entryListComponent";
import React from "react";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { EntryLine } from "../../types/InteractiveBalanceData";
import { getAccountTotals } from "../../util/balanceCalculations";

const sumEntryLines = (lines: EntryLinesProps["lines"]) =>
    lines.reduce((sum, item) => sum + item.line.amount, 0);

export const TAccountComponent: React.FC<TAccountProps> = ({
    id,
    label
}) => {

    const { interactiveBalanceData, draftEntry, accountTotals: accountSaldos } = useInteractiveBalanceData();

    //const journalEntries = interactiveBalanceData.journalEntries;

    const journalEntries = draftEntry
        ? [
            ...(interactiveBalanceData.journalEntries ?? []),
            draftEntry,
        ]
        : interactiveBalanceData.journalEntries ?? [];

    const accountId = id;

    const lines: EntryLinesProps["lines"] = journalEntries
        ?.flatMap(entry => {

            const isDraft = entry === draftEntry;

            const matchingLine = entry.entryLines.find(line => line.accountId === accountId);

            if (matchingLine) return [{
                entryId: entry.id!,
                description: entry.description,
                line: matchingLine,
                draft: isDraft
            }];
            return [];
        }) ?? [];

    const debitLines = lines.filter(l => l.line.entryType === "debit");
    const creditLines = lines.filter(l => l.line.entryType === "credit");

    console.log("debitLines changed: ", debitLines);

    const accountTotals = getAccountTotals(accountSaldos, accountId);

    const sollSum = accountTotals.debit;
    const habenSum = accountTotals.credit;
    const sumDif = accountTotals.balance;
    return (
        <div>
            <div className="flex justify-between">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">Soll</h3>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">Haben</h3>
            </div>
            <div className="grid grid-cols-2 border-t-4 border-solid border-black">
                <div className="pr-1 border-r-2 border-solid border-black w-full pb-1">
                    <EntriesListComponent lines={debitLines} accountId={accountId} type="debit" />
                </div>
                <div className="pl-1 border-l-2 border-solid border-black w-full pb-1">
                    <EntriesListComponent lines={creditLines} accountId={accountId} type="credit" />
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