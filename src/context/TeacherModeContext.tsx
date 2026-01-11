import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';

type TeacherModeContextType = {
    teacherMode: boolean;
    toggleTeacherMode: () => void;
};

const TeacherModeContext = createContext<TeacherModeContextType | null>(null);

export const TeacherModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [teacherMode, setTeacherMode] = useState(false);

    const toggleTeacherMode = useCallback(() => {
        const newValue = !teacherMode;
        setTeacherMode(newValue);
        toast(newValue ? "Teacher mode enabled" : "Teacher mode disabled");
        return newValue;
    }, [teacherMode]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "t") {
                toggleTeacherMode();
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [toggleTeacherMode]);

    return (
        <TeacherModeContext.Provider
            value={{ teacherMode, toggleTeacherMode }}>
            {children}
        </TeacherModeContext.Provider>
    );
};

export const useTeacherMode = () => {
    const ctx = useContext(TeacherModeContext);
    if (!ctx) throw new Error("useTeacherMode must be used within TeacherModeProvider");
    return ctx;
};