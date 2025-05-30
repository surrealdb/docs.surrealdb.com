import type { CategoryItem } from './types';

const categories = [
	'Applications',
	'Client libraries',
	'Management interfaces',
	'Development tools',
	'Deployment tools',
	'Docker images',
	'Integrations',
	'Libraries',
	'GitHub Actions',
	'Starter Kits',
	'Tutorials',
	'Videos',
	'Projects',
];

const dataByCategory: Record<string, CategoryItem[]> = {
	Applications: [
		{
			text: 'SurrealDB',
			url: 'https://github.com/surrealdb/surrealdb',
			description:
				'SurrealDB is a scalable, distributed, collaborative, document-graph database, for the realtime web.',
			author: 'SurrealDB',
		},
	],
	'Client libraries': [
		{
			text: 'awaited-surrealdb',
			url: 'https://github.com/theopensource-company/awaited-surrealdb',
			description:
				'Typescript wrapper for surrealdb.js that holds queries until connection is established.',
			author: 'The Open Source Company',
			
		},
		{
			text: 'mylk',
			url: 'https://github.com/ri-nat/mylk',
			description:
				'Client library for Ruby with support for HTTP and WebSocket connections.',
			author: 'Nat Rattan',
			
		},
		{
			text: 'surrealdb-cloudflare',
			url: 'https://github.com/theopensource-company/surrealdb-cloudflare',
			description:
				"A Typescript implementation for SurrealDB's HTTP API. Can also be used outside of Cloudflare.",
			author: 'The Open Source Company',
			
		},
		{
			text: 'surrealdb-erlang',
			url: 'https://github.com/meppu/surreal',
			description: 'Client library for Erlang and other BEAM languages.',
			
		},
		{
			text: 'surrealdb-flutter',
			url: 'https://github.com/duhanbalci/surrealdb_flutter',
			description: 'Client library for Dart and Flutter.',
			
		},
		{
			text: 'surrealdb-spring-client',
			url: 'https://github.com/Mukund2900/surrealdb-spring-client',
			description:
				'An unofficial maven library to easily integrate surrealdb with springboot.',
			
		},
		{
			text: 'surrealdb.c',
			url: 'https://github.com/surrealdb/surrealdb.c',
			description: 'Official driver for C.',
			
		},
		{
			text: 'surrealdb.cr',
			url: 'https://github.com/yorci/surrealdb.cr',
			description:
				'Client library for Crystal with support for HTTP and WebSocket connections.',
			
		},
		{
			text: 'surrealdb.go',
			url: 'https://github.com/surrealdb/surrealdb.go',
			description: 'Official driver for Golang.',
			
		},
		{
			text: 'surrealdb.java',
			url: 'https://github.com/surrealdb/surrealdb.java',
			description: 'Official driver for Java.',
			
		},
		{
			text: 'surrealdb.js',
			url: 'https://github.com/surrealdb/surrealdb.js',
			description: 'Official driver for JavaScript.',
			
		},
		{
			text: 'surrealdb.net',
			url: 'https://github.com/surrealdb/surrealdb.net',
			description: 'Official driver for .NET.',
			
		},
		{
			text: 'surrealdb.node',
			url: 'https://github.com/surrealdb/surrealdb.node',
			description: 'Official driver for Node.js.',
			
		},
		{
			text: 'surrealdb.php',
			url: 'https://github.com/surrealdb/surrealdb.php',
			description: 'Official driver for PHP.',
			
		},
		{
			text: 'surrealdb.py',
			url: 'https://github.com/surrealdb/surrealdb.py',
			description: 'Official driver for Python.',
		},
		{
			text: 'surrealdb.wasm',
			url: 'https://github.com/surrealdb/surrealdb.wasm',
			description: 'Official driver for WebAssembly.',
			
		},
		{
			text: 'surrealdb',
			url: 'https://github.com/surrealdb/surrealdb/tree/main/crates/sdk',
			description: 'Official driver for Rust.',
		},
		{
			text: 'SurrealDB_DSL',
			url: 'https://github.com/mnbjhu/SurrealDB_DSL',
			description: 'An unofficial Kotlin DSL and driver.',
			
		},
	],
	'Management interfaces': [
		{
			text: 'SurrealDB Admin',
			url: 'https://github.com/sachinbhutani/surrealdb-admin',
			description:
				'A serverless app to browse and query your SurrealDB instance.',
			
		},
		{
			text: 'SurrealDB Explorer',
			url: 'https://github.com/iDevelopThings/SurrealDB-Explorer',
			description: 'A simple database viewer/editor for SurrealDB.',
			
		},
		{
			text: 'Surrealist',
			url: 'https://github.com/surrealdb/surrealist',
			description:
				'Official dashboard, query playground and database explorer for SurrealDB.',
			
		},
		{
			text: 'SurrealReact',
			url: 'https://github.com/rvdende/surrealreact',
			description: 'An explorer UI written in react.',
			
		},
	],
	'Development tools': [
		{
			text: 'surreal-codegen',
			url: 'https://github.com/siteforge-io/surreal-codegen',
			description:
				'SurrealDB Typescript type-safe client generator which extends the official SurrealDB package.',
			
		},
		{
			text: 'surrealdb-client-generator',
			url: 'https://github.com/sebastianwessel/surrealdb-client-generator',
			description:
				'A handy tool that simplifies the process of generating zod schemas and TypeScript clients.',
			
		},
	],
	'Deployment tools': [
		{
			text: 'Dokku Surrealdb',
			url: 'https://github.com/IgnisDa/dokku-surrealdb',
			description: 'A plugin to deploy SurrealDB as a Dokku plugin.',
			deploy: 'standard'
			
		},
		{
			text: 'GKE using Terraform',
			url: 'https://github.com/dvanmali/terraform-google-surrealdb',
			description:
				'Multicluster Cross-Regional Deployment using GKE Autopilot and Terraform.',
			deploy: 'standard'
			
		},
		{
			text: 'Pterodactyl Egg',
			url: 'https://github.com/Stefanuk12/Pterodactyl/blob/master/eggs/misc/egg-surrealdb.json',
			description:
				'An egg to deploy SurrealDB for the Pterodactyl Panel.',
			deploy: 'standard'
			
		},
	],
	'Docker images': [
		{
			text: 'surrealdb/surrealdb',
			url: 'https://hub.docker.com/r/surrealdb/surrealdb',
			description: 'Official Docker image.',
			
		},
	],
	Integrations: [
		{
			text: 'SurrealDB Document Loader for LangChain',
			url: 'https://python.langchain.com/docs/integrations/document_loaders/surrealdb',
			description:
				'A simple document loader implementation around SurrealDB for LangChain.',
			
		},
		{
			text: 'SurrealDB Vector Store for LangChain',
			url: 'https://python.langchain.com/docs/integrations/vectorstores/surrealdb',
			description:
				'Use SurrealDB as a vector store backed retriever within LangChain to build rich Generative AI applications with Large Language Models.',
			
		},
	],
	Libraries: [
		{
			text: 'allographer',
			url: 'https://github.com/itsumura-h/nim-allographer',
			description:
				'A query builder and schema builder for Nim that also supports SurrealDB.',
			
		},
		{
			text: 'kysely-surrealdb',
			url: 'https://github.com/igalklebanov/kysely-surrealdb',
			description:
				'Kysely (type-safe sql query builder) dialects, plugins and other goodies for SurrealDB.',
			
		},
		{
			text: 'PySurrealDB',
			url: 'https://github.com/aurelion314/pysurrealdb',
			description: 'SurrealDB driver and query builder for Python.',
			
		},
		{
			text: 'ra-surrealdb',
			url: 'https://github.com/djedi23/ra-surrealdb',
			description:
				'A data provider and an auth provider for react admin to integrate with SurrealDB.',
			
		},
		{
			text: 'Sirqle',
			url: 'https://github.com/PythiaSocialTech/sirqle',
			description: 'Python wrapper for surrealdb.py.',
			
		},
		{
			text: 'surreal-id',
			url: 'https://github.com/liamwh/surreal-id',
			description:
				'Create custom ID types that are guaranteed to be valid RecordIds in SurrealDB.',
			
		},
		{
			text: 'surrealdb_extra',
			url: 'https://github.com/jakin010/surrealdb_extra',
			description: 'Query builder and orm.',
			
		},
		{
			text: 'surrealdb_migration_engine',
			url: 'https://github.com/mcmah309/surrealdb_migration_engine',
			description: 'Simple yet powerful migration engine for SurrealDB.',
			
		},
		{
			text: 'surrealdb_query_builder',
			url: 'https://github.com/AyushChothe/surrealdb_query_builder',
			description: 'SurrealDB query builder for Dart and Flutter.',
			
		},
		{
			text: 'surrealdb-extras',
			url: 'https://docs.rs/surrealdb-extras/latest/surrealdb_extras/',
			description:
				'Creates namespace, database, tables and defines attributes automatically.',
			
		},
		{
			text: 'surrealdb-migrations',
			url: 'https://github.com/Odonno/surrealdb-migrations',
			description:
				'An awesome SurrealDB migration tool, with a user-friendly CLI and a versatile Rust library.',
			
		},
		{
			text: 'surrealdb-valibot',
			url: 'https://github.com/ShadowWolf308/surrealdb-valibot',
			description:
				"Re-usable valibot schema's for use with the JavaScript SDK.",
			
		},
		{
			text: 'surrealdb-zod',
			url: 'https://github.com/ShadowWolf308/surrealdb-zod',
			description:
				"Re-usable zod schema's for use with the JavaScript SDK.",
			
		},
		{
			text: 'Surrealised',
			url: 'https://github.com/ozone-team/surrealised',
			description:
				'A Server-Side TypeScript SurrealDB Client with a fluent query builder.',
			
		},
		{
			text: 'surrealist',
			url: 'https://github.com/kotolex/surrealist',
			description:
				'Python synchronous client with support for HTTP and WebSocket connections, and all SurrealDB features.',
			
		},
		{
			text: 'type-surrealdb',
			url: 'https://github.com/ibilux/type-surrealdb',
			description:
				'Generate schemas and .surql for SurrealDB using TypeScript classes and decorators.',
			
		},
	],
	'GitHub Actions': [
		{
			text: 'SurrealDB GitHub Action',
			url: 'https://github.com/marketplace/actions/surrealdb-in-github-action',
			description:
				'Official GitHub Action to use SurrealDB in GitHub Continuous Integration pipelines.',
			
		},
		{
			text: 'surrealdb-migrations',
			url: 'https://github.com/marketplace/actions/surrealdb-migrations',
			description:
				'This GitHub Action installs and runs surrealdb-migrations.',
			
		},
		{
			text: 'Use SurrealDB in GitHub Actions',
			url: 'https://github.com/marketplace/actions/use-surrealdb-in-github-actions',
			description: 'GitHub Action for using SurrealDB in your tests.',
			
		},
	],
	'Starter Kits': [
		{
			text: 'SurrealDB + SpringBoot.',
			url: 'https://github.com/PDROJACK/surrealdb-springboot-starter',
			description: 'Starter Kit for SurrealDB + SpringBoot.',
			author: 'PDROJACK',
			
		},
		{
			text: 'Starter Kit for SurrealDB + Tauri + Next.js.',
			url: 'https://github.com/reymom/surrealdb-starter-taurikit',
			description: 'Starter Kit for SurrealDB + Tauri + Next.js.',
			author: 'Reymom',
			
		},
		{
			text: 'SurrealDB + FastAPI-NextJS Starter.',
			url: 'https://github.com/richie-omondi/fastapi-nextjs-surrealdb-starterkit',
			description: 'Starter Kit for SurrealDB + FastAPI-NextJS.',
			author: 'Mardav Chirag and Richard Orido',
			
		},
		{
			text: 'SurrealDB + Flask Starter.',
			url: 'https://github.com/syedzubeen/surrealdb_flask_starter_app',
			description: 'Starter Kit for SurrealDB + Flask.',
			author: 'Syed Zubeen',
			
		},
		{
			text: 'SurrealDB + Go Driver Starter.',
			url: 'https://github.com/sbshah97/surrealdb-go-starter-project',
			description: 'Starter Kit for SurrealDB + Go Driver.',
			author: 'Salman Shah',
			
		},
		{
			text: 'SurrealDB + Koa starter rest api.',
			url: 'https://github.com/jerempy/surrealdb-starter-koa',
			description: 'Starter Kit for SurrealDB + Koa.',
			author: 'Jerempy',
			
		},
		{
			text: 'SurrealDB + Nuxt 3 Starter.',
			url: 'https://github.com/dvanmali/surrealdb-nuxt-starter',
			description: 'Starter Kit for SurrealDB + Nuxt 3.',
			author: 'Dylan Vanmali',
			
		},
		{
			text: 'SurrealDB + React-Nodejs starter.',
			url: 'https://github.com/MSaiKiran9/react.nodejs_starter',
			description: 'Starter Kit for SurrealDB + React-Nodejs.',
			author: 'M SaiKiran',
			
		},
		{
			text: 'SurrealDB + Rocket.',
			url: 'https://github.com/davidzr/surrealdb-rocket-starter',
			description: 'Starter Kit for SurrealDB + Rocket.',
			author: 'David Zabala',
			
		},
		{
			text: 'SurrealDB + SolidStart Starter.',
			url: 'https://github.com/metruzanca/surreal-solid-template',
			description: 'Starter Kit for SurrealDB + SolidStart.',
			author: 'Sam "metru" Zanca',
			
		},
		{
			text: 'SurrealDB + Streamlit Starter.',
			url: 'https://github.com/LuciAkirami/surrealdb-streamlit-starter-kit',
			description: 'Starter Kit for SurrealDB + Streamlit.',
			author: 'Lucifer Akirami',
			
		},
		{
			text: 'SurrealDB + SvelteKit Auth Example.',
			url: 'https://github.com/AlbertMarashi/surrealdb-svelte-auth-template',
			description: 'Starter Kit for SurrealDB + SvelteKit Auth Example.',
			author: 'Albert Marashi',
			
		},
		{
			text: 'SurrealDB + SvelteKit Starter.',
			url: 'https://github.com/spinspire/surrealdb-sveltekit-starter',
			description: 'Starter Kit for SurrealDB + SvelteKit.',
			author: 'Jitesh Doshi',
			
		},
		{
			text: 'SurrealDB + SvelteKit.',
			url: 'https://github.com/oskar-gmerek/surreal-sveltekit',
			description: 'Starter Kit for SurrealDB + SvelteKit.',
			author: 'Oskar Gmerek',
			
		},
		{
			text: 'SurrealDB + Vue Blog Starter.',
			url: 'https://github.com/SrWither/surrealdb-vuejs',
			description: 'Starter Kit for SurrealDB + Vue Blog Starter.',
			author: 'SrWither',
			
		},
		{
			text: 'SurrealDB + Vue Starter.',
			url: 'https://github.com/inkollusireeshaadharani/vue-starter-kit',
			description: 'Starter Kit for SurrealDB + Vue Starter.',
			author: 'Dharani Inkollu',
			
		},
	],
	Tutorials: [
		{
			text: "Aeon's Surreal Renaissance - Official book for in-depth learning through storytelling.",
			url: '/learn/book',
			description:
				'Official book for in-depth learning through storytelling.',
			author: 'SurrealDB',
			difficulty: 'beginner'
		},
		{
			text: 'Build an AI RAG Agent',
			url: 'https://github.com/colinmcnamara/austin_langchain/blob/main/labs/LangChain_104/104-langgraph-rag-agent.ipynb',
			description:
				'Build an AI RAG Agent with LangGraph, Ollama, Llama2, and SurrealDB.',
			author: 'Karim Lalani',
			lesson: 'ai',
			difficulty: 'advanced'
		},
		{
			text: 'CLI phone book in Python using SurrealDB as database.',
			url: 'https://code-maven.com/surrealdb-python-cli-phonebook',
			description:
				'CLI phone book in Python using SurrealDB as database.',
			author: 'Gabor Szabo',
			lesson: 'python sdk',
			difficulty: 'beginner'
		},
		{
			text: 'Getting started with SurrealDB using Python and Docker.',
			url: 'https://code-maven.com/surrealdb-getting-started',
			author: 'Gabor Szabo',
			deploy: 'standard',
			lesson: 'python sdk',
			difficulty: 'beginner'
		},
		{
			text: 'Getting started with SurrealDB.',
			url: '/blog/getting-started-with-surrealdb',
			author: 'SurrealDB',
			difficulty: 'beginner'
		},
		{
			text: 'Hosting Surreal DB in Rust in Less Than 3 Minutes.',
			url: 'https://www.youtube.com/watch?v=VoRoeL1tal4',
			author: 'Gui Bibeau',
			difficulty: 'beginner'
		},
		{
			text: 'How to Use SurrealDb with the Fresh Framework and Deno.',
			url: 'https://www.freecodecamp.org/news/how-to-use-surrealdb-with-fresh-framework/',
			author: 'Rajdeep Singh',
			difficulty: 'beginner'
		},
		{
			text: 'Improve database management with SurrealDB.',
			url: 'https://blog.logrocket.com/improve-database-management-surrealdb/',
			author: 'Alexander Nnakwue',
			difficulty: 'beginner',
			lesson: 'query performance'
		},
		{
			text: 'Simple API with Gin/Gonic and SurrealDB (GO).',
			url: 'https://atoo.hashnode.dev/simple-api-with-gingonic-and-surrealdb',
			author: 'Atharva Deshpande',
			difficulty: 'beginner'
		},
		{
			text: 'SurrealDB - Rust Embedded Database - Quick Tutorial.',
			url: 'https://www.youtube.com/watch?v=iOyvum0D3LM',
			author: 'Jeremy Chone',
			difficulty: 'beginner'
		},
		{
			text: 'SurrealDB Fundamentals Course - Official course to efficiently learn SurrealDB in 3 hours.',
			url: '/learn/fundamentals',
			author: 'SurrealDB',
			difficulty: 'beginner',
		},
		{
			text: 'Unlocking SurrealDB: Building a Real-World Multi-Tenant RBAC System Made Easy (4 Part Series).',
			url: 'https://dev.to/sebastian_wessel/series/24535',
			author: 'Sebastian Wessel',
			difficulty: 'intermediate',
		},
	],
	Videos: [
		{
			text: 'Beyond Surreal? A closer look at NewSQL Relational Data - Beyond Fireship.',
			url: 'https://www.youtube.com/watch?v=LCAIkx1p1k0',
		},
		{
			text: 'Getting started with SurrealDB! Future of cloud databases (maybe)?',
			url: 'https://www.youtube.com/watch?v=D41jb4DDIdA',
			author: 'Chris Hay',
		},
		{
			text: 'Livestream series documenting learning SurrealDB.',
			url: 'https://www.youtube.com/playlist?list=PL5AVzKSngnt_xPGNuYdrbB7NZtJbQ046a',
			author: 'Xkonti',
		},
		{
			text: "Rust Powered Database SurrealDB (It's Pretty Ambitious) - Code to the Moon.",
			url: 'https://www.youtube.com/watch?v=DPQbuW9dQ7w',
		},
		{
			text: 'SurrealDB in 100 seconds.',
			url: 'https://www.youtube.com/watch?v=C7WFwgDRStM',
			author: 'Fireship',
		},
		{
			text: 'SurrealDB. The Kitchen Sink Document Store that might dethrone Firebase.',
			url: 'https://www.youtube.com/watch?v=tWpj8Bc_jBQ',
			author: 'Ray Villalobos',
		},
		{
			text: 'Using SurrealDB to prove football statistics.',
			url: 'https://www.youtube.com/watch?v=6J1SPMXzOh4&t=5s',
			author: 'Joseph McCarthy',
		},
	],
	Projects: [
		{
			text: 'DOX For Everything - An online forum for discussions, questions and answers, fan pages, blogs, or anything else.',
			url: 'https://github.com/tcm151/dox',
		},
		{
			text: 'Gofer Engine - An HL7 (Healthcare Level 7) Interface Engine built to deploy on Node.js servers.',
			url: 'https://github.com/gofer-engine/gofer-engine',
		},
		{
			text: 'Kards Social - FOSS social media app.',
			url: 'https://github.com/theopensource-company/kards-social',
		},
		{
			text: 'MECOMP - A local music player that uses surrealdb as the backend.',
			url: 'https://github.com/AnthonyMichaelTDM/mecomp',
		},
		{
			text: 'Nextjs + surrealdb demo - Basic blog that serves as a demo / template for your nextjs + surrealdb project.',
			url: 'https://github.com/kearfy/demo-nextjs-surrealdb',
		},
		{
			text: 'Playrbase - Event & player management system.',
			url: 'https://github.com/theopensource-company/playrbase',
		},
		{
			text: 'Style Guide AI Assistant - A voice enabled AI assistant that lets you talk to your wardrobe.',
			url: 'https://github.com/lalanikarim/style-guide-ai-assistant',
		},
		{
			text: 'Surreal-4o Fine-tuned Model Datasets for SurrealQL Queries - Project to create structured datasets for OpenAI.',
			url: 'https://github.com/sFritsch09/surreal-4o',
		},
		{
			text: 'SurrealDB AI Docs Retrieval - Project to showcase: How to build a GPT-Based question-answering system on top of SurrealDB Docs.',
			url: 'https://github.com/truskovskiyk/surrealdb-docs-retrieval',
		},
		{
			text: 'SurrealDB as a Vector Store for LangChain - A Jupyter notebook demonstrating how to use SurrealDB as a Vector Store.',
			url: 'https://github.com/lalanikarim/notebooks/blob/main/SurrealDB-Langchain.ipynb',
		},
		{
			text: 'SurrealDB Presence Demo - Demo project on how to create a realtime presence web application using SurrealDB Live Queries.',
			url: 'https://github.com/Odonno/surrealdb-presence-demo',
		},
		{
			text: 'SurrealDB Sandbox - An offline browser-based playground for experimenting with SurrealDB.',
			url: 'https://github.com/plasmatech8/surrealdb-sandbox',
		},
		{
			text: 'SurrealDB x OpenAI - Example of RAG using SurrealDB and OpenAI.',
			url: 'https://github.com/Ce11an/surrealdb-openai',
		},
		{
			text: 'SurrealML vs PyTorch vs ONNX - Benchmarking the performance of SurrealML against PyTorch and ONNX - Vladimir Rotariu.',
			url: 'https://github.com/vladimirrotariu/surrealml-vs-onnx-vs-pytorch/tree/main',
		},
	],
};

export const examplePageConfig = {
	categories,
	dataByCategory,
};