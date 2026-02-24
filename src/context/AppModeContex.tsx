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
};

const AppModeContext = createContext<AppModeContextType | null>(null);

export function hasAccess(current: AppMode, required: AppMode): boolean {
    return MODE_LEVEL[current] >= MODE_LEVEL[required];
}

export const AppModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isTeacherFromUrl = new URLSearchParams(window.location.search).get('mode') === 'teacher';

    const [appMode, setAppMode] = useState<AppMode>(isTeacherFromUrl ? 'teacher' : 'standard');

    // useEffect(() => {
    //     const params = new URLSearchParams(window.location.search);
    //     if (params.get('mode') === 'teacher') {
    //         setAppMode('teacher');
    //     }
    // }, []);

    return (
        <AppModeContext.Provider
            value={{ appMode, isTeacherFromUrl, setAppMode }}>
            {children}
        </AppModeContext.Provider>
    )
};

export const useAppMode = () => {
    const ctx = useContext(AppModeContext);
    if (!ctx) throw new Error("useTeacherMode must be used within TeacherModeProvider");
    return ctx;
};
