import BilanzItem from "./BilanzItem";
import { BilanzProps } from "./BilanzInterfaces";

const BilanzColumn: React.FC<BilanzProps> = ({
  title,
  positions,
}) => {
  return (
    <div className="w-1/2 p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      { positions?.map((position, i) => (
        <BilanzItem key={i} position={position} />
      ))}
    </div>
  );
};

export default BilanzColumn;
