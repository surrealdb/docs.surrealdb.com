const fs = require('fs');
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
    // [
    //   './plugins/shiki',
    //   {
    //     themes: ["min-light", "nord"],
    //   },
    // ],
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
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      }),
    ],
    [
      './src/plugins/shiki',
      {
        theme: JSON.parse(fs.readFileSync('./src/grammars/surrealql-theme.json', 'utf-8')),
        langs: [
          {
            id: 'surql',
            scopeName: 'source.surrealql',
            grammar: JSON.parse(fs.readFileSync('./src/grammars/surrealql.tmLanguage.json', 'utf-8')),
            aliases: ['surrealql']
          },
          'javascript',
          'typescript',
          'bash',
          'shell',
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
        ],
      },
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
        title: 'Docs',
        logo: {
          alt: 'SurrealDB Logo',
          src: 'img/logo-surrealdb-dark.svg',
          srcDark: 'img/logo-surrealdb.svg',
          width: 120,
          height: 30,
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
        logo: {
          alt: 'SurrealDB Logo',
          src: 'img/logo-surrealdb-dark.svg',
          srcDark: 'img/logo-footer.svg',
          href: 'https://surrealdb.com',
          width: 213,
          height: 60,
        },
        copyright: `Copyright © SurrealDB Ltd.
        Registered in England and Wales, no. 13615201
        Registered address: 16 Great Queen Street, Covent Garden, London, WC2B 5AH, United Kingdom
        Trading address: Huckletree Oxford Circus, 213 Oxford Street, London, W1D 2LG`,
      },
    }),
};

module.exports = config;
