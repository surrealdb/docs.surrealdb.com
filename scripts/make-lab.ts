import { args, slugify } from './_utils';
import { input, select, checkbox } from '@inquirer/prompts';
import { LAB_CATEGORIES, LAB_TOPICS } from '@config/pages/labs';
import { resolve } from 'node:path';

try {
    const config = {
        name: args(),
        url: '',
        category: '',
        topics: [] as string[],
        authorName: '',
        authorRole: '',
    };

    if (config.name.trim() === '') {
        config.name = await input({
            message: 'Lab name:',
            required: true,
        });
    }

    config.url = await input({
        message: 'URL (optional):',
    });

    config.category = await select({
        message: 'Category:',
        choices: LAB_CATEGORIES,
    });

    config.topics = await checkbox({
        message: 'Topics (optional):',
        choices: LAB_TOPICS,
    });

    config.authorName = await input({
        message: 'Author name:',
        required: true,
    });

    const isOfficial = config.authorName.toLowerCase() === 'surrealdb';

    if (!isOfficial) {
        config.authorRole = await input({
            message: 'Author role:',
            required: true,
        });
    }

    let content = '---\n';

    content += `title: "${config.name}"\n`;

    if (config.url.trim() !== '') {
        content += `url: ${config.url}\n`;
    }

    content += `category: ${config.category}\n`;

    if (config.topics.length > 0) {
        content += 'topics:\n';

        for (const topic of config.topics) {
            content += `  - ${topic}\n`;
        }
    } else {
        content += 'topics: []\n';
    }

    if (isOfficial) {
        content += 'author: surrealdb\n';
    } else {
        content += 'author:\n';
        content += `  name: ${config.authorName}\n`;
        content += `  role: ${config.authorRole}\n`;
        content += `  avatar: ${slugify(config.authorName)}\n`;
    }

    content += '---\n\n\n';

    const filename = `./src/content/labs-items/${slugify(config.name)}.md`;

    await Bun.write(filename, content);

    console.log(`Lab item created: ${resolve(filename)}`);
} catch (err: unknown) {
    if (err instanceof Error) {
        console.error(`Failed to create lab item: ${err.message}`);
        process.exit(1);
    }

    throw err;
}
