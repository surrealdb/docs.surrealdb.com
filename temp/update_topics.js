import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the valid topics
const VALID_TOPICS = [
    'AI',
    'Data Management',
    'Embedding',
    'Security',
    'Examples',
    'Optimisation',
    'Beginner',
];

// Keywords for each topic to help in classification
const topicKeywords = {
    AI: [
        'ai',
        'llm',
        'gpt',
        'openai',
        'langchain',
        'rag',
        'machine learning',
        'ml',
        'nlp',
        'chatbot',
        'gemini',
        'titan',
        'agents',
        'vector',
        'autonomous',
        'embedding',
    ],
    'Data Management': [
        'database',
        'query',
        'migration',
        'schema',
        'surql',
        'orm',
        'crud',
        'data',
        'management',
        'storage',
        'persistence',
    ],
    Embedding: [
        'vector',
        'embedding',
        'similarity',
        'search',
        'semantic',
        'llm',
        'ai',
        'rag',
        'gemini',
        'titan',
        'openai',
    ],
    Security: [
        'security',
        'auth',
        'authentication',
        'jwt',
        'rbac',
        'permission',
        'access control',
        'encrypt',
    ],
    Examples: ['example', 'demo', 'sample', 'showcase', 'template', 'starter'],
    Optimisation: [
        'optimisation',
        'optimization',
        'performance',
        'benchmark',
        'efficient',
        'fast',
        'speed',
    ],
    Beginner: [
        'starter',
        'tutorial',
        'guide',
        'learn',
        'introduction',
        'getting started',
        'beginner',
        'basic',
    ],
};

// Get all markdown files in the labs-items directory
const labsItemsDir = path.join(__dirname, '../src/content/labs-items');
const mdFiles = fs
    .readdirSync(labsItemsDir)
    .filter((file) => file.endsWith('.md'));

console.log(`Found ${mdFiles.length} markdown files`);

// Function to determine topics from URL and title
function determineTopics(url, title, currentTopics) {
    const combined = `${url} ${title}`.toLowerCase();
    let matchedTopics = [];

    // Check each topic's keywords against the URL and title
    for (const topic of VALID_TOPICS) {
        const keywords = topicKeywords[topic];
        if (
            keywords.some((keyword) => combined.includes(keyword.toLowerCase()))
        ) {
            matchedTopics.push(topic);
        }
    }

    // If we have current topics that match our valid list, preserve them
    if (currentTopics && Array.isArray(currentTopics)) {
        currentTopics.forEach((topic) => {
            if (
                VALID_TOPICS.includes(topic) &&
                !matchedTopics.includes(topic)
            ) {
                matchedTopics.push(topic);
            }
        });
    }

    // If no topics were determined, return empty array
    if (matchedTopics.length === 0) {
        return [];
    }

    // Prioritize topics (some have higher precedence)
    if (matchedTopics.includes('AI') && matchedTopics.includes('Embedding')) {
        // If both AI and Embedding match, determine which one is more appropriate
        if (combined.includes('vector') || combined.includes('embed')) {
            // If it's clearly about embeddings, keep that as primary
            matchedTopics = matchedTopics.filter((t) => t !== 'AI');
        }
    }

    // Limit to top two most relevant topics
    return matchedTopics.slice(0, 2);
}

console.log('Starting to process files...');

// Process each file
mdFiles.forEach((file) => {
    console.log(`Processing file: ${file}`);
    const filePath = path.join(labsItemsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract frontmatter
    const frontMatterMatch = content.match(/---\n([\s\S]*?)\n---/);
    if (!frontMatterMatch) {
        console.log(`No frontmatter found in ${file}`);
        return;
    }

    const frontMatter = frontMatterMatch[1];

    // Extract URL and title from frontmatter
    const urlMatch = frontMatter.match(/url:\s*(.*)/);
    const titleMatch = frontMatter.match(/title:\s*"(.*)"/);

    // Extract current topics if any
    const topicsMatch = frontMatter.match(/topics:\s*\n((\s*-\s*.*\n)*)/);
    let currentTopics = [];
    if (topicsMatch?.[1]) {
        currentTopics = topicsMatch[1]
            .split('\n')
            .filter((line) => line?.trim()?.startsWith('-'))
            .map((line) => line.replace(/\s*-\s*/, '').trim());
    }

    if (!urlMatch || !titleMatch) {
        console.log(`Missing URL or title in ${file}`);
        return;
    }

    const url = urlMatch[1].trim();
    const title = titleMatch[1].trim();

    // Determine topics based on URL and title
    const newTopics = determineTopics(url, title, currentTopics);

    // Format new topics section
    let newTopicsSection = '';
    if (newTopics.length > 0) {
        newTopicsSection = 'topics:\n';
        for (const topic of newTopics) {
            newTopicsSection += `  - ${topic}\n`;
        }
    } else {
        newTopicsSection = 'topics: []\n';
    }

    // Replace topics in frontmatter
    let updatedContent;
    if (topicsMatch) {
        // If topics section exists, replace it
        updatedContent = content.replace(
            /topics:\s*\n((\s*-\s*.*\n)*)/,
            newTopicsSection
        );
    } else {
        // If topics section doesn't exist, add it at the end of frontmatter
        updatedContent = content.replace(
            /---\n([\s\S]*?)\n---/,
            `---\n$1\n${newTopicsSection}---`
        );
    }

    // Write updated content back to file
    fs.writeFileSync(filePath, updatedContent, 'utf8');

    console.log(`Updated ${file} with topics: ${newTopics.join(', ')}`);
});

console.log('Topic update complete!');
