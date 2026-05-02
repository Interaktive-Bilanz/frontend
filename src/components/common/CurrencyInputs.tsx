import { useEffect, useRef, useState } from "react";
import { formatNumber, parseGermanNumber } from "../../util/numberFormat";

// src/components/common/CurrencyInput.tsx
interface CurrencyInputProps {
    value: number | null;
    onChange: (value: number | null) => void;
    className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onChange, className }) => {
    const [raw, setRaw] = useState(value != null ? formatNumber(value) : '');
    const isFocused = useRef(false);

    useEffect(() => {
        if (!isFocused.current) {
            setRaw(value != null ? formatNumber(value) : '');
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRaw(e.target.value);
        const parsed = parseGermanNumber(e.target.value);
        onChange(isNaN(parsed) ? null : parsed);
    };

    const handleBlur = () => {
        isFocused.current = false;
        const parsed = parseGermanNumber(raw);
        if (!isNaN(parsed)) setRaw(formatNumber(parsed));
        else setRaw('');
    };

    return (
        <input
            type="text"
            inputMode="decimal"
            value={raw}
            onChange={handleChange}
            onFocus={() => { isFocused.current = true; }}
            onBlur={handleBlur}
            className={className}
        />
    );
};