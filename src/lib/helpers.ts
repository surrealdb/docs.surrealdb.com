function buildString(input: TemplateStringsArray | string, vals: unknown[]): string {
    if (typeof input === "string") {
        return input;
    }

    return input.reduce(
        (acc, part, idx) => acc + part + (idx < vals.length ? String(vals[idx]) : ""),
        "",
    );
}

function normalizeIndentation(value: string): string {
    const lines = value.replace(/\r\n/g, "\n").split("\n");

    // Trim empty lines at the start and end to avoid shifting indentation.
    while (lines.length && lines[0].trim() === "") lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();

    const indents = lines
        .filter((line) => line.trim() !== "")
        .map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0);

    const minIndent = indents.length ? Math.min(...indents) : 0;

    return lines.map((line) => line.slice(minIndent)).join("\n");
}

/**
 * Remove the smallest common leading whitespace from every line of a string.
 */
export function dedent(strings: TemplateStringsArray | string, ...values: unknown[]): string {
    return normalizeIndentation(buildString(strings, values));
}
