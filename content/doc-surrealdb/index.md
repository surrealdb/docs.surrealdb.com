---
sidebar_position: 1
sidebar_label: Overview
title: SurrealDB
description: SurrealDB makes building and scaling realtime apps dramatically quicker and easier. Get started by installing the server and jump into our getting started guide.
no_page_headings: true
---


<div class="flag-title">
	<img src="@assets/img/logo/light/surrealdb.svg" darkSrc="@assets/img/logo/dark/surrealdb.svg" alt="SurrealDB" class="h-12" />
</div>

SurrealDB is a native, open-source, [multi-model database](/features) that lets you store and manage data across [relational](/docs/surrealql/statements/define), [document](/docs/surrealdb/models/document), [graph](/docs/surrealdb/models/graph), [time series](/docs/surrealdb/models/time-series), [vector search](/docs/surrealdb/models/vector), and [geospatial](/docs/surrealdb/models/geospatial) models—all in one place.

Powered by a flexible, SQL-like query language called [SurrealQL](/docs/surrealql), you can write queries using familiar syntax while leveraging the capabilities of a modern, unified database. Built to be [distributed and scalable](/docs/surrealdb/introduction/architecture), SurrealDB makes it easy to grow with your application.

You can interact with SurrealDB through the [CLI](/docs/surrealdb/cli) and the [Surrealist UI](/docs/surrealist), additional query methods like [HTTP](/docs/surrealdb/integration/http), [RPC](/docs/surrealdb/integration/rpc) and [GraphQL](/docs/surrealdb/querying/graphql), or integrate directly using a range of [SDKs](/docs/surrealdb/integration/sdks) in your native development environment.

<div class="flex gap-4 items-center mt-6 mb-16">
	<a
		href="/docs/surrealdb/introduction/start"
		class="gradient-button group"
	>
		Get started with SurrealDB
		<Icon name="fa6-solid:arrow-right" class="w-4 transition-transform group-hover:translate-x-1" />
	</a>
	<a
		href="/docs/surrealdb/installation"
		class="outline-button group"
	>
		Installation guide
		<Icon name="fa6-solid:arrow-right" class="w-4 transition-transform group-hover:translate-x-1" />
	</a>
</div>

# Topics
<Boxes columns={2} wider class="pt-2">
	<IconBox
		title="SurrealDB Cloud "
		subtitle="Managed Cloud Hosting"
		description="Effortlessly deploy, manage, and scale your SurrealDB instances in the cloud."
		href="/docs/cloud"
		icon={{ light: LightCloud, dark: DarkCloud }}
	/>
	<IconBox
		title="Surrealist"
		subtitle="Management Interface"
		description="The official dashboard to query and manage your SurrealDB databases."
		href="/docs/surrealist"
		icon={{ light: LightSurrealist, dark: DarkSurrealist }}
	/>
	<IconBox
		title="SurrealQL"
		subtitle="Query Language"
		description="Discover SurrealQL, a powerful and intuitive SQL-like language built for SurrealDB."
		href="/docs/surrealql"
		icon={{ light: LightSurrealQL, dark: DarkSurrealQL }}
	/>
</Boxes>
	
# Data Models
<Boxes wider class="pt-2">
	<IconBox
		title="Document"
		description="A flexible way to store data, allowing for nested structures and relationships to be stored within a single document."
		href="/docs/surrealdb/models/document"
		icon={{ light: LightDocument, dark: DarkDocument }}
	/>
	<IconBox
		title="Graph"
		description="Store data as nodes and edges to query connected datasets like social networks, recommendation engines, or fraud detection graphs."
		href="/docs/surrealdb/models/graph"
		icon={{ light: GraphLight, dark: GraphDark }}
	/>
	<IconBox
		title="Vector"
		description="Store and query high-dimensional vectors generated from LLM models for AI applications."
		href="/docs/surrealdb/models/vector"
		icon={{ light: VectorLight, dark: VectorDark }}
	/>
	<IconBox
		title="Full-Text Search"
		description="Index and retrieve text-based data based on tokenized and modified text, rather than exact, literal matches."
		href="/docs/surrealdb/models/full-text-search"
		icon={{ light: FullTextSearchLight, dark: FullTextSearchDark }}
	/>
	<IconBox
		title="Time Series"
		description="Optimized querying and managing time-stamped data over periods of time or via aggregated table views."
		href="/docs/surrealdb/models/time-series"
		icon={{ light: LightTimeSeries, dark: DarkTimeSeries }}
	/>
	<IconBox
		title="Geospatial"
		description="Store and query data related to the Earth's surface using objects including points, lines, polygons, and more."
		href="/docs/surrealdb/models/geospatial"
		icon={{ light: LightGeospatial, dark: DarkGeospatial }}
	/>
</Boxes>
	
# Integrations
<Boxes columns={3} wider class="pt-2">
	<IconBox
		title="Data Management"
		description="SurrealDB integrates with Airbyte, Fivetran, and more to help you manage your data."
		href="/docs/integrations/data-management"
		icon={{ light: LightIntegrations, dark: DarkIntegrations }}
	/>
	<IconBox
	title="Embeddings"
	description="SurrealDB provides a number of different embeddings features that can be used to manage your data."
	href="/docs/integrations/embeddings"
	icon={{ light: LightIntegrations, dark: DarkIntegrations }}
	/>
	<IconBox
	title="Frameworks"
	description="SurrealDB integrates with a number of different frameworks to help you build your applications."
	href="/docs/integrations/frameworks"
	icon={{ light: LightIntegrations, dark: DarkIntegrations }}
	/>
