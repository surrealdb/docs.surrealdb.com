import { Anchor, Badge, Box, Group, Image, Stack, Text } from "@mantine/core";
import classes from "./style.module.scss";

interface ShowcaseCardProps {
    title: string;
    description: string;
    href: string;
    /** A 16:9 thumbnail, as a path under `public/`, such as `/docs/showcase/pompeii/thumb.webp`. */
    image: string;
    /** What the thumbnail shows, for readers who cannot see it. */
    alt: string;
    /** The Agent Memory features the demo shows, such as `asOf` or `Citations`. */
    tags?: string[];
}

/**
 * A card for one showcase demo, with a thumbnail above the title.
 *
 * An `IconBox` carries a 20px icon, which is right for navigation but too small
 * to tell one demo from another. A demo is recognised by what it looks like, so
 * this card leads with a picture of it. Place several inside `<Boxes>`.
 */
export function ShowcaseCard({ title, description, href, image, alt, tags }: ShowcaseCardProps) {
    return (
        <Anchor
            href={href}
            underline="never"
            className={classes.card}
        >
            <Box className={classes.thumb}>
                <Image
                    src={image}
                    alt={alt}
                    loading="lazy"
                    className={classes.image}
                />
            </Box>
            <Stack
                gap="xs"
                p="md"
                className={classes.body}
            >
                <Text
                    fw={500}
                    fz="lg"
                    c="bright"
                >
                    {title}
                </Text>
                <Text
                    className={classes.description}
                    opacity={0.8}
                >
                    {description}
                </Text>
                {tags && tags.length > 0 && (
                    <Group
                        gap={6}
                        mt="auto"
                        pt="xs"
                    >
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="light"
                                color="violet"
                                size="sm"
                                tt="none"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </Group>
                )}
            </Stack>
        </Anchor>
    );
}
