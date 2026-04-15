import {
    Anchor,
    Box,
    Button,
    Flex,
    Image,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import {
    brandDotNet,
    brandGo,
    brandJava,
    brandJavaScript,
    brandPHP,
    brandPython,
    brandRust,
    Icon,
    iconArrowUpRight,
    pictoCloud,
    pictoDocument,
    pictoEmbeddingg,
    pictoFullTextSearch,
    pictoGeospatial,
    pictoGraph,
    pictoIntegrations,
    pictoPadlockClosed,
    pictoQL,
    pictoSDKs,
    pictoSurrealism,
    pictoSurrealist,
    pictoTimeSeries,
    pictoTutorials,
    pictoUniversity,
    pictoVectorSearch,
} from "@surrealdb/ui";
import { SearchDocs } from "~/components/SearchDocs";
import classes from "./style.module.scss";

interface ProductItem {
    title: string;
    description: string;
    href: string;
    icon: string;
}

interface SdkItem {
    label: string;
    href: string;
    icon: string;
}

const SDKS: SdkItem[] = [
    {
        label: "JavaScript",
        href: "/docs/start/languages/javascript/overview",
        icon: brandJavaScript,
    },
    { label: "Python", href: "/docs/start/languages/python", icon: brandPython },
    { label: "Rust", href: "/docs/start/languages/rust/overview", icon: brandRust },
    { label: "Go", href: "/docs/start/languages/golang", icon: brandGo },
    { label: "Java", href: "/docs/start/languages/java", icon: brandJava },
    { label: "PHP", href: "/docs/start/languages/php", icon: brandPHP },
    { label: ".NET", href: "/docs/start/languages/dotnet", icon: brandDotNet },
];

const PRODUCTS: ProductItem[] = [
    {
        title: "SurrealQL",
        description:
            "Statements, functions, operators, and data types for modelling and querying your data.",
        href: "/docs/reference/query-language",
        icon: pictoQL,
    },
    {
        title: "Surrealist",
        description: "The official app for writing queries, designing schemas, and exploring data.",
        href: "/docs/explore/surrealist",
        icon: pictoSurrealist,
    },
    {
        title: "SurrealDB Cloud",
        description: "Provision instances, adjust capacity, and manage backups on SurrealDB Cloud.",
        href: "/docs/build/deployment/surrealdb-cloud/what-is-surrealdb-cloud",
        icon: pictoCloud,
    },
    {
        title: "Extensions",
        description:
            "Add Rust modules and WASM plugins, and call them from SurrealQL for custom behaviour.",
        href: "/docs/learn/extensions",
        icon: pictoSurrealism,
    },
    {
        title: "Authentication",
        description: "System users, record access, and token-based auth for securing your data.",
        href: "/docs/learn/security/authentication/authentication",
        icon: pictoPadlockClosed,
    },
    {
        title: "CLI",
        description: "Install, configure, and operate SurrealDB from the command line.",
        href: "/docs/reference/cli",
        icon: pictoQL,
    },
];

const DATA_MODELS: ProductItem[] = [
    {
        title: "Document",
        description:
            "Store nested records and relationships in flexible documents, with schema modes from schemaless to strict.",
        href: "/docs/learn/data-models/document/overview",
        icon: pictoDocument,
    },
    {
        title: "Graph",
        description:
            "Model nodes and edges for social graphs, recommendations, fraud patterns, and graph traversals in SurrealQL.",
        href: "/docs/learn/data-models/graph/overview",
        icon: pictoGraph,
    },
    {
        title: "Vector",
        description:
            "Index and search embeddings for similarity, hybrid retrieval, and RAG-style AI workloads.",
        href: "/docs/learn/data-models/vector-search/overview",
        icon: pictoVectorSearch,
    },
    {
        title: "Full-Text Search",
        description:
            "Analysers, tokenisers, and search indexes for relevance-ranked text queries beyond exact matches.",
        href: "/docs/learn/data-models/full-text-search/overview",
        icon: pictoFullTextSearch,
    },
    {
        title: "Time Series",
        description:
            "Time buckets, aggregations, and patterns for telemetry, IoT, and event streams over time.",
        href: "/docs/learn/data-models/time-series/overview",
        icon: pictoTimeSeries,
    },
    {
        title: "Geospatial",
        description:
            "Points, lines, polygons, and distance queries for mapping, routing, and location-aware applications.",
        href: "/docs/learn/data-models/geospatial/overview",
        icon: pictoGeospatial,
    },
];

const INTEGRATIONS: ProductItem[] = [
    {
        title: "AI frameworks",
        description:
            "Wire SurrealDB into agent and LLM frameworks including LangChain, LlamaIndex, CrewAI, and more.",
        href: "/docs/build/integrations/ai-frameworks/overview",
        icon: pictoSDKs,
    },
    {
        title: "Embeddings",
        description:
            "Connect embedding and model providers to generate and store vectors alongside your records.",
        href: "/docs/build/integrations/embeddings-providers/overview",
        icon: pictoEmbeddingg,
    },
    {
        title: "Data management",
        description:
            "Move and sync data with ELT tools and automation platforms such as Airbyte, Fivetran, and n8n.",
        href: "/docs/build/integrations/data-management/overview",
        icon: pictoIntegrations,
    },
];

const LEARN: ProductItem[] = [
    {
        title: "SurrealDB University",
        description:
            "Courses and video content to build practical SurrealDB skills from the ground up.",
        href: "https://surrealdb.com/learn",
        icon: pictoUniversity,
    },
    {
        title: "Aeon's Surreal Renaissance",
        description:
            "A narrative-led book that teaches SurrealDB and SurrealQL chapter by chapter.",
        href: "https://surrealdb.com/learn/book",
        icon: pictoSurrealism,
    },
    {
        title: "Knowledge graph tutorial",
        description:
            "Step-by-step guide to modelling and querying a knowledge graph for AI use cases.",
        href: "/docs/explore/tutorials/tutorials/how-to-build-a-knowledge-graph-for-ai",
        icon: pictoTutorials,
    },
    {
        title: "Tutorials",
        description: "Hands-on walkthroughs for authentication, agents, deployment, and more.",
        href: "/docs/explore/tutorials",
        icon: pictoTutorials,
    },
];

function ProductCard({ title, description, href, icon }: ProductItem) {
    return (
        <Anchor
            href={href}
            underline="never"
            variant="glow"
        >
            <Paper className={classes.productCard}>
                <Icon
                    path={iconArrowUpRight}
                    size="sm"
                    className={classes.productCardArrow}
                />
                <Flex
                    align="center"
                    gap="sm"
                >
                    <Image
                        src={icon}
                        w={24}
                        h={24}
                    />
                    <Title
                        order={3}
                        fz="md"
                        c="bright"
                    >
                        {title}
                    </Title>
                </Flex>
                <Text
                    fz="sm"
                    c="dimmed"
                >
                    {description}
                </Text>
            </Paper>
        </Anchor>
    );
}

function CompactLink({ title, href, icon }: { title: string; href: string; icon: string }) {
    return (
        <Anchor
            href={href}
            underline="never"
            className={classes.compactLink}
        >
            <Image
                src={icon}
                w={20}
                h={20}
            />
            <Text
                fz="sm"
                c="bright"
                fw={500}
            >
                {title}
            </Text>
        </Anchor>
    );
}

function SdkIcon({ label, href, icon }: SdkItem) {
    return (
        <Anchor
            href={href}
            underline="never"
            className={classes.sdkIcon}
        >
            <Image
                src={icon}
                w={28}
                h={28}
                fit="contain"
            />
            <Text
                fz="xs"
                c="dimmed"
                fw={500}
            >
                {label}
            </Text>
        </Anchor>
    );
}

export default function Page() {
    return (
        <Stack
            gap={60}
            pb="xl"
        >
            <Box
                component="section"
                className={classes.heroSection}
                mt="xl"
            >
                <SimpleGrid
                    cols={{ base: 1, lg: 2 }}
                    spacing="xl"
                >
                    <Stack
                        justify="center"
                        gap="md"
                        maw={450}
                    >
                        <Title
                            order={1}
                            fz={36}
                            c="bright"
                        >
                            SurrealDB Documentation
                        </Title>
                        <Text
                            fz="lg"
                            c="dimmed"
                            maw={560}
                        >
                            Query with SurrealQL, connect from any SDK, deploy anywhere, and build
                            AI-powered applications — everything you need to get started with
                            SurrealDB.
                        </Text>
                        <SearchDocs mt="sm" />
                    </Stack>

                    <Paper
                        className={classes.gettingStarted}
                        maw={400}
                        ml={{ md: "auto" }}
                    >
                        <Stack gap="md">
                            <Box>
                                <Title
                                    order={2}
                                    fz="xl"
                                    c="bright"
                                >
                                    Getting Started
                                </Title>
                                <Text
                                    fz="sm"
                                    c="dimmed"
                                    mt={4}
                                >
                                    Set up and connect to SurrealDB in minutes
                                </Text>
                            </Box>
                            <SimpleGrid
                                cols={4}
                                spacing="xs"
                                mt="sm"
                            >
                                {SDKS.map((sdk) => (
                                    <SdkIcon
                                        key={sdk.href}
                                        {...sdk}
                                    />
                                ))}
                            </SimpleGrid>
                            <Anchor
                                href="/docs/start"
                                underline="never"
                            >
                                <Button
                                    variant="light"
                                    fullWidth
                                >
                                    Start with SurrealDB
                                </Button>
                            </Anchor>
                        </Stack>
                    </Paper>
                </SimpleGrid>
            </Box>

            <Box component="section">
                <Title
                    order={2}
                    fz="xl"
                    c="bright"
                    mb="md"
                >
                    Guides
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                    {PRODUCTS.map((item) => (
                        <ProductCard
                            key={item.href}
                            {...item}
                        />
                    ))}
                </SimpleGrid>
            </Box>

            <Box
                component="section"
                className={classes.splitSection}
            >
                <Title
                    order={2}
                    fz="xl"
                    c="bright"
                >
                    Data Models
                </Title>
                <SimpleGrid cols={{ base: 2, sm: 3 }}>
                    {DATA_MODELS.map((item) => (
                        <CompactLink
                            key={item.href}
                            title={item.title}
                            href={item.href}
                            icon={item.icon}
                        />
                    ))}
                </SimpleGrid>
            </Box>

            <Box
                component="section"
                className={classes.splitSection}
            >
                <Title
                    order={2}
                    fz="xl"
                    c="bright"
                >
                    AI & Integrations
                </Title>
                <SimpleGrid cols={{ base: 2, sm: 3 }}>
                    {INTEGRATIONS.map((item) => (
                        <CompactLink
                            key={item.href}
                            title={item.title}
                            href={item.href}
                            icon={item.icon}
                        />
                    ))}
                </SimpleGrid>
            </Box>

            <Box
                component="section"
                className={classes.splitSection}
            >
                <Title
                    order={2}
                    fz="xl"
                    c="bright"
                >
                    Resources
                </Title>
                <SimpleGrid cols={{ base: 2, sm: 3 }}>
                    {LEARN.map((item) => (
                        <CompactLink
                            key={item.href}
                            title={item.title}
                            href={item.href}
                            icon={item.icon}
                        />
                    ))}
                </SimpleGrid>
            </Box>
        </Stack>
    );
}
