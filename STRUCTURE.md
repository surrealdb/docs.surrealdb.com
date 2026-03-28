# SurrealDB Docs Structure

This document outlines the new structure for the SurrealDB docs.

## Notes

- All entries ending with [C] are content collections.
- Top content collections and their parent categories will be rendered in the header navigation
- Top level content collections will link directly, while those in categories render in dropdowns
- The first level under each content collection is a section, represented by a folder within the collection
- Sections contain pages, which sometimes point to their original location in the old docs, other times are new pages
- Entries ending with [P] are custom pages that do not represent a content collection

## Structure

* Home [C]
* Start [C]
    * Introduction
        * What is SurrealDB → doc-surrealdb/index.md, doc-surrealdb/introduction/index.md
        * Architecture → doc-surrealdb/introduction/architecture.md (⚠️ REVIEW)
        * Concepts → doc-surrealdb/introduction/concepts.md (⚠️ REVIEW)
        * Getting Started → doc-surrealdb/introduction/start.md (⚠️ REVIEW)
    * SurrealDB Cloud
        * Create a SurrealDB account
        * Create an instance
        * Connect to your instance
    * Self-hosted
        * Installation → doc-surrealdb/installation/index.md
            * Linux → doc-surrealdb/installation/linux.md
            * macOS → doc-surrealdb/installation/macos.md
            * Windows → doc-surrealdb/installation/windows.md
            * Nightly → doc-surrealdb/installation/nightly.md
        * Docker → doc-surrealdb/installation/running/docker.md
        * File-backed → doc-surrealdb/installation/running/file.md
        * In-memory → doc-surrealdb/installation/running/memory.md
        * TiKV (multi-node) → doc-surrealdb/installation/running/tikv.md
    * Languages
        * JavaScript → doc-sdk-javascript/start.md
        * Python → doc-sdk-python/start.md
        * Rust → doc-sdk-rust/setup.md
        * Go → doc-sdk-golang/start.md
        * Java → doc-sdk-java/start.md
        * .NET → doc-sdk-dotnet/start.md
        * PHP → doc-sdk-php/setup.md
    * Frameworks
        * TODO
