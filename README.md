## Getting started 

Visit [www.docs.surrealdb.com/introduction/start](docs.surrealdb.com/introduction/start) to get started with SurrealDB. 

## Contributing

Please see our [contributing.md](/CONTRIBUTING.md).

### Good First Issues

We have a list of [good first issues](https://github.com/surrealdb/docs.surrealdb.com/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) that contain bugs that have a relatively limited scope. This is a great place to get started, gain experience, and get familiar with our contribution process.
### Installation

```
$ pnpm install
```

### Local Development

```
$ pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true pnpm deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> pnpm deploy
```
