import BilanzColumn from "./BilanzColumn";
import { InteractiveBalanceData } from "../../types/InteractiveBalanceData";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { calculatePositionSaldo } from "./BilanzItem";
import { calculateAccountTotals, getAccountTotals } from "../../util/balanceCalculations";

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


  return (
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
    </div>
  );
};

export default BilanzComponent;
