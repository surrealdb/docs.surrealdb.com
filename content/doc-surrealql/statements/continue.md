---
sidebar_position: 6
sidebar_label: CONTINUE
title: CONTINUE statement | SurrealQL
description: The CONTINUE statement can be used to skip an iteration of a loop, like within the FOR statement
---

# `CONTINUE` statement

The CONTINUE statement can be used to skip an iteration of a loop, like within the [FOR statement](/docs/surrealql/statements/for).

import RailroadDiagram from '@components/RailroadDiagram.astro'
import Tabs from '@components/Tabs/Tabs.astro'
import TabItem from '@components/Tabs/TabItem.astro'

### Statement syntax

<Tabs syncKey="continue-statement">
  <TabItem label="SurrealQL Syntax">

```syntax title="SurrealQL Syntax"
CONTINUE
```

  </TabItem>
  <TabItem label="Railroad Diagram">

export const continueAst = {
  type: "Diagram",
  padding: [10, 20, 10, 20],
  children: [
    { type: "Sequence", children: [
      { type: "Terminal", text: "CONTINUE" }
    ]}
  ]
};

<RailroadDiagram ast={continueAst} className="my-6" />

  </TabItem>
</Tabs>

## Example usage

The following queries shows example usage of this statement.

Skipping an iteration of a loop unless a certain condition is met:

```surql
/**[test]

[[test.results]]
value = "NONE"

*/

-- Set can_vote to true for every person over 18 years old.
FOR $person IN (SELECT id, age FROM person) {
	IF ($person.age < 18) {
		CONTINUE;
	};

	UPDATE $person.id SET can_vote = true;
};
```

Skipping an iteration of a loop when bad data is encountered:

```surql
/**[test]

[[test.results]]
value = "NONE"

[[test.results]]
value = "NONE"

*/

-- Data retrieved from somewhere which contains many NONE values
LET $weather = [
	{
		city: 'London',
		temperature: 22.2,
		timestamp: 1722565566389
	},
	NONE,
	{
		city: 'London',
		temperature: 20.1,
		timestamp: 1722652002699
	},
    {
        city: 'Phoenix',
        temperature: 45.1,
        timestamp: 1722565642160
    },
    NONE,
    NONE,
    {
        city: 'Phoenix',
        temperature: 45.1,
        timestamp: 1722652070372
    },
];

FOR $data IN $weather {
    IF $data IS NONE {
        CONTINUE;
    };

	CREATE weather CONTENT $data;
};
```
