/**
 * Where a reader is on their journey with SurrealDB. Each lab has exactly one,
 * in journey order, and the listing filters and groups by it.
 */
export const labStages = ["Explore", "Learn", "Prototype", "Build", "Operate"] as const;

/** What kind of thing a lab is. Sets the card's icon and eyebrow. */
export const labFormats = [
    "Source code",
    "Video",
    "Article",
    "Documentation",
    "Interactive demo",
] as const;

/**
 * What a lab is about. Subjects only: kinds of content (examples, templates,
 * libraries) are expressed by `labStages` and `labFormats` instead.
 */
export const labTopics = [
    "AI",
    "Cloud",
    "Data management",
    "Financial services",
    "Security",
] as const;

export const labLanguages = [
    "Python",
    "Rust",
    "TypeScript",
    "Go",
    "Java",
    "PHP",
    "SurrealQL",
] as const;

/** A lab keeps full opacity for its first year. */
const FADE_START_DAYS = 365;
/** By three years old a lab has faded to `FADE_MIN_OPACITY`, and stays there. */
const FADE_END_DAYS = 3 * 365;
/** Faded cards stay readable: hover, focus and selection restore them fully. */
const FADE_MIN_OPACITY = 0.5;

/**
 * Opacity for a lab card dated `date` (`YYYY-MM-DD`), so older labs recede.
 *
 * Linear between one and three years. SurrealDB majors have come about 18
 * months apart (2.0 in September 2024, 3.0 in February 2026), so a lab older
 * than a year may predate the current major, and one older than three years
 * predates two of them.
 *
 * Counted in whole UTC days and rounded to two places, so the server render and
 * the browser's hydration agree on the value.
 */
export function labAgeOpacity(date: string, now: Date = new Date()): number {
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const days = (today - Date.parse(date)) / 86_400_000;
    const progress = (days - FADE_START_DAYS) / (FADE_END_DAYS - FADE_START_DAYS);
    const clamped = Math.min(1, Math.max(0, progress));

    return Math.round((1 - clamped * (1 - FADE_MIN_OPACITY)) * 100) / 100;
}
