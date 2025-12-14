import BilanzItem, { calculatePositionSaldo } from "./BilanzItem";
import { BilanzProps } from "./BilanzInterfaces";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";

const BilanzColumn: React.FC<BilanzProps> = ({
  title,
  positions,
}) => {
  let sum = 0;

  const { accountTotals } = useInteractiveBalanceData();

  for (const position of positions ?? []) {
    sum += calculatePositionSaldo(position, accountTotals) ?? 0;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      { positions?.map((position, i) => (
        <BilanzItem key={i} position={position} />
      ))}
    </div>
  );
};

export default BilanzColumn;
