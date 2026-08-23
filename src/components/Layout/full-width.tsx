import { Container } from "@mantine/core";

export interface FullWidthLayoutProps {
    children: React.ReactNode;
}

/**
 * A page with no documentation tree beside it - the labs index and the error
 * page. Header, backdrop and footer come from the frame around it, so all that
 * is left here is the reading column.
 */
export function FullWidthLayout({ children }: FullWidthLayoutProps) {
    return (
        <Container
            component="main"
            size="lg"
            flex={1}
        >
            {children}
        </Container>
    );
}
