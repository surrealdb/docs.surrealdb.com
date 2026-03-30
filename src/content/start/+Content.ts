// import * as ui from "@surrealdb/ui";
import { defineCollection } from "vike-content-collection";
import { pageSchema } from "~/utils/collection";

// const iconMap = ui as unknown as Record<string, string>;

export const Content = defineCollection({
    schema: pageSchema,
    type: "both",
    computed: {
        iconPath: ({ metadata }) => getIconPath(metadata.icon),
    },
});

function getIconName(icon: string) {
    return `icon${icon[0].toUpperCase()}${icon.slice(1)}`;
}

function getIconPath(icon?: string) {
    // return (icon && iconMap[getIconName(icon)]) || iconMap.iconHelp;
    return icon;
}
