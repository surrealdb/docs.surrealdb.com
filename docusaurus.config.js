// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// @type {import('@docusaurus/types').Config}
const config = {
  title: 'SurrealDB Docs',
  tagline: 'SurrealDB Documentation',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-test-site.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
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
                to: '/docs/intro',
              },
              {
                label: 'Install',
                to: '/docs/intro',
              },
              {
                label: 'Features',
                to: '/docs/intro',
              },
              {
                label: 'Releases',
                to: '/docs/intro',
              },
              {
                label: 'Roadmap',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'COMMUNITY',
            items: [
              {
                label: 'Github',
                to: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                to: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                to: 'https://twitter.com/docusaurus',
              },
              {
                label: 'YouTube',
                to: 'https://twitter.com/docusaurus',
              },
              {
                label: 'LinkedIn',
                to: 'https://twitter.com/docusaurus',
              },
              {
                label: 'Reddit',
                to: 'https://twitter.com/docusaurus',
              },
              {
                label: 'Instagram',
                to: 'https://twitter.com/docusaurus',
              },
              {
                label: 'Stack Overflow',
                to: 'https://twitter.com/docusaurus',
              },
              {
                label: 'Threads',
                to: 'https://twitter.com/docusaurus',
              },
              {
                label: 'Medium',
                to: 'https://twitter.com/docusaurus',
              },
              {
                label: 'Dev',
                to: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'LEGAL',
            items: [
              {
                label: 'Privacy policy',
                to: '/blog',
              },
              {
                label: 'Cookies policy',
                to: 'https://github.com/facebook/docusaurus',
              },
              {
                label: 'Security policy',
                to: 'https://github.com/facebook/docusaurus',
              },
              {
                label: 'Licence FAQs',
                to: 'https://github.com/facebook/docusaurus',
              },
              {
                label: 'security.txt',
                to: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
          {
            title: 'ABOUT',
            items: [
              {
                label: 'About us',
                to: '/blog',
              },
              {
                label: 'Carrers',
                to: 'https://github.com/facebook/docusaurus',
              },
              {
                label: 'Community',
                to: 'https://github.com/facebook/docusaurus',
              },
              {
                label: 'Open source',
                to: 'https://github.com/facebook/docusaurus',
              },
              {
                label: 'Blog',
                to: 'https://github.com/facebook/docusaurus',
              },
              {
                label: 'Media',
                to: 'https://github.com/facebook/docusaurus',
              },
              {
                label: 'Store',
                to: 'https://github.com/facebook/docusaurus',
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
