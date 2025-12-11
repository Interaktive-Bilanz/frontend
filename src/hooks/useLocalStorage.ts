import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T) {
    const [value, setValue] = useState<T>(() => {
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