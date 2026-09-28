import { Anchor, Box, Group, Text, Title, UnstyledButton } from "@mantine/core";
import { useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import classes from "./style.module.scss";

const errors: Record<number, { label: string; message: string }> = {
    401: {
        label: "Unauthorized",
        message: "You need to be signed in to see this page. Sign in and try again.",
    },
    403: {
        label: "Forbidden",
        message:
            "You do not have permission to see this page. If this looks wrong, contact support.",
    },
    404: {
        label: "Page not found",
        message: "The page you are looking for does not exist or has been moved.",
    },
};

const fallback = {
    label: "Server error",
    message:
        "Something went wrong on our side. Try again in a moment, or start again from the documentation.",
};

/** Somewhere to start again from, like the link row on the apex site's 404. */
const LINKS = [
    { label: "Database", href: "/docs" },
    { label: "Agent Memory", href: "/docs/agent-memory" },
    { label: "SurrealQL", href: "/docs/reference/query-language" },
    { label: "SDKs", href: "/docs/reference" },
    { label: "Labs", href: "/docs/labs" },
];

/**
 * Whether there is somewhere to go back to, which is what makes offering it
 * worthwhile - someone who typed the URL or opened a stale bookmark has
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

/**
 * The error page, laid out like the www.surrealdb.com 404: a monospace status
 * line, a light "Oops!", one line of explanation, pill buttons and a row of
 * places to start again. It sits on the page's own background in each theme.
 */
export default function Page() {
    const ctx = usePageContext();
    const code = ctx.abortStatusCode ?? (ctx.is404 ? 404 : 500);
    const { label, message } = errors[code] ?? fallback;
    const canGoBack = useCanGoBack();

    return (
        <Box className={classes.root}>
            <Text
                component="p"
                className={classes.status}
            >
                {code} - {label}
            </Text>
            <Title
                order={1}
                className={classes.title}
            >
                Oops!
            </Title>
            <Text className={classes.message}>{message}</Text>

            <Group
                gap="sm"
                mt={32}
            >
                <Anchor
                    href="/docs"
                    underline="never"
                    className={classes.cta}
                >
                    <span className={classes.ctaLabel}>Back to the docs</span>
                </Anchor>
                {canGoBack && (
                    <UnstyledButton
                        className={classes.cta}
                        onClick={() => window.history.back()}
                    >
                        <span className={classes.ctaLabel}>Go back</span>
                    </UnstyledButton>
                )}
            </Group>

            <Group
                component="nav"
                aria-label="Documentation"
                gap="lg"
                mt={40}
            >
                {LINKS.map((link) => (
                    <Anchor
                        key={link.href}
                        href={link.href}
                        underline="never"
                        className={classes.link}
                    >
                        {link.label}
                    </Anchor>
                ))}
            </Group>
        </Box>
    );
}
