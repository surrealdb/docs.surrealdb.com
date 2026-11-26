import { useData } from "vike-react/useData";
import { Boxes } from "~/components/Boxes";
import { IconBox } from "~/components/IconBox";
import { getIconScope } from "~/lib/icon-scope";
import type { PageData } from "~/utils/data";
import { docsHref } from "~/utils/navigation";

interface FolderCardsProps {
    /** The folder whose pages are shown, as the sidebar writes paths, such as `/agent-memory/integrations/frameworks`. */
    path: string;
    columns?: 2 | 3;
}

/** A picto name from the icon scope, or the string itself, such as `@ui/brandMastraDark`. */
function pictoSource(name: string | undefined): string | undefined {
    return name ? (getIconScope()[name] ?? name) : undefined;
}

/**
 * A card for each page directly inside a folder, with the page's logo. The
 * logo is the `picto` of the page's frontmatter, with `pictoDark` for the dark
 * theme, so a page added to the folder appears here with no other change.
 */
export function FolderCards({ path, columns = 3 }: FolderCardsProps) {
    const { folders } = useData<PageData>();
    const cards = folders?.[path] ?? [];

    if (cards.length === 0) return null;

    return (
        <Boxes columns={columns}>
            {cards.map((card) => {
                const light = pictoSource(card.picto);
                const dark = pictoSource(card.pictoDark);

                return (
                    <IconBox
                        key={card.path}
                        title={card.title}
                        href={docsHref(card.path)}
                        icon={light && dark ? { light, dark } : light}
                    />
                );
            })}
        </Boxes>
    );
}
