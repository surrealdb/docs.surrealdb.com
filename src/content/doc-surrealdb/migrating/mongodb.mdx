---
sidebar_position: 5
sidebar_label: Migrating from MongoDB
title: Migrating from MongoDB to SurrealDB
description: "How to map existing data and concepts from MongoDB to SurrealDB"
---

# Migrating from MongoDB to SurrealDB

This page details some MongoDB data types and their SurrealQL equivalents, followed by links to the [Surreal Sync](https://github.com/surrealdb/surreal-sync/) tool which allows data from MongoDB to be automatically imported to SurrealDB.

## Data types

The following chart shows MongoDB data types along with the equivalent or near-equivalent [SurrealQL data type](/docs/surrealql/datamodel) for each.

|     MongoDB Data Type     |        BSON Type        |                                          JSON Extended Format v2                                           | SurrealDB Mapping |
| ------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------- |
| **Double**                | Double                  | `3.14` (Relaxed) or `{"$numberDouble": "3.14"}` (Canonical)                                                | `float`           |
| **String**                | String                  | `"text"`                                                                                                   | `string`          |
| **Object**                | Document                | `{"key": "value"}`                                                                                         | `object`          |
| **Array**                 | Array                   | `[1, 2, 3]`                                                                                                | `array`           |
| **Binary ata**            | Binary                  | `{"$binary": {"base64": "...", "subType": "..."}}`                                                         | `bytes`           |
| **Undefined**             | Undefined               | `{"$undefined": true}`                                                                                     | `none`            |
| **ObjectId**              | ObjectId                | `{"$oid": "507f1f77bcf86cd799439011"}`                                                                     | `string`          |
| **Boolean**               | Boolean                 | `true`/`false`                                                                                             | `bool`            |
| **Date**                  | DateTime                | `{"$date": "2024-01-01T00:00:00Z"}` (Relaxed) or `{"$date": {"$numberLong": "1672531200000"}}` (Canonical) | `datetime`        |
| **Null**                  | Null                    | `null`                                                                                                     | `null`            |
| **Regular Expression**    | RegularExpression       | `{"$regularExpression": {"pattern": "...", "options": "..."}}`                                             | `regex`           |
| **DBPointer**             | DbPointer               | `{"$dbPointer": {"$ref": "...", "$id": {...}}}`                                                            | `string`          |
| **JavaScript**            | JavaScriptCode          | `{"$code": "function(){}"}`                                                                                | `string`          |
| **Symbol**                | Symbol                  | `{"$symbol": "text"}`                                                                                      | `string`          |
| **JavaScript with scope** | JavaScriptCodeWithScope | `{"$code": "...", "$scope": {...}}`                                                                        | `object`          |
| **32-bit integer**        | Int32                   | `42` (Relaxed) or `{"$numberInt": "42"}` (Canonical)                                                       | `int`             |
| **Timestamp**             | Timestamp               | `{"$timestamp": {"t": 1672531200, "i": 1}}`                                                                | `datetime`        |
| **64-bit integer**        | Int64                   | `{"$numberLong": "123"}`                                                                                   | `int`             |
| **Decimal128**            | Decimal128              | `{"$numberDecimal": "123.45"}`                                                                             | `number`          |
| **DBRef**                 | Document                | `{"$ref": "users", "$id": "123"}`                                                                          | `thing`           |
| **Min key**               | MinKey                  | `{"$minKey": 1}`                                                                                           | `object`          |
| **Max key**               | MaxKey                  | `{"$maxKey": 1}`                                                                                           | `object`          |

## Importing from MongoDB using Surreal Sync

Surreal Sync can be used to export MongoDB collections to SurrealDB.

It supports inconsistent full syncs and consistent incremental syncs, and together provides ability to reproduce consistent snapshots from the source MongoDB collections onto the target SurrealDB tables.

For more on how to import data from MongoDB to SurrealDB, please see the following pages in the Surreal Sync repo.

* [Surreal Sync for MongoDB](https://github.com/surrealdb/surreal-sync/blob/main/docs/mongodb.md)
* [MongoDB Data Types Support in Surreal Sync](https://github.com/surrealdb/surreal-sync/blob/main/docs/mongodb-data-types.md)