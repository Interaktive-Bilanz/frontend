import { BalanceSheet, Position } from "../types/InteractiveBalanceData";


export const getAssigendAccountIds = (balanceSheet: BalanceSheet): Set<string> => {
    const assigned = new Set<string>();

    const collectFromPositions = (position: Position) => {
        position.accounts.forEach(a => assigned.add(a));
        position.positions.forEach(collectFromPositions);
    };

    balanceSheet.assets.accounts?.forEach(a => assigned.add(a));
    balanceSheet.liabilitiesAndEquity.accounts?.forEach(a => assigned.add(a));

    balanceSheet.assets.positions?.forEach(collectFromPositions);
    balanceSheet.liabilitiesAndEquity.positions?.forEach(collectFromPositions);

    return assigned;
}