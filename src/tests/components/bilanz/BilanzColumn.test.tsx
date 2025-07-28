import React from "react";
import { render, screen } from "@testing-library/react";
import BilanzColumn from "../../../components/bilanz/BilanzColumn";
import { BilanzNode } from "../../../components/bilanz/BilanzInterfaces";

describe("BilanzColumn", () => {
  const mockPosten: BilanzNode[] = [
    {
      label: "Anlagevermögen",
      struktur: {},
    },
    {
      label: "Umlaufvermögen",
      struktur: {},
    },
  ];

  it("renders the column title", () => {
    render(<BilanzColumn title="Aktiva" posten={mockPosten} />);
    expect(screen.getByText("Aktiva")).toBeInTheDocument();
  });
});
