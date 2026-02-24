---
sidebar_position: 4
sidebar_label: Data Types
title: Golang Data Types | SDKs | Integration
description: The Golang SDK translates all datatypes native to SurrealQL into either datatypes native to Golang, or a custom implementation. This document describes all datatypes, and links to their respective documentation.
---

import Table from "@components/shared/Table.astro";

# Data Types

This SDK facilitates communication between client and the backend service using the Concise Binary Object Representation (CBOR) format. It streamlines data serialization and deserialization while ensuring efficient and lightweight communication. The library also provides custom models tailored to specific Data models recognised by SurrealDb, which cannot be covered by idiomatic Go, enabling seamless interaction between the client and the backend.

## Data Types overview

<table><thead>
  <tr>
    <th>CBOR Type</th>
    <th>Go Representation</th>
    <th>Example</th>
  </tr></thead>
<tbody>
  <tr>
    <td>Null</td>
    <td>`nil`</td>
    <td>`var x interface{} = nil`</td>
  </tr>
  <tr>
    <td>None</td>
    <td>`surrealdb.None`</td>
    <td>`map[string]interface{}{"customer": surrealdb.None}`</td>
  </tr>
  <tr>
    <td>Boolean</td>
    <td>`bool`</td>
    <td>`true`, `false`</td>
  </tr>
  <tr>
    <td>Array</td>
    <td>`[]interface{}`</td>
    <td>`[]MyStruct{item1, item2}`</td>
  </tr>
  <tr>
    <td>Date/Time</td>
    <td>`time.Time`</td>
    <td>`time.Now()`</td>
  </tr>
  <tr>
    <td>Duration</td>
    <td>`time.Duration`</td>
    <td>`time.Duration(8821356)`</td>
  </tr>
  <tr>
    <td>UUID (string representation)</td>
    <td>`surrealdb.UUID(string)`</td>
    <td>`surrealdb.UUID("123e4567-e89b-12d3-a456-426614174000")`</td>
  </tr>
  <tr>
    <td>UUID (binary representation)</td>
    <td>`surrealdb.UUIDBin([]bytes)`</td>
    <td>`surrealdb.UUIDBin([]byte{0x01, 0x02, ...}`)`</td>
  </tr>
  <tr>
    <td>Integer</td>
    <td>`uint`, `uint64`,  `int`, `int64`</td>
    <td>`42`, `uint64(100000)`,  `-42`, `int64(-100000)`</td>
  </tr>
  <tr>
    <td>Floating Point</td>
    <td>`float32`, `float64`</td>
    <td>`3.14`, `float64(2.71828)`</td>
  </tr>
  <tr>
    <td>Byte String, Binary Encoded Data</td>
    <td>`[]byte`</td>
    <td>`[]byte{0x01, 0x02}`</td>
  </tr>
  <tr>
    <td>Text String</td>
    <td>`string`</td>
    <td>`"Hello, World!"`</td>
  </tr>
  <tr>
    <td>Map</td>
    <td>`map[interface{}]interface{}`</td>
    <td>`map[string]float64{"one": 1.0}`</td>
  </tr>
  <tr>
    <td>Table name</td>
    <td>`surrealdb.Table(name)`</td>
    <td>`surrealdb.Table("users")`</td>
  </tr>
  <tr>
    <td>Record ID</td>
    <td>`surrealdb.RecordID{Table: string, ID: interface{}}`</td>
    <td>`surrealdb.RecordID{Table: "customers", ID: 1}, surrealdb.NewRecordID("customers", 1)`</td>
  </tr>
  <tr>
    <td>Geometry Point</td>
    <td>`surrealdb.GeometryPoint{Latitude: float64, Longitude: float64}`</td>
    <td>`surrealdb.GeometryPoint{Latitude: 11.11, Longitude: 22.22`</td>
  </tr>
  <tr>
    <td>Geometry Line</td>
    <td>`surrealdb.GeometryLine{GeometricPoint1, GeometricPoint2,... }`</td>
  </tr>
  <tr>
    <td>Geometry Polygon</td>
    <td>`surrealdb.GeometryPolygon{GeometryLine1, GeometryLine2,... }`</td>
  </tr>
  <tr>
    <td>Geometry Multipoint</td>
    <td>`surrealdb.GeometryMultiPoint{GeometryPoint1, GeometryPoint2,... }`</td>
  </tr>
  <tr>
    <td>Geometry MultiLine</td>
    <td>`surrealdb.GeometryMultiLine{GeometryLine1, GeometryLine2,... }`</td>
  </tr>
  <tr>
    <td>Geometry MultiPolygon</td>
    <td>`surrealdb.GeometryMultiPolygon{GeometryPolygon1, GeometryPolygon2,... }`</td>
  </tr>
  <tr>
    <td>Geometry Collection</td>
    <td>`surrealdb.GeometryMultiPolygon{GeometryPolygon1, GeometryLine2, GeometryPoint3, GeometryMultiPoint4,... }`</td>
  </tr>
</tbody></table>

<br /><br />

## Encoding

The SDK uses CBOR for all client-server serialization. It does not use `encoding/json`, and `MarshalJSON` is not part of the serialization path.

- **fxamacker/cbor-based implementation**: see [`pkg/models/cbor.go`](https://github.com/surrealdb/surrealdb.go/blob/main/pkg/models/cbor.go)
- **surrealcbor implementation**: see [`surrealcbor/`](https://github.com/surrealdb/surrealdb.go/tree/main/surrealcbor)

Both implementations are supported; choose the one that fits your needs/performance characteristics.
