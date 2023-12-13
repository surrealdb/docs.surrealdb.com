const fs = require('fs');
const config = {
  title: 'SurrealDB Docs',
  tagline: 'SurrealDB Docs',
  favicon: 'img/favicon.ico',
  // Set the production url of your site here
  url: 'https://surrealdb.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'SurrealDB', // Usually your GitHub org/user name.
  projectName: 'docs.surrealdb.com', // Usually your repo name.
  // TODO We need to fix these issues, just not doing it now :)
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: [
    'docusaurus-plugin-sass',
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
          versions: {
            '1.0.0': {
              label: '1.0.0 (Latest)',
              path: '',
            },
            nightly: {
              label: 'Nightly',
              path: 'nightly',
            },
            '1.1.0': {
              label: '1.1.0 (Beta)',
              path: '1.1.0',
            },
          },
          includeCurrentVersion: false,
          editUrl:
            'https://github.com/surrealdb/docs.surrealdb.com/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
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
        title: '',
        logo: {
          alt: 'SurrealDB Logo',
          src: 'img/logo-surrealdb-dark.svg',
          srcDark: 'img/logo-surrealdb.svg',
        },
        items: [
          {
            to: 'https://surrealdb.com',
            position: 'right',
            className: 'navbar-surreal',
            'aria-label': 'SurrealDB.com',
            label: 'SurrealDB.com',
            target: '_blank',
            icon: 'none'
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/surrealdb',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `&copy; SurrealDB - <a href='https://surrealdb.com'>SurrealDB.com</a> - <a href='https://github.com/surrealdb'>GitHub</a> - <a href='https://discord.gg/surrealdb'>Discord</a> -  <a href='https://surrealdb.com/community'>Community</a> - <a href='https://surrealdb.com/products'>Products</a> - <a href='https://surrealdb.com/features'>Features</a> - <a href='https://surrealdb.com/releases'>Releases</a> `,
      },
      prism: {
        additionalLanguages: [
          'javascript',
          'typescript',
          'bash',
          'yaml',
          'markdown',
          'python',
          'json',
          'rust',
          'jsx',
          'sql',
          'java',
          'go',
          'jsx',
          'csharp'
        ]
      }
    }),
};

module.exports = config;
