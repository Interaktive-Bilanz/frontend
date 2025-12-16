import BilanzColumn from "./BilanzColumn";
import { InteractiveBalanceData } from "../../types/InteractiveBalanceData";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { calculatePositionSaldo } from "./BilanzItem";

const BilanzComponent = () => {
  // const [data, setData] = useState<BilanzData>({
  //   aktiva: { posten: [] },
  //   passiva: { posten: [] },
  // });

  const { interactiveBalanceData, accountTotals } = useInteractiveBalanceData();

  const balanceSheet = interactiveBalanceData.balanceSheet;

  // useEffect(() => {
  //   const bilanzData = getBilanzData();
  //   setData(bilanzData);
  // }, []);

  let assetsBalanceSum = 0;
  let liabilitiesEquityBalanceSum = 0;

  for (const position of balanceSheet.assets ?? []) {
    assetsBalanceSum += calculatePositionSaldo(position, accountTotals) ?? 0;
  }

  for (const position of balanceSheet.liabilitiesAndEquity ?? []) {
    liabilitiesEquityBalanceSum += calculatePositionSaldo(position, accountTotals) ?? 0;
  }

  const balancesMatch = Math.abs(assetsBalanceSum) === Math.abs(liabilitiesEquityBalanceSum);


  return (
    <div className="flex w-1/3 bg-white border-black border rounded-md border-double">
      <div className="w-1/2">
        <BilanzColumn
          title="Aktiva"
          positions={balanceSheet.assets}
        />
        <div className="p-4">
          <span className={`text-lg font-semibold ${balancesMatch ? 'text-green-600' : 'text-red-600'}`}>Summe {Math.abs(assetsBalanceSum).toFixed(2)} €</span>
        </div>
      </div>
      <div className="w-1/2">
        <BilanzColumn
          title="Passiva"
          positions={balanceSheet.liabilitiesAndEquity}
        />
        <div className="p-4">
          <span className={`text-lg font-semibold ${balancesMatch ? 'text-green-600' : 'text-red-600'}`}>Summe {Math.abs(liabilitiesEquityBalanceSum).toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
};

export default BilanzComponent;
