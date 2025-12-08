export function pickRandom<T>(items: T[], count: number): T[] {
    if (items.length <= count) return items
    return [...items]
        .sort(() => Math.random() - 0.5)
        .slice(0, count)
}