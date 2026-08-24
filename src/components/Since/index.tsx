import { Badge, type BadgeProps } from "@mantine/core";

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
 */
export function Since({ v, prefix, ...props }: SinceProps) {
    return (
        <Badge
            component="span"
            variant="outline"
            color="violet"
            tt="uppercase"
            size="sm"
            style={{ fontFamily: "var(--mantine-font-family-monospace)" }}
            {...props}
        >
            {`${prefix !== undefined ? prefix : "Available since: "}${v}`}
        </Badge>
    );
}
