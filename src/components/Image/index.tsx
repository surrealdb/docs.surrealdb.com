import { Image } from "@mantine/core";
import { ThemedImage as SurrealThemedImage, type ThemedImageProps } from "@surrealdb/ui";
import { ClientOnly } from "vike-react/ClientOnly";

export function ThemedImage({ darkSrc, src, ...props }: ThemedImageProps) {
    return (
        <ClientOnly
            fallback={
                <Image
                    src={src}
                    {...props}
                />
            }
        >
            <SurrealThemedImage
                darkSrc={darkSrc}
                src={src}
                {...props}
            />
        </ClientOnly>
    );
}
