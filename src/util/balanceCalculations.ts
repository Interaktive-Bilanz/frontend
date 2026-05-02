import { JournalEntry } from "../types/InteractiveBalanceData";


export type AccountTotal = {
    debit: number;
    credit: number;
    balance: number; //debit-credit
};

export const ZERO_SALDO: AccountTotal = {
    debit: 0,
    credit: 0,
    balance: 0,
}


export function calculateAccountTotals(journalEntries: JournalEntry[]): Record<string, AccountTotal> {
    const result: Record<string, AccountTotal> = {};

    for (const entry of journalEntries) {
        for (const line of entry.entryLines ?? []) {
            const acc = result[line.accountId] ?? { ...ZERO_SALDO };

            if (line.entryType === "debit") {
                acc.debit += line.amount;
            } else {
                acc.credit += line.amount;
            }

            acc.debit = Math.round(acc.debit * 100) / 100;
            acc.credit = Math.round(acc.credit * 100) / 100;
            acc.balance = Math.round((acc.debit - acc.credit) * 100) / 100;
            result[line.accountId] = acc;
        }
    }

    return result;
}


export function getAccountTotals(
    accountTotals: Record<string, AccountTotal>,
    accountId: string
): AccountTotal {
    return accountTotals[accountId] ?? ZERO_SALDO;
}
