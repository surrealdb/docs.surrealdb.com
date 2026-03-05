---
sidebar_position: 1
sidebar_label: Overview
title: JavaScript | SDK | Overview
description: The SurrealDB SDK for JavaScript enables simple and advanced querying of a remote or embedded database.
---


<div class="flag-title">
	<img src="@assets/img/icon/light/javascript.png" darkSrc="@assets/img/icon/dark/javascript.png" alt="JavaScript" style="width: 42px; height: 42px" />
	# JavaScript SDK
</div>

The SurrealDB SDK for JavaScript and TypeScript allows you to interact with SurrealDB from frontend and server-side applications, systems, and APIs. It is designed to be used in a number of environments, including browser-based applications, server-side applications, and serverless functions. You can use the JavaScript SDK to interact with your SurrealDB database instances, or to run SurrealDB as an embedded database within your JavaScript based application, with functionality for executing queries, managing data, running database functions, authenticating to the database, building user signup and authentication functionality, and subscribing to data changes with live queries.

> [!IMPORTANT]
> The SDK is available as a [NPM](https://npmjs.com/package/surrealdb) and a [JSR](https://jsr.io/@surrealdb/surrealdb) package, with full support for TypeScript types.

> [!NOTE]
> The SDK works seamlessly with SurrealDB versions `v2.0.0` to <version />, ensuring compatibility with the latest version.

To contribute to the SDK code, submit an Issue or Pull Request in the [surrealdb.js](https://github.com/surrealdb/surrealdb.js) repository. To contribute to this documentation, submit an Issue or Pull Request in the [docs.surrealdb.com](https://github.com/surrealdb/docs.surrealdb.com) repository.

## Language and Engines

<Boxes>
    <IconBox
        title="JavaScript"
        status="available"
        href="/docs/1.x/sdk/javascript/core/create-a-new-connection"
        icon={{
                light: LightJavaScript,
                dark: DarkJavaScript,
        }}
    />
    
    <IconBox
        title="Node.js"
        status="available"
        href="/docs/1.x/sdk/javascript/engines/node"
        icon={{
                light: LightNodejs,
                dark: DarkNodejs,
        }}
    />
    <IconBox
        title="WebAssembly"
        status="available"
        href="/docs/1.x/sdk/javascript/engines/wasm"
        icon={{
                light: LightWasm,
                dark: DarkWasm,
        }}
    />
</Boxes>

## Frameworks

<Boxes>
    <IconBox
        title="React"
        href="/docs/1.x/sdk/javascript/frameworks/react"
        status="available"
        icon={{
            light: LightReact,
            dark: DarkReact,
        }}
    />
    <IconBox
        title="Solid.js"
        href="/docs/1.x/sdk/javascript/frameworks/solidjs"
        status="available"
        icon={{
            light: LightSolid,
            dark: DarkSolid,
        }}
    />
    <IconBox
        title="Next.js"
        status="coming soon"
        icon={{
            light: LightNext,
            dark: DarkNext,
        }}
    />
    <IconBox
        title="Vue.js"
        status="coming soon"
        icon={{
            light: LightVue,
            dark: DarkVue,
        }}
    />
    <IconBox
        title="Angular"
        status="coming soon"
        icon={{
            light: LightAngular,
            dark: DarkAngular,
        }}
    />
    <IconBox
        title="Svelte"
        status="coming soon"
        icon={{
            light: LightSvelte,
            dark: DarkSvelte,
        }}
    />
</Boxes>

## Example projects

You can find example repositories that demonstrate how to integrate SurrealDB in a number of different environments:

<Boxes>
    <IconBox
        title="Surreal Stickies (React)"
        description="A simple note-taking application built with SurrealDB, React, and Vite."
        href="https://github.com/surrealdb/examples/tree/main/notes-v2"
    />

     <IconBox
        title="Surreal Stickies (SvelteKit)"
        description="A simple note-taking application built with SurrealDB, SvelteKit, and Vite."
        href="https://github.com/surrealdb/examples/tree/main/notes-kit"
    />

    <IconBox
        title="Surreal Presence (React)"
        description="A demo project on how to create a realtime presence web application using SurrealDB Live Queries."
        href="https://github.com/Odonno/surrealdb-presence-demo"
    />

    <IconBox
        title="TypeScript Starter"
        description="A simple TypeScript starter project using Bun."
        href="https://github.com/surrealdb/examples/tree/main/ts-bun-starter"
    />
</Boxes>

## Sources

- [GitHub repository](https://github.com/surrealdb/surrealdb.js)
- [NPM package](https://npmjs.com/package/surrealdb)
- [JSR package](https://jsr.io/@surrealdb/surrealdb)
