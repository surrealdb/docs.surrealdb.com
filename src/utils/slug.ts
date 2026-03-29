export function slug(value = "") {
    return String(value)
        .replace(/[\s.]/gi, "-")
        .replace(/[^a-zA-Z0-9_-]+/g, "")
        .replace(/-{2,}/g, "-")
        .replace(/-+$/g, "") // Only remove trailing dashes
        .toLowerCase();
}
