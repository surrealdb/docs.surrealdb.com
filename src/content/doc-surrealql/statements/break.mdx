---
sidebar_position: 3
sidebar_label: BREAK
title: BREAK statement | SurrealQL
description: The BREAK statement can be used to break out of a loop.
---

# `BREAK` statement

The BREAK statement can be used to break out of a loop, such as inside one created by the [FOR statement](/docs/surrealql/statements/for).

import RailroadDiagram from '@components/RailroadDiagram.astro'
import Tabs from '@components/Tabs/Tabs.astro'
import TabItem from '@components/Tabs/TabItem.astro'

### Statement syntax

<Tabs syncKey="break-statement">
  <TabItem label="SurrealQL Syntax">

```syntax title="SurrealQL Syntax"
BREAK
```

  </TabItem>
  <TabItem label="Railroad Diagram">

export const breakAst = {
  type: "Diagram",
  padding: [10, 20, 10, 20],
  children: [
    { type: "Sequence", children: [
      { type: "Terminal", text: "BREAK" }
    ]}
  ]
};

<RailroadDiagram ast={breakAst} className="my-6" />

  </TabItem>
</Tabs>

## Example usage

The following queries shows example usage of this statement.

Creating a person for everyone in the array where the number is less than or equal to 5:

```surql
/**[test]

[[test.results]]
value = "NONE"

[[test.results]]
value = "NONE"

*/

LET $numbers = [1,2,3,4,5,6,7,8,9];

FOR $num IN $numbers {
    IF $num > 5 {
        BREAK;

    } ELSE IF $num < 5 {
        CREATE type::record(
            'person', $num
        ) CONTENT {
            name: "Person number " + <string>$num
        };
    };
};
```

Breaking out of a loop once unwanted data is encountered:

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

-- Sort the data to move the NONE values to the end
-- and break once the first NONE is reached
FOR $data IN array::sort::desc($weather) {
    IF $data IS NONE {
        BREAK;
    } ELSE {
        CREATE weather CONTENT $data;
    };
};
```
