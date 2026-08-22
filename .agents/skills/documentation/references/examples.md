# Anonymised phrasing examples

Examples below mirror public product-doc phrasing. Product names are generic. Use them as calibration, not as templates to paste unchanged.

## Overview / hub

**Purpose + clarifying fact**

> Use Northwind DB to connect, manage, and secure your Postgres database.
>
> Every project gets a full Postgres database, not a Postgres abstraction. Auth, storage, and functions run on this database. The platform manages daily backups. Point-in-time recovery is available on paid plans.

**Navigational list with annotated links**

> If you are new to this section, read these pages first:
>
> - **Connect to your database:** Connection strings, the pooler, and when to use direct, transaction, or session mode.
> - **Tables and data:** Create tables and relationships, and edit rows in the dashboard.
> - **Secure your data:** Row-level security makes it safe to query from the client. Read this before you expose a table to your app.

**Next-steps group**

> After the basics, these guides cover other use cases:
>
> - **Triggers:** Run logic in the database after inserts, updates, or deletes.
> - **Backups:** Daily backups on every project. Backups cover the database; objects stored through the object API are not included.

## Quickstart / tutorial

**Goal and success criteria**

> This quickstart helps you get a Bolt app running as soon as possible.
>
> When you finish, you will have a local environment with a customised app that you can change.

**Recommend a default path, keep an alternative**

> Use the CLI and the Bolt framework for the simplest setup. To create an app in the browser instead, see Creating an app with app settings.

**Prerequisites, then action**

> Install the latest CLI, then confirm the install:
>
> ```bash
> toolkit version
> ```

**Numbered verify steps**

> With the app running, test it in the workspace:
>
> 1. Open a direct message with your app, or invite the bot to a public channel.
> 2. Send `hello` and wait for a reply.
> 3. Click **Click Me** on the message to post another reply.
>
> After the app responds, stop it with `Ctrl+C`.

**Security callout**

> **Keep tokens secret.** Treat tokens like passwords. The app uses them to read and send data.

**Small personalisation step after success**

> The starter app works. To personalise it, edit the code so the app also replies to a farewell message.

## Get-started hub (branching audience)

**Product definition + fork**

> Acme Auth is an identity platform that manages access to your applications.
>
> If you are new to identity and access management (IAM), learn the basics and plan a solution that fits your stack. If you already know IAM, start building.

**Section intro + card-style items**

> ### Start building
>
> To get running quickly, choose your application type for a step-by-step quickstart.
>
> | Type | Description |
> | ---- | ----------- |
> | Native app | Mobile or desktop app that runs on a device, like iOS or Android. |
> | Single-page app | JavaScript app that runs in the browser, like React. |
> | Regular web app | Server-rendered app, like Express or ASP.NET. |
> | Backend API | API or service protected by Acme Auth. |

**Configure section voice**

> ### Configure Acme Auth
>
> Define how Acme Auth works with your applications and APIs. Control who can access the dashboard.
>
> - **Tenant settings:** Configure tenant behaviour.
> - **Applications:** Control how Acme Auth works with each application.
> - **APIs:** Manage access for resource requests to your APIs.

## Before → after (rewrite calibration)

**Before (internal, vague, AI-flavoured)**

> In today’s modern landscape, our next-gen datastore seamlessly empowers teams to leverage holistic Postgres abstractions. Engineering currently uses the `hydra-b` pooler on the `db-staging-8` box - don’t document that. Simply dive in and explore the myriad ways you can begin initiating connections!

**After (public, STE-aligned)**

> Use the datastore to connect to a full Postgres database - not a Postgres abstraction.
>
> **Connect to your database:** Choose a connection string and mode (direct, transaction, or session). Use the pooler for serverless clients and short-lived connections.
>
> Start with Connect to your database if this is your first project.

## Structural habits to copy

1. **Bold lead-ins** in bullets so scanners see the topic before the clause.
2. **Tables** when the reader must choose among types, modes, or plans.
3. **Callouts** for secrets and irreversible actions - not for ordinary tips every other paragraph.
4. **Expected command output** in quickstarts so the reader knows success.
5. **Progressive disclosure:** basics first; advanced pages linked under “next steps”.
