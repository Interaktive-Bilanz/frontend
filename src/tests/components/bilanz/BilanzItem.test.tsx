import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BilanzItem from "../../../components/bilanz/BilanzItem";
import { BilanzNode } from "../../../components/bilanz/BilanzInterfaces";

describe("BilanzItem", () => {
  const mockOpenTAccWindow = jest.fn();

  const mockBilanzNode: BilanzNode = {
    label: "BGA",
    struktur: {
      konto: [
        { nr: "0500", name: "Betriebs-/Geschäftsausstattung" },
        { nr: "0670", name: "Geringwertige Wirtschaftsgüter" },
      ],
      posten: [
        {
          label: "Child Node",
          struktur: {},
        },
      ],
    },
  };

  it("renders the node label", () => {
    render(
      <BilanzItem node={mockBilanzNode} openTAccWindow={mockOpenTAccWindow} />
    );
    expect(screen.getByText("BGA")).toBeInTheDocument();
  });

  it("toggles child elements when clicked", () => {
    render(
      <BilanzItem node={mockBilanzNode} openTAccWindow={mockOpenTAccWindow} />
    );

    // Initially, konto labels should not be visible
    expect(
      screen.queryByText("0500 Betriebs-/Geschäftsausstattung")
    ).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByText("BGA"));

    // Now konto and child labels should appear
    expect(
      screen.getByText("0500 Betriebs-/Geschäftsausstattung")
    ).toBeInTheDocument();
    expect(
      screen.getByText("0670 Geringwertige Wirtschaftsgüter")
    ).toBeInTheDocument();
    expect(screen.getByText("Child Node")).toBeInTheDocument();
  });

  it("calls openTAccWindow when konto button is clicked", () => {
    render(
      <BilanzItem node={mockBilanzNode} openTAccWindow={mockOpenTAccWindow} />
    );

    // Expand first
    fireEvent.click(screen.getByText("BGA"));

    // Click konto
    fireEvent.click(screen.getByText("0500 Betriebs-/Geschäftsausstattung"));

    expect(mockOpenTAccWindow).toHaveBeenCalledWith(
      "0500: Betriebs-/Geschäftsausstattung"
    );
  });
});
