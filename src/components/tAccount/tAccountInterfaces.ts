// A single booking entry
export type Booking = {
  id: string;
  date: string; // ISO date string
  value: number; // positive number
  description?: string;
};

// A T-Account
export type TAccount = {
  nr: string;
  name: string;
  soll: Booking[];
  haben: Booking[];
};

export interface TAccountProps {
  account: TAccount;
}

export interface BookingsListProps {
  bookings: Booking[];
}

// Backend-style lookup object
export type TAccountMap = {
  [nr: string]: TAccount; // key = account number
};
