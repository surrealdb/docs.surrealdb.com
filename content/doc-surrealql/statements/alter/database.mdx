---
sidebar_position: 2
sidebar_label: DATABASE
title: ALTER DATABASE statement | SurrealQL
description: The ALTER statement can be used to change authentication access and behaviour, global parameters, table configurations, table events, schema definitions, and indexes.
---

import Since from '@components/shared/Since.astro'
import RailroadDiagram from '@components/RailroadDiagram.astro'
import Tabs from '@components/Tabs/Tabs.astro'
import TabItem from '@components/Tabs/TabItem.astro'

# `ALTER DATABASE` statement

<Since v="v3.0.0" />

The `ALTER DATABASE` statement can be used to modify the database. `ALTER DATABASE` is used on the current database, which is why a `IF EXISTS` clause does not exist.

## Statement syntax

<Tabs syncKey="alter-statement">
  <TabItem label="SurrealQL Syntax">

```syntax title="SurrealQL Syntax"
ALTER DATABASE COMPACT
```

  </TabItem>
  <TabItem label="Railroad Diagram">

export const alterAst = {
  type: "Diagram",
  padding: [10, 20, 10, 20],
  children: [
    { type: "Sequence", children: [
      { type: "Terminal", text: "ALTER DATABASE" },
      { type: "Terminal", text: "COMPACT" },
    ]}
  ]
};


<RailroadDiagram ast={alterAst} className="my-6" />

  </TabItem>
</Tabs>

## COMPACT

Performs storage compaction on the current database keyspace. To compact other resources, use [ALTER SYSTEM](/docs/surrealql/statements/alter/database) to compact the entire datastore, [ALTER NAMESPACE](/docs/surrealql/statements/alter/namespace) to compact the current namespace keyspace, or [ALTER TABLE](/docs/surrealql/statements/alter/table) to compact a specific table keyspace.

The actual compaction used will depend on the datastore, such as RocksDB or SurrealKV.

This clause will not work with in-memory storage which has nothing persistent to compact, producing the following error:

```surql
'The storage layer does not support compaction requests.'
```

A successful compaction will return `NONE`.

```surql
ALTER DATABASE COMPACT;
-- NONE
```

## See also

* [`DEFINE DATABASE`](/docs/surrealql/statements/define/database)