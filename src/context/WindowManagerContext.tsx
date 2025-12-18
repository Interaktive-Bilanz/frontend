import { createContext, useContext } from "react";
import { WindowData } from "../util/WindowManager"; 

interface WindowManagerContextType {
    openWindow: (data: WindowData) => void;
    closeWindow: (data: WindowData) => void;
    closeAllWindowsExcept: (data: WindowData | null) => void;
    bringToFront: (data: WindowData) => void;
}

export const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export function useWindowManager() {
    const ctx = useContext(WindowManagerContext);
    if (!ctx) throw new Error("useWindowManager must be used inside <WindowManagerProvider>");
    return ctx;
}