import React, { useState } from "react";

import BilanzColumn from "./BilanzColumn";

import data from "../../api/bilanz.json";

const BilanzComponent: React.FC = () => {
  return (
    <div className="flex w-1/2 bg-white border-black border-2 rounded-md border-solid">
      <BilanzColumn title="Aktiva" posten={data.aktiva.posten} />
      <BilanzColumn title="Passiva" posten={data.passiva.posten} />
    </div>
  );
};

export default BilanzComponent;
