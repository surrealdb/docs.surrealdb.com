import type { ReactNode } from "react";
import { useData } from "vike-react/useData";
import { Boxes } from "~/components/Boxes";
import { IconBox } from "~/components/IconBox";
import { getIconScope } from "~/lib/icon-scope";
import type { PageData } from "~/utils/data";
import { docsHref, type HubCard } from "~/utils/navigation";

interface SectionCardsProps {
    /**
     * Show only the cards at these sidebar paths, in this order, so a hub can
     * split its groups under headings. Without it every card is shown, in the
     * order of the sidebar.
     */
    paths?: string[];
    /**
     * Show the pages of the section instead of its groups, for a section whose
     * pages are one flat list. Each card says what its page covers.
     */
    pages?: boolean;
    columns?: 2 | 3;
    /** Cards that are not a group of the sidebar, shown after the others. */
    children?: ReactNode;
}

/** Whether a page path is the section path or lies under it, so `/reference/java` does not match `/reference/javascript`. */
function inside(pagePath: string, sectionPath: string): boolean {
    return pagePath === sectionPath || pagePath.startsWith(`${sectionPath}/`);
}

/** A picto name from the icon scope, such as `LightRust`, or the string itself, such as `@ui/pictoAI`. */
function pictoSource(name: string | undefined): string | undefined {
    return name ? (getIconScope()[name] ?? name) : undefined;
}

function iconOf(card: HubCard): { light: string; dark: string } | string | undefined {
    const light = pictoSource(card.picto);
    const dark = pictoSource(card.pictoDark);

    return light && dark ? { light, dark } : light;
}

/**
 * The cards of a section hub page: one for each group of the section's
 * sidebar, or with `pages` one for each page of a flat section.
 *
 * The cards are built from the data the sidebar is drawn from, so a collection
 * that joins the section appears in both, with the same title and order. A
 * group's description and picto come from its `__category.json`, and a page's
 * description from its frontmatter.
 */
export function SectionCards({ paths, pages, columns, children }: SectionCardsProps) {
    const { hub } = useData<PageData>();
    const cards = (pages ? hub?.pages : hub?.cards) ?? [];
    const chosen = paths
        ? paths.flatMap((path) => cards.find((card) => inside(card.path, path)) ?? [])
        : cards;

    if (chosen.length === 0 && !children) return null;

    return (
        <Boxes columns={columns}>
            {chosen.map((card) => (
                <IconBox
                    key={card.path}
                    title={card.title}
                    description={card.description}
                    href={docsHref(card.path)}
                    icon={iconOf(card)}
                />
            ))}
            {children}
        </Boxes>
    );
}
