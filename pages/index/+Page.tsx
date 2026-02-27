import { SearchDocs } from "@components/SearchDocs";
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
    pictoCloud,
    pictoIntegrations,
    pictoML,
    pictoQL,
    pictoSurrealDB,
    pictoSurrealist,
    pictoTutorials,
    pictoUniversity,
} from "@surrealdb/ui";
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
        title: "SurrealML",
        description:
            "Integrate machine learning models directly into your database for intelligent data processing.",
        href: "/docs/surrealml/",
        icon: pictoML,
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
        >
            <Paper className={classes.productCard}>
                <Image
                    className="blend"
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
                    className="blend"
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
            gap="xl"
            pb="xl"
        >
            <Box className={classes.hero}>
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
