import { Anchor, Avatar, Badge, Box, Group, Image, Paper, Text, Title } from "@mantine/core";
import {
    pictoCurlyBraces,
    pictoFile,
    pictoInbox,
    pictoPlay,
    pictoQuestion,
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
    isDark: boolean;
}

const CATEGORY_IMAGES: Record<string, string> = {
    "Source code": pictoCurlyBraces,
    Videos: pictoPlay,
    Blogposts: pictoInbox,
    Documentation: pictoFile,
    "Learning resources": pictoQuestion,
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
    const description = item.description?.trim();

    return (
        <Anchor
            href={href}
            underline="never"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={classes.anchor}
            c="unset"
        >
            <Paper
                className={classes.root}
                withBorder
                radius="sm"
                p="md"
            >
                <Group>
                    {categoryImage && (
                        <Image
                            src={categoryImage}
                            alt=""
                            w={20}
                        />
                    )}
                    <Text
                        className={classes.category}
                        fz="sm"
                        fw={500}
                        lineClamp={2}
                        opacity={0.8}
                    >
                        {item.category}
                    </Text>
                    <Spacer />
                    {item.topics.length > 0 && (
                        <Group gap="xs">
                            {item.topics.map((topic) => (
                                <Badge
                                    key={topic}
                                    variant="transparent"
                                    color="violet"
                                    size="sm"
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
                    fz="xl"
                    c="bright"
                    lineClamp={2}
                    lh={1.35}
                >
                    {item.title}
                </Title>

                {description && (
                    <Text
                        lineClamp={2}
                        opacity={0.85}
                    >
                        {description}
                    </Text>
                )}

                <Spacer />

                <Group mt="sm">
                    <Avatar
                        src={avatarSrc}
                        alt=""
                        className={classes.avatar}
                        name={authorName === "SurrealDB" ? "SD" : undefined}
                        size="sm"
                    />
                    <Box>
                        <Text
                            fz="sm"
                            fw={500}
                            lh={1.3}
                            lineClamp={1}
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
                </Group>
            </Paper>
        </Anchor>
    );
}
