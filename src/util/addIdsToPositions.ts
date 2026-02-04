import { InteractiveBalanceData, Position } from "../types/InteractiveBalanceData";
import { v4 as uuidv4 } from "uuid";

const usedIds : string[] = [];

function addIdToPosition(position: Position): Position {
    if (usedIds.includes(String(position.id)) || position.id == undefined) {
        position.id = undefined;
    } else {
        usedIds.push(String(position.id));
    }

    return {
        ...position,
        id: position.id !== undefined ? position.id : uuidv4(),
        positions: position.positions.map(addIdToPosition) 
    };
}

export function ensurePositionIds(data: InteractiveBalanceData): InteractiveBalanceData {
    return {
        ...data,
        balanceSheet: {
            ...data.balanceSheet,
            assets: {
                ...data.balanceSheet.assets,
                positions: data.balanceSheet.assets.positions?.map(addIdToPosition)
            },
            liabilitiesAndEquity: {
                ...data.balanceSheet.liabilitiesAndEquity,
                positions: data.balanceSheet.liabilitiesAndEquity.positions?.map(addIdToPosition)
            }
        }
    }
}