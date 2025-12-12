import React, { createContext, useContext, useEffect, useState } from "react";
import { InteractiveBalanceData, JournalEntry } from "../types/InteractiveBalanceData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import defaultDataJson from "../api/chat_gpt_example3.json"

interface InteractiveBalanceDataContextType {
  interactiveBalanceData: InteractiveBalanceData;
  setInteractiveBalanceData: React.Dispatch<React.SetStateAction<InteractiveBalanceData>>;

  draftEntry: JournalEntry | null;
  setDraftEntry: (entry: JournalEntry | null) => void;
  commitDraft: () => void;
  cancelDraft: () => void;
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
      journalEntries: prev.journalEntries?.map(e =>
        e.id === draftEntry.id ? draftEntry : e
      ),
    }));

    setDraftEntry(null);
  };

  const cancelDraft = () => {
    setDraftEntry(null);
  };

  return (
    <InteractiveBalanceDataContext.Provider value={{ interactiveBalanceData, setInteractiveBalanceData, draftEntry, setDraftEntry, commitDraft, cancelDraft }}>
      {children}
    </InteractiveBalanceDataContext.Provider>
  );
};