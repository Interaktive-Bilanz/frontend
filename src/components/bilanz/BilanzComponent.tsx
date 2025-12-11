import React, { useEffect, useState } from "react";
import BilanzColumn from "./BilanzColumn";
import { getBilanzData } from "../../api/bilanzApi";
import { BilanzData } from "./BilanzInterfaces";

import { InteractiveBalanceData } from "../../types/InteractiveBalanceData";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";

const BilanzComponent: React.FC<{
  openTAccWindow: (title: string) => void;
}> = ({ openTAccWindow }) => {
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
        openTAccWindow={openTAccWindow}
      />
      <BilanzColumn
        title="Passiva"
        positions={balanceSheet.liabilitiesAndEquity}
        openTAccWindow={openTAccWindow}
      />
    </div>
  );
};

export default BilanzComponent;
