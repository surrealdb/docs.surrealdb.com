import GraphImage from '@assets/img/image/example/graph.png';
import MachineLearningImage from '@assets/img/image/example/machine-learning.png';
import RelationalImage from '@assets/img/image/example/relational.png';
import SearchImage from '@assets/img/image/example/search.png';
import EmbedImage from '@assets/img/image/example/embed.png';

export const LAB_CATEGORIES = [
    'CI/CD',
    'Deployment Tools',
    'Development Tools',
    'Docker Images',
    'Integrations',
    'Libraries',
    'SDKs',
    'Templates',
    'Tutorials',
    'Videos',
];

export const LAB_TOPICS = [
    'AI',
    'Data Management',
    'Embedding',
    'Security',
    'Examples',
    'Optimisation',
    'Beginner',
];

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
	'Integrations': MachineLearningImage,
	'Libraries': RelationalImage,
	'SDKs': SearchImage,
	'Templates': GraphImage,
	'Tutorials': MachineLearningImage,
	'Videos': EmbedImage, 
} as const;