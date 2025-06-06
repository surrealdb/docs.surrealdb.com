import EmbedImage from '@assets/img/image/example/embed.png';
import GraphImage from '@assets/img/image/example/graph.png';
import MachineLearningImage from '@assets/img/image/example/machine-learning.png';
import RelationalImage from '@assets/img/image/example/relational.png';
import SearchImage from '@assets/img/image/example/search.png';

export const LAB_CATEGORIES = [
    'CI/CD',
    'Demos',
    'Deployment Tools',
    'Development Tools',
    'Docker Images',
    'Integrations',
    'Libraries',
    'SDKs',
    'Templates',
    'Tutorials',
    'Videos',
] as const;

export const LAB_TOPICS = [
    'AI',
    'Data Management',
    'Embedding',
    'Security',
    'Examples',
    'Optimisation',
    'Beginner',
] as const;

export const LAB_SIDEBAR = [
    {
        title: 'Categories',
        key: 'categories',
        options: LAB_CATEGORIES,
    },
    {
        title: 'Topics',
        key: 'topics',
        options: LAB_TOPICS,
    },
    {
        title: 'Filters',
        key: 'filters',
        options: ['SurrealDB Official'],
    },
];

export const LAB_IMAGE_MAP = {
    'CI/CD': EmbedImage,
    'Deployment Tools': RelationalImage,
    'Development Tools': SearchImage,
    'Docker Images': GraphImage,
    Integrations: MachineLearningImage,
    Libraries: RelationalImage,
    SDKs: SearchImage,
    Templates: GraphImage,
    Tutorials: MachineLearningImage,
    Videos: EmbedImage,
} as const;

export const LABS_TOPICS_MAP: Record<
    Lowercase<(typeof LAB_TOPICS)[number]>,
    string
> = {
    ai: 'AI',
    'data management': 'Data Management',
    embedding: 'Embedding',
    security: 'Security',
    examples: 'Examples',
    optimisation: 'Optimisation',
    beginner: 'Beginner',
} as const;