* Learn
    * Querying [C]
        * SurrealQL
            * What is SurrealQL? → NEW
            * Writing SurrealQL → NEW
            * Statements & values → NEW
            * Executing queries → doc-surrealdb/querying/surrealql/index.md
                * via CLI → doc-surrealdb/querying/surrealql/cli.md
                * via SDKs → doc-surrealdb/querying/sdks/index.md
                * via Surrealist → doc-surrealdb/querying/surrealql/surrealist.md
                * via HTTP → doc-surrealdb/querying/surrealql/http.md
        * GraphQL
            * Overview → doc-surrealdb/querying/graphql/index.md
            * via HTTP → doc-surrealdb/querying/graphql/http.md
            * via Bruno → doc-surrealdb/querying/graphql/bruno.md
            * via Surrealist → doc-surrealdb/querying/graphql/surrealist.md
        * Concepts & Guides
            * Transactions → (conceptual guide, references doc-surrealql/transactions.md) NEW
            * Query Optimisation → (EXPLAIN, index usage, patterns) NEW
            * Parameterised Queries → (guide, references doc-surrealql/parameters.md) NEW
            * Subqueries & Advanced Patterns → NEW
            * Bulk Operations & Data Import → NEW
            * Custom Functions → (guide, references DEFINE FUNCTION, scripting) NEW
            * Error Handling → (THROW, IF ELSE, debugging) NEW
            * tolSessions & Scoping → (USE, session::\ functions)* NEW
            * Idempotent Operations → (UPSERT patterns) NEW
            * Connecting from Serverless & Edge → NEW
            * Sequences → NEW
            * Testing → NEW
        * Custom APIs
            * Managing APIs → NEW
            * Middleware → NEW
        * Real-time
            * Live Queries → (conceptual guide, references LIVE SELECT) NEW
            * Changefeeds → (conceptual guide, references SHOW statement) NEW
            * Real-time Best Practices → doc-surrealdb/reference-guide/real-time-best-practices.md
        * Performance
            * Performance Best Practices → doc-surrealdb/reference-guide/performance-best-practices.md
    * Schema management [C]
        * Multi-tenancy
            * Namespace & Database Architecture → (conceptual guide) NEW
        * Schema Design
            * Schema Design (schemaless vs schemafull) → NEW
            * Schema Best Practices → doc-surrealdb/reference-guide/schema-creation-best-practices.md
            * Schema Evolution → NEW
            * Sample Industry Schemas → doc-surrealdb/reference-guide/sample-industry-schemas.md
        * Tables & Fields
            * Tables → (conceptual guide, references DEFINE TABLE) NEW
            * Fields & Validation → (conceptual guide, references DEFINE FIELD, assertions) NEW
            * Record IDs & Addressing → (conceptual guide, references doc-surrealql/datamodel/ids.md) NEW
        * Indexes
            * Index Types & Strategies → (conceptual guide covering unique, composite, search, vector indexes) NEW
        * Events & Triggers
            * Defining Events → (conceptual guide, references DEFINE EVENT) NEW
            * Reactive Patterns → NEW
        * Computed Data
            * Computed Fields → (guide, references doc-surrealql/datamodel/futures.md) NEW
            * Closures → (guide, references doc-surrealql/datamodel/closures.md) NEW
        * Files
            * Working with files → NEW
            * Buckets → NEW
    * Data models [C]
        * Overview
            * What is a multi-model database? → doc-surrealdb/models/index.md
        * Document
            * Using SurrealDB as a Document Database → doc-surrealdb/models/document.md
            * Nested Objects & Arrays → **NEW (**broken out)
            * Schema Modes → **NEW (**broken out)
            * Common Patterns → **NEW (**broken out)
        * Graph
            * Using SurrealDB as a Graph Database → doc-surrealdb/models/graph.md
            * Creating Relations (RELATE deep-dive) → **NEW (**broken out)
            * Graph Traversal (→, ←, <->) → **NEW (**broken out)
            * Recursive Traversals → **NEW (**broken out)
            * Record Links vs Graph Relations → **NEW (**broken out)
            * Social Network Patterns → **NEW (**broken out)
            * Knowledge Graph Patterns → **NEW (**broken out)
        * Vector Search
            * Using SurrealDB as a Vector Database → doc-surrealdb/models/vector.md
            * Vector Indexes → **NEW (**broken out)
            * Similarity Search (KNN) → **NEW (**broken out)
            * Hybrid Search → **NEW (**broken out)
            * RAG Architecture Patterns → **NEW (**broken out)
            * Embedding Pipelines → **NEW (**broken out)
        * Full-text Search
            * Using SurrealDB as a Full Text Search Database → doc-surrealdb/models/full-text-search.md
            * Analyzers & Tokenizers → **NEW (**broken out)
            * Search Indexes → **NEW (**broken out)
            * Scoring & Ranking → **NEW (**broken out)
            * Autocomplete Patterns → **NEW (**broken out)
        * Geospatial
            * Using SurrealDB as a Geospatial Database → doc-surrealdb/models/geospatial.md
            * Geometry Types → **NEW (**broken out)
            * Spatial Queries → **NEW (**broken out)
            * Distance & Proximity → **NEW (**broken out)
            * Location-based Patterns → **NEW (**broken out)
        * Time-series
            * Using SurrealDB as a Time Series Database → doc-surrealdb/models/time-series.md
            * Time Buckets & Windowing → **NEW (**broken out)
            * Aggregation Queries → **NEW (**broken out)
            * IoT & Telemetry Patterns → **NEW (**broken out)
    * Security [C]
        * Authentication
            * Overview → doc-surrealdb/security/index.md
            * Authentication → doc-surrealdb/security/authentication.md
            * Summary → doc-surrealdb/security/summary.md
        * Authorization
            * Capabilities → doc-surrealdb/security/capabilities.md
            * Permissions & Row-Level Security → NEW
            * Tokens & JWTs → NEW
        * Best Practices
            * Security Best Practices → doc-surrealdb/security/security-best-practices.md
            * Troubleshooting → doc-surrealdb/security/troubleshooting.md
    * Extensions [C]
        * Plugins formerly Surrealism
            * Overview → doc-surrealdb/extensions/index.md
            * Quick Tutorial → doc-surrealdb/extensions/tutorial.md
            * Further Examples → doc-surrealdb/extensions/examples.md
        * Guides
            * Creating Custom Modules → NEW
            * Using WASM Plugins → NEW
            * Module Architecture → NEW
