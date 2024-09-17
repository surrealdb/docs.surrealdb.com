---
sidebar_position: 2
sidebar_label: Machine learning functions
title: Machine learning functions | SurrealQL
description: These functions can be used when calculating outputs from a trained machine learning model that has been uploaded to the database.
---

# Machine Learning functions

These functions can be used when calculating outputs from a trained machine learning model that has been uploaded to the database.

<table>
	<thead>
		<tr>
			<th scope="col">Function</th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td scope="row" data-label="Function">
				<a href="#mlname-of-modelversion">
					<code>
						ml::name-of-model&lt;version&gt;()
					</code>
				</a>
			</td>
			<td scope="row" data-label="Description">Computes a value from a trained machine learning model</td>
		</tr>
	</tbody>
</table>

## `ml::name-of-model<version>()`

Once a model has been uploaded to the database, the model can be called with inputs resulting in a calculation
from the trained ml model. We can do a basic raw computation with the following call:

```surql title="API DEFINITION"
ml::house-price-prediction<0.0.1>(500.0, 1.0);
```
In the above example, the model we are calling is called `house-price-prediction` with the version `0.0.1`. We
then pass in a raw vector of `[ [500.0, 1.0] ]` Depending on the model, the name and version of the model will vary as well
as the inputs. The name and version of the model will be defined in the `.surml` file which will defined when uploading the
model to the database. We can also perform a "buffered compute" with the code below:

```surql title="API DEFINITION"
ml::house-price-prediction<0.0.1>({squarefoot: 500.0, num_floors: 1.0});
```
Here, we are using the key mappings in the header of the `.surml` file uploaded to the database to map the fields defined
in the object passed into the `ml::` function in the correct order. If there are any normalisation parameters in the header
of the `.surml` file, these will also be applied.

The following example shows this function, and its output, when used in a [`RETURN`](/docs/surrealql/statements/return) statement:

```surql 
RETURN ml::house-price-prediction<0.0.1>({squarefoot: 500.0, num_floors: 1.0});

250000
```

Seeing as the ML is integrated into our surql, we can infer entire columns using the ml function. We can demonstrate this with a simple
example of house prices. We can define some basic table with the following surql:

```surql
CREATE house_listing SET squarefoot_col = 500.0, num_floors_col = 1.0;
CREATE house_listing SET squarefoot_col = 1000.0, num_floors_col = 2.0;
CREATE house_listing SET squarefoot_col = 1500.0, num_floors_col = 3.0;
```

We can then get all the rows with the imputed price prediction with the surql below:

```surql
SELECT 
	*, 
	ml::house-price-prediction<0.0.1>({ squarefoot: squarefoot_col, num_floors: num_floors_col }) AS price_prediction 
FROM house_listing;
```

This would statement gives us the following result:

```json
[
	{
		"id": "house_listing:7bo0f35tl4hpx5bymq5d",
		"num_floors_col": 3,
		"price_prediction": 406534.75,
		"squarefoot_col": 1500
	},
	{
		"id": "house_listing:8k2ttvhp2vh8v7skwyie",
		"num_floors_col": 2,
		"price_prediction": 291870.5,
		"squarefoot_col": 1000
	},
	{
		"id": "house_listing:vnlv3nzr21oi5o23kydw",
		"num_floors_col": 1,
		"price_prediction": 177206.21875,
		"squarefoot_col": 500
	}
]
```

We can see that our price prediction is calculated in the query. We can build on the previous surql to filter based on the computed
price prediction with the surql below:

```surql
SELECT * FROM (
		SELECT 
			*, 
			ml::house-price-prediction<0.0.1>({ squarefoot: squarefoot_col, num_floors: num_floors_col }) AS price_prediction 
		FROM house_listing
	) 
	WHERE price_prediction > 177206.21875;
```

This gives us the following result:

```json
[
	{
		"id": "house_listing:7bo0f35tl4hpx5bymq5d",
		"num_floors_col": 3,
		"price_prediction": 406534.75,
		"squarefoot_col": 1500
	},
	{
		"id": "house_listing:8k2ttvhp2vh8v7skwyie",
		"num_floors_col": 2,
		"price_prediction": 291870.5,
		"squarefoot_col": 1000
	}
]
```


<br /><br />