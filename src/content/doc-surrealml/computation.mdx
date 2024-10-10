---
sidebar_position: 3
sidebar_label: Computation
title: SurrealML | Computation
description: SurrealML enables machine learning models to be greatly simplified, ensuring reproducibility and consistency in machine learning pipelines.
---

# Computation

If we have a loaded a model you will want to execute it to perform a calculation. First we will cover the high-level execution of models in Python and Rust, then will explore what is going on under the hood for these executions. Before we go through some code examples, let us define the different types of computation that we can perform on a model.

## Raw Compute

Raw compute passes an array directly into the model for execution. Here we bypass all the metadata in the file. This means that you need to perform your own normalisations on your input data if you normalised the model training data when training the model. This approach is more beneficial to complex data structures such as images, as they are multi-dimensional. When executing the raw compute, you do not need to pass in the dimensions of the input, as these are extracted from the saved model itself as the code shows [here](https://github.com/surrealdb/surrealml/blob/34baa045da9184ccd1479220e6205dd298b78ee3/modules/core/src/execution/compute.rs#L80C68-L80C75).

## Buffered Compute

Buffered computer passes a dictionary or hashmap with the names of the columns as the keys, and the values associated with the column. The engine then checks all the columns, applies normalisation functions to the inputs if the normalisation functions are present for the column, and constructs a vector in the correct order for inputs. At this point, the model computation will error if any of the columns are missing, only allowing valid input to pass through. The processed vector is then passed into the raw compute function.

Now that we have explored the two types of computation, we can explore how to perform these computations.

## Executing a model in Python

We can execute a model in Python using the following code:

```python
# raw compute
print(new_file.raw_compute(input_vector=[5, 6]))

# buffered compute (implement data from the meta data)
print(
	new_file.buffered_compute(
		value_map={
			"squarefoot": 5, 
			"num_floors": 6
		}
	)
)
```

## Executing a model in Rust

Starting with the following `use` statements will let us bring a number of necessary types into scope:

```rust
use surrealml_core::storage::surml_file::SurMlFile;
use surrealml_core::execution::compute::ModelComputation;
use ndarray::ArrayD;
use std::collections::HashMap;
```

We can then create a compute unit with the code below:

```rust
let compute_unit = ModelComputation {
    surml_file: &mut new_file,
};
```

First we can do a buffered compute with a standard HashMap with the following code:

```rust
let mut input_values = HashMap::new();
input_values.insert(String::from("squarefoot"), 1000.0);
input_values.insert(String::from("num_floors"), 2.0);

let output = compute_unit.buffered_compute(&mut input_values).unwrap();
```

If we want to perform a raw compute, we can do so with the code below:

```rust
let x = vec![1000.0, 2.0];
let data: ArrayD<f32> = ndarray::arr1(&x).into_dyn();

let output = compute_unit.raw_compute(data, None).unwrap();
```

Note that the input dimensions fed into the `.raw_compute()` method are specified as None, as they will be extracted directly from the saved model.

## Executing a model in SurrealDB

Once the model is stored in the database, it can be called with the following code:

```sql
	ml::house-price-prediction<0.0.1>({
		squarefoot: squarefoot_col,
		num_floors: num_floors_col
	})
```

Here the `ml::` is saying that we are using the SurrealDB’s ML module. The `house-price-prediction` is the name of the model in the meta data of the `surml` file. The `<0.0.1>` is the version that is also defined in the header of the `surml` file. The object passed into it is essentially a hashmap for the buffered compute.  This calculation then yields a result that can then be inputted into the rest of the SurrealQL statement. 

## Execution mechanics

The interface between the ONNX `C++` and Rust can be found in SurrealDB’s source code [here](https://github.com/surrealdb/surrealml/blob/main/modules/core/src/execution/onnx_environment.rs). Based on different build parameters, we embed the `libonnxruntime` library into the Rust binary. When performing an execution, we load the `libonnxruntime` library into a `Lazy<Arc<Environment>>`. This leads to a single Environment instance that lasts for the entire duration of the program. This environment can be accessed by any thread, which is safe to do so as access is protected by a lock that is only available once another thread has given it up.

Tests of running a computation in Rust can be found [here](https://github.com/surrealdb/surrealml/blob/34baa045da9184ccd1479220e6205dd298b78ee3/modules/core/src/execution/compute.rs#L161). Python does not perform any computations, but all interactions between the Rust module and the Python code can be found [here](https://github.com/surrealdb/surrealml/blob/develop/surrealml/rust_adapter.py) in the `RustAdapter` object.