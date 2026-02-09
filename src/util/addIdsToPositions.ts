import { InteractiveBalanceData, Position } from "../types/InteractiveBalanceData";
import { v4 as uuidv4 } from "uuid";

const usedIds : string[] = [];

function addIdToPosition(position: Position, usedIds: Set<string>): Position {
    if (usedIds.has(String(position.id)) || position.id == undefined) {
        position.id = undefined;
    } else {
        usedIds.add(String(position.id));
    }

    return {
        ...position,
        id: position.id !== undefined ? position.id : uuidv4(),
        positions: position.positions.map(p => addIdToPosition(p, usedIds)) 
    };
}

export function ensurePositionIds(data: InteractiveBalanceData): InteractiveBalanceData {
    const usedIds = new Set<string>();

    return {
        ...data,
        balanceSheet: {
            ...data.balanceSheet,
            assets: {
                ...data.balanceSheet.assets,
                positions: data.balanceSheet.assets.positions?.map(p => addIdToPosition(p, usedIds))
            },
            liabilitiesAndEquity: {
                ...data.balanceSheet.liabilitiesAndEquity,
                positions: data.balanceSheet.liabilitiesAndEquity.positions?.map(p => addIdToPosition(p, usedIds))
            }
        }
    }
}