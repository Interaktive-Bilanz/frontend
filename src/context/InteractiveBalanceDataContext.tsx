import React, {createContext, useContext} from "react";
import { InteractiveBalanceData } from "../types/InteractiveBalanceData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import defaultDataJson from "../api/chat_gpt_example.json"

interface InteractiveBalanceDataContextType {
    interactiveBalanceData: InteractiveBalanceData;
    setInteractiveBalanceData: React.Dispatch<React.SetStateAction<InteractiveBalanceData>>;
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
    defaultData
  );

  return (
    <InteractiveBalanceDataContext.Provider value={{ interactiveBalanceData, setInteractiveBalanceData }}>
      {children}
    </InteractiveBalanceDataContext.Provider>
  );
};