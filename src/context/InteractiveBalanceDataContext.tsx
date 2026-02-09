import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { InteractiveBalanceData, JournalEntry, Position } from "../types/InteractiveBalanceData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import defaultDataJson from "../api/chat_gpt_example4.json"
import { calculateAccountTotals, AccountTotal } from "../util/balanceCalculations";
import { ensurePositionIds } from "../util/addIdsToPositions";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

interface InteractiveBalanceDataContextType {
  interactiveBalanceData: InteractiveBalanceData;
  setInteractiveBalanceData: React.Dispatch<React.SetStateAction<InteractiveBalanceData>>;

  draftEntry: JournalEntry | null;
  setDraftEntry: React.Dispatch<React.SetStateAction<JournalEntry | null>>;
  //setDraftEntry: (entry: JournalEntry | null) => void;
  commitDraft: () => void;
  cancelDraft: () => void;

  updatePositionLabel: (positionId: string, newLabel: string) => void;

  addNewPositionTo: (positionId: string) => void;

  addNewAccount: (accountId: string) => void;

  addAccountTo: (positionId: string, accountId: string) => void;

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
    ensurePositionIds(defaultData),
    true
  );

  const [draftEntry, setDraftEntry] = useState<JournalEntry | null>(null);

  const updatePositionLabel = (positionId: string, newLabel: string) => {
    setInteractiveBalanceData(draft => {
      const findAndUpdate = (positions: Position[]) => {
        for (const position of positions) {
          if (position.id === positionId) {
            position.label = newLabel;
            return;
          }
          if (position.positions?.length) {
            findAndUpdate(position.positions);
          }
        }
      };

      findAndUpdate(draft.balanceSheet.assets.positions as Position[]);
      findAndUpdate(draft.balanceSheet.liabilitiesAndEquity.positions as Position[]);
    });
  };

  const addNewPositionTo = (positionId: string) => {

    const newPosition = {
      label: "Neue Position",
      accounts: [],
      positions: [],
      id: uuidv4()
    };

    setInteractiveBalanceData(draft => {
      const findAndAdd = (positions: Position[]) => {
        for (const position of positions) {
          if (position.id === positionId) {
            position.positions.push(newPosition)
            return;
          }
          if (position.positions?.length) {
            findAndAdd(position.positions);
          }
        }
      };

      findAndAdd(draft.balanceSheet.assets.positions as Position[]);
      findAndAdd(draft.balanceSheet.liabilitiesAndEquity.positions as Position[]);
    });
  };

  const addNewAccount = (accountId: string) => {


    if (!/^[0-9]{4}$/.test(accountId)) {
      console.log("not a valid account id");
      toast.error("Account ID nicht zulässig");
      throw new Error("Invalid account ID format");
    }

    const newAccount = {
      id: accountId,
      label: "Neuer Account"
    };

    setInteractiveBalanceData(draft => {
      draft.accounts.push(newAccount);
    });
  };

  const addAccountTo = (positionId: string, accountId: string) => {
    try {
      console.log("account ID to add: ", accountId);
      if (!interactiveBalanceData.accounts.find(a => a.id === accountId)) addNewAccount(accountId);

      setInteractiveBalanceData(draft => {
        if (positionId === "assets") {
          const index = draft.balanceSheet.assets.accounts?.findIndex((id) => id === accountId);
          if (index === -1) {
            draft.balanceSheet.assets.accounts?.push(accountId);
          } else toast.error("Konto bereits in dieser Position enthalten");
        } else if (positionId === "liabilitiesAndEquity") {
          const index = draft.balanceSheet.liabilitiesAndEquity.accounts?.findIndex((id) => id === accountId);
          if (index === -1) {
            draft.balanceSheet.liabilitiesAndEquity.accounts?.push(accountId);
          } else toast.error("Konto bereits in dieser Position enthalten");
        } else {
          const findAndAdd = (positions: Position[]) => {
            for (const position of positions) {
              if (position.id === positionId) {
                const index = position.accounts?.findIndex((id) => id === accountId);
                if (index === -1) {
                  position.accounts.push(accountId);
                } else toast.error("Konto bereits in dieser Position enthalten");
                return;
              }
              if (position.positions?.length) {
                findAndAdd(position.positions);
              }
            }
          };
          findAndAdd(draft.balanceSheet.assets.positions as Position[]);
          findAndAdd(draft.balanceSheet.liabilitiesAndEquity.positions as Position[]);
        };
      });
    } catch (e) {}


  };

  const commitDraft = () => {
    if (!draftEntry) return;

    setInteractiveBalanceData(draft => {
      draft.journalEntries.push(draftEntry);
    });

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
    <InteractiveBalanceDataContext.Provider value={{ interactiveBalanceData, setInteractiveBalanceData, draftEntry, setDraftEntry, commitDraft, cancelDraft, accountTotals: accountTotals, updatePositionLabel, addNewPositionTo, addNewAccount, addAccountTo: addAccountTo }}>
      {children}
    </InteractiveBalanceDataContext.Provider>
  );
};