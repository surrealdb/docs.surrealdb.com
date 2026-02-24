---
sidebar_position: 1
sidebar_label: Feast
title: Feast
description: Feast is a feature store for ML that supports feature retrieval and serving.
---

# Feast

[Feast](https://docs.feast.dev) (**Fea**ture **St**ore) is an open-source feature store for production ML.
You define your features once and Feast handles validation, materialisation and low-latency online look-ups.

## Installation

```bash
pip install feast surrealdb openai     # swap OpenAI for any embedder you like
```


## Configuring Feast with SurrealDB

Feast lets you plug in a custom online store by pointing to a Python class.
Create `surreal_online_store.py` in your repo:

```python
# surreal_online_store.py
from feast.infra.online_stores.base import OnlineStore, OnlineReadOptions
from typing import List, Tuple, Any, Dict
from surrealdb import AsyncSurreal
import json, os, asyncio

class SurrealOnlineStore(OnlineStore):
    """
    Minimal SurrealDB-backed online store for embedding vectors.
    Stores one table per feature view: <project>__<entity>.
    """

    def __init__(
        self,
        *,
        url: str = "ws://localhost:8000/rpc",
        namespace: str = "feast",
        database: str = "online",
        user: str = "root",
        password: str = "secret",
        **_,
    ):
        self.url = url
        self.namespace = namespace
        self.database = database
        self.user = user
        self.password = password

    # ---------- write --------------------------------------------------
    def online_write_batch(self, project, table, data, progress=None):
        asyncio.run(self._write_batch(table, data))

    async def _write_batch(self, table, data):
        async with AsyncSurreal(self.url) as db:
            await db.signin({"username": self.user, "password": self.password})
            await db.use(self.namespace, self.database)
            
            await self._ensure_table(db, table)
            for entity_key, values, timestamp in data:
                row = {
                    "id": "_".join(map(str, entity_key.entity_id)),
                    **{fv: v for fv, v in values.items()},
                    "_timestamp": int(timestamp.timestamp()),
                }
                await db.create(table, row)

    # ---------- read ---------------------------------------------------
    def online_read(
        self,
        project,
        table,
        entity_keys: List[Any],
        requested_features: List[str],
        options: OnlineReadOptions,
    ) -> List[Tuple[Any, Dict[str, Any]]]:
        return asyncio.run(self._read(table, entity_keys, requested_features))

    async def _read(
        self,
        table: str,
        entity_keys: List[Any],
        requested_features: List[str],
    ) -> List[Tuple[Any, Dict[str, Any]]]:
        async with AsyncSurreal(self.url) as db:
            await db.signin({"username": self.user, "password": self.password})
            await db.use(self.namespace, self.database)

            keys = ["_".join(map(str, k.entity_id)) for k in entity_keys]
            results = []
            for k in keys:
                res = await db.select(f"{table}:{k}")
                if res:
                    row = res[0]
                    results.append((k, {f: row.get(f) for f in requested_features}))
                else:
                    results.append((k, {}))
            return results

    # ---------- vector helper -----------------------------------------
    def retrieve_online_documents(
        self,
        table: str,
        query_vector: List[float],
        top_k: int = 5,
        distance: str = "COSINE",
    ):
        return asyncio.run(self._retrieve_documents(table, query_vector, top_k, distance))

    async def _retrieve_documents(
        self,
        table: str,
        query_vector: List[float],
        top_k: int = 5,
        distance: str = "COSINE",
    ):
        async with AsyncSurreal(self.url) as db:
            await db.signin({"username": self.user, "password": self.password})
            await db.use(self.namespace, self.database)

            result = await db.query(
                """
                SELECT id, 
                       vector::distance::cosine(embedding, $vec) AS score
                FROM $table
                WHERE embedding <|$k|> $vec
                ORDER BY score ASC
                """,
                {
                    "table": table,
                    "vec": query_vector,
                    "k": top_k
                }
            )
            return result[0]["result"]

    # ---------- internals ---------------------------------------------
    async def _ensure_table(self, db: AsyncSurreal, table: str):
        await db.query(
            """
            DEFINE TABLE $table SCHEMALESS;
            DEFINE FIELD id        ON $table TYPE string;
            DEFINE FIELD embedding ON $table TYPE array;
            DEFINE INDEX IF NOT EXISTS ${table}_vec
                ON $table FIELDS embedding
                HNSW DIMENSION 384 DIST COSINE;
            """,
            {"table": table}
        )
```

### YAML config

```yaml
# feature_store.yaml
project: my_feature_repo
registry: data/registry.db
provider: local
online_store:
  path: surreal_online_store.SurrealOnlineStore   # ← Python path
  url: ws://localhost:8000/rpc
  namespace: feast
  database: online
  vector_len: 384
  write_batch_size: 100
```

## Retrieving vectors online

```python
from feast import FeatureStore
from typing import List

store = FeatureStore(repo_path="feature_store.yaml")

# The custom store adds `.retrieve_online_documents`
query_vector: List[float] = [1.0, 2.0, 3.0, 4.0]   # 384-D in real life

top_k = 5
rows = store.online_store.retrieve_online_documents(
    table="my_feature_view__user_id",
    query_vector=query_vector,
    top_k=top_k,
)

for r in rows:
    print(r["id"], r["score"])
```
## Why SurrealDB?

SurrealDB is a **multi-model database with native vector search**.
Key capabilities that map well to Feast's needs:

<table>
    <thead>
        <tr>
            <th>SurrealDB feature</th>
            <th>Benefit for a feature-store</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong><code>DEFINE INDEX … HNSW</code></strong> – build an approximate-NN index in one DDL line (<a href="#" rel="noopener noreferrer">SurrealDB</a>)</td>
            <td>Millisecond-latency k-NN retrieval without an extra service</td>
        </tr>
        <tr>
            <td><strong><code>vector::similarity::cosine()</code></strong> & [other vector functions](/docs/surrealql/functions/database/vector)</td>
            <td>Compute similarity scores directly in the query plan</td>
        </tr>
        <tr>
            <td><strong><code>&lt;|K|&gt;</code></strong> operator for "return <em>K</em> [nearest neighbours](/docs/surrealql/operators)"</td>
            <td>Simple, declarative top-K semantics for online reads</td>
        </tr>
        <tr>
            <td>Document / table / graph in one engine</td>
            <td>Store scalar features <strong>and</strong> embeddings side-by-side</td>
        </tr>
    </tbody>
</table>



### Going further

- **HNSW tune-ups** – adjust `EF`/`M` parameters in the `DEFINE INDEX …` line to trade search speed vs. recall.
- **Multi-vector features** – SurrealQL supports **named vectors**; simply add another `embedding₂` field and index.
- **SQL + vector filters** – mix Boolean predicates with similarity (`WHERE metadata.region = 'EU' AND embedding <|…|>`).
- **Streaming updates** – SurrealDB's live queries let downstream services react instantly when features change.

With these few steps, Feast can serve scalar features and high-dimensional embeddings straight out of SurrealDB—zero micro-services, one binary. Happy feasting!

## Resources

- [DEFINE INDEX statement](/docs/surrealql/statements/define/indexes)
- [Vector functions](/docs/surrealql/functions/database/vector)
- [Operators](/docs/surrealql/operators)

