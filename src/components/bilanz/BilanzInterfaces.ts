import { Account, Position } from "../../types/InteractiveBalanceData";

// Leaf Konto
export type Konto = {
  nr: string;
  name: string;
};

// Node structure
export type Struktur = {
  label: string;
  posten?: BilanzNode[]; // child nodes
  konto?: Konto[]; // leaf accounts
};

// Node in the bilanz tree
export type BilanzNode = {
  label: string;
  struktur: Struktur;
};

// Props for React components
export type BilanzProps = {
  title: string;
  positions?: Position[];
  accounts?: string[];
};

// Optional: Column type for backend
export type BilanzColumn = {
  title: string;
  positions?: Position[];
  accounts?: Account[];
};

// Full backend object
export type BilanzData = {
  aktiva: BilanzColumn;
  passiva: BilanzColumn;
};
