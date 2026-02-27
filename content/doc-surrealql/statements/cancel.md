---
sidebar_position: 4
sidebar_label: CANCEL
title: CANCEL statement | SurrealQL
description: The CANCEL statement can be used to cancel the statements within a transaction, reverting or rolling back any data modification made within the transaction as a whole.
---

# `CANCEL` statement

Each statement within SurrealDB is run within its own transaction. If a set of changes need to be made together, then groups of statements can be run together as a single transaction, either succeeding as a whole, or failing without leaving any residual data modifications. While a transaction will fail if any of its statements encounters an error, the `CANCEL` statement can also be used to cancel a transaction manually.

import RailroadDiagram from '@components/RailroadDiagram.astro'
import Tabs from '@components/Tabs/Tabs.astro'
import TabItem from '@components/Tabs/TabItem.astro'

### Statement syntax

<Tabs syncKey="cancel-statement">
  <TabItem label="SurrealQL Syntax">

```syntax title="SurrealQL Syntax"
CANCEL [ TRANSACTION ];
```

  </TabItem>
  <TabItem label="Railroad Diagram">

export const cancelAst = {
  type: "Diagram",
  padding: [10, 20, 10, 20],
  children: [
    { type: "Sequence", children: [
      { type: "Terminal", text: "CANCEL" },
      { type: "Optional", child: { type: "Terminal", text: "TRANSACTION" } },
      { type: "Terminal", text: ";" }
    ]}
  ]
};

<RailroadDiagram ast={cancelAst} className="my-6" />

  </TabItem>
</Tabs>

## Example usage

The following query shows example usage of this statement.

```surql
/**[test]

[[test.results]]
error = "'The query was not executed due to a cancelled transaction'"

[[test.results]]
error = "'The query was not executed due to a cancelled transaction'"

[[test.results]]
error = "'The query was not executed due to a cancelled transaction'"

[[test.results]]
error = "'The query was not executed due to a cancelled transaction'"

*/

BEGIN TRANSACTION;

-- Setup accounts
CREATE account:one SET balance = 135605.16;
CREATE account:two SET balance = 91031.31;

-- Move money
UPDATE account:one SET balance += 300.00;
UPDATE account:two SET balance -= 300.00;

-- Rollback all changes
CANCEL TRANSACTION;
```

`CANCEL` is not used to automatically cancel a transaction based on a condition such as inside an [IF..ELSE](/docs/surrealql/statements/ifelse) block. Instead, a [THROW](/docs/surrealql/statements/throw) statement is used. THROW can be followed by any value, usually a string containing context behind the error.

```surql
/**[test]

[[test.results]]
error = "'The query was not executed due to a cancelled transaction'"

[[test.results]]
error = "'The query was not executed due to a cancelled transaction'"

[[test.results]]
error = "'The query was not executed due to a cancelled transaction'"

[[test.results]]
error = "'The query was not executed due to a cancelled transaction'"

[[test.results]]
error = "'An error occurred: Not enough funds'"

*/

BEGIN TRANSACTION;

-- Setup accounts
CREATE account:one SET balance = 135605.16;
CREATE account:two SET balance = 200.31;

-- Move money
UPDATE account:one SET balance += 300.00;
UPDATE account:two SET balance -= 300.00;

IF account:two.balance < 0 {
    THROW "Not enough funds";
};

COMMIT TRANSACTION;
```
