# Overview

## USE

```sql
-- Specify a namespace to use for future sql commands
USE NAMESPACE abcum;
-- Specify a database to use for future sql commands
USE DATABASE acreon;
-- Specify a namespace and database to use in one sql query
USE NAMESPACE abcum DATABASE acreon;
```

## Namespaces

?> You must be authenticated as a *root* user in order to be able to **DEFINE** or **REMOVE** namespaces.

```sql
-- Define a namespace
DEFINE NAMESPACE abcum;
-- Remove a namespace and all data
REMOVE NAMESPACE abcum;
```

```sql
-- Retrive info for the namespace
INFO FOR NAMESPACE;
```

## Databases

?> You must be authenticated as a *namespace* user in order to be able to **DEFINE** or **REMOVE** databases.

```sql
-- Define a database
DEFINE DATABASE acreon;
-- Remove a database and all data
REMOVE DATABASE acreon;
```

```sql
-- Retrive info for the database
INFO FOR DATABASE;
```

## Tables

?> You must be authenticated as a *database* user in order to be able to **DEFINE** or **REMOVE** tables.

```sql
-- Retrive info for a specific table
INFO FOR TABLE person;
```
