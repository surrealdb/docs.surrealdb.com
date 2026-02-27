---
sidebar_position: 7
sidebar_label: SYSTEM
title: ALTER SYSTEM statement | SurrealQL
description: The ALTER statement can be used to change authentication access and behaviour, global parameters, table configurations, table events, schema definitions, and indexes.
---

import Since from '@components/shared/Since.astro'
import RailroadDiagram from '@components/RailroadDiagram.astro'
import Tabs from '@components/Tabs/Tabs.astro'
import TabItem from '@components/Tabs/TabItem.astro'

# `ALTER SYSTEM` statement

<Since v="v3.0.0" />

The `ALTER SYSTEM` statement is used to alter the entire datastore. It can be used to compact the system, or to set or drop a systemwide query timeout.

This statement is the only `ALTER` statement that does not have a corresponding `DEFINE` statement.

## Statement syntax

<Tabs syncKey="alter-statement">
  <TabItem label="SurrealQL Syntax">

```syntax title="SurrealQL Syntax"
ALTER SYSTEM 
    COMPACT |
    QUERY_TIMEOUT |
    DROP QUERY_TIMEOUT
```

  </TabItem>
  <TabItem label="Railroad Diagram">

export const alterAst = {
  type: "Diagram",
  padding: [10, 20, 10, 20],
  children: [
    { type: "Sequence", children: [
      { type: "Terminal", text: "ALTER SYSTEM" },
      { type: "Choice", index: 0, children: [
        { type: "Terminal", text: "COMPACT" },
        { type: "Sequence", children: [ { type: "Terminal", text: "QUERY_TIMEOUT" }, { type: "NonTerminal", text: "@duration" } ] },
        { type: "Terminal", text: "DROP QUERY_TIMEOUT" }
      ]},
    ]}
  ]
};

<RailroadDiagram ast={alterAst} className="my-6" />

  </TabItem>
</Tabs>

## `QUERY_TIMEOUT` clause

A query timeout can be set for the system as a whole. The minimum possible timeout is one millisecond, below which the value will be set as `NONE`.

```surql
ALTER SYSTEM QUERY_TIMEOUT 100ns;
INFO FOR ROOT.config;
```

```surql title="Output"
{ QUERY_TIMEOUT: NONE }
```

Any value above `1ms` will set the timeout, beyond which no query that takes any longer than this will succeed.

```surql
ALTER SYSTEM QUERY_TIMEOUT 1ms;
FOR $_ IN 0..1000 {
    FOR $_ IN 0..1000 {
        CREATE |person:1000|;
    }
};

-- 'The query was not executed because it exceeded the timeout: 1ms'
```

## COMPACT clause

Compacts the entire datastore. To compact other resources, use [ALTER NAMESPACE](/docs/surrealql/statements/alter/namespace) to compact the current namespace keyspace, [ALTER DATABASE](/docs/surrealql/statements/alter/database) to compact the current database keyspace, or [ALTER TABLE](/docs/surrealql/statements/alter/table) to compact a specific table keyspace.

The actual compaction used will depend on the datastore, such as RocksDB or SurrealKV.

This clause will not work with in-memory storage which has nothing persistent to compact, producing the following error:

```surql
'The storage layer does not support compaction requests.'
```

A successful compaction will return `NONE`.

```surql
ALTER SYSTEM COMPACT;
-- NONE
```