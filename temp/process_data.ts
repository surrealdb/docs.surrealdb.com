import * as fs from 'node:fs';
import * as path from 'node:path';
import { examplePageConfig } from '../config/pages/labs';

const { dataByCategory } = examplePageConfig;

// Ensure labs-items directory exists
const outputDir = path.join(process.cwd(), 'src', 'content', 'labs-items');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Slugify a string to create a valid filename
function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .replace(/(\s|\.)+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

// Ensure the index is unique for each item
const usedSlugs = new Set<string>();

// Process each category and its items
Object.entries(dataByCategory).forEach(([category, items]) => {
    items.forEach((item, index) => {
        const baseSlug = slugify(item.text);
        let slug = baseSlug;
        let counter = 1;

        // Ensure unique slugs
        while (usedSlugs.has(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        usedSlugs.add(slug);

        const topics = Array.isArray(item.lesson) ? item.lesson : [item.lesson];

        // Create frontmatter content
        const frontmatter = [
            '---',
            `title: "${item.text.replace(/"/g, '\\"')}"`,
            `url: ${item.url}`,
            `category: ${category}`,
            typeof item.author === 'string'
                ? `author: ${item.author}`
                : `author:
  name: ${item.author.name.replace(/"/g, '\\"')}
  role: ${item.author.role.replace(/"/g, '\\"')}
  avatar: ${slugify(item.author.name)}`,
            'topics:',
            ...topics.map((topic) => `  - ${topic}`),
            '---',
            '',
            '',
        ].join('\n');

        // Write to file
        const filePath = path.join(outputDir, `${slug}.md`);
        fs.writeFileSync(filePath, frontmatter);

        console.log(`Created ${filePath}`);
    });
});

console.log('All files created successfully!');
