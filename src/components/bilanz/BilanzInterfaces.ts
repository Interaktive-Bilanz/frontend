import { Position } from "../../types/InteractiveBalanceData";

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
  //posten: BilanzNode[];
  positions?: Position[]; // child nodes
  konto?: Konto[]; // leaf accounts
  openTAccWindow: (title: string) => void;
};

// Optional: Column type for backend
export type BilanzColumn = {
  posten: BilanzNode[];
};

// Full backend object
export type BilanzData = {
  aktiva: BilanzColumn;
  passiva: BilanzColumn;
};
