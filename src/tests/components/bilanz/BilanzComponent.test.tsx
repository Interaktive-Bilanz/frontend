import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BilanzComponent from "../../../components/bilanz/BilanzComponent";
import * as bilanzApi from "../../../api/bilanzApi"; // import the module to mock
import { BilanzData } from "../../../components/bilanz/BilanzInterfaces";

describe("BilanzComponent", () => {
  const mockOpenTAccWindow = jest.fn();

  // Mock data for the test
  const mockBilanzData: BilanzData = {
    aktiva: {
      posten: [
        { label: "Anlagevermögen", struktur: {} },
        { label: "Umlaufvermögen", struktur: {} },
      ],
    },
    passiva: {
      posten: [
        { label: "Eigenkapital", struktur: {} },
        { label: "Verbindlichkeiten", struktur: {} },
      ],
    },
  };

  // Mock the getBilanzData function
  beforeEach(() => {
    jest
      .spyOn(bilanzApi, "getBilanzData")
      .mockImplementation(() => mockBilanzData);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders Aktiva title and first-level posten", () => {
    render(<BilanzComponent openTAccWindow={mockOpenTAccWindow} />);

    // Column title
    expect(screen.getByText("Aktiva")).toBeInTheDocument();

    // First-level posten under Aktiva
    expect(screen.getByText("Anlagevermögen")).toBeInTheDocument();
    expect(screen.getByText("Umlaufvermögen")).toBeInTheDocument();
  });

  it("renders Passiva title and first-level posten", () => {
    render(<BilanzComponent openTAccWindow={mockOpenTAccWindow} />);

    expect(screen.getByText("Passiva")).toBeInTheDocument();

    expect(screen.getByText("Eigenkapital")).toBeInTheDocument();
    expect(screen.getByText("Verbindlichkeiten")).toBeInTheDocument();
  });
});
