import { Anchor, Box, Flex, Image, Paper, Text, Title } from "@mantine/core";
import { pictoSurrealDB } from "@surrealdb/ui";
import placeholderAvatar from "~/assets/img/labs-authors/placeholder.avif";
import catDemosDark from "~/assets/img/labs-categories/demos.avif";
import catDemosLight from "~/assets/img/labs-categories/demos.light.avif";
import catIntegrationsDark from "~/assets/img/labs-categories/integrations.avif";
import catIntegrationsLight from "~/assets/img/labs-categories/integrations.light.avif";
import catLibrariesDark from "~/assets/img/labs-categories/libraries.avif";
import catLibrariesLight from "~/assets/img/labs-categories/libraries.light.avif";
import catTutorialsDark from "~/assets/img/labs-categories/tutorials.avif";
import catTutorialsLight from "~/assets/img/labs-categories/tutorials.light.avif";
import catVideosDark from "~/assets/img/labs-categories/videos.avif";
import catVideosLight from "~/assets/img/labs-categories/videos.light.avif";
import type { LabCategory } from "~/content/config";
import classes from "./style.module.scss";

export interface LabCardItem {
    slug: string;
    title: string;
    url?: string;
    category: LabCategory;
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

const CATEGORY_IMAGES: Record<LabCategory, { dark: string; light: string }> = {
    "Code repositories": { dark: catLibrariesDark, light: catLibrariesLight },
    Videos: { dark: catVideosDark, light: catVideosLight },
    Blogposts: { dark: catTutorialsDark, light: catTutorialsLight },
    Documentation: { dark: catIntegrationsDark, light: catIntegrationsLight },
    "Learning Resources": { dark: catDemosDark, light: catDemosLight },
};

function getAuthorAvatarUrl(slug: string): string {
    return new URL(`../../assets/img/labs-authors/${slug}.jpg`, import.meta.url).href;
}

export function LabCard({ item, isDark }: LabCardProps) {
    const categoryImages = CATEGORY_IMAGES[item.category];
    const categoryImage = isDark ? categoryImages.dark : categoryImages.light;

    let authorName: string;
    let authorRole: string;
    let avatarSrc: string;

    if (item.author === "surrealdb") {
        authorName = "SurrealDB";
        authorRole = "Official";
        avatarSrc = pictoSurrealDB;
    } else {
        authorName = item.author.name;
        authorRole = item.author.role;
        avatarSrc = getAuthorAvatarUrl(item.author.avatar);
    }

    const href = item.url || "#";

    return (
        <Anchor
            href={href}
            underline="never"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
            <Paper
                className={classes.root}
                radius="4px"
                h="320px"
            >
                <Box className={classes.image}>
                    <Image
                        src={categoryImage}
                        alt=""
                    />
                </Box>
                <Box className={classes.body}>
                    <Text
                        fz="xs"
                        c="surreal"
                        fw={500}
                    >
                        {item.category}
                    </Text>
                    <Title
                        order={3}
                        fz="md"
                        c="bright"
                        lineClamp={2}
                    >
                        {item.title}
                    </Title>

                    {item.topics.length > 0 && (
                        <Flex
                            gap="xs"
                            wrap="wrap"
                        >
                            {item.topics.map((topic) => (
                                <Box
                                    component="span"
                                    key={topic}
                                    className={classes.topicBadge}
                                >
                                    {topic}
                                </Box>
                            ))}
                        </Flex>
                    )}

                    <Box className={classes.footer}>
                        <Image
                            src={avatarSrc}
                            alt={authorName}
                            className={classes.avatar}
                            fallbackSrc={placeholderAvatar}
                        />
                        <Box>
                            <Text
                                fz="sm"
                                c="bright"
                                fw={500}
                                lh={1.3}
                            >
                                {authorName}
                            </Text>
                            <Text
                                fz="xs"
                                c="dimmed"
                                lh={1.3}
                            >
                                {authorRole}
                            </Text>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Anchor>
    );
}
