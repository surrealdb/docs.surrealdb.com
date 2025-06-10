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
        title: 'Filters',
        key: 'filters',
        options: ['SurrealDB Official'],
    },
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
];

export const LAB_IMAGE_MAP = {
    'CI/CD': { light: CiCdLightImg, dark: CiCdDarkImg },
    'Deployment Tools': {
        light: DeploymentToolsLightImg,
        dark: DeploymentToolsDarkImg,
    },
    'Development Tools': {
        light: DevelopmentToolsLightImg,
        dark: DevelopmentToolsDarkImg,
    },
    'Docker Images': { light: DockerImagesLightImg, dark: DockerImagesDarkImg },
    Demos: { light: DemosLightImg, dark: DemosDarkImg },
    Integrations: { light: IntegrationsLightImg, dark: IntegrationsDarkImg },
    Libraries: { light: LibrariesLightImg, dark: LibrariesDarkImg },
    SDKs: { light: SdksLightImg, dark: SdksDarkImg },
    Templates: { light: TemplatesLightImg, dark: TemplatesDarkImg },
    Tutorials: { light: TutorialsLightImg, dark: TutorialsDarkImg },
    Videos: { light: VideosLightImg, dark: VideosDarkImg },
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
