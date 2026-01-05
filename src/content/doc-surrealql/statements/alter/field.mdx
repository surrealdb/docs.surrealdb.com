---
sidebar_position: 3
sidebar_label: FIELD
title: ALTER FIELD statement | SurrealQL
description: The ALTER statement can be used to change authentication access and behaviour, global parameters, table configurations, table events, schema definitions, and indexes.
---

import Since from '@components/shared/Since.astro'
import RailroadDiagram from '@components/RailroadDiagram.astro'
import Tabs from '@components/Tabs/Tabs.astro'
import TabItem from '@components/Tabs/TabItem.astro'

# `ALTER FIELD` statement

The `ALTER FIELD` statement is used to change or entirely drop clauses of a defined field on a table.

## Statement syntax

<Tabs syncKey="alter-statement">
  <TabItem label="SurrealQL Syntax">

```syntax title="SurrealQL Syntax"
ALTER FIELD [ IF EXISTS ] ON [ TABLE ] @table 
[ 
    DROP TYPE |
    DROP FLEXIBLE |
    DROP READONLY |
    DROP VALUE |
    DROP ASSERT |
    DROP DEFAULT |
    DROP COMMENT |
    DROP REFERENCE |
    FLEXIBLE |
    READONLY |
    REFERENCE |
    TYPE @type |
    VALUE @value |
    ASSERT @expression |
    DEFAULT [ ALWAYS ] @expression |
    [ PERMISSIONS [ NONE | FULL
		| FOR select @expression
		| FOR create @expression
		| FOR update @expression
		| FOR delete @expression
	] ]
    COMMENT @string |
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
        { type: "Terminal", text: "ALTER FIELD" },
        {
          type: "Optional",
          child: {
            type: "Sequence",
            children: [
              { type: "Terminal", text: "IF" },
              { type: "Terminal", text: "EXISTS" },
            ],
          },
        },
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
                      { type: "Terminal", text: "TYPE" },
                      { type: "Terminal", text: "FLEXIBLE" },
                      { type: "Terminal", text: "READONLY" },
                      { type: "Terminal", text: "VALUE" },
                      { type: "Terminal", text: "ASSERT" },
                      { type: "Terminal", text: "DEFAULT" },
                      { type: "Terminal", text: "COMMENT" },
                      { type: "Terminal", text: "REFERENCE" },
                    ],
                  },
                ],
              },

              { type: "Terminal", text: "FLEXIBLE" },
              { type: "Terminal", text: "READONLY" },
              { type: "Terminal", text: "REFERENCE" },

              {
                type: "Sequence",
                children: [
                  { type: "Terminal", text: "TYPE" },
                  { type: "Terminal", text: "@type" },
                ],
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


## Examples

As `ALTER FIELD` contains the same clauses available in a [`DEFINE FIELD`](/docs/surrealql/statements/define/field) statement, be sure to see that page for more examples.

Here is one example in which the `name` field is defined for a record `user`:

```surql
DEFINE FIELD name ON user TYPE string;
```

Later on, a database-wide [parameter](/docs/surrealql/statements/define/param) is defined to disallow certain user names. This can be followed up with an `ALTER FIELD` statement to add the `ASSERT` clause to it.

```surql
DEFINE PARAM $DISALLOWED_NAMES VALUE ["Lord British", "Lord Blackthorn"];
ALTER FIELD name ON user ASSERT $value NOT IN $DISALLOWED_NAMES;
CREATE user SET name = "Lord British";
```

```surql title="Output"
"Found 'Lord British' for field `name`, with record `user:yn4yttkg5w683q2937bq`, but field must conform to: $value NOTINSIDE $DISALLOWED_NAMES""
```

## See also

* [`DEFINE FIELD`](/docs/surrealql/statements/define/field)