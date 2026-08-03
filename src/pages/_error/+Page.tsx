import { Anchor, Box, Button, Flex, Group, Stack, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { ProductList } from "~/components/Layout/product-switcher";
import classes from "./style.module.scss";

const errors: Record<number, { title: string; message: string }> = {
    401: {
        title: "Unauthorized",
        message: "You need to be authenticated to access this page. Please sign in and try again.",
    },
    403: {
        title: "Forbidden",
        message:
            "You don't have permission to access this resource. If you believe this is a mistake, please contact support.",
    },
    404: {
        title: "Page not found",
        message:
            "The page you are looking for might have been moved, deleted, or never existed in the first place.",
    },
};

const fallback = {
    title: "Something went wrong",
    message: "An unexpected error occurred. Please try again later or return to the homepage.",
};

/**
 * Whether there is somewhere to go back to, which is what makes offering it
 * worthwhile — someone who typed the URL or opened a stale bookmark has
 * nothing behind them. Resolved after mount so the server and the client
 * render the same initial markup.
 *
 * History length rather than `document.referrer`: client-side navigation
 * leaves the referrer empty, and that is precisely the case where the
 * visitor came from another docs page.
 */
function useCanGoBack() {
    const [canGoBack, setCanGoBack] = useState(false);

    useEffect(() => {
        setCanGoBack(window.history.length > 1);
    }, []);

    return canGoBack;
}

export default function Page() {
    const ctx = usePageContext();
    const code = ctx.abortStatusCode ?? (ctx.is404 ? 404 : 500);
    const { title, message } = errors[code] ?? fallback;
    const canGoBack = useCanGoBack();
    const isNotFound = code === 404;

    return (
        <Box
            h="calc(100vh - 56px - 67px)"
            p="xl"
            style={{ overflowY: "auto" }}
        >
            <Stack
                mih="100%"
                justify="center"
                gap="3xl"
            >
                <Flex
                    direction={{ base: "column", sm: "row" }}
                    align={{ base: "flex-start", md: "center" }}
                    justify="center"
                    gap={{ base: "md", sm: 48 }}
                >
                    <Box className={classes.code}>{code}</Box>
                    <Stack
                        gap="md"
                        maw="460px"
                    >
                        <Title order={2}>{title}</Title>
                        <Text fz="lg">{message}</Text>
                        <Group
                            gap="sm"
                            mt="xs"
                        >
                            {canGoBack && (
                                <Button
                                    variant="light"
                                    size="md"
                                    onClick={() => window.history.back()}
                                >
                                    Go back
                                </Button>
                            )}
                            <Anchor
                                href="/"
                                underline="never"
                            >
                                <Button
                                    variant={canGoBack ? "subtle" : "light"}
                                    size="md"
                                >
                                    Back to homepage
                                </Button>
                            </Anchor>
                        </Group>
                    </Stack>
                </Flex>
                {isNotFound && (
                    <Stack
                        gap="sm"
                        maw="520px"
                        w="100%"
                        mx="auto"
                    >
                        <Text
                            fz="sm"
                            fw={600}
                            c="bright"
                        >
                            Or start from the documentation
                        </Text>
                        <ProductList label="Documentation" />
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}
