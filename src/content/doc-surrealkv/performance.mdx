---
sidebar_position: 2
sidebar_label: Performance characteristics
title: Performance characteristics | SurrealQL
description: Learn about the performance characteristics of SurrealQL and how it optimizes query execution and resource usage in SurrealDB.
---

# SurrealKV performance characteristics and trade-offs

## Strengths

SurrealKV offers several notable performance advantages:

From a latency perspective, the system provides constant-time retrieval operations through direct offset lookups. Write operations are primarily bound by sequential I/O performance, and the system maintains minimal disk seeks during normal operation.

In terms of throughput properties, SurrealKV excels through its sequential write patterns that maximize I/O bandwidth utilization. The system's concurrent read operations effectively scale with available CPU cores, while range queries are optimized through the trie's prefix-based organization.

The recovery semantics are robust and predictable. During initial startup, the system performs a full segment scan to rebuild the index. Recovery and repair times scale proportionally with the total segment size and last active segment size, respectively. Data integrity is maintained through CRC verification during recovery. The system handles partial writes effectively by using CRC32 calculations from record fields to detect truncated writes, identifying and truncates incomplete records during recovery, and ensuring transaction logs are recovered to the last valid record boundary.

Operationally, SurrealKV offers significant advantages. The compaction process runs concurrently with normal operations, and the append-only format makes replication procedures straightforward.

## Limitations

SurrealKV does have some important limitations to consider, many of which pertain to SurrealKV [when versioning is enabled](/docs/surrealdb/cli/start#surrealkv-beta):

* Memory management is a key consideration, as the index must reside in memory. Memory usage scales with the number of unique keys, key size distribution, and the number of versions per key.

* Write amplification is another factor to consider. Each update creates a new version, requiring periodic compaction. During compaction, space usage temporarily increases.

* Range query performance varies depending on several factors: key distribution, version history depth, and range size. Large ranges may require multiple disk reads to complete.

* From an operational standpoint, regular compaction is necessary for space reclamation. System restart time increases with log size, and high-cardinality keyspaces can create memory pressure.

## Performance implications

SurrealKV is particularly well-suited for certain use cases. It performs optimally with write-intensive workloads, point query dominated patterns, prefix-based access patterns, and time-series data with version tracking.

However, some scenarios may not be ideal for SurrealKV. These include memory-constrained environments, very large key spaces, scan-heavy workloads, and situations involving random updates to large datasets.