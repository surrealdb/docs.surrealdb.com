import CiCdLightImg from '@assets/img/labs-categories/ci-cd.light.png';
import CiCdDarkImg from '@assets/img/labs-categories/ci-cd.png';
import DemosLightImg from '@assets/img/labs-categories/demos.light.png';
import DemosDarkImg from '@assets/img/labs-categories/demos.png';
import DeploymentToolsLightImg from '@assets/img/labs-categories/deployment-tools.light.png';
import DeploymentToolsDarkImg from '@assets/img/labs-categories/deployment-tools.png';
import DevelopmentToolsLightImg from '@assets/img/labs-categories/development-tools.light.png';
import DevelopmentToolsDarkImg from '@assets/img/labs-categories/development-tools.png';
import DockerImagesLightImg from '@assets/img/labs-categories/docker-images.light.png';
import DockerImagesDarkImg from '@assets/img/labs-categories/docker-images.png';
import IntegrationsLightImg from '@assets/img/labs-categories/integrations.light.png';
import IntegrationsDarkImg from '@assets/img/labs-categories/integrations.png';
import LibrariesLightImg from '@assets/img/labs-categories/libraries.light.png';
import LibrariesDarkImg from '@assets/img/labs-categories/libraries.png';
import SdksLightImg from '@assets/img/labs-categories/sdks.light.png';
import SdksDarkImg from '@assets/img/labs-categories/sdks.png';
import TemplatesLightImg from '@assets/img/labs-categories/templates.light.png';
import TemplatesDarkImg from '@assets/img/labs-categories/templates.png';
import TutorialsLightImg from '@assets/img/labs-categories/tutorials.light.png';
import TutorialsDarkImg from '@assets/img/labs-categories/tutorials.png';
import VideosLightImg from '@assets/img/labs-categories/videos.light.png';
import VideosDarkImg from '@assets/img/labs-categories/videos.png';

export const LAB_CATEGORIES = [
    'Blogposts',
    'Code repositories',
    'Videos',
    'Documentation',
    'Learning Resources',
] as const;

export const LAB_TOPICS = [
    'AI',
    'Cloud',
    'Data Management',
    'Examples',
    'Libraries',
    'Security',
    'Templates',
    'Tooling',
    'Tutorials',
] as const;

export const LAB_LANGUAGES = [
    'Python',
    'Rust',
    'TypeScript',
    'Go',
    'Java',
    'PHP',
    'SurrealQL',
] as const;

export const LAB_SIDEBAR = [
    {
        title: 'Filters',
        key: 'filters',
        options: ['SurrealDB Official', 'Community'],
    },
    {
        title: 'Languages',
        key: 'languages',
        options: LAB_LANGUAGES,
    },
    {
        title: 'Topics',
        key: 'topics',
        options: LAB_TOPICS,
    },
    {
        title: 'Categories',
        key: 'categories',
        options: LAB_CATEGORIES,
    },
];

export const LAB_IMAGE_MAP: Record<
    (typeof LAB_CATEGORIES)[number],
    { light: ImageMetadata; dark: ImageMetadata }
> = {
    'Code repositories': { light: LibrariesLightImg, dark: LibrariesDarkImg },
    Videos: { light: VideosLightImg, dark: VideosDarkImg },
    Documentation: { light: IntegrationsLightImg, dark: IntegrationsDarkImg },
    'Learning Resources': { light: DemosLightImg, dark: DemosDarkImg },
    Blogposts: { light: TemplatesLightImg, dark: TemplatesDarkImg },
} as const;

export const LABS_TOPICS_MAP: Record<
    Lowercase<(typeof LAB_TOPICS)[number]>,
    string
> = {
    ai: 'AI',
    'data management': 'Data Management',
    examples: 'Examples',
    libraries: 'Libraries',
    security: 'Security',
    templates: 'Templates',
    tooling: 'Tooling',
    tutorials: 'Tutorials',
    cloud: 'Cloud',
} as const;
