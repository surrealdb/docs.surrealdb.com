
<p align="center">
    <a href="https://surrealdb.com#gh-dark-mode-only" target="_blank">
        <img width="300" src="src/assets/img/logo/dark/logo.svg" alt="SurrealDB Logo">
    </a>
</p>

<h3 align="center">
    <a href="https://surrealdb.com#gh-dark-mode-only" target="_blank">
        <img src="src/assets/img/logo/dark/text.svg" height="15" alt="SurrealDB">
    </a>
    is the ultimate cloud <br> database for tomorrow's applications
</h3>

<h3 align="center">Develop easier. &nbsp; Build faster. &nbsp; Scale quicker.</h3>

<br>

<p align="center">The documentation for <a href="https://github.com/surrealdb/surrealdb" target="_blank">SurrealDB</a>, built using <a href="https://astro.build/" target="_blank">Astro</a>.</p>

<p align="center">If you want to contribute, then please read the <a href="https://github.com/surrealdb/docs.surrealdb.com/blob/main/CONTRIBUTING.md" target="_blank">contributing guidelines</a>.</p>

<br>

<p align="center">
    <a href="https://surrealdb.com/discord"><img src="https://img.shields.io/discord/902568124350599239?label=discord&style=flat-square&color=5a66f6"></a>
    &nbsp;
    <a href="https://twitter.com/surrealdb"><img src="https://img.shields.io/badge/twitter-follow_us-1d9bf0.svg?style=flat-square"></a>
    &nbsp;
    <a href="https://dev.to/surrealdb"><img src="https://img.shields.io/badge/dev-join_us-86f7b7.svg?style=flat-square"></a>
    &nbsp;
    <a href="https://www.linkedin.com/company/surrealdb/"><img src="https://img.shields.io/badge/linkedin-connect_with_us-0a66c2.svg?style=flat-square"></a>
    &nbsp;
    <a href="https://www.youtube.com/channel/UCjf2teVEuYVvvVC-gFZNq6w"><img src="https://img.shields.io/badge/youtube-subscribe-ff0000.svg?style=flat-square"></a>
</p>

<p align="center">
    <a href="https://surrealdb.com/blog"><img height="25" src="src/assets/img/logo/dark/blog.svg" alt="Blog"></a>
    &nbsp;
    <a href="https://github.com/surrealdb/surrealdb"><img height="25" src="src/assets/img/logo/dark/github.svg" alt="Github	"></a>
    &nbsp;
    <a href="https://www.linkedin.com/company/surrealdb/"><img height="25" src="src/assets/img/logo/dark/linkedin.svg" alt="LinkedIn"></a>
    &nbsp;
    <a href="https://twitter.com/surrealdb"><img height="25" src="src/assets/img/logo/dark/twitter.svg" alt="Twitter"></a>
    &nbsp;
    <a href="https://www.youtube.com/channel/UCjf2teVEuYVvvVC-gFZNq6w"><img height="25" src="src/assets/img/logo/dark/youtube.svg" alt="Youtube"></a>
    &nbsp;
    <a href="https://dev.to/surrealdb"><img height="25" src="src/assets/img/logo/dark/dev.svg" alt="Dev"></a>
    &nbsp;
    <a href="https://surrealdb.com/discord"><img height="25" src="src/assets/img/logo/dark/discrod.svg" alt="Discord"></a>
    &nbsp;
    <a href="https://stackoverflow.com/questions/tagged/surrealdb"><img height="25" src="src/assets/img/logo/dark/stack-overflow.svg" alt="StackOverflow"></a>
</p>

<br>

## Getting started with SurrealDB

