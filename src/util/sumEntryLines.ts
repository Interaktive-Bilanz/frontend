import { EntryLine } from "../types/InteractiveBalanceData";



export function sumLines (lines: EntryLine[]) : number {
    return lines.reduce((sum, item) => sum + item.amount, 0);
}