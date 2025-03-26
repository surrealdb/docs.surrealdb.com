---
sidebar_position: 1
sidebar_label: GROUP BY
title: GROUP BY clause | SurrealQL
description: The `GROUP BY` clause is used to group records by one or more columns.
---

import SurrealistMini from "@components/SurrealistMini.astro";

# `GROUP BY` clause

The `GROUP BY` clause is used in SurrealQL to aggregate data based on one or more columns. It is particularly useful when you want to perform calculations on groups of data, such as counting the number of records, calculating averages, or finding sums for each group. 

This is often used in reporting and data analysis to summarize data in a meaningful way. More specifically, it is used to:

- Aggregating Data: When you need to calculate aggregate values like SUM, COUNT, AVG, MIN, or MAX for each group of data.
- Data Summarization: When you want to summarize data into categories or groups.
- Reporting: When generating reports that require grouped data, such as sales reports by region or department.

## Syntax

```syntax title="Clause Syntax"
GROUP BY @fields
```

## Data representation


```surql
SELECT
    product_id,
    region,
    math::sum(amount) AS total_sales
FROM
    sales
GROUP BY
    product_id, region;
```

Explanation:
- `SELECT product_id, region, math::sum(amount) AS total_sales`: This selects the product_id and region columns and calculates the total sales amount for each group. The `AS` clause is used to rename the calculated column to `total_sales`.

- `FROM sales`: This specifies the table from which to retrieve the data. Using the `FROM` clause, we specify the table `sales` to retrieve the data from.

- `GROUP BY product_id, region`: This groups the results by product_id and region, so the SUM function calculates the total sales for each unique combination of product_id and region.

This query will return a result set where each row represents a unique combination of `product_id` and `region`, along with the total sales amount for that combination. This is useful for understanding how different products are performing in different regions.

<SurrealistMini
	resultMode="single"
	setup={`
INSERT INTO rams [
    { gender: "M", age: 20, country: "Japan" },
    { gender: "M", age: 25, country: "Japan" },
    { gender: "F", age: 23, country: "US" },
    { gender: "F", age: 30, country: "US" },
    { gender: "F", age: 25, country: "Korea" },
    { gender: "F", age: 45, country: "UK" },
];
	`}
	query={`
		SELECT
	count() AS total,
	math::mean(age) AS average_age,
	gender,
	country
FROM rams
GROUP BY gender, country;
	`}
/>



