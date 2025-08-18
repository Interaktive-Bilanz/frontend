import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // for "toBeInTheDocument"
import BilanzColumn from "../../../components/bilanz/BilanzColumn";
import { BilanzNode } from "../../../components/bilanz/BilanzInterfaces";

describe("BilanzColumn", () => {
  const mockPosten: BilanzNode[] = [
    { label: "Anlagevermögen", struktur: {} },
    { label: "Umlaufvermögen", struktur: {} },
  ];

  const mockOpenTAccWindow = jest.fn(); // mock callback

  it("renders the column title", () => {
    render(
      <BilanzColumn
        title="Aktiva"
        posten={mockPosten}
        openTAccWindow={mockOpenTAccWindow}
      />
    );

    expect(screen.getByText("Aktiva")).toBeInTheDocument();
    expect(screen.getByText("Anlagevermögen")).toBeInTheDocument();
    expect(screen.getByText("Umlaufvermögen")).toBeInTheDocument();
  });
});
