const LOCALE = 'de-DE';

export function formatCurrency(value: number): string {
    const normalized = value === 0 ? 0 : value;
    return normalized.toLocaleString(LOCALE, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) + ' €';
}

export function formatNumber(value: number): string {
    return value.toLocaleString(LOCALE, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function parseGermanNumber(input: string): number {
    const normalize = input
        .replace(/\./g, '')
        .replace(',', '.');
    return Number(parseFloat(normalize).toFixed(2));
}


export function isValidGermanNumber(input: string): boolean {
    return !isNaN(parseGermanNumber(input));
}