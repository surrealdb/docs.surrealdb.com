---
sidebar_position: 6
sidebar_label: Importing CSV data
title: Importing CSV data to SurrealDB
description: "SurrealDB's Surrealist UI can be used to import CSV data to SurrealDB."
---

# Importing CSV data to SurrealDB

This page details some methods to import CSV data to SurrealDB.

## Using Surrealist

CSV data is the easiest external data type to import to SurrealDB, as it can be imported directly via the [Surrealist](/docs/surrealist/) UI.

Importing the data is done by going to the Explorer tab, clicking on Import database below, and following the prompts. For more details, see [this page](/docs/surrealist/concepts/explore-database-records#importing-a-csv-file) in the Surrealist documentation.

## Importing CSV data using Surreal Sync

The [Surreal Sync](https://github.com/surrealdb/surreal-sync) tool can be used to import CSV files in the local filesystem or S3 buckets into a SurrealDB table with automatic type detection and optional record ID generation.

For more on how this is done, please see the [CSV Import for Surreal Sync](https://github.com/surrealdb/surreal-sync/blob/main/docs/csv.md) page in its repo.