* Build
    * Deployment [C]
        * SurrealDB Cloud
            * What is SurrealDB Cloud → doc-cloud/index.md
            * Architecture → doc-cloud/architecture.md
            * Getting Started:
                * Overview → doc-cloud/getting-started/index.md
                * Create an Account → doc-cloud/getting-started/create-an-account.md
                * Create an Organisation → doc-cloud/getting-started/create-an-organisation.md
                * Create an Instance → doc-cloud/getting-started/create-an-instance.md
            * Connecting:
                * Overview → doc-cloud/connect/index.md
                * via CLI → doc-cloud/connect/cli.md
                * via HTTP → doc-cloud/connect/http.md
                * via SDK → doc-cloud/connect/sdk.md
                * via Surrealist → doc-cloud/connect/surrealist.md
            * Operations:
                * Overview → doc-cloud/operate-and-manage/index.md
                * Data Export & Backup → doc-cloud/operate-and-manage/data-export-and-backup.md
                * Scaling → NEW
                * Migrating Data → doc-cloud/operate-and-manage/migrating-data.md
                * Network Access → doc-cloud/operate-and-manage/network-access.md
                * Monitoring Overview → doc-cloud/operate-and-manage/monitoring/index.md
                * Logs → doc-cloud/operate-and-manage/monitoring/logs.md
                * Metrics → doc-cloud/operate-and-manage/monitoring/metrics.md
            * Tooling:
                * Overview → doc-cloud/tooling/index.md
                * Search & Shortcuts → doc-cloud/tooling/search-and-shortcuts.md
                * SurrealQL Editors → doc-cloud/tooling/surrealql-editors.md
            * Billing & Support:
                * Overview → doc-cloud/billing-and-support/index.md
                * Billing → doc-cloud/billing-and-support/billing.md
                * Support → doc-cloud/billing-and-support/support.md
                * Referrals → doc-cloud/referrals/index.md
                * FAQs → doc-cloud/faqs/index.md
        * Self-hosted
            * Overview → doc-surrealdb/deployment/index.md
            * Docker → doc-surrealdb/installation/running/docker.md (shared with Start)
            * Kubernetes → doc-surrealdb/deployment/kubernetes.md
            * Amazon EKS → doc-surrealdb/deployment/amazon.md
            * Azure AKS → doc-surrealdb/deployment/azure.md
            * Google GKE → doc-surrealdb/deployment/google.md
        * Observability
            * Observability → doc-surrealdb/reference-guide/observability.md
    * Migrating [C]
        * From Other Databases
            * Overview → doc-surrealdb/migrating/index.md
            * From PostgreSQL → doc-surrealdb/migrating/postgresql.md
            * From MySQL → doc-surrealdb/migrating/mysql.md
            * From MongoDB → doc-surrealdb/migrating/mongodb.md
            * From Neo4j → doc-surrealdb/migrating/neo4j.md
        * From Files & Streams
            * CSV → doc-surrealdb/migrating/csv.md
            * JSON Lines → doc-surrealdb/migrating/jsonl.md
            * Kafka → doc-surrealdb/migrating/kafka.md
        * From Old SurrealDB Versions
            * 1.x to 2.x → doc-surrealdb/installation/upgrading/migrating-data-to-2.x.md
            * 2.x to 3.x → doc-surrealdb/installation/upgrading/migrating-data-to-3.x.md
    * Embedding [C]
        * Overview
            * Embedding SurrealDB → doc-surrealdb/embedding/index.md
            * Storage engines → NEW
        * By Language
            * JavaScript → doc-surrealdb/embedding/javascript.md, doc-sdk-javascript/embedding.md
            * Python → doc-surrealdb/embedding/python.md, doc-sdk-python/embedding.md
            * Rust → doc-surrealdb/embedding/rust.md, doc-sdk-rust/embedding.md
            * .NET → doc-surrealdb/embedding/dotnet.md, doc-sdk-dotnet/embedding.md
    * AI Agents [C]
        * Overview
            * Why SurrealDB for AI Agents
            * Agent Rules (move from Integrations)
            * AI Frameworks (move from Integrations)
    * Integrations [C]
        * AI Frameworks
            * Overview → doc-integrations/Frameworks/index.md
            * LangChain → doc-integrations/Frameworks/langchain.md
            * LlamaIndex → doc-integrations/Frameworks/llama-index.md
            * CrewAI → doc-integrations/Frameworks/crewai.md
            * Pydantic AI → doc-integrations/Frameworks/pydantic-ai.md
            * Agno → doc-integrations/Frameworks/agno.md
            * CAMEL → doc-integrations/Frameworks/camel.md
            * SmolAgents → doc-integrations/Frameworks/smolagents.md
            * Google Agent → doc-integrations/Frameworks/googleagent.md
            * Dagster → doc-integrations/Frameworks/dagster.md
            * DeepEval → doc-integrations/Frameworks/deepeval.md
            * Dynamiq → doc-integrations/Frameworks/dynamiq.md
            * Feast → doc-integrations/Frameworks/feast.md
        * Embeddings Providers
            * Overview → doc-integrations/Embeddings/index.md
            * OpenAI → doc-integrations/Embeddings/openai.md
            * Mistral → doc-integrations/Embeddings/mistral.md
            * FastEmbed → doc-integrations/Embeddings/fastembed.md
            * Python quickstart → doc-integrations/Embeddings/python.md
            * Rust quickstart → doc-integrations/Embeddings/rust.md
        * Data Management
            * Overview → doc-integrations/data-management/index.md
            * Airbyte → doc-integrations/data-management/airbyte.md
            * Fivetran → doc-integrations/data-management/fivetran.md
            * n8n → doc-integrations/data-management/n8n.md
        * Agent Rules
            * Agent Rules → doc-integrations/agent-rules/index.md