Visit [surrealdb.com/docs](https://surrealdb.com/docs/surrealdb/) to get started with SurrealDB. 


## Learn SurrealDB

- SurrealDB University: https://surrealdb.com/learn/fundamentals
- Aeon's Surreal Renaissance (Interative book): https://surrealdb.com/learn/book
- Documentation: https://surrealdb.com/docs


## Contributing to the documentation

Please see our [contributing guidelines](/CONTRIBUTING.md).

### Good First Issues

We have a list of [good first issues](https://github.com/surrealdb/docs.surrealdb.com/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) that contain bugs that have a relatively limited scope. This is a great place to get started, gain experience, and get familiar with our contribution process.

## Installation

To get started with contributing to the SurrealDB documentation, first install the required packages using the following command. 

> This project uses [Bun](https://bun.sh/) as our package manager. If you haven't installed Bun yet, then please see the [installation guide](https://bun.sh/docs/installation) for your operating system. It also requires Node.js v20.0.0 or higher.

```bash
bun i 
```

## Contributing Lab content to SurrealDB Documentation

## Overview
Labs are a collection of community and official content that helps users learn and work with SurrealDB. This guide will help you contribute your own lab content to the documentation.

## Prerequisites
- [Bun](https://bun.sh/) installed on your system
- A GitHub account
- Basic knowledge of Markdown

## Creating a new Lab

### Using the Lab creation tool
The easiest way to create a new lab is using the built-in tool:

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/surrealdb/docs.surrealdb.com.git
cd docs.surrealdb.com
bun install
```

2. Run the lab creation tool:

```bash
bun run make:lab
```

3. Follow the interactive prompts to provide:
   - Lab name (required)
   - URL (optional) - Link to your project/repository
   - Category (required) - Choose from:
     - CI/CD
     - Demos
     - Deployment Tools
     - Development Tools
     - Docker Images
     - Integrations
     - Libraries
     - SDKs
     - Templates
     - Tutorials
     - Videos
   - Topics (optional) - Select one or more from:
     - AI
     - Data Management
     - Embedding
     - Security
     - Examples
     - Optimisation
     - Beginner
   - Author name (required)
   - Author role (required for community content)

### Manual creation
Alternatively, you can create a lab manually by creating a new Markdown file in [`src/content/labs-items/`](https://github.com/surrealdb/docs.surrealdb.com/tree/main/src/content/labs-items) with the following structure:

```markdown
---
title: "Your Lab Title"
url: "https://your-project-url.com"  # Optional
category: "Category Name"  # Must be one of the predefined categories
topics:  # Optional
  - Topic1
  - Topic2
author:
  name: "Your Name"
  role: "Your Role"
  avatar: "your-name-slug"  # Will be automatically generated
---

Your lab content here...
```

> For the author avater field, you will also need to upload an avatar to /src/assets/img/labs-authors with the same file name as the author property in the lab markdown

## Content guidelines

### Categories
Choose the most appropriate category for your lab:
- **CI/CD**: Continuous integration and deployment tools
- **Demos**: Example applications and demonstrations
- **Deployment Tools**: Tools for deploying SurrealDB
- **Development Tools**: Tools for development workflow
- **Docker Images**: Docker-related resources
- **Integrations**: Third-party integrations
- **Libraries**: Code libraries and packages
- **SDKs**: Software development kits
- **Templates**: Project templates and starters
- **Tutorials**: Step-by-step guides
- **Videos**: Video content and tutorials

### Topics
Select relevant topics to help users find your content:
- **AI**: Artificial Intelligence related content
- **Data Management**: Data handling and management
- **Embedding**: Embedding-related features
- **Security**: Security features and best practices
- **Examples**: Code examples and snippets
- **Optimisation**: Performance optimization
- **Beginner**: Content suitable for beginners

## Best practices

1. **Title**: Choose a clear, descriptive title that reflects the content. Keep it short and concise for better readability
2. **Content** (Only required when no URL is provided):
   - Start with a brief introduction
   - Include clear instructions
   - Add code examples where relevant
   - Include screenshots or diagrams if helpful
3. **URL**: If your lab has an associated project, include the URL
4. **Author Information**: 
   - Use your real name
   - Provide a clear role description
   - For official SurrealDB content, use "surrealdb" as the author name

## Submitting your contribution

1. Create a new branch for your lab
2. Add your lab content
3. Commit your changes
4. Push to your fork
5. Create a pull request

## Review process

Your lab will be reviewed for:
- Technical accuracy
- Content quality
- Adherence to guidelines
- Proper categorisation and topics

## Need help?

If you need assistance or have questions:
- [Open an issue in the repository](https://github.com/surrealdb/docs.surrealdb.com/issues)
- [Join the SurrealDB community channels](https://discord.com/invite/surrealdb)
- [Check existing labs for examples](/docs/labs)

Remember, your contribution helps the SurrealDB community grow and learn. Thank you for contributing!


## Development

The following command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

```
bun dev
```

## Building

The following command builds and generates static content into the `build` directory, and can then be served using any static contents hosting service.

```
bun run build
```

## Adding a new doc

**READ VERY CAREFULLY**

When adding a new doc, you MUST update redirect logic <br />
If this does not happen, you'll get endless redirects :D <br />
In: project://aws/viewer-request/index.js#4

## File structure

To contribute to the documentation, most of your changes will be made to the `src/content` directory. Each section of the documentation has its own subdirectory, and each page is an MDX file. 

```md
src/
    assets/
    components/
    content/
        doc-surrealdb/
        doc-surrealql/
        doc-surrealist/
        ...
    layouts/
    pages/
    styles/
    util/ 
```

## Linting

To ensure the documentation is consistent and follows our style guide, we use `make qc` to check for linting errors. You can also use `make qa` to automatically fix most of the errors. 

Here are the commands for some of the common commands you may need to use.

- `make install` - Install dependencies, first time or when they change
- `make dev` - Run a development server
- `make build` - Build the website
- `make preview` - Preview a build you made
- `make qc` - Check code quality (fmt + lint)
- `make qa` - Apply safe code quality suggestions
- `make qau` - Apply (un)safe code quality suggestions
