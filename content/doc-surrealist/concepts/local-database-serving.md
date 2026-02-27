---
sidebar_position: 6
sidebar_label: Local database serving
title: Surrealist | Local database serving
description: Surrealist is a user interface for interacting with your SurrealDB database visually. It enables you to seamlessly connect to any SurrealDB instance, allowing you to execute queries, explore your tables, design your schemas, and much more.
---

import Image from "@components/Image.astro";
import ImageConsole from "@img/image/surrealist/console.png";

# Local database serving

Surrealist allows you to easily and effortlessly launch a localhost instance of SurrealDB directly from the interface. For this you will first need to install SurrealDB for your platform. After this you can press the play button in the top right of the interface to start SurrealDB.


> [!NOTE]
> Local database serving is only available in the Surrealist Desktop app.

### Configuration

Surrealist will automatically detect the location of the SurrealDB executable if it is in your environment PATH. If it is not, you can manually enter the path to the executable in the Surrealist settings dialog.
This setting, along with other local database serving settings, can be found in the settings dialog accessible from the top right of the interface.

### Console drawer

After launching the local database, you can press the console button to reveal the output of the SurrealDB instance.

<Image
  alt="Console drawer"
  src={ImageConsole}
/>
