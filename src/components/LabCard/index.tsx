import {
    Anchor,
    Avatar,
    Badge,
    Box,
    CheckboxIndicator,
    Group,
    Paper,
    Text,
    Title,
    UnstyledButton,
} from "@mantine/core";
import { Icon, iconArrowUpRight, iconSurreal, Spacer } from "@surrealdb/ui";
import { memo } from "react";
import placeholderAvatar from "~/assets/img/labs-authors/placeholder.png";
import { labAgeOpacity } from "~/utils/labs";
import classes from "./style.module.scss";

const AUTHOR_AVATARS = import.meta.glob<string>("../../assets/img/labs-authors/*.jpg", {
    eager: true,
    import: "default",
    query: "?url",
}) as Record<string, string>;

export interface LabCardItem {
    slug: string;
    title: string;
    /** `YYYY-MM-DD`; older labs fade, see `labAgeOpacity`. */
    date: string;
    description?: string;
    url?: string;
    format: string;
    author:
        | "surrealdb"
        | {
              name: string;
              role: string;
              avatar: string;
          };
    topics: string[];
    languages?: string[];
}

export interface LabCardProps {
    item: LabCardItem;
    /** When set, the card toggles selection instead of opening its link. Called with the item's slug. */
    onSelect?: (slug: string) => void;
    selected?: boolean;
}

function getAuthorAvatarUrl(slug: string): string | undefined {
    const key = `../../assets/img/labs-authors/${slug}.jpg`;
    return AUTHOR_AVATARS[key];
}

// Memoised: the labs grid re-renders on every filter change, and most cards' props are unchanged.
export const LabCard = memo(function LabCard({ item, onSelect, selected = false }: LabCardProps) {
    let authorName: string;
    let authorRole: string;
    let avatarSrc: string | undefined;

    if (item.author === "surrealdb") {
        authorName = "SurrealDB";
        authorRole = "Official";
    } else {
        authorName = item.author.name;
        authorRole = item.author.role;
        avatarSrc = getAuthorAvatarUrl(item.author.avatar) ?? placeholderAvatar;
    }

    const href = item.url || "#";
    const isExternal = href.startsWith("http");
    const description = item.description?.trim();

    const card = (
        <Paper
            className={classes.root}
            style={{ "--lab-age-opacity": labAgeOpacity(item.date) }}
            radius={0}
            p="lg"
            data-selected={selected || undefined}
        >
            <Group
                gap="sm"
                wrap="nowrap"
                align="flex-start"
            >
                {/* The tick box and the format label share one
                    centre line, whatever their heights; the topics beside
                    them can wrap, so the outer row stays top-aligned. */}
                <Group
                    gap="sm"
                    wrap="nowrap"
                    align="center"
                    miw={0}
                    mih={22}
                >
                    {onSelect && (
                        <CheckboxIndicator
                            variant="surreal"
                            className={classes.tick}
                            checked={selected}
                            color="var(--docs-accent)"
                        />
                    )}
                    {/* Same kicker treatment as the nav dropdowns' section
                        labels, so the format reads as an eyebrow rather
                        than competing with the title. */}
                    <Text
                        className={classes.category}
                        lineClamp={1}
                    >
                        {item.format}
                    </Text>
                </Group>
                <Spacer />
                {item.topics.length > 0 && (
                    // Topics wrap onto further lines rather than
                    // truncating, since an item can carry any number.
                    <Group
                        gap={4}
                        justify="flex-end"
                    >
                        {item.topics.map((topic) => (
                            <Badge
                                key={topic}
                                variant="filled"
                                // A solid tag in the product accent, not Mantine
                                // violet: Lilac on the Database docs, with white
                                // text as on every accent fill.
                                color="var(--docs-accent)"
                                c="var(--docs-accent-contrast)"
                                size="md"
                                radius={0}
                            >
                                {topic}
                            </Badge>
                        ))}
                    </Group>
                )}
            </Group>

            <Title
                mt="md"
                order={3}
                fz="lg"
                fw={500}
                c="bright"
                lineClamp={2}
                lh={1.35}
                className={classes.title}
            >
                {item.title}
            </Title>

            {description && (
                <Text
                    className={classes.description}
                    fz="sm"
                    lineClamp={2}
                    opacity={0.8}
                >
                    {description}
                </Text>
            )}

            <Spacer />

            <Group
                mt="md"
                gap="sm"
            >
                {item.author === "surrealdb" ? (
                    // Official entries carry the brand mark on the
                    // product accent rather than initials.
                    <Avatar
                        size="sm"
                        className={classes.officialAvatar}
                    >
                        <Icon
                            path={iconSurreal}
                            size={18}
                        />
                    </Avatar>
                ) : (
                    <Avatar
                        src={avatarSrc}
                        alt=""
                        size="sm"
                    />
                )}
                <Box>
                    <Text
                        fz="sm"
                        fw={500}
                        lh={1.3}
                        lineClamp={1}
                        c="bright"
                    >
                        {authorName}
                    </Text>
                    <Text
                        fz="xs"
                        lh={1.3}
                        lineClamp={1}
                        c="slate"
                    >
                        {authorRole}
                    </Text>
                </Box>
                <Spacer />
                {isExternal && (
                    <Icon
                        path={iconArrowUpRight}
                        size="sm"
                        className={classes.open}
                        aria-hidden
                    />
                )}
            </Group>
        </Paper>
    );

    if (onSelect) {
        return (
            <UnstyledButton
                className={classes.anchor}
                onClick={() => onSelect(item.slug)}
                aria-pressed={selected}
                display="block"
                w="100%"
                h="100%"
            >
                {card}
            </UnstyledButton>
        );
    }

    return (
        <Anchor
            href={href}
            underline="never"
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={classes.anchor}
            c="unset"
        >
            {card}
        </Anchor>
    );
});