* Manage
    * SurrealDB Cloud [C]
		* Overview
			* Organisations & users
			* Instance management (Free / Start / Dedicated)
			* Scaling
			* Network access
			* Monitoring & logs
			* Backups & recovery
			* AWS Marketplace
			* Billing & support
    * Self-hosted [C]
		* Overview
			* Configuration
			* Upgrades & patching
			* Monitoring & observability
			* Backups & recovery
    * Enterprise Edition [C]
        * Overview
            * What EE is
            * feature table
            * contact/licensing
        * Getting started
            * Instal
            * Licensing & activation
            * Upgrading from Community
        * Security
            * Audit logging
            * FIPS
            * Trusted execution
        * Storage
            * File storage / S3 / Blob
        * Capabilities
            * Distributed live queries
        * Support
            * Support tiers
            * SLAs
* Explore
    * Surrealist UI [C]
        * Getting Started
            * Introduction → doc-surrealist/index.md
            * Getting Started → doc-surrealist/getting-started.md
            * Installation → doc-surrealist/installation.md
        * Concepts
            * Overview → doc-surrealist/concepts/index.md
            * Sending Queries → doc-surrealist/concepts/sending-queries.md
            * Sending Queries with GraphQL → doc-surrealist/concepts/sending-queries-with-graphql.md
            * Designing the Database Schema → doc-surrealist/concepts/designing-the-database-schema.md
            * Exploring Database Records → doc-surrealist/concepts/explore-database-records.md
            * Managing Database Access → doc-surrealist/concepts/manage-database-access.md
            * Local Database Serving → doc-surrealist/concepts/local-database-serving.md
            * Writing Stored Procedures → doc-surrealist/concepts/writing-stored-procedures.md
            * Specialized API Docs → doc-surrealist/concepts/specialized-api-docs.md
            * Deploying via SurrealDB Cloud → doc-surrealist/concepts/surreal-cloud.md
        * Advanced Topics
            * Overview → doc-surrealist/advanced-topics/index.md
            * Connection Templates → doc-surrealist/advanced-topics/connection-templates.md
            * Embedding Surrealist → doc-surrealist/advanced-topics/embedding-surrealist.md
            * URL Intents → doc-surrealist/advanced-topics/intents.md
            * Search & Shortcuts → doc-surrealist/advanced-topics/search-and-shortcuts.md
            * Settings & Customisation → doc-surrealist/advanced-topics/settings-and-customisation.md
            * SurrealQL Editors → doc-surrealist/advanced-topics/surrealql-editors.md
        * FAQs
            * FAQs → doc-surrealist/faqs/index.md
            * FAQ Details → doc-surrealist/faqs/info.md
            * Known Issues → doc-surrealist/faqs/known-issues.md
        * Troubleshooting
            * Troubleshooting → doc-surrealist/troubleshooting.md
    * ML Models [C]
        * SurrealML
            * Introduction → doc-surrealml/index.md
            * Storage → doc-surrealml/storage.md
            * Computation → doc-surrealml/computation.md
    * Tutorials & demos [C]
        * Tutorials
            * Overview → doc-tutorials/index.md
            * Define a Schema → doc-tutorials/define-a-schema.md
            * Auth0 Integration → doc-tutorials/integrate-auth0-as-authentication-provider.md
            * AWS Cognito Integration → doc-tutorials/integrate-aws-cognito-as-authentication-provider.md
            * Build a Real-time Presence App → doc-tutorials/build-a-realtime-presence-web-application-using-surrealdb-live-queries.md
            * GitHub Actions → doc-tutorials/using-github-actions.md
            * Connect via ngrok → doc-tutorials/connect-to-surrealdb-via-ngrok-tunnel.md
            * HTTP via Postman → doc-tutorials/working-with-surrealdb-over-http-via-postman.md
            * How to build a knowledge graph for AI → https://surrealdb.com/blog/how-to-build-a-knowledge-graph-for-ai
        * Demos
            * Surreal Deal Store → NEW
            * Blink → NEW
            * Kaig: AI demos → https://github.com/surrealdb/kaig/tree/main
            * Pydantic AI (example of how to build a retrieval tool for vector-search) → https://surrealdb.com/docs/integrations/frameworks/pydantic-ai
    * SurrealDB Labs [P]
        * (Same as current)
