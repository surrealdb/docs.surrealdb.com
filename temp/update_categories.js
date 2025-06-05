import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the mapping from README categories to our capitalized format
const categoryMapping = {
    Applications: 'Applications',
    'Client libraries': 'Client Libraries',
    'Management interfaces': 'Management Interfaces',
    'Development tools': 'Development Tools',
    'Deployment tools': 'Deployment Tools',
    'Docker images': 'Docker Images',
    Integrations: 'Integrations',
    Libraries: 'Libraries',
    'GitHub Actions': 'CI/CD',
    'Starter Kits': 'Templates',
    Tutorials: 'Tutorials',
    Videos: 'Videos',
    Projects: 'Examples',
};

// Get all markdown files in the labs-items directory
const labsItemsDir = path.join(__dirname, '../src/content/labs-items');
const mdFiles = fs
    .readdirSync(labsItemsDir)
    .filter((file) => file.endsWith('.md'));

console.log(`Found ${mdFiles.length} markdown files`);

// Process each file
mdFiles.forEach((file) => {
    const filePath = path.join(labsItemsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Find the category in the frontmatter
    const categoryMatch = content.match(/category: (.*?)(\r?\n)/);

    if (categoryMatch) {
        const currentCategory = categoryMatch[1].trim();
        let newCategory = 'unknown_category';

        // Find matching category from our mapping
        // First check for direct match with our mapping values
        for (const [readmeCategory, mappedCategory] of Object.entries(
            categoryMapping
        )) {
            // Case insensitive match
            if (
                currentCategory.toLowerCase() ===
                    readmeCategory.toLowerCase() ||
                currentCategory.toLowerCase() === mappedCategory.toLowerCase()
            ) {
                newCategory = mappedCategory;
                break;
            }
        }

        // If we still don't have a match, try to find a partial match
        if (newCategory === 'unknown_category') {
            for (const [readmeCategory, mappedCategory] of Object.entries(
                categoryMapping
            )) {
                if (
                    currentCategory
                        .toLowerCase()
                        .includes(readmeCategory.toLowerCase()) ||
                    readmeCategory
                        .toLowerCase()
                        .includes(currentCategory.toLowerCase())
                ) {
                    newCategory = mappedCategory;
                    break;
                }
            }
        }

        // If we found a match and the category is different, update the file
        if (newCategory !== currentCategory) {
            console.log(
                `Updating ${file}: ${currentCategory} -> ${newCategory}`
            );
            const updatedContent = content.replace(
                /category: (.*?)(\r?\n)/,
                `category: ${newCategory}$2`
            );
            fs.writeFileSync(filePath, updatedContent, 'utf8');
        } else {
            console.log(`No change needed for ${file}`);
        }
    } else {
        console.log(`No category found in ${file}`);
    }
});

console.log('Category update complete!');
