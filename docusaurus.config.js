const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const config = {
  title: 'SurrealDB Docs',
  tagline: 'SurrealDB Documentation',
  favicon: 'img/favicon.ico',
  // Set the production url of your site here
  url: 'https://surrealdb.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'SurrealDB', // Usually your GitHub org/user name.
  projectName: 'SurrealDB docs', // Usually your repo name.
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'rust',
        path: "./sdks/rust",
        routeBasePath: "./sdks/rust",
        include: ["**/*.md"],
        sidebarPath: require.resolve('./sdks/rust/sidebarsRust.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'golang',
        path: "./sdks/golang",
        routeBasePath: "./sdks/golang",
        include: ["**/*.md"],
        sidebarPath: require.resolve('./sdks/golang/sidebarsGolang.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'node',
        path: "./sdks/node",
        routeBasePath: "./sdks/node",
        include: ["**/*.md"],
        sidebarPath: require.resolve('./sdks/node/sidebarsNode.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'python',
        path: "./sdks/python",
        routeBasePath: "./sdks/node",
        include: ["**/*.md"],
        sidebarPath: require.resolve('./sdks/python/sidebarsPython.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'deno',
        path: "./sdks/deno",
        routeBasePath: "./sdks/deno",
        include: ["**/*.md"],
        sidebarPath: require.resolve('./sdks/deno/sidebarsDeno.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'java',
        path: "./sdks/java",
        routeBasePath: "./sdks/java",
        include: ["**/*.md"],
        sidebarPath: require.resolve('./sdks/java/sidebarsJava.js'),
      },
    ],
  ],
  presets: [
    [
      'classic',
      ({
        docs: {
          lastVersion: 'current',
          versions: {
            current: {
              label: '1.0.0',
              path: '',
            },
          },
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/surrealdb/docs.surrealdb.com/edit/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/surrealdb/docs.surrealdb.com',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  themeConfig:
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Documentation',
        logo: {
          alt: 'SurrealDB Logo',
          src: 'img/logo-surrealdb.svg',
        },
        items: [
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        logo: {
          alt: 'SurrealDB Logo',
          src: 'img/logo-footer.svg',
          href: 'https://surrealdb.com',
          width: 213,
          height: 60,
        },
        links: [
          {
            title: 'PRODUCT',
            items: [
              {
                label: 'Documentation',
                to: '/docs/intro',
              },
              {
                label: 'Why',
                to: 'https://surrealdb.com/why',
              },
              {
                label: 'Install',
                to: 'https://surrealdb.com/install',
              },
              {
                label: 'Features',
                to: 'https://surrealdb.com/features',
              },
              {
                label: 'Releases',
                to: 'https://surrealdb.com/releases',
              },
              {
                label: 'Roadmap',
                to: 'https://surrealdb.com/roadmap',
              },
            ],
          },
          {
            title: 'COMMUNITY',
            items: [
              {
                label: 'Github',
                to: 'https://github.com/surrealdb/surrealdb',
              },
              {
                label: 'Discord',
                to: 'https://discord.gg/surrealdb',
              },
              {
                label: 'Twitter',
                to: 'https://twitter.com/surrealdb',
              },
              {
                label: 'YouTube',
                to: 'https://www.youtube.com/channel/UCjf2teVEuYVvvVC-gFZNq6w',
              },
              {
                label: 'LinkedIn',
                to: 'https://www.linkedin.com/company/surrealdb/',
              },
              {
                label: 'Reddit',
                to: 'https://www.reddit.com/r/surrealdb/',
              },
              {
                label: 'Instagram',
                to: 'https://www.instagram.com/surrealdb',
              },
              {
                label: 'Stack Overflow',
                to: 'https://stackoverflow.com/questions/tagged/surrealdb',
              },
              {
                label: 'Threads',
                to: 'https://www.threads.net/@surrealdb',
              },
              {
                label: 'Medium',
                to: 'https://medium.com/surrealdb',
              },
              {
                label: 'Dev',
                to: 'https://dev.to/surrealdb',
              },
            ],
          },
          {
            title: 'LEGAL',
            items: [
              {
                label: 'Privacy policy',
                to: 'https://surrealdb.com/legal/privacy',
              },
              {
                label: 'Cookies policy',
                to: 'https://surrealdb.com/legal/cookies',
              },
              {
                label: 'Security policy',
                to: 'https://surrealdb.com/legal/security',
              },
              {
                label: 'Licence FAQs',
                to: 'https://surrealdb.com/licence',
              },
              {
                label: 'security.txt',
                to: 'https://surrealdb.com/.well-known/security.txt',
              },
            ],
          },
          {
            title: 'ABOUT',
            items: [
              {
                label: 'About us',
                to: 'https://surrealdb.com/about',
              },
              {
                label: 'Carrers',
                to: 'https://surrealdb.com/careers',
              },
              {
                label: 'Community',
                to: 'https://surrealdb.com/community',
              },
              {
                label: 'Open source',
                to: 'https://surrealdb.com/opensource',
              },
              {
                label: 'Blog',
                to: 'https://surrealdb.com/blog',
              },
              {
                label: 'Media',
                to: 'https://surrealdb.com/media',
              },
              {
                label: 'Store',
                to: 'https://surrealdb.com/store',
              },
            ],
          },
        ],
        copyright: `Copyright © SurrealDB Ltd.
        Registered in England and Wales, no. 13615201
        Registered address: 16 Great Queen Street, Covent Garden, London, WC2B 5AH, United Kingdom
        Trading address: Huckletree Oxford Circus, 213 Oxford Street, London, W1D 2LG`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
