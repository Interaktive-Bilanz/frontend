import BilanzItem from "./BilanzItem";
import { BilanzProps } from "./BilanzInterfaces";

const BilanzColumn: React.FC<BilanzProps> = ({ title, posten }) => {
  return (
    <div className="w-1/2 p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {posten.map((node, i) => (
        <BilanzItem key={i} node={node} />
      ))}
    </div>
  );
};

export default BilanzColumn;
