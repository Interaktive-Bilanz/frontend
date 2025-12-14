import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { InteractiveBalanceData, JournalEntry } from "../types/InteractiveBalanceData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import defaultDataJson from "../api/chat_gpt_example4.json"
import { calculateAccountTotals, AccountTotal } from "../util/balanceCalculations";

interface InteractiveBalanceDataContextType {
  interactiveBalanceData: InteractiveBalanceData;
  setInteractiveBalanceData: React.Dispatch<React.SetStateAction<InteractiveBalanceData>>;

  draftEntry: JournalEntry | null;
  setDraftEntry: React.Dispatch<React.SetStateAction<JournalEntry | null>>;
  //setDraftEntry: (entry: JournalEntry | null) => void;
  commitDraft: () => void;
  cancelDraft: () => void;

  accountTotals: Record<string, AccountTotal>;
}

const InteractiveBalanceDataContext = createContext<InteractiveBalanceDataContextType | null>(null);

export const useInteractiveBalanceData = () => {
  const ctx = useContext(InteractiveBalanceDataContext);
  if (!ctx) throw new Error("useInteractiveBalanceData must be used inside <InteractiveBalanceDataProvider>");
  return ctx;
};

const defaultData = defaultDataJson as unknown as InteractiveBalanceData;

export const InteractiveBalanceDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [interactiveBalanceData, setInteractiveBalanceData] = useLocalStorage<InteractiveBalanceData>(
    "interactiveBalanceData",
    defaultData,
    true
  );

  const [draftEntry, setDraftEntry] = useState<JournalEntry | null>(null);

  const commitDraft = () => {
    if (!draftEntry) return;

    setInteractiveBalanceData(prev => ({
      ...prev,
      journalEntries: [...(prev.journalEntries ?? []), draftEntry]
    }));

    setDraftEntry(null);
  };

  const cancelDraft = () => {
    setDraftEntry(null);
  };

  const accountTotals = useMemo(() => {

    const entries = interactiveBalanceData.journalEntries ?? [];

    const mergedEntries = draftEntry
      ? [
        ...entries.filter(e => e.id !== draftEntry.id),
        draftEntry,
      ] : entries;

    return calculateAccountTotals(mergedEntries);
  }, [interactiveBalanceData.journalEntries, draftEntry]);

  return (
    <InteractiveBalanceDataContext.Provider value={{ interactiveBalanceData, setInteractiveBalanceData, draftEntry, setDraftEntry, commitDraft, cancelDraft, accountTotals: accountTotals }}>
      {children}
    </InteractiveBalanceDataContext.Provider>
  );
};