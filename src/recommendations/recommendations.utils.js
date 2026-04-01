export function getTopKeysFromMap(scoreMap, limit = 3) {
    if (!scoreMap) return [];

    const entries = Object.entries(scoreMap instanceof Map ? Object.fromEntries(scoreMap) : scoreMap);

    return entries
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([key]) => key);
}

export function updatePricePreference(currentPref, newPrice) {
    if (typeof newPrice !== "number" || !Number.isFinite(newPrice)) {
        return currentPref || { min: null, max: null };
    }

    const min = currentPref?.min ?? newPrice;
    const max = currentPref?.max ?? newPrice;

    return {
        min: Math.min(min, newPrice),
        max: Math.max(max, newPrice),
    };
}