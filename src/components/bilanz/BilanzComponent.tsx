import BilanzColumn from "./BilanzColumn";
import { InteractiveBalanceData, Position } from "../../types/InteractiveBalanceData";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { calculatePositionSaldo } from "./BilanzItem";
import { calculateAccountTotals, getAccountTotals } from "../../util/balanceCalculations";
import { DndContext, DragEndEvent, DragOverEvent, Over, pointerWithin, DragOverlay } from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import { useDragContext } from "../../context/DragContext";

const BilanzComponent = () => {
  // const [data, setData] = useState<BilanzData>({
  //   aktiva: { posten: [] },
  //   passiva: { posten: [] },
  // });

  const { interactiveBalanceData, accountTotals, reorderAccountsInPosition, reorderPositionsInPosition,
    moveAccount, movePosition
  } = useInteractiveBalanceData();

  const { dropIndicator, setDropIndicator, addOpenPositionId, clearOpenPositionIds, setOpenPositionIds, openPositionIds } = useDragContext();

  const [activeData, setActiveData] = useState<{ type: string, label: string } | null>(null);

  const pointerRef = useRef({ x: 0, y: 0 });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [openBeforeDragIds, setOpenBeforeDragIds] = useState<Set<string>>(new Set());
  const overRectRef = useRef<DOMRect | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTargetRef = useRef<string | null>(null);

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };

      if (activeId && overId && overRectRef.current) {
        const rect = overRectRef.current;
        const relativeY = (e.clientY - rect.top) / rect.height;
        const intent = relativeY < 0.3 ? 'before' : relativeY > 0.7 ? 'after' : 'inside';
        setDropIndicator({ targetId: overId, intent });
      }
      if (overId && overId !== hoverTargetRef.current) {
        // moved to a new item, clear any existing timer
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTargetRef.current = overId;

        hoverTimerRef.current = setTimeout(() => {
          addOpenPositionId(overId);
        }, 1000);
      }
    };
    window.addEventListener('pointermove', handler);
    return () => window.removeEventListener('pointermove', handler);
  }, [activeId, overId]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const intent = getDropIntent(event.over);
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const draggedType = active.data.current?.type;
    const droppedOnType = over.data.current?.type;
    const sourceParentId = active.data.current?.parentId;
    const targetParentId = over.data.current?.parentId;
    const targetId = over.id;

    if (draggedType === "position") {

      if (droppedOnType === "position") {
        console.log(`Drop intent: ${intent}`);

        if (intent === 'before' || intent === 'after') {
          if (sourceParentId === targetParentId) {
            const ids = getPositionIdsForParent(sourceParentId);
            const activeIndex = ids.indexOf(String(active.id));
            const overIndex = ids.indexOf(String(over.id));
            const insertIndex = intent === 'after' ? overIndex + 1 : overIndex;
            console.log(`Reordering in ${targetParentId}`);
            reorderPositionsInPosition(sourceParentId, activeIndex, insertIndex);
          } else {
            console.log(`Moving to ${targetParentId}`);
            movePosition(String(active.id), sourceParentId, targetParentId);
            const ids = getPositionIdsForParent(targetParentId);
            const activeIndex = ids.indexOf(String(active.id));
            const overIndex = ids.indexOf(String(over.id));
            const insertIndex = intent === 'after' ? overIndex + 1 : overIndex;
            console.log(`Reordering in ${targetParentId}`);
            reorderPositionsInPosition(targetParentId, activeIndex, insertIndex);
          }
        } else {
          console.log(`Moving to ${over.id}`);
          movePosition(String(active.id), sourceParentId, String(over.id));
        }
      } else if (droppedOnType === "column") {
        movePosition(String(active.id), sourceParentId, String(over.id));
      } else if (droppedOnType === "account" && active.id != targetParentId) {
        movePosition(String(active.id), sourceParentId, targetParentId);
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
          if (intent === "before" || intent === "after") {
            moveAccount(accountId, sourceParentId, targetParentId);
          } else if (intent === "inside") {
            moveAccount(accountId, sourceParentId, String(targetId));
          }
        } else if (droppedOnType === "column") {
          console.log(`Moving account from ${sourceParentId} to ${targetId}`);
          moveAccount(accountId, sourceParentId, String(targetId));
        }
      };
    }

    let ancestors: string[] = [];

    const allPositions = [
      ...balanceSheet.assets.positions as Position[],
      ...balanceSheet.liabilitiesAndEquity.positions as Position[]
    ];
    try {
      ancestors = getAncestorIds(
        droppedOnType === "account" || (droppedOnType === "position" && intent != "inside") ? targetParentId : String(targetId),
        allPositions
      ) ?? [];
    }
    catch (e) {
      console.log(e);
    }

    const idsToKeepOpen = new Set([
      ...Array.from(openBeforeDragIds),
      ...ancestors,
      droppedOnType === "account" || (droppedOnType === "position" && intent != "inside") ? targetParentId : String(targetId)
    ]);

    setOpenPositionIds(idsToKeepOpen);

  };

  function getDropIntent(over: Over | null): 'before' | 'inside' | 'after' {
    const rect = over?.rect;
    if (!rect) return 'inside';
    const relativeY = (pointerRef.current.y - rect.top) / rect.height;
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

  function getAncestorIds(targetId: string, positions: Position[], acc: string[] = []): string[] | null {
    for (const pos of positions) {
      if (pos.id === targetId) return acc;
      const found = getAncestorIds(targetId, pos.positions ?? [], [...acc, pos.id!]);
      if (found) return found;
    }
    return null;
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
      onDragStart={(e) => {
        setOpenBeforeDragIds(openPositionIds);
        setActiveId(String(e.active.id));
        setActiveData({
          type: e.active.data.current?.type,
          label: e.active.data.current?.label
        });
      }}
      onDragOver={(e) => {
        if (!e.over) {
          setOverId(null);
          setDropIndicator(null);
          overRectRef.current = null;
          return;
        }
        setOverId(String(e.over.id));
        overRectRef.current = e.over.rect as unknown as DOMRect;
        const intent = getDropIntent(e.over);
        setDropIndicator({ targetId: String(e.over.id), intent });
      }}
      onDragEnd={(e) => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTargetRef.current = null;

        setActiveId(null);
        setOverId(null);
        setDropIndicator(null);
        handleDragEnd(e);
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
        <DragOverlay>
          {activeData && (
            <div className="bg-white border border-gray-400 rounded px-2 py-1 shadow-lg opacity-90">
              {activeData.label}
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default BilanzComponent;
