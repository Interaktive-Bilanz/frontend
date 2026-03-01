import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Account, InteractiveBalanceData, JournalEntry, Position } from "../types/InteractiveBalanceData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import defaultDataJson from "../api/chat_gpt_example4.json"
import { calculateAccountTotals, AccountTotal } from "../util/balanceCalculations";
import { ensurePositionIds } from "../util/addIdsToPositions";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { getAssigendAccountIds } from "../util/getAssignedAccountIds";

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

  deletePosition: (positionId: string) => void;

  addNewAccount: (id: string, label: string) => void;

  addAccountTo: (positionId: string, accountId: string) => void;

  removeAccountFrom: (positionId: string, accountId: string) => void;

  reorderAccountsInPosition: (positionId: string, oldIndex: number, newIndex: number) => void;

  reorderPositionsInPosition: (positionId: string, oldIndex: number, newIndex: number) => void;

  moveAccount: (accountId: string, fromPositionId: string, toPositionId: string) => void;

  movePosition: (positionId: string, fromPositionId: string, toPositionId: string) => void;

  accountTotals: Record<string, AccountTotal>;

  assigendAccountIds: Set<string>;

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

  const assigendAccountIds = useMemo(() => {
    return getAssigendAccountIds(interactiveBalanceData.balanceSheet);
  }, [interactiveBalanceData.balanceSheet]);


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


  const deletePosition = (positionId: string) => {
    setInteractiveBalanceData(draft => {
      const findAndDelete = (positions: Position[]) => {
        for (const position of positions) {
          if (position.id === positionId) {
            positions.splice(positions.findIndex(p => p.id === positionId), 1);
          } else {
            findAndDelete(position.positions);
          }
        }
      };

      findAndDelete(draft.balanceSheet.assets.positions as Position[]);
      findAndDelete(draft.balanceSheet.liabilitiesAndEquity.positions as Position[]);
    })
  }

  const addNewAccount = (id: string, label: string) => {


    if (!/^[0-9]{4}$/.test(id)) {
      console.log("not a valid account id");
      toast.error("Account ID nicht zulässig");
      throw new Error("Invalid account ID format");
    }

    if (interactiveBalanceData.accounts.some(a => a.id === id)) {
      toast.error("Konto mit dieser Kontonummer existier bereits");
      throw new Error("Account already exists");
    }

    const newAccount = {
      id: id,
      label: label
    };

    setInteractiveBalanceData(draft => {
      draft.accounts.push(newAccount);
    });
  };

  const addAccountTo = (positionId: string, accountId: string) => {
    try {
      console.log("account ID to add: ", accountId);
      if (!interactiveBalanceData.accounts.find(a => a.id === accountId)) {
        throw new Error("Account does not exist");
      };

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
    } catch (e) { }


  };

  const removeAccountFrom = (positionId: string, accountId: string) => {
    setInteractiveBalanceData(draft => {

      if (positionId === "assets") {
        const index = draft.balanceSheet.assets.accounts?.findIndex((id) => id === accountId);
        if (index != -1) {
          draft.balanceSheet.assets.accounts?.splice(Number(index), 1);
        } else toast.error("Konto nicht enthalten");
      } else if (positionId === "liabilitiesAndEquity") {
        const index = draft.balanceSheet.liabilitiesAndEquity.accounts?.findIndex((id) => id === accountId);
        if (index != -1) {
          draft.balanceSheet.liabilitiesAndEquity.accounts?.splice(Number(index), 1);
        } else toast.error("Konto nicht enthalten");
      } else {
        const findAndRemove = (positions: Position[]) => {
          for (const position of positions) {
            if (position.id === positionId) {
              position.accounts.splice(position.accounts.findIndex((id) => id === accountId), 1);
            } else {
              findAndRemove(position.positions);
            };
          };
        };

        findAndRemove(draft.balanceSheet.assets.positions as Position[]);
        findAndRemove(draft.balanceSheet.liabilitiesAndEquity.positions as Position[]);
      }


    })
  }

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

  const reorderAccountsInPosition = (positionId: string, oldIndex: number, newIndex: number) => {
    setInteractiveBalanceData(draft => {

      if (positionId === "assets") {
        const acc = draft.balanceSheet.assets.accounts?.splice(oldIndex, 1) ?? [];
        draft.balanceSheet.assets.accounts?.splice(newIndex, 0, acc[0]);
        return;
      } else if (positionId === "liabilitiesAndEquity") {
        const acc = draft.balanceSheet.liabilitiesAndEquity.accounts?.splice(oldIndex, 1) ?? [];
        draft.balanceSheet.liabilitiesAndEquity.accounts?.splice(newIndex, 0, acc[0]);
        return;
      } else {
        const findAndReorder = (positions: Position[]) => {
          for (const position of positions) {
            if (position.id === positionId) {
              const acc = position.accounts.splice(oldIndex, 1);
              position.accounts.splice(newIndex, 0, acc[0]);
              return;
            } else {
              findAndReorder(position.positions);
            };
          };
        };

        findAndReorder(draft.balanceSheet.assets.positions as Position[]);
        findAndReorder(draft.balanceSheet.liabilitiesAndEquity.positions as Position[]);
      }
    })
  }

  const reorderPositionsInPosition = (positionId: string, oldIndex: number, newIndex: number) => {
    setInteractiveBalanceData(draft => {

      if (positionId === "assets") {
        const pos = draft.balanceSheet.assets.positions?.splice(oldIndex, 1) ?? [];
        draft.balanceSheet.assets.positions?.splice(newIndex, 0, pos[0]);
        return;
      } else if (positionId === "liabilitiesAndEquity") {
        const pos = draft.balanceSheet.liabilitiesAndEquity.positions?.splice(oldIndex, 1) ?? [];
        draft.balanceSheet.liabilitiesAndEquity.positions?.splice(newIndex, 0, pos[0]);
        return;
      } else {
        const findAndReorder = (positions: Position[]) => {
          for (const position of positions) {
            if (position.id === positionId) {
              const pos = position.positions.splice(oldIndex, 1);
              position.positions.splice(newIndex, 0, pos[0]);
              return;
            } else {
              findAndReorder(position.positions);
            };
          };
        };

        findAndReorder(draft.balanceSheet.assets.positions as Position[]);
        findAndReorder(draft.balanceSheet.liabilitiesAndEquity.positions as Position[]);
      }
    })
  }

  const movePosition = (positionId: string, fromPositionId: string, toPositionId: string) => {
    setInteractiveBalanceData(draft => {
      let positionToMove;
      if (fromPositionId === "assets") {
        const index = draft.balanceSheet.assets.positions!.findIndex((p) => p.id === positionId)
        if (index != -1) {
          const [removed] = draft.balanceSheet.assets.positions?.splice(index, 1) as Position[];
          positionToMove = removed;
        }
      } else if (fromPositionId === "liabilitiesAndEquity") {
        const index = draft.balanceSheet.liabilitiesAndEquity.positions!.findIndex((p) => p.id === positionId)
        if (index != -1) {
          const [removed] = draft.balanceSheet.liabilitiesAndEquity.positions?.splice(index, 1) as Position[];
          positionToMove = removed;
        }
      } else {
        const findAndRemove = (positions: Position[]): Position | undefined => {
          for (const position of positions) {
            if (position.id === fromPositionId) {
              const [removed] = position.positions.splice(position.positions.findIndex((p) => p.id! === positionId), 1);
              return removed;
            } else {
              const found = findAndRemove(position.positions);
              if (found) return found;
            };
          };
        };

        positionToMove = findAndRemove(draft.balanceSheet.assets.positions as Position[])
          ?? findAndRemove(draft.balanceSheet.liabilitiesAndEquity.positions as Position[]);
      };

      if (!positionToMove) return;

      if (toPositionId === "assets") {
        draft.balanceSheet.assets.positions?.push(positionToMove);
      } else if (toPositionId === "liabilitiesAndEquity") {
        draft.balanceSheet.liabilitiesAndEquity.positions?.push(positionToMove);
      } else {
        const findAndAdd = (positions: Position[]) => {
          for (const position of positions) {
            if (position.id === toPositionId) {
              const index = position.positions?.findIndex((p) => p.id! === positionId);
              if (index === -1) {
                position.positions.push(positionToMove);
              } else toast.error("Position bereits in dieser Position enthalten");
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
    })
  }

  const moveAccount = (accountId: string, fromPositionId: string, toPositionId: string) => {
    setInteractiveBalanceData(draft => {
      if (fromPositionId === "assets") {
        draft.balanceSheet.assets.accounts?.splice(draft.balanceSheet.assets.accounts?.findIndex((a) => a === accountId), 1);
      } else if (fromPositionId === "liabilitiesAndEquity") {
        draft.balanceSheet.liabilitiesAndEquity.accounts?.splice(draft.balanceSheet.liabilitiesAndEquity.accounts?.findIndex((a) => a === accountId), 1);
      } else {
        const findAndRemove = (positions: Position[]) => {
          for (const position of positions) {
            if (position.id === fromPositionId) {
              position.accounts.splice(position.accounts.findIndex((id) => id === accountId), 1);
            } else {
              findAndRemove(position.positions);
            };
          };
        };

        findAndRemove(draft.balanceSheet.assets.positions as Position[]);
        findAndRemove(draft.balanceSheet.liabilitiesAndEquity.positions as Position[]);
      };

      if (toPositionId === "assets") {
        draft.balanceSheet.assets.accounts?.push(accountId);
      } else if (toPositionId === "liabilitiesAndEquity") {
        draft.balanceSheet.liabilitiesAndEquity.accounts?.push(accountId);
      } else {
        const findAndAdd = (positions: Position[]) => {
          for (const position of positions) {
            if (position.id === toPositionId) {
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
    })
  }

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
    <InteractiveBalanceDataContext.Provider value={{
      interactiveBalanceData, setInteractiveBalanceData, draftEntry, setDraftEntry, commitDraft, cancelDraft, accountTotals, updatePositionLabel, addNewPositionTo, addNewAccount, addAccountTo, deletePosition, removeAccountFrom, reorderAccountsInPosition, reorderPositionsInPosition,
      moveAccount, movePosition, assigendAccountIds
    }}>
      {children}
    </InteractiveBalanceDataContext.Provider>
  );
};