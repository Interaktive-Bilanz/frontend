export type Konto = {
  nr: string;
  name: string;
};

export type Struktur = {
  posten?: BilanzNode[];
  konto?: Konto[];
};

export type BilanzNode = {
  label: string;
  struktur: Struktur;
};

export type BilanzProps = {
  title: string;
  posten: BilanzNode[];
  openTAccWindow: (title: string) => void;
};
