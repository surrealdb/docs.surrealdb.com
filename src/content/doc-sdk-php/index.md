---
sidebar_position: 1
sidebar_label: Overview
title: PHP SDK | Integration | SurrealDB
description: The SurrealDB SDK for PHP enables simple and advanced querying of a remote database.
---


<div class="flag-title">
	<img src="~/assets/img/icon/light/php.png" darkSrc="~/assets/img/icon/dark/php.png" alt="PHP" style="width: 42px; height: 42px" />
	# PHP SDK
</div>

The SurrealDB SDK for PHP enables you to interact with SurrealDB from server-side applications, systems, and APIs, allowing you to integrate SurrealDB into your website or application backend, and serve dynamic content to your users. You can use the PHP SDK to interact with your SurrealDB database instances, with functionality for executing queries, managing data, running database functions, authenticating to the database, building user signup and authentication functionality, and subscribing to data changes with live queries. When connecting to remote database instances, connections automatically reconnect when terminated.

> [!IMPORTANT]
> The SDK requires PHP version `8.2` or greater, and is available as a [Composer package](https://packagist.org/packages/surrealdb/surrealdb.php).

> [!NOTE]
> The SDK works seamlessly with SurrealDB versions `v2.0.0` to <Version prefix="v" sdk="php" />, ensuring compatibility with the latest version.

To contribute to the SDK code, submit an Issue or Pull Request in the [surrealdb.php](https://github.com/surrealdb/surrealdb.php) repository. To contribute to this documentation, submit an Issue or Pull Request in the [docs.surrealdb.com](https://github.com/surrealdb/docs.surrealdb.com) repository.

## Language

<Boxes>
    <IconBox
        title="PHP"
        status="available"
        href="/docs/sdk/php"
        icon={{
            light: LightPhp,
            dark: DarkPhp,
        }}
    />
</Boxes>

## Frameworks

<Boxes>
    <IconBox
        title="Laravel"
        status="coming soon"
        icon={{
            light: LightLaravel,
            dark: DarkLaravel,
        }}
    />
    <IconBox
        title="Symfony"
        status="coming soon"
        icon={{
            light: LightSymfony,
            dark: DarkSymfony,
        }}
    />
</Boxes>

## Sources

- [GitHub repository](https://github.com/surrealdb/surrealdb.php)
- [Composer package](https://packagist.org/packages/surrealdb/surrealdb.php)
