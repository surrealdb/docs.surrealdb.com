---
sidebar_position: 8
sidebar_label: TABLE
title: ALTER TABLE statement | SurrealQL
description: The ALTER statement can be used to change authentication access and behaviour, global parameters, table configurations, table events, schema definitions, and indexes.
---

import Since from '@components/shared/Since.astro'
import RailroadDiagram from '@components/RailroadDiagram.astro'
import Tabs from '@components/Tabs/Tabs.astro'
import TabItem from '@components/Tabs/TabItem.astro'

# `ALTER TABLE` statement

The `ALTER TABLE` statement is used to alter a defined table.

<Tabs syncKey="alter-statement">
  <TabItem label="SurrealQL Syntax">

```syntax title="SurrealQL Syntax"
ALTER TABLE [
	[ IF EXISTS ] @name
		[ DROP COMMENT ]
        [ DROP CHANGEFEED ]
        [ COMPACT ]
		[ SCHEMAFULL | SCHEMALESS ]
		[ PERMISSIONS [ NONE | FULL
			| FOR select @expression
			| FOR create @expression
			| FOR update @expression
			| FOR delete @expression
		] ]
    [ CHANGEFEED @duration ]
    [ COMMENT @string ] 
    [ CHANGEFEED ]
]
```

  </TabItem>
  <TabItem label="Railroad Diagram">

export const alterAst = {
  type: "Diagram",
  padding: [10, 20, 10, 20],
  children: [
    {
      type: "Sequence",
      children: [
        { type: "Terminal", text: "ALTER TABLE" },
        { type: "Optional", child: { type: "Sequence", children: [ { type: "Terminal", text: "IF" }, { type: "Terminal", text: "EXISTS" } ] } },
        { type: "Terminal", text: "@table" },

        {
          type: "OneOrMore",
          child: {
            type: "Choice",
            index: 0,
            children: [
              {
                type: "Sequence",
                children: [
                  { type: "Terminal", text: "DROP" },
                  {
                    type: "Choice",
                    index: 0,
                    children: [
                      { type: "Terminal", text: "COMMENT" },
                      { type: "Terminal", text: "CHANGEFEED" },
                    ],
                  },
                ],
              },

              { type: "Terminal", text: "COMPACT" },

              {
                type: "Optional",
                child: {
                  type: "Sequence",
                  children: [
                    { type: "Terminal", text: "TYPE" },
                    {
                      type: "Choice",
                      index: 1,
                      children: [
                        { type: "Terminal", text: "ANY" },
                        { type: "Terminal", text: "NORMAL" },
                        {
                          type: "Sequence",
                          children: [
                            { type: "Terminal", text: "RELATION" },
                            {
                              type: "Optional",
                              child: {
                                type: "Sequence",
                                children: [
                                  {
                                    type: "Choice",
                                    index: 1,
                                    children: [
                                      { type: "Terminal", text: "IN" },
                                      { type: "Terminal", text: "FROM" },
                                    ],
                                  },
                                  { type: "NonTerminal", text: "@table" },
                                ],
                              },
                            },
                            {
                              type: "Optional",
                              child: {
                                type: "Sequence",
                                children: [
                                  {
                                    type: "Choice",
                                    index: 1,
                                    children: [
                                      { type: "Terminal", text: "OUT" },
                                      { type: "Terminal", text: "TO" },
                                    ],
                                  },
                                  { type: "NonTerminal", text: "@table" },
                                ],
                              },
                            },
                            { type: "Optional", child: { type: "Terminal", text: "ENFORCED" } },
                          ],
                        },
                      ],
                    },
                  ],
                },
              },

              {
                type: "Sequence",
                children: [
                  { type: "Terminal", text: "VALUE" },
                  { type: "Terminal", text: "@value" },
                ],
              },
              {
                type: "Sequence",
                children: [
                  { type: "Terminal", text: "ASSERT" },
                  { type: "Terminal", text: "@expression" },
                ],
              },
              {
                type: "Sequence",
                children: [
                  { type: "Terminal", text: "DEFAULT" },
                  { type: "Optional", child: { type: "Terminal", text: "ALWAYS" } },
                  { type: "Terminal", text: "@expression" },
                ],
              },

              {
                type: "Optional",
                child: {
                  type: "Sequence",
                  children: [
                    { type: "Terminal", text: "PERMISSIONS" },
                    {
                      type: "Choice",
                      index: 1,
                      children: [
                        { type: "Terminal", text: "NONE" },
                        { type: "Terminal", text: "FULL" },
                        {
                          type: "Sequence",
                          children: [
                            { type: "Terminal", text: "WHERE" },
                            { type: "NonTerminal", text: "@condition" },
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
              {
                type: "Sequence",
                children: [
                  { type: "Terminal", text: "COMMENT" },
                  { type: "Terminal", text: "@string" },
                ],
              },
            ],
          },
          repeat: { type: "Skip" },
        },
      ],
    },
  ],
};

<RailroadDiagram ast={alterAst} className="my-6" />

  </TabItem>
</Tabs>

## COMPACT

<Since v="v3.0.0" />

Performs storage compaction on a specific table keyspace. To compact other resources, use [ALTER SYSTEM](/docs/surrealql/statements/alter/system) to compact the entire datastore, [ALTER NAMESPACE](/docs/surrealql/statements/alter/namespace) to compact the current namespace keyspace, or [ALTER DATABASE](/docs/surrealql/statements/alter/database) to compact the current database keyspace.

The actual compaction used will depend on the datastore, such as RocksDB or SurrealKV.

This clause will not work with in-memory storage which has nothing persistent to compact, producing the following error:

```surql
'The storage layer does not support compaction requests.'
```

A successful compaction will return `NONE`.

```surql
ALTER TABLE user COMPACT;
-- NONE
```

## See also

* [`DEFINE TABLE`](/docs/surrealql/statements/define/table)