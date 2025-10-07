// src/api/tAccountData.ts
import { TAccountMap } from "../components/tAccount/tAccountInterfaces";

export const tAccountData: TAccountMap = {
  "0500": {
    nr: "0500",
    name: "Betriebs-/Geschäftsausstattung",
    soll: [
      {
        date: "2025-08-01",
        value: 1200.5,
        description: "Purchase of office chairs",
      },
      { date: "2025-08-05", value: 450, description: "Desk repair" },
    ],
    haben: [
      { date: "2025-08-10", value: 300, description: "Sale of old equipment" },
    ],
  },
  "0670": {
    nr: "0670",
    name: "Geringwertige Wirtschaftsgüter",
    soll: [{ date: "2025-08-03", value: 250, description: "Laptop purchase" }],
    haben: [],
  },
  "1200": {
    nr: "1200",
    name: "Forderungen aLuL",
    soll: [],
    haben: [],
  },
};