* Reference
    * Query language [C]
        * Language primitives
            * Statements → NEW
            * Operators → doc-surrealql/operators.md
            * Parameters → doc-surrealql/parameters.md
            * Transactions → doc-surrealql/transactions.md
            * Comments → doc-surrealql/comments.md
            * Record Links → doc-surrealql/datamodel/records.md
            * Record References → doc-surrealql/datamodel/references.md
            * Casting → doc-surrealql/datamodel/casting.md
            * Formatters → doc-surrealql/datamodel/formatters.md
            * Idioms → doc-surrealql/datamodel/idioms.md
            * Data Types → doc-surrealql/datamodel/index.md
                * Arrays → doc-surrealql/datamodel/arrays.md
                * Booleans → doc-surrealql/datamodel/booleans.md
                * Bytes → doc-surrealql/datamodel/bytes.md
                * Closures → doc-surrealql/datamodel/closures.md
                * Datetimes → doc-surrealql/datamodel/datetimes.md
                * Files → doc-surrealql/datamodel/files.md
                * Futures → doc-surrealql/datamodel/futures.md
                * Geometries → doc-surrealql/datamodel/geometries.md
                * Literals → doc-surrealql/datamodel/literals.md
                * None and Null → doc-surrealql/datamodel/none-and-null.md
                * Numbers → doc-surrealql/datamodel/numbers.md
                * Objects → doc-surrealql/datamodel/objects.md
                * Ranges → doc-surrealql/datamodel/ranges.md
                * Record IDs → doc-surrealql/datamodel/ids.md
                * Regex → doc-surrealql/datamodel/regex.md
                * Sets → doc-surrealql/datamodel/sets.md
                * Strings → doc-surrealql/datamodel/strings.md
                * UUIDs → doc-surrealql/datamodel/uuid.md
        * Statements
            * Overview → doc-surrealql/statements/index.md
            * ACCESS → doc-surrealql/statements/access.md
            * BEGIN → doc-surrealql/statements/begin.md
            * BREAK → doc-surrealql/statements/break.md
            * CANCEL → doc-surrealql/statements/cancel.md
            * COMMIT → doc-surrealql/statements/commit.md
            * CONTINUE → doc-surrealql/statements/continue.md
            * CREATE → doc-surrealql/statements/create.md
            * DELETE → doc-surrealql/statements/delete.md
            * EXPLAIN → doc-surrealql/statements/explain.md
            * FOR → doc-surrealql/statements/for.md
            * IF ELSE → doc-surrealql/statements/ifelse.md
            * INFO → doc-surrealql/statements/info.md
            * INSERT → doc-surrealql/statements/insert.md
            * KILL → doc-surrealql/statements/kill.md
            * LET → doc-surrealql/statements/let.md
            * LIVE SELECT → doc-surrealql/statements/live.md
            * REBUILD → doc-surrealql/statements/rebuild.md
            * RELATE → doc-surrealql/statements/relate.md
            * REMOVE → doc-surrealql/statements/remove.md
            * RETURN → doc-surrealql/statements/return.md
            * SELECT → doc-surrealql/statements/select.md
            * SHOW → doc-surrealql/statements/show.md
            * SLEEP → doc-surrealql/statements/sleep.md
            * THROW → doc-surrealql/statements/throw.md
            * UPDATE → doc-surrealql/statements/update.md
            * UPSERT → doc-surrealql/statements/upsert.md
            * USE → doc-surrealql/statements/use.md
            * DEFINE Overview → doc-surrealql/statements/define/index.md
            * DEFINE ACCESS → doc-surrealql/statements/define/access/index.md
            * BEARER → doc-surrealql/statements/define/access/bearer.md
            * JWT → doc-surrealql/statements/define/access/jwt.md
            * RECORD → doc-surrealql/statements/define/access/record.md
            * DEFINE ANALYZER → doc-surrealql/statements/define/analyzer.md
            * DEFINE API → doc-surrealql/statements/define/api.md
            * DEFINE BUCKET → doc-surrealql/statements/define/bucket.md
            * DEFINE CONFIG → doc-surrealql/statements/define/config.md
            * DEFINE DATABASE → doc-surrealql/statements/define/database.md
            * DEFINE EVENT → doc-surrealql/statements/define/event.md
            * DEFINE FIELD → doc-surrealql/statements/define/field.md
            * DEFINE FUNCTION → doc-surrealql/statements/define/function.md
            * DEFINE INDEX → doc-surrealql/statements/define/indexes.md
            * DEFINE MODULE → doc-surrealql/statements/define/module.md
            * DEFINE NAMESPACE → doc-surrealql/statements/define/namespace.md
            * DEFINE PARAM → doc-surrealql/statements/define/param.md
            * DEFINE SCOPE → doc-surrealql/statements/define/scope.md
            * DEFINE SEQUENCE → doc-surrealql/statements/define/sequence.md
            * DEFINE TABLE → doc-surrealql/statements/define/table.md
            * DEFINE TOKEN → doc-surrealql/statements/define/token.md
            * DEFINE USER → doc-surrealql/statements/define/user.md
            * ALTER Overview → doc-surrealql/statements/alter/index.md
            * ALTER DATABASE → doc-surrealql/statements/alter/database.md
            * ALTER FIELD → doc-surrealql/statements/alter/field.md
            * ALTER INDEX → doc-surrealql/statements/alter/indexes.md
            * ALTER NAMESPACE → doc-surrealql/statements/alter/namespace.md
            * ALTER SEQUENCE → doc-surrealql/statements/alter/sequence.md
            * ALTER SYSTEM → doc-surrealql/statements/alter/system.md
            * ALTER TABLE → doc-surrealql/statements/alter/table.md
        * Clauses
            * Overview → doc-surrealql/clauses/index.md
            * EXPLAIN → doc-surrealql/clauses/explain.md
            * FETCH → doc-surrealql/clauses/fetch.md
            * FROM → doc-surrealql/clauses/from.md
            * GROUP BY → doc-surrealql/clauses/group-by.md
            * LIMIT → doc-surrealql/clauses/limit.md
            * OMIT → doc-surrealql/clauses/omit.md
            * ORDER BY → doc-surrealql/clauses/order-by.md
            * SPLIT → doc-surrealql/clauses/split.md
            * WHERE → doc-surrealql/clauses/where.md
            * WITH → doc-surrealql/clauses/with.md
        * Functions
            * Database Functions Overview → doc-surrealql/functions/database/index.md
            * API → doc-surrealql/functions/database/api.md
            * Array → doc-surrealql/functions/database/array.md
            * Bytes → doc-surrealql/functions/database/bytes.md
            * Count → doc-surrealql/functions/database/count.md
            * Crypto → doc-surrealql/functions/database/crypto.md
            * Duration → doc-surrealql/functions/database/duration.md
            * Encoding → doc-surrealql/functions/database/encoding.md
            * File → doc-surrealql/functions/database/file.md
            * Geo → doc-surrealql/functions/database/geo.md
            * HTTP → doc-surrealql/functions/database/http.md
            * Math → doc-surrealql/functions/database/math.md
            * Meta → doc-surrealql/functions/database/meta.md
            * Not → doc-surrealql/functions/database/not.md
            * Object → doc-surrealql/functions/database/object.md
            * Parse → doc-surrealql/functions/database/parse.md
            * Record → doc-surrealql/functions/database/record.md
            * Search → doc-surrealql/functions/database/search.md
            * Sequence → doc-surrealql/functions/database/sequence.md
            * Session → doc-surrealql/functions/database/session.md
            * Set → doc-surrealql/functions/database/set.md
            * Sleep → doc-surrealql/functions/database/sleep.md
            * String → doc-surrealql/functions/database/string.md
            * Time → doc-surrealql/functions/database/time.md
            * Type → doc-surrealql/functions/database/type.md
            * Value → doc-surrealql/functions/database/value.md
            * Vector → doc-surrealql/functions/database/vector.md
            * ML Functions → doc-surrealql/functions/ml/functions.md
        * Scripting
            * Scripting Functions Overview → doc-surrealql/functions/script/index.md
            * Arguments → doc-surrealql/functions/script/arguments.md
            * Built-in Functions → doc-surrealql/functions/script/built-in-functions.md
            * Function Context → doc-surrealql/functions/script/context.md
            * SurrealQL Functions → doc-surrealql/functions/script/surrealql-functions.md
            * Type Conversion → doc-surrealql/functions/script/type-conversion.md
    * CLI Tools [C]
		* SurrealDB CLI
			* Overview → doc-surrealdb/cli/index.md
			* start → doc-surrealdb/cli/start.md
			* sql → doc-surrealdb/cli/sql.md
			* import → doc-surrealdb/cli/import.md
			* export → doc-surrealdb/cli/export.md
			* fix → doc-surrealdb/cli/fix.md
			* ml → doc-surrealdb/cli/ml.md
			* module → doc-surrealdb/cli/module.md
			* validate → doc-surrealdb/cli/validate.md
			* upgrade → doc-surrealdb/cli/upgrade.md
			* version → doc-surrealdb/cli/version.md
			* help → doc-surrealdb/cli/help.md
			* isready → doc-surrealdb/cli/isready.md
			* Environment Variables → doc-surrealdb/cli/env.md
		* Formatter
			* Overview → doc-surrealdb/formatter/index.md
    * Rust SDK [C] - TODO
    * JavaScript SDK [C] - TODO
    * Python SDK [C] - TODO
    * GoLang SDK [C] - TODO
    * Java SDK [C] - TODO
    * .NET SDK [C] - TODO
    * PHP SDK [C] - TODO
    * REST API [C]
		* Overview
			* Integration Overview → doc-surrealdb/integration/index.md
			* HTTP Protocol → doc-surrealdb/integration/http.md
			* RPC Protocol → doc-surrealdb/integration/rpc.md
			* CBOR Protocol → doc-surrealdb/integration/cbor.md