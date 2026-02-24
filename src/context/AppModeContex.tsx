import React, { createContext, useState, useContext, useEffect } from "react";


export type AppMode = 'standard' | 'edit' | 'teacher';

const MODE_LEVEL: Record<AppMode, number> = {
    standard: 0,
    edit: 1,
    teacher: 2
};

type AppModeContextType = {
    appMode: AppMode;
    isTeacherFromUrl: boolean;
    setAppMode: (mode: AppMode) => void;
    cycleMode: () => void;
};

const AppModeContext = createContext<AppModeContextType | null>(null);

export function hasAccess(current: AppMode, required: AppMode): boolean {
    return MODE_LEVEL[current] >= MODE_LEVEL[required];
}

const modes = Object.entries(MODE_LEVEL)
    .sort((a, b) => a[1] - b[1])
    .map(([mode]) => mode) as AppMode[];

const nextMode = (current: AppMode): AppMode => {
    const index = modes.indexOf(current);
    return modes[(index + 1) % modes.length];
};

export const AppModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isTeacherFromUrl = new URLSearchParams(window.location.search).get('mode') === 'teacher';

    const [appMode, setAppMode] = useState<AppMode>(isTeacherFromUrl ? 'teacher' : 'standard');

    const cycleMode = () => {
        let nextModeCheck = nextMode(appMode);
        if (nextModeCheck === "teacher" && !isTeacherFromUrl) nextModeCheck = nextMode(nextModeCheck);
        setAppMode(nextModeCheck);
    };

    return (
        <AppModeContext.Provider
            value={{ appMode, isTeacherFromUrl, setAppMode, cycleMode }}>
            {children}
        </AppModeContext.Provider>
    )
};

export const useAppMode = () => {
    const ctx = useContext(AppModeContext);
    if (!ctx) throw new Error("useTeacherMode must be used within TeacherModeProvider");
    return ctx;
};
