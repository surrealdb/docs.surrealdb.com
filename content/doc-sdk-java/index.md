---
sidebar_position: 1
sidebar_label: Overview
title: Java | SDKs | Integration
description: The SurrealDB SDK for Java enables simple and advanced querying of a remote or embedded database.
---


<div class="flag-title">
	<img src="@assets/img/icon/light/java.png" darkSrc="@assets/img/icon/dark/java.png" alt="Java" style="width: 42px; height: 42px" />
	# Java SDK
</div>

The SurrealDB SDK for Java enables you to interact with SurrealDB from client or server-side applications, systems, and APIs. You can use the Java SDK to interact with your SurrealDB database instances, or to run SurrealDB as an embedded database within your Java application, with functionality for executing queries, managing data, running database functions, and authenticating to the database. When connecting to remote database instances, connections automatically reconnect when terminated.

> [!IMPORTANT]
> The SDK requires Java JDK version `8` or greater, and is available as a [Maven package](https://mvnrepository.com/artifact/com.surrealdb/surrealdb).

> [!NOTE]
> The SDK works seamlessly with SurrealDB versions `v2.0.0` to <version />, ensuring compatibility with the latest version.

> [!WARNING]
> This API is not yet fully stabilized and may be subject to change until the SDK reaches `1.0.0`.

To contribute to the SDK code, submit an Issue or Pull Request in the [surrealdb.java](https://github.com/surrealdb/surrealdb.java) repository. To contribute to this documentation, submit an Issue or Pull Request in the [docs.surrealdb.com](https://github.com/surrealdb/docs.surrealdb.com) repository.

## Example projects

You can find example repositories that demonstrate how to integrate SurrealDB in a number of different environments:

<Boxes>
    <IconBox
        title="Java Starter"
        description="A simple starter project demonstrating the power of the SurrealDB Java SDK"
        href="https://github.com/surrealdb/examples/tree/main/java-starter"
    />
</Boxes>

## Sources

- [GitHub repository](https://github.com/surrealdb/surrealdb.java)
- [JavaDoc](https://surrealdb.github.io/surrealdb.java/javadoc/)
- [Maven package](https://mvnrepository.com/artifact/com.surrealdb/surrealdb)
