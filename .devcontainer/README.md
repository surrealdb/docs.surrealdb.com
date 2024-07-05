# SurrealDB Docs and GitHub Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/surrealdb/docs.surrealdb.com)

This directory contains the required code to run the SurrealDB documentation in a GitHub Codespace.

After the setup is complete:

- All the required dependencies will be installed.

> [!NOTE]
> The setup process will take a few minutes to complete, especially the `pnpm install` step.

# Local Dev Containers

If you are planning to run the documentation locally, you can setup Dev Containers locally in order to have the same environment.

To do so, you need to have the following installed:

- [Docker](https://www.docker.com) (Preferably [Docker Desktop](https://www.docker.com/products/docker-desktop))
- [Visual Studio Code](https://code.visualstudio.com)
- [VS Code - Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension

After setting up the above, you can open the Command Palette in VS Code and click on the `Remote-Containers: Reopen in Container` option.

This will open the documentation in a Dev Container with all the required dependencies installed.
