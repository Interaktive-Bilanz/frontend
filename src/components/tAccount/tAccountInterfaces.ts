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
  account: Account;
}

export interface EntryLinesProps {
  lines: {
    entryId: number,
    line: EntryLine
  }[];
}

export interface BookingsListProps {
  bookings: Booking[];
}

// Backend-style lookup object
export type TAccountMap = {
  [nr: string]: TAccount; // key = account number
};
