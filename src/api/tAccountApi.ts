import { tAccountData } from "./tAccountData";
import { TAccount } from "../components/tAccount/tAccountInterfaces";

export const getTAccountByNr = (nr: string): TAccount | undefined => {
  return tAccountData[nr] || null;
};
