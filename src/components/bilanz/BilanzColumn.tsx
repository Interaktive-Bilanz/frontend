import BilanzItem, { calculatePositionSaldo } from "./BilanzItem";
import { BilanzProps } from "./BilanzInterfaces";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { useTeacherMode } from "../../context/TeacherModeContext";

const BilanzColumn: React.FC<BilanzProps> = ({
  title,
  positions,
}) => {
  let sum = 0;

  const { accountTotals } = useInteractiveBalanceData();
  const {teacherMode} = useTeacherMode();

  for (const position of positions ?? []) {
    sum += calculatePositionSaldo(position, accountTotals) ?? 0;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {teacherMode &&
        <div className="flex">
          <button className="bg-green-500 hover:bg-green-700 px-1 py-1 mr-1 rounded mt">
            + Position
          </button>
          <button className="bg-green-500 hover:bg-green-700 px-1 py-1 mr-1 rounded">
            + Konto
          </button>
        </div>
      }
      { positions?.map((position, i) => (
        <BilanzItem key={i} position={position} />
      ))}
    </div>
  );
};

export default BilanzColumn;
