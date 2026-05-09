import { resolve } from "node:path";
import { checkbox, input, select } from "@inquirer/prompts";
import { slug } from "github-slugger";
import { labCategories, labTopics } from "~/utils/labs";

try {
    const config = {
        name: process.argv.slice(2).join(" "),
        description: "",
        url: "",
        category: "",
        topics: [] as string[],
        authorName: "",
        authorRole: "",
    };

    if (config.name.trim() === "") {
        config.name = await input({
            message: "Lab name:",
            required: true,
        });
    }

    config.description = await input({
        message: "Description (recommended):",
    });

    config.url = await input({
        message: "URL (optional):",
    });

    config.category = await select({
        message: "Category:",
        choices: labCategories,
    });

    config.topics = await checkbox({
        message: "Topics (optional):",
        choices: labTopics,
    });

    config.authorName = await input({
        message: "Author name:",
        required: true,
    });

    const isOfficial = config.authorName.toLowerCase() === "surrealdb";

    if (!isOfficial) {
        config.authorRole = await input({
            message: "Author role:",
            required: true,
        });
    }

    let content = "---\n";

    content += `title: "${config.name}"\n`;

    if (config.description.trim() !== "") {
        content += `description: "${config.description}"\n`;
    }

    if (config.url.trim() !== "") {
        content += `url: ${config.url}\n`;
    }

    content += `category: ${config.category}\n`;

    if (config.topics.length > 0) {
        content += "topics:\n";

        for (const topic of config.topics) {
            content += `  - ${topic}\n`;
        }
    } else {
        content += "topics: []\n";
    }

    if (isOfficial) {
        content += "author: surrealdb\n";
    } else {
        content += "author:\n";
        content += `  name: ${config.authorName}\n`;
        content += `  role: ${config.authorRole}\n`;
        content += `  avatar: ${slug(config.authorName)}\n`;
    }

    content += "---\n\n\n";

    const filename = `./src/content/labs-items/${slug(config.name)}.mdx`;

    await Bun.write(filename, content);

    console.log(`Lab item created: ${resolve(filename)}`);
} catch (err: unknown) {
    if (err instanceof Error) {
        console.error(`Failed to create lab item: ${err.message}`);
        process.exit(1);
    }

    throw err;
}
