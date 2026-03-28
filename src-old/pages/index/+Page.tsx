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
        title: "SurrealDB",
        description:
            "Learn about SurrealDB's architecture, installation, configuration, and core concepts.",
        href: "/docs/surrealdb/",
        icon: pictoSurrealDB,
    },
    {
        title: "SurrealQL",
        description:
            "Explore the powerful query language for SurrealDB with statements, functions, operators, and data types.",
        href: "/docs/surrealql/",
        icon: pictoQL,
    },
    {
        title: "Surrealist",
        description:
            "Get started with the official IDE for SurrealDB, featuring a query editor, designer, and explorer.",
        href: "/docs/surrealist/",
        icon: pictoSurrealist,
    },
    {
        title: "Cloud",
        description:
            "Deploy and manage SurrealDB instances in the cloud with automatic scaling and backups.",
        href: "/docs/cloud/",
        icon: pictoCloud,
    },
    {
        title: "Extensions",
        description:
            "Extend SurrealDB with custom modules written in Rust that can be accessed from SurrealQL.",
        href: "/docs/surrealdb/extensions/",
        icon: pictoSurrealism,
    },
];

const SDKS: SdkItem[] = [
    { label: "JavaScript", href: "/docs/sdk/javascript/", icon: brandJavaScript },
    { label: "Python", href: "/docs/sdk/python/", icon: brandPython },
    { label: "Rust", href: "/docs/sdk/rust/", icon: brandRust },
    { label: "Go", href: "/docs/sdk/golang/", icon: brandGo },
    { label: "Java", href: "/docs/sdk/java/", icon: brandJava },
    { label: "PHP", href: "/docs/sdk/php/", icon: brandPHP },
    { label: ".NET", href: "/docs/sdk/dotnet/", icon: brandDotNet },
];

const DATA_MODELS: ProductItem[] = [
    {
        title: "Document",
        description:
            "A flexible way to store data, allowing for nested structures and relationships to be stored within a single document.",
        href: "/docs/surrealdb/models/document",
        icon: pictoDocument,
    },
    {
        title: "Graph",
        description:
            "Store data as nodes and edges to query connected datasets like social networks, recommendation engines, or fraud detection graphs.",
        href: "/docs/surrealdb/models/graph",
        icon: pictoGraph,
    },
    {
        title: "Vector",
        description:
            "Store and query high-dimensional vectors generated from LLM models for AI applications.",
        href: "/docs/surrealdb/models/vector",
        icon: pictoVectorSearch,
    },
    {
        title: "Full-Text Search",
        description:
            "Index and retrieve text-based data based on tokenized and modified text, rather than exact, literal matches.",
        href: "/docs/surrealdb/models/full-text-search",
        icon: pictoFullTextSearch,
    },
    {
        title: "Time Series",
        description:
            "Optimized querying and managing time-stamped data over periods of time or via aggregated table views.",
        href: "/docs/surrealdb/models/time-series",
        icon: pictoTimeSeries,
    },
    {
        title: "Geospatial",
        description:
            "Store and query data related to the Earth's surface using objects including points, lines, polygons, and more.",
        href: "/docs/surrealdb/models/geospatial",
        icon: pictoGeospatial,
    },
];

const INTEGRATIONS: ProductItem[] = [
    {
        title: "Data Management",
        description:
            "SurrealDB integrates with Airbyte, Fivetran, and more to help you manage your data.",
        href: "/docs/integrations/data-management",
        icon: pictoIntegrations,
    },
    {
        title: "Embeddings",
        description:
            "SurrealDB provides a number of different embeddings features that can be used to manage your data.",
        href: "/docs/integrations/embeddings",
        icon: pictoEmbeddingg,
    },
    {
        title: "Frameworks",
        description:
            "SurrealDB integrates with a number of different frameworks to help you build your applications.",
        href: "/docs/integrations/frameworks",
        icon: pictoSDKs,
    },
];

const AUTHENTICATION: ProductItem[] = [
    {
        title: "System Access",
        description:
            "System access is used to authenticate and authorize system users to access the SurrealDB server.",
        href: "/docs/surrealdb/security/authentication",
        icon: pictoPadlockClosed,
    },
    {
        title: "Record Access",
        description:
            "Record access is used to authenticate and authorize record users to access the SurrealDB database.",
        href: "/docs/surrealql/statements/define/access/record",
        icon: pictoBadgeAccess,
    },
    {
        title: "Token Access",
        description:
            "Token access is used to authenticate and authorize users to access the SurrealDB database via a token.",
        href: "/docs/surrealql/statements/define/access/jwt",
        icon: pictoKey,
    },
];

const EDUCATION: ProductItem[] = [
    {
        title: "SurrealDB University",
        description:
            "Watch videos, live streams, and expert talks to quickly learn key SurrealDB concepts and insights.",
        href: "/learn",
        icon: pictoUniversity,
    },
    {
        title: "Aeon's Surreal Renaissance",
        description:
            "Learn SurrealDB through an engaging, story-driven experience that feels like watching a movie.",
        href: "/learn",
        icon: pictoSurrealism,
    },
    {
        title: "Movie Database Tutorial",
        description: "Learn how to build a movie database with SurrealDB and Surrealist.",
        href: "/learn/movies",
        icon: pictoTutorials,
    },
];

const RESOURCES: ResourceItem[] = [
    {
        title: "Integrations",
        description: "Connect SurrealDB with your favorite tools and platforms.",
        href: "/docs/integrations/",
        icon: pictoIntegrations,
    },
    {
        title: "Tutorials",
        description: "Step-by-step guides to build real applications with SurrealDB.",
        href: "/docs/tutorials/",
        icon: pictoTutorials,
    },
    {
        title: "SurrealDB University",
        description: "Structured courses to master SurrealDB from beginner to advanced.",
        href: "/learn",
        icon: pictoUniversity,
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
                    Learn how to get up and running with SurrealDB through tutorials, APIs, and
                    platform resources.
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
