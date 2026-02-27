import { Anchor, Box, Button, Flex, Stack, Text, Title } from "@mantine/core";
import { usePageContext } from "vike-react/usePageContext";
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

export default function Page() {
    const ctx = usePageContext();
    const code = ctx.abortStatusCode ?? (ctx.is404 ? 404 : 500);
    const { title, message } = errors[code] ?? fallback;

    return (
        <Flex
            direction={{ base: "column", sm: "row" }}
            align="center"
            justify="center"
            gap={{ base: "md", sm: 48 }}
            h="100%"
            p="xl"
        >
            <Box className={classes.code}>{code}</Box>
            <Stack
                gap="md"
                maw="460px"
            >
                <Title order={2}>{title}</Title>
                <Text
                    c="dimmed"
                    fz="lg"
                >
                    {message}
                </Text>
                <Box>
                    <Anchor
                        href="/"
                        underline="never"
                    >
                        <Button
                            variant="light"
                            size="md"
                            mt="xs"
                        >
                            Back to homepage
                        </Button>
                    </Anchor>
                </Box>
            </Stack>
        </Flex>
    );
}
