import React, { createContext, useContext, useState } from "react";

type DropIntent = 'before' | 'inside' | 'after';

type DropIndicator = {
    targetId: string;
    intent: DropIntent;
} | null;

type DragContextType = {
    dropIndicator: DropIndicator;
    setDropIndicator: React.Dispatch<React.SetStateAction<DropIndicator>>;
    openPositionIds: Set<string>;
    addOpenPositionId: (id: string) => void;
    clearOpenPositionIds: () => void;
    toggleOpenPositionId: (id: string) => void;
    setOpenPositionIds: React.Dispatch<React.SetStateAction<Set<string>>>;
};

const DragContext = createContext<DragContextType | null>(null);

export const DragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dropIndicator, setDropIndicator] = useState<DropIndicator>(null);
    const [openPositionIds, setOpenPositionIds] = useState<Set<string>>(new Set());

    const addOpenPositionId = (id: string) => {
        setOpenPositionIds(prev => new Set(prev).add(id));
    };

    const clearOpenPositionIds = () => {
        setOpenPositionIds(new Set());
    };

    const toggleOpenPositionId = (id: string) => {
        setOpenPositionIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <DragContext.Provider value={{ dropIndicator, setDropIndicator, openPositionIds, setOpenPositionIds, addOpenPositionId, clearOpenPositionIds, toggleOpenPositionId }}>
            {children}
        </DragContext.Provider>
    );
};

export const useDragContext = () => {
    const ctx = useContext(DragContext);
    if (!ctx) throw new Error("useDragContext must be used inside <DragProvider>");
    return ctx;
};