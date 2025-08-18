// src/api/getBilanzData.ts
import { BilanzData } from "../components/bilanz/BilanzInterfaces";
import bilanzJson from "./bilanz.json";

export const getBilanzData = (): BilanzData => {
  const bilanzData: BilanzData = bilanzJson as BilanzData;

  return bilanzData;
};
