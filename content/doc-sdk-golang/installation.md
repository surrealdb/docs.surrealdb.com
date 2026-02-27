---
sidebar_position: 2
sidebar_label: Installation
title: Golang | SDKs | Installation
description: In this section, you will learn how to install the Golang SDK in your project.
---

# Installation

In this section, you will learn how to install the Golang SDK in your project.

### Install the SDK

First, install the [SDK from pkg.go.dev](https://pkg.go.dev/github.com/surrealdb/surrealdb.go) using the `go get` command:

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

<Tabs groupId="golang-package-manager">
  <TabItem value="golang-cli" label="go get" default>

```bash
go get github.com/surrealdb/surrealdb.go
  ```

  </TabItem>
</Tabs>

<br />

### Import the SDK to your project

After installing, you can then import the SDK into your project. 

```go
import (
	"fmt"
	surrealdb "github.com/surrealdb/surrealdb.go"
	"github.com/surrealdb/surrealdb.go/pkg/models"
)
```

## Next Steps

After installing the SDK, check out the quick start guide to build your a simple application with the SDK. You can also learn more about carrying out common tasks with the SDK in the following sections:
- [Quick Start](/docs/sdk/golang/start)
