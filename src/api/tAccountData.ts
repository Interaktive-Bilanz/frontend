// src/api/tAccountData.ts
import { TAccountMap } from "../components/tAccount/tAccountInterfaces";

export const tAccountData: TAccountMap = {
  "0500": {
    nr: "0500",
    name: "Betriebs-/Geschäftsausstattung",
    soll: [
      {
        id: "0500-s1",
        date: "2025-08-01",
        value: 1200.5,
        description: "Purchase of office chairs",
      },
      {
        id: "0500-s2",
        date: "2025-08-03",
        value: 600,
        description: "Office desk setup",
      },
      {
        id: "0500-s3",
        date: "2025-08-05",
        value: 450,
        description: "Printer maintenance",
      },
      {
        id: "0500-s4",
        date: "2025-08-07",
        value: 300,
        description: "Stationery order",
      },
      {
        id: "0500-s5",
        date: "2025-08-10",
        value: 1500,
        description: "New laptop purchase",
      },
      {
        id: "0500-s6",
        date: "2025-08-12",
        value: 750,
        description: "Office chair repair",
      },
      {
        id: "0500-s7",
        date: "2025-08-15",
        value: 200,
        description: "Coffee machine maintenance",
      },
      {
        id: "0500-s8",
        date: "2025-08-18",
        value: 950,
        description: "Desk lamps purchase",
      },
    ],
    haben: [
      {
        id: "0500-h1",
        date: "2025-08-10",
        value: 300,
        description: "Sale of old equipment",
      },
    ],
  },
  "0670": {
    nr: "0670",
    name: "Geringwertige Wirtschaftsgüter",
    soll: [
      {
        id: "0670-s1",
        date: "2025-08-03",
        value: 250,
        description: "Laptop purchase",
      },
    ],
    haben: [],
  },
  "1200": {
    nr: "1200",
    name: "Forderungen aLuL",
    soll: [],
    haben: [],
  },
};

