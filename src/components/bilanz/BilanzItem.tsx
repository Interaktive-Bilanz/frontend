import React, { useEffect, useMemo, useRef, useState } from "react";
import { Position } from "../../types/InteractiveBalanceData";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { useWindowManager } from "../../context/WindowManagerContext";
import { AccountTotal, getAccountTotals } from "../../util/balanceCalculations";
import { useTeacherMode } from "../../context/TeacherModeContext";
import { getAssigendAccountIds } from "../../util/getAssignedAccountIds";
import { toast } from "react-toastify";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SortableAccountItem from "../sortable/SortableAccountItems";
import { useDragContext } from "../../context/DragContext";

export function calculatePositionSaldo(
  position: Position,
  accountTotals: Record<string, AccountTotal>
): number {
  let sum = 0;

  for (const accountId of position.accounts ?? []) {
    sum += getAccountTotals(accountTotals, accountId).balance;
  }

  for (const child of position.positions ?? []) {
    sum += calculatePositionSaldo(child, accountTotals);
  }

  return sum;
}

const BilanzItem: React.FC<{
  position: Position;
  parentId: string;
  level?: number;
}> = ({ position, parentId, level = 0 }) => {
  const [open, setOpen] = useState(false);

  const { interactiveBalanceData, setInteractiveBalanceData, updatePositionLabel, addNewPositionTo, accountTotals, addAccountTo, deletePosition, removeAccountFrom } = useInteractiveBalanceData();

  const { dropIndicator } = useDragContext();

  const accounts = interactiveBalanceData.accounts;

  const { openWindow } = useWindowManager();

  const positionBalance = calculatePositionSaldo(position, accountTotals);

  const displaypositionBalance = Math.abs(positionBalance);

  const { teacherMode } = useTeacherMode();

  const [editLabel, setEditLabel] = useState(false);
  const [labelDraft, setLabelDraft] = useState(position.label);

  const assigendAccountIds = useMemo(() => {
    return getAssigendAccountIds(interactiveBalanceData.balanceSheet);
  }, [interactiveBalanceData.balanceSheet]);

  const unassignedAccounts = useMemo(() => {
    return interactiveBalanceData.accounts.filter(a => !assigendAccountIds.has(a.id));
  }, [interactiveBalanceData.accounts, assigendAccountIds]);

  const [newAccountId, setNewAccountId] = useState(unassignedAccounts.length > 0 ? unassignedAccounts[0].id : "");

  useEffect(() => {
    if (unassignedAccounts.length > 0) {
      setNewAccountId(unassignedAccounts[0].id);
    } else {
      setNewAccountId("");
    }
  }, [unassignedAccounts]);

  const nodeRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: position.id!,
    data: {
      type: 'position',
      positionId: position.id,
      parentId: parentId,
      getRect: () => nodeRef.current?.getBoundingClientRect()
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };


  return (
    // <div style={style} className={`ml-${level} mt-1`}>
    <div className={`ml-${level} mt-1`}>
      {dropIndicator?.targetId === position.id && dropIndicator!.intent === 'before' && (
        <div className="h-1 bg-blue-400 rounded mx-2" />
      )}
      <div className="flex">
        <div
          role="button"
          ref={(el) => {
            setNodeRef(el);
            (nodeRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }}
          tabIndex={0}
          className={`bg-white hover:bg-blue-100 border border-gray-300 rounded px-2 py-1 w-full text-left cursor-pointer ${dropIndicator?.targetId === position.id && dropIndicator!.intent === 'inside'
            ? 'ring-2 ring-blue-400' : ''
            }`}
          onClick={() => setOpen(!open)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(!open);
            }
          }}
        >
          <div className="flex justify-between items-center">
            {teacherMode && (
              <span
                {...attributes}
                {...listeners}
                className="cursor-grab mr-2"
                onClick={(e) => e.stopPropagation()}
              >
                ⋮⋮
              </span>
            )}
            {editLabel ?
              <div className="min-w-0 hyphens-auto flex-1">
                <input
                  type="text"
                  className="h-5 px-1 text-sm border border-gray-300 rounded box-border"
                  value={labelDraft}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    setLabelDraft(e.target.value);
                  }} />
              </div> :
              <div className="min-w-0 hyphens-auto flex-1">{position.label}</div>

            }
            {teacherMode &&
              <div>
                {editLabel ?
                  <button className="bg-transparent hover:bg-gray-100 mr-1 px-1 py-1 rounded" onClick={(e) => {
                    e.stopPropagation();
                    updatePositionLabel(String(position.id), labelDraft)
                    setEditLabel(false);
                  }}>&#x2705;</button> :
                  <button className="bg-transparent hover:bg-gray-100 mr-1 px-1 py-1 rounded" onClick={(e) => {
                    e.stopPropagation();
                    setEditLabel(true);
                  }}>&#x270E;</button>
                }
                <button className="bg-transparent hover:bg-gray-100 mr-1 px-1 py-1 rounded" onClick={(e) => {
                  e.stopPropagation();
                  deletePosition(String(position.id));
                }}>&#x274C;</button>
              </div>
            }
            <div className="text-nowrap whitespace-nowrap ml-2">{displaypositionBalance.toFixed(2)} €</div>
          </div>
        </div>
      </div>
      {dropIndicator?.targetId === position.id && dropIndicator!.intent === 'after' && (
        <div className="h-1 bg-blue-400 rounded mx-2" />
      )}



      {open && (
        <div className="ml-4">
          {teacherMode &&
            <div className="flex">
              <button
                className="bg-green-500 hover:bg-green-700 px-1 py-1 mt-1 mr-1 rounded"
                onClick={(e) =>
                  addNewPositionTo(String(position.id))}
              >
                + Position
              </button>
              <div
                role="button"
                tabIndex={0}
                className="flex items-center bg-green-500 hover:bg-green-700 px-1 py-1 mt-1 mr-1 rounded gap-1"
                onClick={() => {
                  if (newAccountId) {
                    addAccountTo(String(position.id), newAccountId);
                  } else {
                    toast.info("Bitte ein Konto auswählen.");
                  }
                }}
              >
                <span>+ Konto</span>

                <select
                  className="h-5 w-20 text-sm rounded"
                  onClick={(e) => {
                    if (unassignedAccounts.length === 0) toast.info("Kein verfügbares Konto. Bitte weitere Konten anlegen.");
                    e.stopPropagation()

                  }}
                  onChange={(e) => {
                    setNewAccountId(e.target.value);
                  }}
                // disabled={unassignedAccounts.length === 0}
                >
                  {unassignedAccounts.length > 0 ? unassignedAccounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.id} {a.label}</option>
                  )
                  ) : <option key={"noAccAvailable"} className="text-xs"></option>}
                </select>
              </div>
              {/* <button
                className="bg-green-500 hover:bg-green-700 px-1 py-1 mt-1 mr-1 rounded"
                onClick={() => addNewAccountTo(String(position.id), newAccountId)}>
                <div className="flex items-center">
                  + Konto
                  <select name="" id=""></select>
                  <input
                    value={newAccountId}
                    type="text"
                    size={4}
                    maxLength={4}
                    placeholder="1234"
                    pattern="[0-9]{4}"
                    className="ml-1 h-5 px-1 text-sm border border-gray-300 rounded box-border text-center"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const value = e.target.value.replace('/[^0-9]/g', '');
                      if (value.length <= 4) setNewAccountId(value);
                    }}
                  />
                </div>
              </button> */}
            </div>
          }
          <SortableContext items={position.accounts ?? []}>
            {position.accounts?.map((accountId) => {
              const account = accounts.find(a => a.id === accountId)
              if (!account) return;
              return (
                <SortableAccountItem
                  key={accountId}
                  accountId={accountId}
                  account={account}
                  teacherMode={teacherMode}
                  parentId={position.id!}
                  onRemove={() => removeAccountFrom(
                    position.id!,
                    accountId
                  )}
                  onOpen={() => openWindow({
                    type: "Account",
                    payload: { id: accountId, label: account.label }
                  })}
                />
              )
            })}
          </SortableContext>

          <SortableContext items={position.positions.map(p => p.id!) ?? []}>
            {position.positions?.map((childpos) => (
              <BilanzItem
                key={childpos.id}
                position={childpos}
                parentId={position.id!}
                level={level + 1}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div >
  );
};

export default BilanzItem;
