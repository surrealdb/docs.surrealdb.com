// Retrieve arguments as a string
export function args(): string {
    return process.argv.slice(2).join(' ');
}

// Slugify a string to create a valid filename
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .replace(/(\s|\.)+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}
