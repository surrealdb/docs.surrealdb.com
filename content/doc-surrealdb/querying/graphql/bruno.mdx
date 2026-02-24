---
sidebar_position: 3
sidebar_label: GraphQL via Bruno
title: GraphQL via Bruno | GraphQL
description: In this section, you will explore querying SurrealDB using Bruno.
---

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

# GraphQL via Bruno

## Getting Started

Before you can start making queries, you need to start SurrealDB. You can do this by starting a new instance of SurrealDB with the [`surreal start`](/docs/surrealdb/cli/start) command, docker, Surrealist.

<Tabs groupId="start-surreal">
<TabItem value="cli" label="CLI">
```bash
surreal start --log debug --user root --password secret
```
</TabItem>
<TabItem value="docker" label="Docker">
```bash
docker run --rm --pull always -p 8000:8000 surrealdb/surrealdb:nightly start -u root -p secret
```
</TabItem>
</Tabs>

## Create a new Bruno collection

Create a new collection by hand, or copy the following files into a new folder, for example `graphql-test`.

If you are creating your collection copying the following files, make sure to create `bruno.json` with the following content:

```json
{
  "version": "1",
  "name": "surrealdb graphql",
  "type": "collection",
  "ignore": [
    "node_modules",
    ".git"
  ]
}
```

Set authentication to basic, using your credentials from above (username: `root`, password: `secret`). Or save the following in a new file as `collection.bru`:

```
auth {
  mode: basic
}

auth:basic {
  username: root
  password: secret
}
```

## Create a script to populate the DB 

Save this file as `import.bru`. We are going to import this script using Bruno:

```
meta {
  name: import
  type: http
  seq: 2
}

post {
  url: http://localhost:8000/import
  body: text
  auth: inherit
}

headers {
  Surreal-NS: test
  Surreal-DB: graphql
  Accept: application/json
}

body:text {
  DEFINE TABLE item SCHEMAFULL;
  DEFINE TABLE tag SCHEMAFULL;
  DEFINE TABLE container SCHEMAFULL;
  DEFINE TABLE space SCHEMAFULL;
  
  -- Enable GraphQL for the table
  DEFINE CONFIG GRAPHQL AUTO;
  
  -- Define some fields
  DEFINE FIELD name ON TABLE item TYPE string;
  DEFINE FIELD description ON TABLE item TYPE string;
  DEFINE FIELD space ON TABLE item TYPE record;
  DEFINE FIELD time ON TABLE item TYPE object;
  DEFINE FIELD time.createdAt ON TABLE item TYPE datetime;
  
  DEFINE FIELD tags ON TABLE item TYPE array<object>;
  DEFINE FIELD tags.*.name ON TABLE item TYPE string;
  DEFINE FIELD tags.*.color ON TABLE item TYPE string;
  
  DEFINE FIELD name ON TABLE tag TYPE string;
  DEFINE FIELD name ON TABLE container TYPE string;
  DEFINE FIELD name ON TABLE space TYPE string;
  
  DEFINE TABLE is_in TYPE RELATION IN item | container OUT container | space;
  DEFINE TABLE tagged TYPE RELATION IN item OUT tag;
  
  -- Create tags
  CREATE tag:electronics CONTENT { name: 'Electronics' };
  CREATE tag:tools CONTENT { name: 'Tools' };
  CREATE tag:cleaning CONTENT { name: 'Cleaning' };
  
  -- Create spaces
  CREATE space:home CONTENT { name: 'Home' };
  
  -- Create containers
  LET $c_living = CREATE container CONTENT { name: 'Living room' } RETURN id;
  LET $c_desk = CREATE container CONTENT { name: 'Work desk' } RETURN id;
  LET $c_box = CREATE container CONTENT { name: 'Box 1' } RETURN id;
  LET $c_box_2 = CREATE container CONTENT { name: 'Small box 2' } RETURN id;
  
  RELATE $c_box_2->is_in->$c_box SET time = { updatedAt: time::now() };
  RELATE $c_box->is_in->$c_desk SET time = { updatedAt: time::now() };
  RELATE $c_desk->is_in->$c_living SET time = { updatedAt: time::now() };
  RELATE $c_living->is_in->space:home SET time = { updatedAt: time::now() };
  
  -- Create an item
  LET $item = CREATE item CONTENT {
      name: 'Lens wipes',
      description: 'box of lens wipes',
      space: space:home,
      tags: [{name: "comsumable", color: "#FF0000"}, {name: "cleaning", color: "#0000FF"}],
      time: {
          createdAt: time::now()
      }
  } RETURN id;
  
  RELATE $item->is_in->$c_box SET time = { updatedAt: time::now() };
  RELATE $item->tagged->tag:cleaning;
  
  -- Create an item
  LET $item2 = CREATE item CONTENT {
      name: 'HDD',
      description: 'external hard drive samsung white',
      space: space:home,
      tags: [{name: "electronics", color: "#00FFFF"}],
      time: {
          createdAt: time::now()
      }
  } RETURN id;
  
  RELATE $item2->is_in->$c_box_2 SET time = { updatedAt: time::now() };
  RELATE $item2->tagged->tag:electronics;
  
}

settings {
  encodeUrl: true
  timeout: 0
}
```

## Create a script to query using GraphQL

Save this one as `query.graphql`

```
meta {
  name: test
  type: graphql
  seq: 1
}

post {
  url: http://localhost:8000/graphql
  body: graphql
  auth: inherit
}

headers {
  Surreal-NS: test
  Surreal-DB: graphql
  Accept: application/json
}

body:graphql {
  {
    item(filter: { name: { ne: "HDD" } }) {  # -- example "not equals" filter
      name
      space {
        id
      }
    }
  }
}

settings {
  encodeUrl: true
  timeout: 0
}
```

## Now open and run in Bruno

Your collection folder should contain the following files:

- `bruno.json`
- `collection.bru`
- `import.bru`
- `query.bru`

Open the collection in Bruno, run the "import" request, and then "query".

You should then see a result like this:

```json
{
  "data": {
    "item": [
      {
        "name": "Lens wipes",
        "space": {
          "id": "space:home"
        }
      }
    ]
  }
}
```

## Troubleshooting

- if you see this error: `InvalidRequest(NotConfigured)`, make sure you have included this line in the import `DEFINE CONFIG GRAPHQL AUTO`.
