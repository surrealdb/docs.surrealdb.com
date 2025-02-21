---
sidebar_position: 1
sidebar_label: WITH
title: WITH clause | SurrealQL
description: The `WITH` clause is used to select records from a table with an index, which is a pre-computed lookup table for faster queries.
---

# `WITH` clause


When retrieving data from a table, the query planner can replace the standard table iterator with one or several index iterators based on the structure and requirements of the query. This is particularly useful when querying large datasets, as it can significantly reduce the time it takes to retrieve the data.

However, there may be situations where manual control over these potential optimizations is desired or required. 

The `WITH` clause is used to replace the default table iterator with an index iterator. In cases where the cardinality of an index can be high, potentially even equal to the number of records in the table, the sum of the records iterated by several indexes may end up being larger than the number of records obtained by iterating over the table. 

In such cases, if there are different index possibilities, the most probable optimal choice would be to use the index known with the lowest cardinality.

The query planner can replace the standard table iterator with one or several index iterators based on the structure and requirements of the query.

> [!NOTE]
> If you are using a `SELECT` statement, the `WITH` clause is used to specify the index to use for the query. You can define an index using the [`DEFINE INDEX`](/docs/surrealql/statements/define/indexes) statement. Also see the [`DEFINE ANALYZER`](/docs/surrealql/statements/define/analyzer) statement for more information on optimizing query performance with full-text search.

## Syntax

```syntax title="Clause Syntax"
[ WITH [ NOINDEX | INDEX @indexes ... ]]
```

This clause can be used in the following ways:

- `WITH NOINDEX`: forces the query planner to use the table iterator. (Default)
- `WITH INDEX @indexes`: restricts the query planner to using only the specified index(es)


```surql
-- forces the query planner to use the specified index(es):
SELECT * FROM person
WITH INDEX ft_email
WHERE
	email = 'tobie@surrealdb.com' AND
	company = 'SurrealDB';

-- forces the usage of the table iterator
SELECT name FROM person WITH NOINDEX WHERE job = 'engineer' AND gender = 'm';
```



