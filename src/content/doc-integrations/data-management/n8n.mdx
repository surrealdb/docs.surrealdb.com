---
sidebar_position: 2
sidebar_label: n8n
title: n8n | Data Management
description: The official n8n node for SurrealDB. It provides both action and tool nodes to interact with a SurrealDB database, allowing you to create, read, update, and delete records, as well as execute custom SurrealQL queries.
---

# n8n

This guide shows how to integrate SurrealDB with [n8n](https://n8n.io/), a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.


The official n8n node for SurrealDB. It provides both action and tool nodes to interact with a SurrealDB database, allowing you to create, read, update, and delete records, as well as execute custom SurrealQL queries. It is available in the [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/) repository.


> [!IMPORTANT]
> As with all community nodes, this node works only with self-hosted n8n instances, not with n8n Cloud. This node has been tested with SurrealDB `v2.x`


## Features

- **Dual Node Types**: Functions as both an action node and a tool node for AI workflows
- **Complete CRUD Operations**: Create, read, update, and delete SurrealDB records
- **Custom Queries**: Execute any SurrealQL query with full parameter support
- **Enhanced Query Builder**: Visual interface for building `SELECT` queries with `WHERE`, `ORDER BY`, `GROUP BY`, and other clauses
- **Table Operations**: List fields and explore table structure
- **Relationship Support**: Query and manage record relationships
- **Native Data Format**: Works with SurrealDB's native data formats
- **Connection Pooling**: Configurable connection pooling for improved performance and resource management
- **Enhanced Error Handling**: Comprehensive error classification, automatic retry logic, and connection recovery
    - **Intelligent Recovery**: Different error handling strategies for different operation types
    - **Detailed Error Reporting**: Rich error context with categorization and severity levels
- **Pool Monitoring**: Built-in pool statistics and performance monitoring

## Prerequisites

1. You need a self-hosted n8n instance (`v0.214.0` or later recommended).
2. You need access to a SurrealDB instance (`2.0.0` or later recommended).

## Installation Steps

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-surrealdb` and click **Install**
5. Restart your n8n instance if prompted

> [!NOTE]
> To use this node as a tool in AI workflows, you must set the environment variable `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true`. 

## Configuration

In order to use SurrealDB in n8n, you need to configure the SurrealDB node.

### Credentials

To use the SurrealDB node, you need to create credentials with the following properties:

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Connection String</strong></td>
      <td>The connection string to your SurrealDB instance (must start with <code>http://</code> or <code>https://</code>). WebSocket connections (<code>ws://</code> or <code>wss://</code>) are not supported.</td>
    </tr>
    <tr>
      <td><strong>Authentication</strong></td>
      <td>Choose the authentication scope:</td>
    </tr>
    <tr>
      <td><strong>Root</strong></td>
      <td>Full access to all namespaces and databases</td>
    </tr>
    <tr>
      <td><strong>Namespace</strong></td>
      <td>Access limited to a specific namespace</td>
    </tr>
    <tr>
      <td><strong>Database</strong></td>
      <td>Access limited to a specific database within a namespace</td>
    </tr>
    <tr>
      <td><strong>Username</strong></td>
      <td>Username for authentication</td>
    </tr>
    <tr>
      <td><strong>Password</strong></td>
      <td>Password for authentication</td>
    </tr>
    <tr>
      <td><strong>Namespace</strong></td>
      <td>Target namespace (required for Namespace and Database authentication)</td>
    </tr>
    <tr>
      <td><strong>Database</strong></td>
      <td>Target database (required for Database authentication)</td>
    </tr>
  </tbody>
</table>


The authentication type you choose affects how namespace and database information is handled. Depending on the authentication type, you will need to provide different information. See the table below for more details.

<table>
  <thead>
    <tr>
      <th>Authentication Type</th>
      <th>Access Scope</th>
      <th>Required Fields</th>
      <th>Optional Fields</th>
      <th>Override Capability</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Root Authentication</strong></td>
      <td>All namespaces and databases</td>
      <td>None</td>
      <td>Namespace, Database</td>
      <td>Can override namespace/database at node level</td>
    </tr>
    <tr>
      <td><strong>Namespace Authentication</strong></td>
      <td>All databases within a specific namespace</td>
      <td>Namespace</td>
      <td>Database</td>
      <td>Can override database at node level</td>
    </tr>
    <tr>
      <td><strong>Database Authentication</strong></td>
      <td>Specific database within a specific namespace</td>
      <td>Namespace, Database</td>
      <td>None</td>
      <td>Can override both at node level for specific operations</td>
    </tr>
  </tbody>
</table>

### Node-Level Namespace and Database Overrides

For most operations, you can override the namespace and database settings from your credentials:

1. In the node configuration, expand the **Options** section
2. Enter values in the **Namespace** and/or **Database** fields
3. These values will take precedence over the credential settings for that specific operation
4. You will be required to provide a namespace when using Namespace authentication
5. You will be required to provide both a namespace and database when using Database authentication

## Operations

The SurrealDB node provides a comprehensive set of operations organized by resource type. For anything not covered, you can use the **Execute Query** operation.

<table>
  <thead>
    <tr>
      <th>Category</th>
      <th>Operation</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="5"><strong>Record Operations</strong></td>
      <td><strong>Create Record</strong></td>
      <td>Create a single record in a table</td>
    </tr>
    <tr>
      <td><strong>Get Record</strong></td>
      <td>Retrieve a specific record by ID</td>
    </tr>
    <tr>
      <td><strong>Update Record</strong></td>
      <td>Update a specific record by ID</td>
    </tr>
    <tr>
      <td><strong>Upsert Record</strong></td>
      <td>Create or update a record (insert if not exists, update if exists)</td>
    </tr>
    <tr>
      <td><strong>Delete Record</strong></td>
      <td>Delete a specific record by ID</td>
    </tr>
    <tr>
      <td rowspan="9"><strong>Table Operations</strong></td>
      <td><strong>Get All Records</strong></td>
      <td>Retrieve all records from a table</td>
    </tr>
    <tr>
      <td><strong>Create Many</strong></td>
      <td>Create multiple records in a table</td>
    </tr>
    <tr>
      <td><strong>Get Many</strong></td>
      <td>Retrieve multiple records by IDs</td>
    </tr>
    <tr>
      <td><strong>Update All Records</strong></td>
      <td>Update all records in a table</td>
    </tr>
    <tr>
      <td><strong>Delete All Records</strong></td>
      <td>Delete all records from a table</td>
    </tr>
    <tr>
      <td><strong>Merge All Records</strong></td>
      <td>Merge the same data into all records in a table</td>
    </tr>
    <tr>
      <td><strong>Create Table</strong></td>
      <td>Define a new table with optional schema</td>
    </tr>
    <tr>
      <td><strong>Delete Table</strong></td>
      <td>Remove a table from the database</td>
    </tr>
    <tr>
      <td><strong>Get Table</strong></td>
      <td>Retrieve information about a table</td>
    </tr>
    <tr>
      <td rowspan="3"><strong>Field Operations</strong></td>
      <td><strong>List Fields</strong></td>
      <td>List all fields defined on a table</td>
    </tr>
    <tr>
      <td><strong>Create Field</strong></td>
      <td>Create a new field on a table</td>
    </tr>
    <tr>
      <td><strong>Delete Field</strong></td>
      <td>Delete a field from a table</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>Index Operations</strong></td>
      <td><strong>Create Index</strong></td>
      <td>Create a new index on a table</td>
    </tr>
    <tr>
      <td><strong>Delete Index</strong></td>
      <td>Delete an index from a table</td>
    </tr>
    <tr>
      <td rowspan="3"><strong>Relationship Operations</strong></td>
      <td><strong>Create Relationship</strong></td>
      <td>Create a relationship between two records</td>
    </tr>
    <tr>
      <td><strong>Delete Relationship</strong></td>
      <td>Delete a relationship between records</td>
    </tr>
    <tr>
      <td><strong>Query Relationships</strong></td>
      <td>Query relationships between records</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>Query Operations</strong></td>
      <td><strong>Execute Query</strong></td>
      <td>Execute a raw SurrealQL query with parameters</td>
    </tr>
    <tr>
      <td><strong>Build Select Query</strong></td>
      <td>Build SELECT queries using a visual interface with WHERE, ORDER BY, GROUP BY, and other clauses</td>
    </tr>
    <tr>
      <td rowspan="3"><strong>System Operations</strong></td>
      <td><strong>Health Check</strong></td>
      <td>Check if the database instance is responsive</td>
    </tr>
    <tr>
      <td><strong>Version</strong></td>
      <td>Get the version of the SurrealDB instance</td>
    </tr>
    <tr>
      <td><strong>Get Pool Statistics</strong></td>
      <td>Monitor connection pool performance and statistics</td>
    </tr>
  </tbody>
</table>

## Understanding SurrealDB and n8n Integration

### Connection Protocol

> [!IMPORTANT]
> Due to n8n's architecture, this node only supports HTTP/HTTPS connections to SurrealDB. WebSocket connections (WS/WSS) are not supported.

Your connection string must start with `http://` or `https://` (not `ws://` or `wss://`). This means that when configuring your SurrealDB instance, ensure it's accessible via `HTTP/HTTPS`. 

If you're using SurrealDB Cloud or another instance that only offers WebSocket connections, you'll need to set up a [self-hosted SurrealDB instance](/pricing) with HTTP enabled. This limitation is due to how n8n handles connections and executes node operations. You can read more about this in the [n8n documentation](https://docs.n8n.io/integrations/community-nodes/n8n-nodes-surrealdb/connection-protocol/).

This node uses the HTTP/HTTPS protocol exclusively, which means that each operation creates a new connection to SurrealDB, the connection is closed after the operation completes, and no persistent connection is maintained between operations.

### Connection Pooling

The SurrealDB node includes comprehensive connection pooling to improve performance and resource management. Connection pooling allows the node to reuse database connections across multiple operations, reducing connection overhead and improving response times.

#### Pool Configuration Options

You can configure the connection pool through the "Connection Pooling" options in any node operation:

- **Max Connections** (default: 10): Maximum number of connections in the pool
- **Min Connections** (default: 2): Minimum number of connections to keep in the pool
- **Acquire Timeout** (default: 30000ms): Maximum time to wait for a connection from the pool
- **Health Check Interval** (default: 60000ms): Interval between health checks for pool connections
- **Max Idle Time** (default: 300000ms): Maximum time a connection can remain idle before being closed
- **Retry Attempts** (default: 3): Number of retry attempts for failed connection acquisitions
- **Retry Delay** (default: 1000ms): Delay between retry attempts

#### Pool Monitoring

Use the **System > Get Pool Statistics** operation to monitor pool performance:

```json
{
  "poolStatistics": {
    "totalConnections": 5,
    "activeConnections": 2,
    "idleConnections": 3,
    "waitingRequests": 0,
    "totalRequests": 150,
    "failedRequests": 2,
    "averageResponseTime": 45,
    "successRate": 99
  },
  "performance": {
    "averageResponseTimeMs": 45,
    "requestsPerSecond": 2,
    "errorRate": 1
  },
  "poolHealth": {
    "utilizationRate": 40,
    "availableConnections": 3,
    "waitingRequests": 0
  }
}
```


### SurrealDB Result Handling

SurrealDB operations often return empty results rather than errors when no matching data is found. This behavior differs from many other databases and can be important to understand when building workflows:

- **Empty Results vs. Errors**: A query for a non-existent record returns an empty result, not an error
- **Always Output Data**: The "Always Output Data" option is particularly useful with SurrealDB to ensure your workflow continues even when no results are found

### Working with SurrealDB Data Types

SurrealDB supports rich data types that map well to n8n's JSON handling:

- **Records and IDs**: SurrealDB record IDs use the format `table:id`
- **Relationships**: Relationships are first-class citizens in SurrealDB
- **Arrays and Objects**: Nested data structures are fully supported

## Error Handling

The SurrealDB node includes a comprehensive error handling and recovery system that automatically manages common database issues:

### Automatic Error Classification

The system automatically categorizes errors into different types:
<table>
  <thead>
    <tr>
      <th>Error Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Connection Errors</strong></td>
      <td>Network issues, timeouts, connection refused</td>
    </tr>
    <tr>
      <td><strong>Authentication Errors</strong></td>
      <td>Invalid credentials, unauthorized access</td>
    </tr>
    <tr>
      <td><strong>Query Errors</strong></td>
      <td>Syntax errors, malformed queries</td>
    </tr>
    <tr>
      <td><strong>Validation Errors</strong></td>
      <td>Invalid data, missing required fields</td>
    </tr>
    <tr>
      <td><strong>System Errors</strong></td>
      <td>Database server issues, internal errors</td>
    </tr>
  </tbody>
</table>

### Intelligent Retry Logic

- **Exponential Backoff**: Automatic retry with increasing delays
- **Operation-Specific Retries**: Different retry strategies for read vs write operations
- **Configurable Limits**: Adjustable retry counts and delays
- **Smart Error Filtering**: Only retry on recoverable errors

### Connection Recovery

- **Automatic Reconnection**: Reconnects to SurrealDB on connection failures
- **Re-authentication**: Automatically re-authenticates after reconnection
- **Connection Validation**: Verifies connection health before retrying operations

### Enhanced Error Reporting

When `Continue on Fail` is enabled, errors include detailed information:
```json
{
  "error": {
    "message": "Connection timeout",
    "category": "TIMEOUT_ERROR",
    "severity": "MEDIUM",
    "retryable": true,
    "context": {
      "operation": "executeQuery",
      "itemIndex": 0,
      "timestamp": "2024-01-15T10:30:00Z",
      "recoveryStrategy": "CONNECTION_RECOVERY"
    }
  }
}
```

### Error Handling Strategies

Different operation types use different error handling strategies:

- **Read Operations**: Faster retries, continue on low/medium errors
- **Write Operations**: More retries, stop on medium+ errors
- **Critical Operations**: Minimal retries, stop on any error
- **Bulk Operations**: Moderate retries, handle rate limiting

For detailed information about the error handling system, see [Error Handling Documentation](https://github.com/surrealdb/n8n-nodes-surrealdb/blob/main/docs/ERROR_HANDLING.md).

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [SurrealDB Documentation](/docs)
- [SurrealQL Reference](/docs/surrealql)

