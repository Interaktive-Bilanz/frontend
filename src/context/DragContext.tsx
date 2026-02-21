import React, { createContext, useContext, useState } from "react";

type DropIntent = 'before' | 'inside' | 'after';

type DropIndicator = {
    targetId: string;
    intent: DropIntent;
} | null;

type DragContextType = {
    dropIndicator: DropIndicator;
    setDropIndicator: React.Dispatch<React.SetStateAction<DropIndicator>>;
};

const DragContext = createContext<DragContextType | null>(null);

export const DragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dropIndicator, setDropIndicator] = useState<DropIndicator>(null);

    return (
        <DragContext.Provider value={{ dropIndicator, setDropIndicator }}>
            {children}
        </DragContext.Provider>
    );
};

export const useDragContext = () => {
    const ctx = useContext(DragContext);
    if (!ctx) throw new Error("useDragContext must be used inside <DragProvider>");
    return ctx;
};