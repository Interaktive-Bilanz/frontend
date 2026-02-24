import { useState, useEffect } from "react";
import { useImmer } from 'use-immer';

export function useLocalStorage<T>(key: string, defaultValue: T, overwrite = false) {
    const [value, setValue] = useImmer<T>(() => {
        if (overwrite) return defaultValue;
        const json = window.localStorage.getItem(key);
        return json ? (JSON.parse(json) as T) : defaultValue;
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error("localStorage write failed:", e);
        }
    }, [key, value]);
    return [value, setValue] as const;
}