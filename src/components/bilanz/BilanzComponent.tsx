import React, { useEffect, useState } from "react";
import BilanzColumn from "./BilanzColumn";
import { getBilanzData } from "../../api/bilanzApi";
import { BilanzData } from "./BilanzInterfaces";

const BilanzComponent: React.FC<{
  openTAccWindow: (title: string) => void;
}> = ({ openTAccWindow }) => {
  const [data, setData] = useState<BilanzData>({
    aktiva: { posten: [] },
    passiva: { posten: [] },
  });

  useEffect(() => {
    const bilanzData = getBilanzData();
    setData(bilanzData);
  }, []);

  return (
    <div className="flex w-1/3 bg-white border-black border rounded-md border-double">
      <BilanzColumn
        title="Aktiva"
        posten={data.aktiva.posten}
        openTAccWindow={openTAccWindow}
      />
      <BilanzColumn
        title="Passiva"
        posten={data.passiva.posten}
        openTAccWindow={openTAccWindow}
      />
    </div>
  );
};

export default BilanzComponent;
