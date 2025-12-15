import { Account, EntryLine } from "../../types/InteractiveBalanceData";

// A single booking entry
export type Booking = {
  id: string;
  date: string; // ISO date string
  value: number; // positive number
  description?: string;
};

// A T-Account
export type TAccount = {
  id: number;
  name: string;
  // soll: Booking[];
  // haben: Booking[];
};

export interface TAccountProps {
  id: string;
  label: string;
}

export interface EntryLinesProps {
  accountId: string;
  lines: {
    entryId: number,
    description: string,
    line: EntryLine,
    draft: boolean
  }[];
  type: "credit" | "debit";
}

export interface BookingsListProps {
  bookings: Booking[];
}

// Backend-style lookup object
export type TAccountMap = {
  [nr: string]: TAccount; // key = account number
};
