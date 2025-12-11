import BilanzColumn from "./BilanzColumn";
import { InteractiveBalanceData } from "../../types/InteractiveBalanceData";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";

const BilanzComponent = () => {
  // const [data, setData] = useState<BilanzData>({
  //   aktiva: { posten: [] },
  //   passiva: { posten: [] },
  // });

  const { interactiveBalanceData } = useInteractiveBalanceData();

  const balanceSheet = interactiveBalanceData.balanceSheet;

  // useEffect(() => {
  //   const bilanzData = getBilanzData();
  //   setData(bilanzData);
  // }, []);

  return (
    <div className="flex w-1/3 bg-white border-black border rounded-md border-double">
      <BilanzColumn
        title="Aktiva"
        positions={balanceSheet.assets}
      />
      <BilanzColumn
        title="Passiva"
        positions={balanceSheet.liabilitiesAndEquity}
      />
    </div>
  );
};

export default BilanzComponent;
