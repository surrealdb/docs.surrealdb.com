import { Anchor, Avatar, Badge, Box, Group, Image, Paper, Text, Title } from "@mantine/core";
import {
    Icon,
    iconOpen,
    iconSurreal,
    pictoCurlyBracesSolid,
    pictoFileSolid,
    pictoInboxSolid,
    pictoPlaySolid,
    pictoQuestionSolid,
    Spacer,
} from "@surrealdb/ui";
import placeholderAvatar from "~/assets/img/labs-authors/placeholder.png";
import classes from "./style.module.scss";

const AUTHOR_AVATARS = import.meta.glob<string>("../../assets/img/labs-authors/*.jpg", {
    eager: true,
    import: "default",
    query: "?url",
}) as Record<string, string>;

export interface LabCardItem {
    slug: string;
    title: string;
    description?: string;
    url?: string;
    category: string;
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
}

const CATEGORY_IMAGES: Record<string, string> = {
    "Source code": pictoCurlyBracesSolid,
    Videos: pictoPlaySolid,
    Blogposts: pictoInboxSolid,
    Documentation: pictoFileSolid,
    "Learning resources": pictoQuestionSolid,
};

function getAuthorAvatarUrl(slug: string): string | undefined {
    const key = `../../assets/img/labs-authors/${slug}.jpg`;
    return AUTHOR_AVATARS[key];
}

export function LabCard({ item }: LabCardProps) {
    const categoryImage = CATEGORY_IMAGES[item.category];

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

    return (
        <Anchor
            href={href}
            underline="never"
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={classes.anchor}
            c="unset"
        >
            <Paper
                className={classes.root}
                radius="var(--surreal-radius-card)"
                p="lg"
            >
                <Group
                    gap="sm"
                    wrap="nowrap"
                >
                    {categoryImage && (
                        <Image
                            src={categoryImage}
                            alt=""
                            w={18}
                        />
                    )}
                    {/* Same kicker treatment as the nav dropdowns' section
                        labels, so the category reads as an eyebrow rather
                        than competing with the title. */}
                    <Text
                        className={classes.category}
                        lineClamp={1}
                    >
                        {item.category}
                    </Text>
                    <Spacer />
                    {item.topics.length > 0 && (
                        <Group
                            gap={4}
                            wrap="nowrap"
                        >
                            {item.topics.map((topic) => (
                                <Badge
                                    key={topic}
                                    variant="transparent"
                                    // The product accent, not Mantine violet: brand
                                    // pink on the Database docs in both themes.
                                    color="var(--docs-accent-text)"
                                    size="sm"
                                    // Transparent badges carry no fill, so the
                                    // built-in inset only breaks alignment with
                                    // the card's right padding edge.
                                    px={0}
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
                            path={iconOpen}
                            size="sm"
                            className={classes.open}
                            aria-hidden
                        />
                    )}
                </Group>
            </Paper>
        </Anchor>
    );
}
