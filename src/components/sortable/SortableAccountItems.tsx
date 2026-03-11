import { useSortable } from "@dnd-kit/sortable";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { Account } from "../../types/InteractiveBalanceData";
import { getAccountTotals } from "../../util/balanceCalculations";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";



interface SortableAccountItemProps {
  accountId: string;
  account: Account;
  teacherMode: boolean;
  onRemove: () => void;
  onOpen: () => void;
  parentId: string;
  side: "assets" | "liabilitiesAndEquity" | undefined
}

const SortableAccountItem: React.FC<SortableAccountItemProps> = ({
  accountId,
  account,
  side,
  teacherMode,
  onRemove,
  onOpen,
  parentId
}) => {
  const { interactiveBalanceData, accountTotals } = useInteractiveBalanceData();

  const accountBalance = getAccountTotals(accountTotals, accountId).balance;

  const isAbnormal = (side === 'assets' && accountBalance < 0) ||
    (side === 'liabilitiesAndEquity' && accountBalance > 0);

  const displayAccountBalance = Math.abs(accountBalance);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: accountId,
    data: {
      type: 'account',
      accountId: accountId,
      label: account.label,
      parentId: parentId
    },
    disabled: !teacherMode
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex">
      <button
        className="mt-1 bg-green-100 hover:bg-green-400 border border-gray-300 rounded px-2 py-1 w-full text-left"
        lang="de"
        onClick={onOpen}
      >
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-y-1">
          <div className="flex items-center min-w-0 flex-1">
            {teacherMode && (
              <span
                  {...attributes}
                  {...listeners}
                  className="inline-block cursor-grab active:cursor-grabbing mr-2 active:text-blue-500 active:scale-110 transition-all duration-200 select-none touch-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GripVertical size={16} />
                </span>
            )}
            <div lang="de" className="min-w-0 hyphens-auto break-words flex-1">
              {accountId} {account.label}
            </div>
            {teacherMode && (
              <button
                className="bg-transparent hover:bg-gray-100 mr-1 px-1 py-1 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                &#x274C;
              </button>
            )}
          </div>
          <div className={`self-end xl:self-auto text-right xl:ml-2 text-nowrap ${isAbnormal && 'text-red-500'}`}>
            {displayAccountBalance.toFixed(2)} €
            {accountBalance < 0 && " H"}
            {accountBalance > 0 && " S"}
          </div>
        </div>
      </button>
    </div>
  )
}

export default SortableAccountItem;