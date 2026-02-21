import { useSortable } from "@dnd-kit/sortable";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { Account } from "../../types/InteractiveBalanceData";
import { getAccountTotals } from "../../util/balanceCalculations";
import { CSS } from "@dnd-kit/utilities";



interface SortableAccountItemProps {
    accountId: string;
    account: Account;
    teacherMode: boolean;
    onRemove: () => void;
    onOpen: () => void;
    parentId: string;
}

const SortableAccountItem: React.FC<SortableAccountItemProps> = ({
    accountId,
    account,
    teacherMode,
    onRemove,
    onOpen,
    parentId
}) => {
    const { interactiveBalanceData, accountTotals } = useInteractiveBalanceData();

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
        <div className="flex justify-between items-center">
          {teacherMode && (
            <span 
              {...attributes} 
              {...listeners}
              className="cursor-grab active:cursor-grabbing mr-2 text-gray-400 hover:text-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              ⋮⋮
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
          <span className="text-nowrap whitespace-nowrap">
            {Math.abs(getAccountTotals(accountTotals, accountId).balance).toFixed(2)} €
          </span>
        </div>
      </button>
    </div>
  )
}

export default SortableAccountItem;