---
sidebar_position: 5
sidebar_label: Fastembed
title: Fastembed | Embeddings
description: This section contains information about using Fastembed to retrieve embeddings to store in SurrealDB
---

# Fastembed

Fastembed is a library that allows you to generate vector embeddings locally, without needing an API key or calling into an external service.

Fastembed uses the included ONNX runtime to run its embedding models, downloading the model once every time it is used for the first time.

Fastembed libraries are available for the following languages:

* [Python](https://github.com/qdrant/fastembed)
* [Rust](https://crates.io/crates/fastembed)
* [Go](https://github.com/Anush008/fastembed-go)
* [JavaScript](https://github.com/Anush008/fastembed-js)

## Overview of available models

The following is an overview of most of the models available for Fastembed. General use cases are:

* Prototyping, development speed, cost savings: models with small vector embedding sizes tend to take up a relatively small amount of disk size as well (generally a few hundred MB) and can be quickly downloaded and run locally.
* Small or edge devices: devices with no internet access can still take advantage of vector embeddings.
* Particular use cases: some models are specialized for certain use cases such as images, certain languages, and contexts.

### MiniLM Series

Fast general-purpose embeddings. Choose L6 for speed, L12 for quality. Ideal for semantic search, clustering, and similarity tasks.

A "quantized" model means that it is optimised for faster inference and lower memory usage, often with minimal quality loss.

| Model name      | Embedding size | Description                                         |
| --------------- | -------------- | --------------------------------------------------- |
| AllMiniLML6V2   | 384            | Sentence Transformer model, MiniLM-L6-v2            |
| AllMiniLML6V2Q  | 384            | Quantized Sentence Transformer model, MiniLM-L6-v2  |
| AllMiniLML12V2  | 384            | Sentence Transformer model, MiniLM-L12-v2           |
| AllMiniLML12V2Q | 384            | Quantized Sentence Transformer model, MiniLM-L12-v2 |

### BGE Series 

Used for dense retrieval and semantic similarity. BGESmallENV15 is optimized for speed and tends to be the default choice for many applications.

| Model name     | Embedding size | Description                                                  |
| -------------- | -------------- | ------------------------------------------------------------ |
| BGEBaseENV15   | 768            | v1.5 release of the base English model                       |
| BGEBaseENV15Q  | 768            | Quantized v1.5 release of the base English model             |
| BGELargeENV15  | 1024           | v1.5 release of the large English model                      |
| BGELargeENV15Q | 1024           | Quantized v1.5 release of the large English model            |
| BGESmallENV15  | 384            | v1.5 release of the fast and default English model           |
| BGESmallENV15Q | 384            | Quantized v1.5 release of the fast and default English model |


### Nomic Embed Text

Used for large context window embeddings.

Optimized for long-context English text (8K tokens). v1.5 improves quality over v1.

| Model name         | Embedding size | Description                                                     |
| ------------------ | -------------- | --------------------------------------------------------------- |
| NomicEmbedTextV1   | 768            | 8192 context length english model                               |
| NomicEmbedTextV15  | 768            | v1.5 release of the 8192 context length english model           |
| NomicEmbedTextV15Q | 768            | Quantized v1.5 release of the 8192 context length english model |


### Paraphrase Models

Used for paraphrase detection and multilingual similarity. Ideal for sentence equivalence and semantic matching tasks.

| Model name               | Embedding size | Description                                                              |
| ------------------------ | -------------- | ------------------------------------------------------------------------ |
| ParaphraseMLMiniLML12V2  | 384            | Multi-lingual model                                                      |
| ParaphraseMLMiniLML12V2Q | 384            | Quantized Multi-lingual model                                            |
| ParaphraseMLMpnetBaseV2  | 768            | Sentence-transformers model for tasks like clustering or semantic search, based on the MPNet architecture. |


### Chinese BGE Models

| Model name    | Embedding size | Description                             |
| ------------- | -------------- | --------------------------------------- |
| BGESmallZHV15 | 512            | v1.5 release of the small Chinese model |
| BGELargeZHV15 | 1024           | v1.5 release of the large Chinese model |


### ModernBert and Multilingual E5

Used for context-rich multilingual embeddings. Great for cross-language retrieval and nuanced contextual understanding.

| Model name           | Embedding size | Description                                    |
| -------------------- | -------------- | ---------------------------------------------- |
| ModernBertEmbedLarge | 1024           | Large model of ModernBert Text Embeddings      |
| MultilingualE5Small  | 384            | Small model of multilingual E5 Text Embeddings |
| MultilingualE5Base   | 768            | Base model of multilingual E5 Text Embeddings  |
| MultilingualE5Large  | 1024           | Large model of multilingual E5 Text Embeddings |


### Mxbai and GTE

Used for high-quality English/multilingual embeddings.

| Model name         | Embedding size | Description                                                |
| ------------------ | -------------- | ---------------------------------------------------------- |
| MxbaiEmbedLargeV1  | 1024           | Large English embedding model from MixedBreed.ai           |
| MxbaiEmbedLargeV1Q | 1024           | Quantized Large English embedding model from MixedBreed.ai |
| GTEBaseENV15       | 768            | Base multilingual embedding model from Alibaba            |
| GTEBaseENV15Q      | 768            | Quantized base multilingual embedding model from Alibaba  |
| GTELargeENV15      | 1024           | Large multilingual embedding model from Alibaba            |
| GTELargeENV15Q     | 1024           | Quantized large multilingual embedding model from Alibaba  |


### CLIP and Code Models

Use CLIP for image-text matching, Jina for code search and retrieval. JinaEmbeddingsV2BaseCode is optimised for embedding code snippets.

| Model name               | Embedding size | Description                         |
| ------------------------ | -------------- | ----------------------------------- |
| ClipVitB32               | 512            | CLIP text encoder based on ViT-B/32 |
| JinaEmbeddingsV2BaseCode | 768            | Jina embeddings v2 base code        |

## Language-specific example

The following example in Rust demonstrates how SurrealDB can be used to store the embeddings from the default language model for a number of phrases, after which it can be prompted to return the three closest results to a certain prompt.

First add a few crates to Cargo.toml with the following command:

```bash
cargo add anyhow fastembed serde tokio surrealdb --features surrealdb/kv-mem
```

Then use the following code.

```rust
use anyhow::Error;
use fastembed::{EmbeddingModel, InitOptions, TextEmbedding};
use serde::Serialize;
use surrealdb::{
    Surreal, Value,
    engine::any::{Any, connect},
};

const SCHEMA: &str = "DEFINE TABLE document;
        DEFINE FIELD text ON document TYPE string;
        DEFINE FIELD embedding ON document TYPE array<float>;
        // Uncomment this to use HNSW index, ensure that number after DIMENSION matches size of embedding
        // DEFINE INDEX hnsw_embed ON document FIELDS embedding HNSW DIMENSION 384 DIST COSINE";

const INSERT_QUERY: &str = "INSERT INTO document $docs";

const VECTOR_QUERY: &str = "SELECT 
        text, 
        vector::distance::knn() AS distance 
        FROM document
        WHERE embedding <|3,COSINE|> $embeds
        ORDER BY distance";

#[derive(Serialize)]
struct DocumentInput {
    text: String,
    embedding: Vec<f32>,
}

async fn store_docs(
    input: Vec<&str>,
    db: &Surreal<Any>,
    model: &mut TextEmbedding,
) -> Result<(), Error> {
    let docs = model
        .embed(input.clone(), None)?
        .into_iter()
        .zip(input.into_iter())
        .map(|(embedding, text)| DocumentInput {
            text: text.to_string(),
            embedding,
        })
        .collect::<Vec<DocumentInput>>();

    db.query(INSERT_QUERY).bind(("docs", docs)).await?;
    Ok(())
}

async fn test_embed(
    input: &str,
    db: &Surreal<Any>,
    model: &mut TextEmbedding,
) -> Result<(), Error> {
    let Some(embeds) = model.embed(vec![input], None)?.into_iter().next() else {
        return Err(anyhow::anyhow!("Nothing found at index 0"));
    };

    let val = db
        .query(VECTOR_QUERY)
        .bind(("embeds", embeds.clone()))
        .await?
        .take::<Value>(0)?;
    println!("{val}\n");
    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Default model
    let mut model = TextEmbedding::try_new(InitOptions::new(EmbeddingModel::BGESmallENV15))?;

    let db = connect("memory").await?;

    db.use_ns("ns").use_db("db").await?;

    db.query(SCHEMA).await?;

    let input = vec![
        // Cities
        "Calgary is a city in the Canadian province of Alberta.",
        "Ljubljana is the capital and largest city of Slovenia.",
        // Historical / mythological figures
        "Xenophon of Athens was a Greek military leader, philosopher, and historian.",
        "King Arthur was a mythical king in the mythology of Great Britain.",
        // Planets
        "Venus is the second planet from the Sun.",
        "Ceres is a dwarf planet in the middle main asteroid belt between the orbits of Mars and Jupiter.",
        // Languages
        "Manx is a Gaelic language of the insular Celtic branch of the Celtic language family",
        "Interlingue, originally Occidental, is an international auxiliary language created in 1922.",
        // Sea animals
        "Octopuses have a complex nervous system and are among the most intelligent and behaviourally diverse invertebrates.",
        "Clams have no central nervous system at all and are near to plants in intelligence.",
    ];
    store_docs(input, &db, &mut model).await?;

    println!("Edmonton is closest to:");
    test_embed("Edmonton", &db, &mut model).await?;

    println!("Merlin is closest to:");
    test_embed("Merlin", &db, &mut model).await?;

    println!("Earth is closest to:");
    test_embed("Earth", &db, &mut model).await?;

    println!("Irish is closest to:");
    test_embed("Irish language", &db, &mut model).await?;

    println!("Squid are closest to:");
    test_embed("Squid", &db, &mut model).await?;

    Ok(())
}
```

Output of the example with the default model:

```
Edmonton is closest to:
[
    { distance: 0.2596421358215669f, text: 'Calgary is a city in the Canadian province of Alberta.' },
    { distance: 0.5010449624435647f, text: 'Ljubljana is the capital and largest city of Slovenia.' },
    { distance: 0.5242241576926254f, text: 'Interlingue, originally Occidental, is an international auxiliary language created in 1922.' }
]

Merlin is closest to:
[
    { distance: 0.3653307924860497f, text: 'King Arthur was a mythical king in the mythology of Great Britain.' },
    { distance: 0.4515194174120666f, text: 'Manx is a Gaelic language of the insular Celtic branch of the Celtic language family' },
    { distance: 0.5317039966149415f, text: 'Calgary is a city in the Canadian province of Alberta.' }
]

Earth is closest to:
[
    { distance: 0.3380429615054925f, text: 'Venus is the second planet from the Sun.' },
    { distance: 0.3764237673020161f, text: 'Ceres is a dwarf planet in the middle main asteroid belt between the orbits of Mars and Jupiter.' },
    { distance: 0.444087039462282f, text: 'Calgary is a city in the Canadian province of Alberta.' }
]

Irish is closest to:
[
    { distance: 0.27517683002655635f, text: 'Manx is a Gaelic language of the insular Celtic branch of the Celtic language family' },
    { distance: 0.34080671701374754f, text: 'Interlingue, originally Occidental, is an international auxiliary language created in 1922.' },
    { distance: 0.5113325799682362f, text: 'King Arthur was a mythical king in the mythology of Great Britain.' }
]

Squid are closest to:
[
    { distance: 0.3439891425642231f, text: 'Octopuses have a complex nervous system and are among the most intelligent and behaviourally diverse invertebrates.' },
    { distance: 0.4707156750207915f, text: 'Manx is a Gaelic language of the insular Celtic branch of the Celtic language family' },
    { distance: 0.517311424260043f, text: 'Clams have no central nervous system at all and are near to plants in intelligence.' }
]
```