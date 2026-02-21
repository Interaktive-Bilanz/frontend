import BilanzColumn from "./BilanzColumn";
import { InteractiveBalanceData, Position } from "../../types/InteractiveBalanceData";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { calculatePositionSaldo } from "./BilanzItem";
import { calculateAccountTotals, getAccountTotals } from "../../util/balanceCalculations";
import { DndContext, DragEndEvent, DragOverEvent, pointerWithin } from "@dnd-kit/core";
import { useState } from "react";
import { useDragContext } from "../../context/DragContext";

const BilanzComponent = () => {
  // const [data, setData] = useState<BilanzData>({
  //   aktiva: { posten: [] },
  //   passiva: { posten: [] },
  // });

  const { interactiveBalanceData, accountTotals, reorderAccountsInPosition, reorderPositionsInPosition,
    moveAccount, movePosition
  } = useInteractiveBalanceData();

  const balanceSheet = interactiveBalanceData.balanceSheet;

  // useEffect(() => {
  //   const bilanzData = getBilanzData();
  //   setData(bilanzData);
  // }, []);

  let assetsBalanceSum = 0;
  let liabilitiesEquityBalanceSum = 0;

  for (const position of balanceSheet.assets.positions ?? []) {
    assetsBalanceSum += calculatePositionSaldo(position, accountTotals) ?? 0;
  }
  for (const account of balanceSheet.assets.accounts ?? []) {
    assetsBalanceSum += getAccountTotals(accountTotals, account).balance;
  }

  for (const position of balanceSheet.liabilitiesAndEquity.positions ?? []) {
    liabilitiesEquityBalanceSum += calculatePositionSaldo(position, accountTotals) ?? 0;
  }
  for (const account of balanceSheet.liabilitiesAndEquity.accounts ?? []) {
    liabilitiesEquityBalanceSum += getAccountTotals(accountTotals, account).balance;
  }

  const balancesMatch = Math.abs(assetsBalanceSum) === Math.abs(liabilitiesEquityBalanceSum);

  const { dropIndicator, setDropIndicator } = useDragContext();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const draggedType = active.data.current?.type;
    const droppedOnType = over.data.current?.type;
    const sourceParentId = active.data.current?.parentId;
    const targetParentId = over.data.current?.parentId;
    const targetId = over.id;

    if (draggedType === "position") {

      if (droppedOnType === "position") {
        const dropIntent = getDropIntent(event);
        console.log(`Drop intent: ${dropIntent}`);

        if (dropIntent === 'before' || dropIntent === 'after') {
          if (sourceParentId === targetParentId) {
            const ids = getPositionIdsForParent(sourceParentId);
            const activeIndex = ids.indexOf(String(active.id));
            const overIndex = ids.indexOf(String(over.id));
            const insertIndex = dropIntent === 'after' ? overIndex + 1 : overIndex;
            console.log(`Reordering in ${targetParentId}`);
            reorderPositionsInPosition(sourceParentId, activeIndex, insertIndex);
            return;
          } else {
            console.log(`Moving to ${targetParentId}`);
            movePosition(String(active.id), sourceParentId, targetParentId);
            const ids = getPositionIdsForParent(targetParentId);
            const activeIndex = ids.indexOf(String(active.id));
            const overIndex = ids.indexOf(String(over.id));
            const insertIndex = dropIntent === 'after' ? overIndex + 1 : overIndex;
            console.log(`Reordering in ${targetParentId}`);
            reorderPositionsInPosition(targetParentId, activeIndex, insertIndex);
          }
        } else {
          console.log(`Moving to ${over.id}`);
          movePosition(String(active.id), sourceParentId, String(over.id));
          return;
        }
      } else if (droppedOnType === "column") {
        movePosition(String(active.id), sourceParentId, String(over.id));
        return;
      } else if (droppedOnType === "account" && active.id != targetParentId) {
        movePosition(String(active.id), sourceParentId, targetParentId);
        return;
      }

    }

    if (draggedType === "account") {
      const accountId = String(active.id);


      if (droppedOnType === "account") {
        if (sourceParentId === targetParentId) {
          const accounts = getAccountIdsForPosition(targetParentId);
          const activeIndex = accounts?.findIndex(id => id === active.id);
          const overIndex = accounts?.findIndex(id => id === over.id);
          if (activeIndex !== undefined && overIndex !== undefined &&
            activeIndex !== -1 && overIndex !== -1) {
            console.log(`Reordering accounts inside ${sourceParentId}`);
            reorderAccountsInPosition(sourceParentId, activeIndex, overIndex);
          }
        } else {
          moveAccount(accountId, sourceParentId, targetParentId);
          const accounts = getAccountIdsForPosition(targetParentId);
          const activeIndex = accounts?.findIndex(id => id === active.id);
          const overIndex = accounts?.findIndex(id => id === over.id);
          reorderAccountsInPosition(targetParentId, activeIndex, overIndex);
        }
      } else {
        if (droppedOnType === "position") {
          const dropIntent = getDropIntent(event);
          if (dropIntent === "before" || dropIntent === "after") {
            moveAccount(accountId, sourceParentId, targetParentId);
          } else if (dropIntent === "inside") {
            moveAccount(accountId, sourceParentId, String(targetId));
          }
        } else if (droppedOnType === "column") {
          console.log(`Moving account from ${sourceParentId} to ${targetId}`);
          moveAccount(accountId, sourceParentId, String(targetId));
        }
      };
    }
  };

  function getDropIntent(event: DragEndEvent | DragOverEvent): 'before' | 'inside' | 'after' {
    const rect = event.over?.data.current?.getRect?.();
    console.log('rect:', rect);
    console.log('activatorEvent:', event.activatorEvent);
    console.log('delta:', event.delta);
    if (!rect) return 'inside';

    const pointerY = (event.activatorEvent as PointerEvent).clientY + event.delta.y;

    const relativeY = (pointerY - rect.top) / rect.height;
    console.log('relativeY:', relativeY);

    if (relativeY < 0.3) return 'before';
    if (relativeY > 0.7) return 'after';
    return 'inside';
  }

  function getPositionIdsForParent(parentId: string): string[] {
    if (parentId === "assets") {
      return balanceSheet.assets.positions?.map(p => p.id!) as string[];
    } else if (parentId === "liabilitiesAndEquity") {
      return balanceSheet.liabilitiesAndEquity.positions?.map(p => p.id!) as string[];
    } else {
      const findPositionAndReturnChildpositionIds = (positions: Position[]): string[] | undefined => {
        for (const pos of positions) {
          if (pos.id === parentId) {
            return pos.positions.map(p => p.id!) as string[];
          }

          if (pos.positions && pos.positions.length > 0) {
            const found = findPositionAndReturnChildpositionIds(pos.positions);
            if (found) {
              return found;
            }
          }
        }
        return;
      }

      let positionIds = findPositionAndReturnChildpositionIds(balanceSheet.assets.positions as Position[]) as string[];
      if (!positionIds || positionIds.length === 0) {
        positionIds = findPositionAndReturnChildpositionIds(balanceSheet.liabilitiesAndEquity.positions as Position[]) as string[];
      }
      return positionIds;
    }
  }

  function getAccountIdsForPosition(positionId: string): string[] {
    let accountIds: string[];

    if (positionId === "assets") {
      accountIds = balanceSheet.assets.accounts as string[];
    } else if (positionId === "liabilitiesAndEquity") {
      accountIds = balanceSheet.liabilitiesAndEquity.accounts as string[];
    } else {
      const findPositionAndReteturnAccounts = (positions: Position[]): string[] | undefined => {
        for (const pos of positions) {
          if (pos.id === positionId) {
            return pos.accounts;
          }

          if (pos.positions && pos.positions.length > 0) {
            const found = findPositionAndReteturnAccounts(pos.positions);
            if (found) {
              return found;
            }
          }
        }

        return;
      };

      accountIds = findPositionAndReteturnAccounts(balanceSheet.assets.positions as Position[]) as string[];
      if (!accountIds || accountIds.length === 0) {
        accountIds = findPositionAndReteturnAccounts(balanceSheet.liabilitiesAndEquity.positions as Position[]) as string[];
      }
    }
    return accountIds;
  }


  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragOver={(event) => {
        if (!event.over) { setDropIndicator(null); return; }
        const intent = getDropIntent(event);
        setDropIndicator({ targetId: String(event.over.id), intent });
      }}
      onDragEnd={(event) => {
        setDropIndicator(null);
        handleDragEnd(event);
      }}
    >
      <div className="flex w-2/5 bg-white border-black border rounded-md border-double">
        <div className="w-1/2">
          <BilanzColumn
            title="Aktiva"
            positions={balanceSheet.assets.positions}
            accounts={balanceSheet.assets.accounts}
          />
          <div className="p-4">
            <span className={`text-lg font-semibold ${balancesMatch ? 'text-green-600' : 'text-red-600'}`}>Summe {Math.abs(assetsBalanceSum).toFixed(2)} €</span>
          </div>
        </div>
        <div className="w-1/2">
          <BilanzColumn
            title="Passiva"
            positions={balanceSheet.liabilitiesAndEquity.positions}
            accounts={balanceSheet.liabilitiesAndEquity.accounts}
          />
          <div className="p-4">
            <span className={`text-lg font-semibold ${balancesMatch ? 'text-green-600' : 'text-red-600'}`}>Summe {Math.abs(liabilitiesEquityBalanceSum).toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default BilanzComponent;
