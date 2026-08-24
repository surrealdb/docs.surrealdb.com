import { Anchor, Box, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import {
    Icon,
    iconBrandDev,
    iconBrandDiscord,
    iconBrandGitHub,
    iconBrandInstagram,
    iconBrandLinkedin,
    iconBrandMedium,
    iconBrandReddit,
    iconBrandStackOverflow,
    iconBrandX,
    iconBrandYouTube,
} from "@surrealdb/ui";
import { SurrealDBLogo } from "~/components/Logo";
import { FooterLink } from "./link";
import classes from "./style.module.scss";

interface FooterColumn {
    heading: string;
    links: { label: string; href: string }[];
}

/**
 * Link columns, drawn from the apex site's footer and narrowed to what a
 * reader of the documentation is likely to want next. The apex footer runs to
 * six columns and sixty-odd links because it also serves people who have not
 * chosen a product yet; that job is already done by the time someone is here.
 *
 * Paths without a host are resolved against `surrealdb.com`, where the docs are
 * mounted under `/docs`, so an apex link such as `/blog` reaches the apex site.
 */
const COLUMNS: FooterColumn[] = [
    {
        heading: "Documentation",
        links: [
            // Every href here is a direct 200 - a footer that routes through
            // redirects (or, since missing pages became honest 404s, into one)
            // is how /docs/build/sdks shipped dead on every page. There is no
            // SDK overview page, so SDKs takes the JavaScript SDK, matching
            // the apex site's footer.
            { label: "Overview", href: "/docs" },
            { label: "Agent Memory", href: "/docs/agent-memory" },
            { label: "SurrealQL", href: "/docs/reference/query-language" },
            { label: "SDKs", href: "/docs/reference/javascript" },
            { label: "Cloud", href: "/docs/manage/instances" },
            { label: "Labs", href: "/docs/labs" },
        ],
    },
    {
        heading: "Resources",
        links: [
            { label: "University", href: "/learn" },
            { label: "Blog", href: "/blog" },
            { label: "Case studies", href: "/casestudies" },
            { label: "Releases", href: "/releases" },
            { label: "Roadmap", href: "/roadmap" },
            { label: "Events and webinars", href: "/events" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "Contact us", href: "/contact" },
            { label: "Careers", href: "/careers" },
            { label: "Open source", href: "/opensource" },
            { label: "Brand assets", href: "/brand" },
            { label: "Status", href: "https://status.surrealdb.com" },
            {
                label: "Contributing",
                href: "https://github.com/surrealdb/docs.surrealdb.com/blob/main/README.md#contributing-to-the-documentation",
            },
        ],
    },
    {
        heading: "Legal",
        links: [
            { label: "Overview", href: "/legal" },
            { label: "Terms", href: "/legal/category/terms" },
            { label: "Privacy", href: "/legal/category/privacy" },
            { label: "Trust and security", href: "/legal/category/security" },
            { label: "Compliance", href: "/legal/category/compliance" },
            { label: "Licence FAQs", href: "/license" },
        ],
    },
];

/**
 * Community row, matching the apex site: icon-and-label chips rather than bare
 * glyphs, in the same order, so the two footers read as one index.
 */
const COMMUNITY = [
    { label: "Discord", href: "https://discord.gg/surrealdb", icon: iconBrandDiscord },
    { label: "GitHub", href: "https://github.com/surrealdb", icon: iconBrandGitHub },
    { label: "X", href: "https://x.com/surrealdb", icon: iconBrandX },
    { label: "YouTube", href: "https://www.youtube.com/@surrealdb", icon: iconBrandYouTube },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/surrealdb",
        icon: iconBrandLinkedin,
    },
    { label: "Reddit", href: "https://www.reddit.com/r/surrealdb", icon: iconBrandReddit },
    { label: "Instagram", href: "https://www.instagram.com/surrealdb", icon: iconBrandInstagram },
    {
        label: "Stack Overflow",
        href: "https://stackoverflow.com/questions/tagged/surrealdb",
        icon: iconBrandStackOverflow,
    },
    { label: "Medium", href: "https://medium.com/surrealdb", icon: iconBrandMedium },
    { label: "Dev", href: "https://dev.to/surrealdb", icon: iconBrandDev },
];

export function Footer() {
    return (
        <Box
            component="footer"
            role="contentinfo"
            className={classes.root}
        >
            <Box className={classes.inner}>
                {/* Identity block. Holds its own column on wide viewports and
                    stacks above the links when the grid collapses. */}
                {/* Closing statement, carried over from the apex site: wordmark,
                    masthead line, then the two supporting sentences. */}
                <Box className={classes.identity}>
                    <SurrealDBLogo className={classes.logo} />
                    <Text
                        c="bright"
                        fz={{ base: 18, sm: 20, md: 22 }}
                        fw={400}
                        lh={1.2}
                        lts="-0.01em"
                        maw={760}
                    >
                        The unified data layer for AI
                    </Text>
                    <Text
                        c="slate"
                        fz={{ base: 13, sm: 14 }}
                        mt="md"
                        maw={780}
                        lh={1.5}
                    >
                        Graph, vector, document, and relational in one engine.
                        <br />
                        Agent Memory that connects and retrieves context wherever your data lives.
                    </Text>
                </Box>
                <SimpleGrid
                    cols={{ base: 2, sm: 4 }}
                    spacing={32}
                    component="nav"
                    aria-label="SurrealDB footer links"
                    className={classes.columns}
                >
                    {COLUMNS.map((column) => (
                        <Stack
                            key={column.heading}
                            gap={8}
                        >
                            <Text
                                component="h2"
                                fz={11}
                                fw={600}
                                tt="uppercase"
                                className={classes.heading}
                            >
                                {column.heading}
                            </Text>
                            {column.links.map((link) => (
                                <FooterLink
                                    key={link.label}
                                    href={link.href}
                                >
                                    {link.label}
                                </FooterLink>
                            ))}
                        </Stack>
                    ))}
                </SimpleGrid>
                <Stack
                    gap={8}
                    className={classes.community}
                >
                    <Text
                        component="h2"
                        fz={11}
                        fw={600}
                        tt="uppercase"
                        className={classes.heading}
                    >
                        Community
                    </Text>
                    <Group gap={8}>
                        {COMMUNITY.map((item) => (
                            <Anchor
                                key={item.label}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="never"
                                className={classes.socialChip}
                            >
                                <Icon
                                    path={item.icon}
                                    size="sm"
                                />
                                {item.label}
                            </Anchor>
                        ))}
                    </Group>
                </Stack>
            </Box>
            <Box className={classes.baseline}>
                <Text fz={12}>&copy; SurrealDB 2026</Text>
            </Box>
        </Box>
    );
}
