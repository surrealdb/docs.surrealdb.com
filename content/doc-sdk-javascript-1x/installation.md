---
sidebar_position: 2
sidebar_label: Installation
title: JavaScript SDK Installation | SDKs | Installation
description: In this section, you will learn how to install the JavaScript SDK in your project.
---

# Installation

In this section, you will learn how to install the JavaScript SDK in your project. 

### Install the SDK

First, install the [SurrealDB SDK](https://npmjs.com/package/surrealdb) using your favorite package manager:


<tabs synckey="node-package-manager">
  <tabitem label="bun">
    ```bash
    bun install surrealdb
    ```
  </tabitem>
  <tabitem label="npm">
    ```bash
    npm install --save surrealdb
    ```
  </tabitem>
  <tabitem label="yarn">
    ```bash
    yarn add surrealdb
    ```
  </tabitem>
  <tabitem label="pnpm">
    ```bash
    pnpm install surrealdb
    ```
  </tabitem>
</tabs>

> [!IMPORTANT]
> The SurrealDB SDK for JavaScript is also available in the JSR registry as [`@surrealdb/surrealdb`](https://jsr.io/@surrealdb/surrealdb).

<br />

### Import the SDK to your project

After installing, you can then import the SDK into your project. Depending on your setup and environment, we supported multiple options.

<tabs synckey="node-package-manager">
<tabitem label="ES6">

```ts
import Surreal from 'surrealdb';
```

</tabitem>
<tabitem label="CommonJS">

```ts
const { Surreal } = require('surrealdb');
```

</tabitem>
<tabitem label="Deno">

```ts
//Importing from Deno
import Surreal from "https://deno.land/x/surrealdb/mod.ts";

// Import with version 
import Surreal from "https://deno.land/x/surrealdb@1.0.0/mod.ts";
```

</tabitem>
  <tabitem label="CDN">

```ts
import Surreal from "https://unpkg.com/surrealdb";
// or
import Surreal from "https://cdn.jsdelivr.net/npm/surrealdb";
```

  </tabitem>
</tabs>

> [!NOTE]
> It is recommended to import this in a utility file or a file that is shared across your application.


## Next Steps

After installing the SDK, check out the quick start guide to build your a simple application with the SDK. You can also learn more about carrying out common tasks with the SDK in the following sections:
- [Quick Start](/docs/1.x/sdk/javascript/start)
- [Creating a new connection](/docs/1.x/sdk/javascript/core/create-a-new-connection)
- [Authenticating users](/docs/1.x/sdk/javascript/core/handling-authentication)
