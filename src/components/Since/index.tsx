import { Badge, type BadgeProps } from "@mantine/core";
import { isSinceRelevant, useMajorVersion } from "~/utils/major-version";

export interface SinceProps extends Omit<BadgeProps, "children"> {
    v: string;
    prefix?: string;
}

/**
 * Version badge for markdown content, overriding the identically-styled
 * component from `@surrealdb/ui` for one reason: this one renders as a
 * `span`. The kit's version renders Mantine's default `div`, and markdown
 * places the badge inside a `<p>`, where a `div` is invalid HTML. The
 * browser repairs the nesting while parsing, the repaired DOM no longer
 * matches the server-rendered tree, and React abandons hydration and
 * re-renders every page from scratch (minified error #418) - which is
 * where much of the slow tab-spinner went.
 *
 * The badge renders nothing when it dates something at or below the `.0.0`
 * of the major version the reader has selected, because everything shown
 * for that version already has it. A reader on 4.x sees badges from 4.1
 * onwards, and a reader on 3.x sees 3.1 to 3.3 and anything 4.x-only.
 */
export function Since({ v, prefix, ...props }: SinceProps) {
    const { major } = useMajorVersion();

    if (!isSinceRelevant(v, major)) return null;

    return (
        <Badge
            component="span"
            variant="light"
            bd={0}
            bg="rgba(from var(--docs-accent) r g b / 0.12)"
            c="var(--docs-accent-text)"
            tt="uppercase"
            size="sm"
            style={{ fontFamily: "var(--mantine-font-family-monospace)" }}
            {...props}
        >
            {`${prefix !== undefined ? prefix : "Available since: "}${v}`}
        </Badge>
    );
}
