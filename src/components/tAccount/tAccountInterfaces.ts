// A single booking entry
export type Booking = {
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

// Backend-style lookup object
export type TAccountMap = {
  [nr: string]: TAccount; // key = account number
};
