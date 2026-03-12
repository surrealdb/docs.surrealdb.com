---
sidebar_position: 1
sidebar_label: Agno
title: Agno | Integrations
description: This section contains information about the Agno framework and how to integrate it with SurrealDB.
---

# Agno

[Agno](https://github.com/agno-agi/agno) is a python framework for building multi-agent systems with shared memory, knowledge and reasoning.

## Setup

```shell
docker run --rm \
  --pull always \
  -p 8000:8000 \
  surrealdb/surrealdb:latest \
  start \
  --user root \
  --pass root
```

or

```shell
./cookbook/scripts/run_surrealdb.sh
```

## Example

```python
from agno.agent import Agent
from agno.embedder.openai import OpenAIEmbedder
from agno.knowledge.pdf_url import PDFUrlKnowledgeBase
from agno.vectordb.surrealdb import SurrealDb
from surrealdb import Surreal

# SurrealDB connection parameters
SURREALDB_URL = "ws://localhost:8000"
SURREALDB_USER = "root"
SURREALDB_PASSWORD = "root"
SURREALDB_NAMESPACE = "test"
SURREALDB_DATABASE = "test"

# Create a client
client = Surreal(url=SURREALDB_URL)
client.signin({"username": SURREALDB_USER, "password": SURREALDB_PASSWORD})
client.use(namespace=SURREALDB_NAMESPACE, database=SURREALDB_DATABASE)

surrealdb = SurrealDb(
    client=client,
    collection="recipes",  # Collection name for storing documents
    efc=150,  # HNSW construction time/accuracy trade-off
    m=12,  # HNSW max number of connections per element
    search_ef=40,  # HNSW search time/accuracy trade-off
)


def sync_demo():
    """Demonstrate synchronous usage of SurrealDb"""
    knowledge_base = PDFUrlKnowledgeBase(
        urls=["https://agno-public.s3.amazonaws.com/recipes/ThaiRecipes.pdf"],
        vector_db=surrealdb,
        embedder=OpenAIEmbedder(),
    )

    # Load data synchronously
    knowledge_base.load(recreate=True)

    # Create agent and query synchronously
    agent = Agent(knowledge=knowledge_base, show_tool_calls=True)
    agent.print_response(
        "What are the 3 categories of Thai SELECT is given to restaurants overseas?",
        markdown=True,
    )


if __name__ == "__main__":
    # Run synchronous demo
    print("Running synchronous demo...")
    sync_demo()
```

## Developer Resources

* View [Cookbook (Sync)](https://github.com/agno-agi/agno/blob/main/cookbook/agent_concepts/knowledge/vector_dbs/surrealdb/surreal_db.py)
* View [Cookbook (Async)](https://github.com/agno-agi/agno/blob/main/cookbook/agent_concepts/knowledge/vector_dbs/surrealdb/async_surreal_db.py)
* View [Agno documentation](https://docs.agno.com/vectordb/surrealdb)
