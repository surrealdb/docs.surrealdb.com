---
sidebar_position: 1
sidebar_label: ORDER BY
title: ORDER BY clause | SurrealQL
description: The `ORDER BY` clause specifies the sort order of the records in a table.
---

# `ORDER BY` clause

To sort records, SurrealDB allows ordering on multiple fields and nested fields. Use the `ORDER BY` clause to specify a comma-separated list of field names that should be used to order the resulting records. 

The `ASC` and `DESC` keywords can be used to specify whether results should be sorted in an ascending or descending manner. The `COLLATE` keyword can be used to use Unicode collation when ordering text in string values, ensuring that different cases, and different languages are sorted in a consistent manner. Finally, the `NUMERIC` can be used to correctly sort text which contains numeric values.

It is also worth noting that `COLLATE` ignores unicode order. e.g. 'á' comes after 'z' by default (Unicode sorting) but with `COLLATE` 'á' comes before 'z'.

## Syntax

```syntax title="Clause Syntax"
[ ORDER [ BY ] 
	@field [ COLLATE ] [ NUMERIC ] [ ASC | DESC ], ...
	| RAND() ]
]
```

## Examples


```surql
SELECT * FROM <table> ORDER BY <field> ASC;
```

```surql 

-- Order records randomly
SELECT * FROM <table> ORDER BY rand();

-- Order records descending by a single field
SELECT * FROM <table> ORDER BY <field> DESC;

-- Order records by multiple fields independently
SELECT * FROM <table> ORDER BY <field> ASC, <field2> DESC;

-- Order text fields with lexical collation instead of Unicode order
SELECT * FROM <table> ORDER BY <field> COLLATE ASC;

-- Order text fields with which include numeric values
SELECT * FROM <table> ORDER BY <field> NUMERIC ASC;

-- COLLATE and NUMERIC can be used together
SELECT * FROM <table> ORDER BY <field> COLLATE NUMERIC ASC;
```