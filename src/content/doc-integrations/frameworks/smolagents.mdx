---
sidebar_position: 1
sidebar_label: Smolagents
title: SmolAgents— Grocery Finder
description: A complete walkthrough for building a code-generating AI agent that recommends grocery items by querying SurrealDB's HNSW vector index.
---

# Smolagents

In this guide you will build an agent that, given a natural-language shopping request, finds the most relevant grocery items in your database and returns them in a single reply.

## Install the dependencies

```bash
pip install smolagents surrealdb fastembed datasets
```

| Library        | Purpose                                |
| -------------- | -------------------------------------- |
| **surrealdb**  | Async Python SDK for SurrealDB         |
| **smolagents** | Code-generating agent framework        |
| **fastembed**  | Local Jina v2 embedding model (768-D)  |
| **datasets**   | Pulls the public *GroceryList* dataset |

## Create a SurrealDB "grocery search" tool

```python
from fastembed import TextEmbedding
from surrealdb import AsyncSurreal
from smolagents import Tool
from datasets import load_dataset
import asyncio, os
from typing import List, Dict, Any

class GroceryQueryTool(Tool):
    name = "surreal_grocery_search"
    description = "Semantic search over grocery items stored in SurrealDB."
    inputs = {
        "query": {
            "type": "string",
            "description": "A natural-language description of a grocery need.",
        }
    }
    output_type = "string"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # Connection details
        self.uri = "ws://localhost:8000/rpc"
        self.ns = "demo"
        self.dbname = "demo"
        self.table = "groceries"
        self.user = os.getenv("SURREAL_USER", "root")
        self.pw = os.getenv("SURREAL_PASS", "secret")

        self.emb = TextEmbedding(model_name="jinaai/jina-embeddings-v2-base-en")

        # one-time async bootstrap
        asyncio.run(self._setup())

    async def _setup(self):
        """Connect, create schema, and ingest groceries if empty."""
        async with AsyncSurreal(self.uri) as db:
            await db.signin({"username": self.user, "password": self.pw})
            await db.use(self.ns, self.dbname)

            schema = """
            DEFINE TABLE $tb SCHEMALESS PERMISSIONS NONE;
            DEFINE FIELD item_name   ON $tb TYPE string;
            DEFINE FIELD category    ON $tb TYPE string;
            DEFINE FIELD description ON $tb TYPE string;
            DEFINE FIELD embedding   ON $tb TYPE array;

            DEFINE INDEX idx_hnsw ON $tb
              FIELDS embedding
              HNSW DIMENSION 768
              DIST   COSINE;
            """
            await db.query(schema, {"tb": self.table})

            # skip ingest if we already have rows
            existing = await db.query(f"SELECT count() FROM {self.table};")
            if existing[0]["result"][0]["count"] > 0:
                return

            print("🛒 Ingesting GroceryList dataset …")
            ds = load_dataset("AmirMohseni/GroceryList")["train"]  # 225 rows

            BATCH = 64
            items = ds["item"]
            cats = ds["category"]
            descs = [f"{it.capitalize()} is in the {cat} aisle." for it, cat in zip(items, cats)]

            for i in range(0, len(descs), BATCH):
                vecs = self.emb.query_embed(descs[i:i+BATCH])
                rows = [
                    {
                        "id": f"{self.table}:{i+j}",
                        "item_name": items[i+j],
                        "category": cats[i+j],
                        "description": descs[i+j],
                        "embedding": list(vec),
                    }
                    for j, vec in enumerate(vecs)
                ]
                await db.create(self.table, rows)

    async def _lookup(self, query_vec: List[float]) -> List[Dict[str, Any]]:
        """Perform vector search with proper connection management."""
        async with AsyncSurreal(self.uri) as db:
            await db.signin({"username": self.user, "password": self.pw})
            await db.use(self.ns, self.dbname)

            surql = """
            LET $q := $vec;
            SELECT item_name, category, description,
                   vector::distance::knn() AS dist
            FROM $tb
            WHERE embedding <|$k,$ef|> $q      -- top-k, efSearch
            ORDER BY dist;
            """
            result = await db.query(
                surql,
                {
                    "vec": query_vec,
                    "tb": self.table,
                    "k": 5,
                    "ef": 64
                }
            )
            return result[0]["result"]

    def forward(self, query: str) -> str:
        """Return the five closest grocery items."""
        q_vec = next(self.emb.query_embed(query))
        hits = asyncio.run(self._lookup(q_vec))

        return "Retrieved items:\n" + "".join(
            f"== {hit['item_name'].title()} ==\n"
            f"Category: {hit['category']}\n"
            f"{hit['description']}\n\n"
            for hit in hits
        )
```