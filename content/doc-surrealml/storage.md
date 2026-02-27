---
sidebar_position: 2
sidebar_label: Storage
title: SurrealML | Storage
description: SurrealML enables machine learning models to be greatly simplified, ensuring reproducibility and consistency in machine learning pipelines.
---

import Image from "@components/Image.astro";
import LightSchema from "@img/image/light/surrealml-storage-schema.png";
import DarkSchema from "@img/image/light/surrealml-storage-schema.png";

# Storage

If you have completed the introduction, you would have stored your ML model in a `.surml` file. Seeing as the `.surml` file is at the heart of storage, we will start by covering the anatomy of a `.surml` file.

## The Anatomy of a Surml File

A `.surml` file is essentially a header, with weights stored in the ONNX format. Interacting with the file takes the following form:

<Image
  alt="SurrealML Storage Schema"
  src={{
    light: LightSchema,
    dark: DarkSchema,
  }}
/>

<br />
<br />

The metadata is data around the model. You can see the definition of the header [here](https://github.com/surrealdb/surrealml/blob/main/modules/core/src/storage/header/mod.rs).   The meta data has the following fields (all fields can be empty if needed):

- **keys ⇒** The name of the column and the index of where that column is placed in an input vector
- **normalisers ⇒** A map of normalisers with parameters to execute the normaliser, and a reference to the column that the normaliser is attached to
- **output ⇒** The name of the output and a normaliser attached to the output (if needed)
- **name ⇒** The name of the model being stored
- **version ⇒** The version of the model. Model versions use a default and auto-increment function that results in formats such as  `0.0.1` and `0.0.2`.
- **description ⇒** The description of the model
- **engine ⇒** The type of engine that was used to train the model, such as the native Linfa Rust module, the Rust PyTorch model, or Undefined (trained using a third party module such as Sklearn, PyTorch, etc.)
- **Origin ⇒** Where the model was trained, such as locally, in the database, or Undefined (local is automatically defined when using the Python surrealML package)
- **input_dims ⇒** the input dimensions that are needed to perform a model imputation. This is automatically defined when tracing the model when saving it in the `.surml` file format.

When reading a file, the loader loads the first 4 bytes of a file. Those first 4 bytes are then converted into a 4 byte integer. This 4 byte integer then tells the loader how many bytes to load to get all of the meta data about the model. Once this is loaded, we can then assume that the rest of the file is ONNX protobuf, and this protobuf data is then loaded into the ONNX runtime C++ library for inference calculations.

## Why ONNX

SurrealML supports the ONNX runtime which is the standard format for storing machine learning weights, and is officially [supported by Microsoft](https://github.com/microsoft/onnxruntime).

Under the hood, SurrealML exports the torch model into ONNX format which is officially supported by [PyTorch](https://pytorch.org/tutorials/advanced/super_resolution_with_onnxruntime.html).

The convergence of the ML community to ONNX as its standard format has led to [research and academic papers](https://cloudblogs.microsoft.com/opensource/2020/12/17/accelerate-simplify-scikit-learn-model-inference-onnx-runtime/) produced by Fang researchers on how to convert models such as random forests into ONNX.

There are also desktop apps like neutron that let you inspect these ONNX models in graphical form such as the following:

https://netron.app/

Alongside this, there is also work directly supported by a range of massive companies to enable ONNX to be run in WASM:

https://onnxruntime.ai/docs/build/web.html

And the official huggingface github is also working on a pure Rust implementation of ONNX with the code link below:

https://github.com/huggingface/candle/tree/main/candle-onnx

ONNX also supports GPUs as seen in the following link:

https://onnxruntime.ai/docs/execution-providers/CUDA-ExecutionProvider.html

With all this support for the ecosystem, it makes sense for us to support ONNX and automate processes that convert models to ONNX such as Sklearn.

Now that we have covered the anatomy of a `.surml` file, we can now move to loading and saving files.

## Loading and Saving with Python

This has been covered in the introduction section, so if you want to see the code around loading and saving, please visit the introduction section. We can save a model with the following code:

```python
file = SurMlFile(
	model=model, # the trained model object
	name="house-price-prediction",
	inputs=HOUSE_LINEAR["inputs"],
	engine=Engine.SKLEARN # change to the pytorch version is storing a pytorch model
)

file.add_version(version="0.0.1")
file.save(path="./linear.surml")
```

To load the file, we use the code below:

```python
new_file = SurMlFile.load(path="./linear.surml", engine=Engine.SKLEARN)
```

We can also load `.surml` files in Rust too.

## Saving and Loading SurML in Rust

To load in Rust you will need the following dependency in your `cargo.toml` file (version may have increased since the time of writing this):

```toml
surrealml-core = "0.0.8"
```

Alternatively, you can add the dependency by typing  `cargo add surrealml-core` on the command line. The `core` is the exact same code that runs in the Python client, ensuring consistency between the client and the server in production.

Starting with the following `use` statements will let us bring a number of necessary types into scope:

```rust
use std::fs::File;
use std::io::{self, Read, Write};

use surrealml_core::storage::surml_file::SurMlFile;
use surrealml_core::storage::header::Header;
use surrealml_core::storage::header::normalisers::{
    wrapper::NormaliserType,
    linear_scaling::LinearScaling
};
```

We can then load the ONNX file that was saved from a training session with the code below:

```rust
let mut file = File::open("./stash/linear_test.onnx").expect("File to be found");
let mut model_bytes = Vec::new();
file.read_to_end(&mut model_bytes).expect(”File content to be read to string”);
```

Once we have loaded our bytes from the ONNX file, we will insert the `model_bytes` once we have defined our file. We can first define our header and add the columns with the following code:

```rust
let mut header = Header::fresh();
header.add_column(String::from("squarefoot"));
header.add_column(String::from("num_floors"));
header.add_output(String::from("house_price"), None);
```

We can then add the normalisers with the code below:

```rust
header.add_normaliser(
    "squarefoot".to_string(),
    NormaliserType::LinearScaling(LinearScaling { min: 0.0, max: 1.0 })
);
header.add_normaliser(
    "num_floors".to_string(),
    NormaliserType::LinearScaling(LinearScaling { min: 0.0, max: 1.0 })
);
```

We now have everything we need to package our `.surml` file which we can do and write to disk with the following code:

```rust
let surml_file = SurMlFile::new(header, model_bytes);
surml_file.write("./stash/test.surml").unwrap();
```

If we want to load a model, it can either be from bytes or a file using the code below:

```rust
let new_file = SurMlFile::from_file("./stash/test.surml").unwrap();
let file_from_bytes = SurMlFile::from_bytes(surml_file.to_bytes()).unwrap();
```
