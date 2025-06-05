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
