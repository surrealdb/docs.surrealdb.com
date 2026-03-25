export function getCollectionPartsFromURL(urlPathname: string, sliceIndex = 3): string[] {
    const parts: string[] = urlPathname.split("/").slice(sliceIndex).filter(Boolean);

    if (parts.length === 0) {
        return [...parts, "index"];
    }

    return parts;
}
