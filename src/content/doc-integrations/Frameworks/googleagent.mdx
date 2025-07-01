---
sidebar_position: 1
sidebar_label: Google Agent
title: Google Agent
description: Google Agent is a framework for building and deploying agents.
---

# Google Agent

Vertex AI Agent Builder provides a powerful framework for developing and deploying intelligent agents in Google Cloud. This integration is particularly valuable since any agent running on Vertex AI Agent Engine or the open-source ADK runtime can be seamlessly [surfaced through Agentspace](https://cloud.google.com/products/agentspace), making it easily accessible to your organization.

### TL;DR

*Build the agent with ADK → deploy to Agent Engine → "Add to Agentspace"*—the SurrealDB retrieval tool keeps working unchanged, giving your Gemini-based agent sub-second RAG over your own vector index, all inside Google Cloud.

Below is a concise walkthrough that shows:

1. creating a SurrealDB-powered retrieval tool
2. wiring it into an **ADK** agent
3. deploying that agent to Agent Engine
4. registering it in Agentspace so employees can chat with it from the Agentspace UI.

## Prerequisites

```bash
pip install google-adk google-genai surrealdb    # ADK + Gemini SDK + SurrealDB
docker run -p 8000:8000 surrealdb/surrealdb:latest \
       start --user root --pass secret file:/data/db   # optional local DB
export GOOGLE_API_KEY=<your-Gemini-key>
```

## Prepare SurrealDB (one-time DDL)

```surql
DEFINE TABLE kb_docs SCHEMALESS;
DEFINE FIELD id        ON kb_docs TYPE string;
DEFINE FIELD text      ON kb_docs TYPE string;
DEFINE FIELD source    ON kb_docs TYPE string;
DEFINE FIELD embedding ON kb_docs TYPE array;

-- 1 536-D cosine HNSW (matches Gemini embeddings)
DEFINE INDEX IF NOT EXISTS kb_vec
  ON kb_docs FIELDS embedding
  HNSW DIMENSION 1536 DIST COSINE;
```

## Custom "Surreal Retrieve" tool

```python
from typing import List, Dict, Any, Optional
from google import genai
from surrealdb import AsyncSurreal
from surrealdb.exception import SurrealException
import os
import json
import hashlib
import logging
from dataclasses import dataclass
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class SurrealConfig:
    """Configuration for SurrealDB connection."""
    url: str = "ws://localhost:8000/rpc"
    namespace: str = "agent"
    database: str = "demo"
    username: str = "root"
    password: str = "secret"

class SurrealRetriever:
    """SurrealDB-powered retrieval tool for Google Agent."""
    
    def __init__(
        self,
        config: Optional[SurrealConfig] = None,
        api_key: Optional[str] = None
    ):
        """Initialize the retriever.
        
        Args:
            config: Optional SurrealDB configuration
            api_key: Optional Google API key
        """
        self.config = config or SurrealConfig()
        self.api_key = api_key or os.environ.get("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("Google API key is required")
            
        genai.configure(api_key=self.api_key)
        self.embedder = genai.Client().models.get_embedding_model("models/embedding-001")
        
    @asynccontextmanager
    async def _get_connection(self) -> AsyncSurreal:
        """Get a database connection with proper authentication.
        
        Yields:
            Connected AsyncSurreal instance
            
        Raises:
            SurrealException: If connection fails
        """
        db = AsyncSurreal(self.config.url)
        try:
            await db.signin({
                "username": self.config.username,
                "password": self.config.password
            })
            await db.use(self.config.namespace, self.config.database)
            yield db
        except SurrealException as e:
            logger.error(f"Failed to connect to SurrealDB: {str(e)}")
            raise SurrealException(f"Connection failed: {str(e)}")
        finally:
            await db.close()

    async def _embed(self, text: str) -> List[float]:
        """Generate embeddings for text.
        
        Args:
            text: Text to embed
            
        Returns:
            List of embedding values
            
        Raises:
            Exception: If embedding generation fails
        """
        try:
            return self.embedder.embed(content=text).embedding
        except Exception as e:
            logger.error(f"Failed to generate embeddings: {str(e)}")
            raise Exception(f"Embedding generation failed: {str(e)}")

    async def retrieve(self, question: str, k: int = 4) -> str:
        """Retrieve top-k passages related to question from SurrealDB.
        
        Args:
            question: Search query
            k: Number of results to return
            
        Returns:
            Formatted string of matching passages
            
        Raises:
            SurrealException: If database operations fail
        """
        try:
            qv = await self._embed(question)
            async with self._get_connection() as db:
                result = await db.query("""
                    SELECT text, source,
                           vector::distance::cosine(embedding, $vec) AS score
                    FROM kb_docs
                    WHERE embedding <|$k|> $vec
                    ORDER BY score ASC
                """, {
                    "vec": qv,
                    "k": k
                })
                
                rows = result[0]["result"]
                return "\n".join(
                    f"- {r['text']} (src: {r['source']})"
                    for r in rows
                )
        except SurrealException as e:
            logger.error(f"Retrieval failed: {str(e)}")
            raise SurrealException(f"Retrieval failed: {str(e)}")

    async def ingest(self, docs: List[Dict[str, str]]) -> None:
        """Ingest documents into SurrealDB.
        
        Args:
            docs: List of documents with text and source
            
        Raises:
            SurrealException: If database operations fail
        """
        try:
            async with self._get_connection() as db:
                for doc in docs:
                    rec = {
                        "id": hashlib.sha1(doc["text"].encode()).hexdigest(),
                        "text": doc["text"],
                        "source": doc["source"],
                        "embedding": await self._embed(doc["text"]),
                    }
                    await db.create("kb_docs", rec)
                logger.info(f"Ingested {len(docs)} documents")
        except SurrealException as e:
            logger.error(f"Ingestion failed: {str(e)}")
            raise SurrealException(f"Ingestion failed: {str(e)}")

    async def ensure_schema(self) -> None:
        """Ensure the required table and index exist.
        
        Raises:
            SurrealException: If schema operations fail
        """
        try:
            async with self._get_connection() as db:
                await db.query("""
                    DEFINE TABLE IF NOT EXISTS kb_docs SCHEMALESS;
                    DEFINE FIELD id        ON kb_docs TYPE string;
                    DEFINE FIELD text      ON kb_docs TYPE string;
                    DEFINE FIELD source    ON kb_docs TYPE string;
                    DEFINE FIELD embedding ON kb_docs TYPE array;
                    DEFINE INDEX IF NOT EXISTS kb_vec
                        ON kb_docs FIELDS embedding
                        HNSW DIMENSION 1536 DIST COSINE;
                """)
                logger.info("Schema ensured successfully")
        except SurrealException as e:
            logger.error(f"Schema setup failed: {str(e)}")
            raise SurrealException(f"Schema setup failed: {str(e)}")

# Example usage
async def main():
    retriever = SurrealRetriever()
    
    try:
        # Ensure schema exists
        await retriever.ensure_schema()
        
        # Ingest sample documents
        await retriever.ingest([
            {
                "text": "Nikola Tesla patented the first practical AC induction motor in 1888.",
                "source": "wiki/Tesla"
            },
            {
                "text": "The Wright brothers achieved powered flight on 17 Dec 1903.",
                "source": "wiki/Wright"
            },
        ])
        
        # Test retrieval
        result = await retriever.retrieve(
            "Who invented the AC motor and when?",
            k=2
        )
        print(result)
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

## Build an ADK agent that uses the tool

```python
from typing import Optional
from adk import Agent, Tool
from surreal_tool import SurrealRetriever
import asyncio
import logging
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize retriever
retriever = SurrealRetriever()

@Tool
async def knowledge_search(query: str) -> str:
    """Search SurrealDB for passages relevant to the query.
    
    Args:
        query: Search query
        
    Returns:
        Formatted string of matching passages
    """
    try:
        return await retriever.retrieve(query, k=4)
    except Exception as e:
        logger.error(f"Knowledge search failed: {str(e)}")
        return f"Error searching knowledge base: {str(e)}"

@asynccontextmanager
async def get_agent():
    """Get an agent instance with proper setup and teardown.
    
    Yields:
        Configured Agent instance
    """
    try:
        agent = Agent(
            name="Surreal-Facts-Bot",
            llm="gemini-pro",
            instructions="""
You are a helpful assistant that must cite retrieved passages verbatim.
When knowledge is required, call knowledge_search().
""",
            tools=[knowledge_search],
        )
        logger.info("Agent created successfully")
        yield agent
    except Exception as e:
        logger.error(f"Failed to create agent: {str(e)}")
        raise

async def main():
    """Run the agent."""
    try:
        async with get_agent() as agent:
            response = await agent.chat("Who invented the AC motor and when?")
            print(response)
            logger.info("Agent execution completed successfully")
    except Exception as e:
        logger.error(f"Agent execution failed: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(main())
```

Run locally (`python agent.py`) to verify the agent calls your SurrealDB tool.

## Deploy to **Vertex AI Agent Engine**

Create `agent.yaml` (full schema in the ADK docs):

```yaml
name: surreal-facts
entrypoint: agent:agent        # python-module:object
requirements:
  - surrealdb
  - google-genai
  - google-adk
  - google-cloud-aiplatform
```

```bash
gcloud ai agent-engines deploy surreal-facts \
  --agent-spec=agent.yaml \
  --region=us-central1
```

## Publish in **Agentspace**

Agentspace can list any agent that's running on Agent Engine ([Google Cloud][3], [Medium][4]).

* **Console path:** *Agentspace → Agent Gallery → "Add agent" → Source: Agent Engine*
* **CLI (preview):**

```bash
gcloud ai agentspace agent-galleries add-agent \
  --agent-engine=projects/$PROJECT/locations/us-central1/agentEngines/surreal-facts
```

Once added, employees will see **"Surreal Facts Bot"** in the gallery and can chat with it from the Agentspace UI; every time it needs knowledge it silently calls your SurrealDB index.

## Operational notes

<table>
  <thead>
    <tr>
      <th>Topic</th>
      <th>Guidance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Networking</strong></td>
      <td>Run SurrealDB on Cloud Run, GKE, or a VM inside the same VPC; use Private Service Connect so the Agent Engine can reach it.</td>
    </tr>
    <tr>
      <td><strong>Security</strong></td>
      <td>Protect the DB with <code>DEFINE ACCESS</code> tokens or basic auth; Agentspace inherits IAM & VPC-SC you already set in Agent Builder (<a href="[Google Cloud][5]">Google Cloud</a>).</td>
    </tr>
    <tr>
      <td><strong>Hybrid search</strong></td>
      <td>Mix Boolean filters with the <code>&lt;|K|&gt;</code> operator (<code>WHERE source ~ 'wiki' AND embedding &lt;|3|&gt;</code>).</td>
    </tr>
    <tr>
      <td><strong>Updates</strong></td>
      <td>New docs can be inserted at any time; SurrealDB's HNSW index updates incrementally, or run <code>REBUILD INDEX</code> during low-traffic windows (<a href="[SurrealDB][6]">SurrealDB</a>).</td>
    </tr>
  </tbody>
</table>


## Resources 

- [Google Next 25 Updates: ADK, Agentspace, Application Integration](https://www.googlecloudcommunity.com/gc/Cloud-Product-Articles/Google-Next-25-Updates-ADK-Agentspace-Application-Integration/ta-p/898343)
- [DEFINE INDEX statement](/docs/surrealql/statements/define/indexes)
- [Vertex AI Agent Builder](https://cloud.google.com/products/agent-builder)
- [A Foundational Framework for Agentic AI Ecosystems: Enabling](https://medium.com/google-cloud/a-foundational-framework-for-agentic-ai-ecosystems-enabling-development-discovery-and-2aeb120949f6)
- [Introduction to Google Agentspace](https://cloud.google.com/agentspace/docs/overview)
- [REBUILD statement](/docs/surrealql/statements/rebuild)


