import { Anchor, Box, Image, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
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
    pictoBadgeAccess,
    pictoCloud,
    pictoDocument,
    pictoEmbeddingg,
    pictoFullTextSearch,
    pictoGeospatial,
    pictoGraph,
    pictoIntegrations,
    pictoKey,
    pictoPadlockClosed,
    pictoQL,
    pictoSDKs,
    pictoSurrealDB,
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

interface ResourceItem {
    title: string;
    description: string;
    href: string;
    icon: string;
}

const PRODUCTS: ProductItem[] = [
    {
        title: "Getting started",
        description:
            "Install SurrealDB, run your first queries, and work through core concepts with the guided introduction.",
        href: "/docs/start",
        icon: pictoSurrealDB,
    },
    {
        title: "Query language",
        description:
            "SurrealQL statements, functions, operators, and data types for modelling and querying your data.",
        href: "/docs/reference/query-language",
        icon: pictoQL,
    },
    {
        title: "Surrealist",
        description:
            "The official app for writing queries, designing schemas, and exploring data in SurrealDB.",
        href: "/docs/explore/surrealist",
        icon: pictoSurrealist,
    },
    {
        title: "Cloud",
        description:
            "Provision instances, adjust capacity, and manage backups for SurrealDB on SurrealDB Cloud.",
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
];

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
            "Analyzers, tokenisers, and search indexes for relevance-ranked text queries beyond exact matches.",
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
        title: "Data management",
        description:
            "Move and sync data with ELT tools and automation platforms such as Airbyte, Fivetran, and n8n.",
        href: "/docs/build/integrations/data-management/overview",
        icon: pictoIntegrations,
    },
    {
        title: "Embeddings",
        description:
            "Connect embedding and model providers to generate and store vectors alongside your records.",
        href: "/docs/build/integrations/embeddings-providers/overview",
        icon: pictoEmbeddingg,
    },
    {
        title: "AI frameworks",
        description:
            "Wire SurrealDB into agent and LLM frameworks including LangChain, LlamaIndex, CrewAI, and more.",
        href: "/docs/build/integrations/ai-frameworks/overview",
        icon: pictoSDKs,
    },
];

const AUTHENTICATION: ProductItem[] = [
    {
        title: "Authentication",
        description:
            "System users, record users, and access methods: how credentials map to roles and permissions.",
        href: "/docs/learn/security/authentication/authentication",
        icon: pictoPadlockClosed,
    },
    {
        title: "Record access",
        description:
            "Define ACCESS methods so application users sign up, sign in, and authenticate as records.",
        href: "/docs/reference/query-language/statements/define/access/record",
        icon: pictoBadgeAccess,
    },
    {
        title: "Token access",
        description:
            "JWT and bearer access for verifying tokens issued by SurrealDB or external identity providers.",
        href: "/docs/reference/query-language/statements/define/access/jwt",
        icon: pictoKey,
    },
];

const EDUCATION: ProductItem[] = [
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
];

const RESOURCES: ResourceItem[] = [
    {
        title: "Integrations",
        description:
            "AI frameworks, embeddings providers, agents, and data tooling wired to SurrealDB.",
        href: "/docs/build/integrations",
        icon: pictoIntegrations,
    },
    {
        title: "Tutorials",
        description: "Hands-on walkthroughs for authentication, agents, deployment, and more.",
        href: "/docs/explore/tutorials",
        icon: pictoTutorials,
    },
    {
        title: "SurrealDB CLI",
        description: "Install, configure, and operate SurrealDB from the command line.",
        href: "/docs/reference/cli",
        icon: pictoQL,
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
                <Image
                    src={icon}
                    w={36}
                    h={36}
                />
                <Box>
                    <Title
                        order={3}
                        fz="lg"
                        c="bright"
                    >
                        {title}
                    </Title>
                    <Text
                        fz="sm"
                        c="dimmed"
                    >
                        {description}
                    </Text>
                </Box>
            </Paper>
        </Anchor>
    );
}

function SdkCard({ label, href, icon }: SdkItem) {
    return (
        <Anchor
            href={href}
            underline="never"
        >
            <Paper className={classes.sdkCard}>
                <Image
                    src={icon}
                    w={28}
                    h={28}
                    fit="contain"
                />
                <Text
                    fz="sm"
                    c="bright"
                    fw={500}
                >
                    {label}
                </Text>
            </Paper>
        </Anchor>
    );
}

function ResourceCard({ title, description, href, icon }: ResourceItem) {
    return (
        <Anchor
            href={href}
            underline="never"
        >
            <Paper className={classes.resourceCard}>
                <Image
                    src={icon}
                    w={32}
                    h={32}
                />
                <Box flex={1}>
                    <Text
                        fz="md"
                        c="bright"
                        fw={600}
                    >
                        {title}
                    </Text>
                    <Text
                        fz="sm"
                        c="dimmed"
                    >
                        {description}
                    </Text>
                </Box>
                <Icon
                    path={iconArrowUpRight}
                    size="sm"
                />
            </Paper>
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
                className={classes.hero}
                component="main"
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
                    mt="sm"
                    maw={560}
                    mx="auto"
                >
                    SurrealQL, SDKs, deployment guides, and integrations—everything you need to
                    build with SurrealDB.
                </Text>
                <SearchDocs
                    maw={500}
                    mx="auto"
                    mt="xl"
                />
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
                    {PRODUCTS.map((product) => (
                        <ProductCard
                            key={product.href}
                            {...product}
                        />
                    ))}
                </SimpleGrid>
            </Box>

            <Box component="section">
                <Title
                    order={2}
                    fz="xl"
                    c="bright"
                    mb="md"
                >
                    Client Libraries
                </Title>
                <SimpleGrid cols={{ base: 3, sm: 4, lg: 7 }}>
                    {SDKS.map((sdk) => (
                        <SdkCard
                            key={sdk.href}
                            {...sdk}
                        />
                    ))}
                </SimpleGrid>
            </Box>

            <Box component="section">
                <Title
                    order={2}
                    fz="xl"
                    c="bright"
                    mb="md"
                >
                    Data Models
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    {DATA_MODELS.map((item) => (
                        <ProductCard
                            key={item.href}
                            {...item}
                        />
                    ))}
                </SimpleGrid>
            </Box>

            <Box component="section">
                <Title
                    order={2}
                    fz="xl"
                    c="bright"
                    mb="md"
                >
                    Integrations
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    {INTEGRATIONS.map((item) => (
                        <ProductCard
                            key={item.href}
                            {...item}
                        />
                    ))}
                </SimpleGrid>
            </Box>

            <Box component="section">
                <Title
                    order={2}
                    fz="xl"
                    c="bright"
                    mb="md"
                >
                    Authentication
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    {AUTHENTICATION.map((item) => (
                        <ProductCard
                            key={item.href}
                            {...item}
                        />
                    ))}
                </SimpleGrid>
            </Box>

            <Box component="section">
                <Title
                    order={2}
                    fz="xl"
                    c="bright"
                    mb="md"
                >
                    Education
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    {EDUCATION.map((item) => (
                        <ProductCard
                            key={item.href}
                            {...item}
                        />
                    ))}
                </SimpleGrid>
            </Box>

            <Box component="section">
                <Title
                    order={2}
                    fz="xl"
                    c="bright"
                    mb="md"
                >
                    Additional Resources
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    {RESOURCES.map((resource) => (
                        <ResourceCard
                            key={resource.href}
                            {...resource}
                        />
                    ))}
                </SimpleGrid>
            </Box>
        </Stack>
    );
}
