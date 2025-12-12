import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T, overwrite = false) {
    const [value, setValue] = useState<T>(() => {
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