</Boxes>

# Authentication
<Boxes columns={3} wider class="pt-2">
	<IconBox
		title="System Access"
		description="System access is used to authenticate and authorize system users to access the SurrealDB server."
		href="/docs/surrealdb/security/authentication"
		icon={{ light: SystemAccessLight, dark: SystemAccessDark }}
	/>
	<IconBox
		title="Record Access"
		description="Record access is used to authenticate and authorize record users to access the SurrealDB database."
		href="/docs/surrealql/statements/define/access/record"
		icon={{ light: RecordAccessLight, dark: RecordAccessDark }}
	/>
	<IconBox
		title="Token Accesss"
		description="Token access is used to authenticate and authorize users to access the SurrealDB database via a token."
		href="/docs/surrealql/statements/define/access/jwt"
		target="_blank"
		rel="noopener noreferrer"
		icon={{ light: TokenAccessLight, dark: TokenAccessDark }}
	/>
</Boxes>

# Education
<Boxes columns={3} wider class="pt-2">
	<IconBox
		title="SurrealDB University"
		description="Watch videos, live streams, and expert talks to quickly learn key SurrealDB concepts and insights."
		href="/learn"
		icon={{ light: LightUniversity, dark: DarkUniversity }}
	/>
	<IconBox
		title="Aeon's Surreal Renaissance"
		description="Learn SurrealDB through an engaging, story-driven experience that feels like watching a movie."
		href="/learn/book"
		icon={{ light: LightBook, dark: DarkBook }}
	/>
	<IconBox
		title="Surreal Sidekick"
		description="Surreal Sidekick is your go-to AI assistant for all things SurrealDB related."
		href="https://app.surrealdb.com/chat"
		target="_blank"
		rel="noopener noreferrer"
		icon={{ light: SidekickLight, dark: SidekickDark }}
	/>
</Boxes>

# SDKs
<Boxes columns={3} wider class="pt-2">
	<IconBox
		title="Rust"
		description="Connect to SurrealDB in Rust applications."
		href="/docs/sdk/rust"
		icon={{ light: LightRust, dark: DarkRust }}
	>
		<Check>HTTP & WebSocket</Check>
		<Check>In-memory and on-disk</Check>
	</IconBox>
	<IconBox
		title="JavaScript"
		description="Connect to SurrealDB from JavaScript environments."
		href="/docs/sdk/javascript"
		icon={{ light: LightJavascript, dark: DarkJavascript }}
	>
		<Check>HTTP & WebSocket</Check>
	</IconBox>
	<IconBox
		title="Node.js"
		description="Node.js adapter for the JavaScript SDK."
		href="/docs/sdk/javascript/engines/node"
		icon={{ light: LightNodejs, dark: DarkNodejs }}
	>
		<Check>HTTP & WebSocket</Check>
		<Check>In-memory and on-disk</Check>
	</IconBox>
	<IconBox
		title="WASM"
		description="WebAssembly adapter for the JavaScript SDK."
		href="/docs/sdk/javascript/engines/wasm"
		icon={{ light: LightWasm, dark: DarkWasm }}
	>
		<Check>In-memory and IndexedDB</Check>
	</IconBox>
	<IconBox
		title="Java"
		description="Connect to SurrealDB in Java applications."
		href="/docs/sdk/java"
		icon={{ light: LightJava, dark: DarkJava }}
	>
		<Check>HTTP & WebSocket</Check>
		<Check>In-memory and on-disk</Check>
	</IconBox>
	<IconBox
		title="Golang"
		description="Connect to SurrealDB in Go applications."
		href="/docs/sdk/golang"
		icon={{ light: LightGolang, dark: DarkGolang }}
	>
		<Check>HTTP & WebSocket</Check>
		<Check>In-memory and on-disk</Check>
	</IconBox>
	<IconBox
		title="Python"
		description="Connect to SurrealDB in Python applications."
		href="/docs/sdk/python"
		icon={{ light: LightPython, dark: DarkPython }}
	>
		<Check>HTTP & WebSocket</Check>
		<Check>In-memory and on-disk</Check>
	</IconBox>
	<IconBox
		title=".NET"
		description="Connect to SurrealDB in .NET applications."
		href="/docs/sdk/dotnet"
		icon={{ light: LightDotnet, dark: DarkDotnet }}
	>
		<Check>HTTP & WebSocket</Check>
		<Check>In-memory and on-disk</Check>
	</IconBox>
	<IconBox
		title="PHP"
		description="Connect to SurrealDB in PHP applications."
		href="/docs/sdk/php"
		icon={{ light: LightPhp, dark: DarkPhp }}
	>
		<Check>HTTP & WebSocket</Check>
	</IconBox>
</Boxes>


# Resources
<BasicBox href="/docs/labs" class="group block">
	<img src="@assets/img/logo/light/labs.svg" darkSrc="@assets/img/logo/dark/labs.svg" alt="SurrealDB" class="block h-5" />
	<div class="mt-6">
		Dive into the full range of tools, libraries, and integrations built around SurrealDB. SurrealDB Labs brings together first- and third-party resources to help you build, manage, and extend your SurrealDB applications with ease.
	</div>
	<div class="mt-6 flex gap-2 items-center">
		<div class="!text-surreal-energy">Explore SurrealDB Labs</div>
		<Icon name="fa6-solid:arrow-right" class="w-4 text-surreal-energy transition-transform group-hover:translate-x-1" />
	</div>
</BasicBox>