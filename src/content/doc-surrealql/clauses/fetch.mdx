---
sidebar_position: 1
sidebar_label: FETCH
title: FETCH clause | SurrealQL
description: The `FETCH` clause is used to fetch records from a table.
---
import SurrealistMini from "@components/SurrealistMini.astro";

# `FETCH` clause

The `FETCH` clause is used to retrieve related records or data from other tables in a single query. This is particularly useful when you want to gather data that is linked through relationships ([record links](/docs/surrealql/datamodel/records) or [graph edges](/docs/surrealql/statements/relate)) without having to perform multiple separate queries.

## Benefits of Using the `FETCH` Clause

- Efficiency: By using the FETCH clause, you can reduce the number of queries needed to gather related data. This can lead to performance improvements, especially when dealing with complex data models with multiple relationships.

- Simplified Queries: It simplifies your queries by allowing you to specify related data to be fetched directly within the same query. This makes your code cleaner and easier to understand.

- Reduced Network Overhead: Fetching related data in a single query reduces the number of round trips to the database, which can decrease network latency and improve the overall speed of your application.

- Consistency: By fetching related data in one go, you ensure that the data is consistent and up-to-date at the time of retrieval, reducing the risk of discrepancies that might occur if data is fetched in separate queries.

## Example Usage

Suppose you have a person table and a post table, where each post is related to a person. You can use the FETCH clause to retrieve a person along with their posts in a single query:

```surql
SELECT * FROM person FETCH posts;
```

In this example, `posts` would be a related field in the `person` table that links to the `post` table. The `FETCH` clause allows you to retrieve all posts associated with each person in the result set.

Overall, the `FETCH` clause in SurrealQL is a powerful tool for optimizing data retrieval and simplifying query logic when working with related data.

In addition to fetching related records, the `FETCH` clause can also be used to replace record ids with their actual record values. Consider the following example:

<SurrealistMini
	resultMode="single"
	setup={`
		CREATE category SET name = 'Technology', created_at = time::now();
		CREATE person:john SET
			name.first = 'John',
			name.last = 'Adams',
			name.full = string::join(' ', name.first, name.last),
			age = 29,
			admin = true,
			signup_at = time::now();
		CREATE article SET
			created_at = time::now(),
			author = person:john,
			title = 'Lorem ipsum dolor',
			text = 'Donec eleifend, nunc vitae commodo accumsan, mauris est fringilla.',
			category = (SELECT VALUE id FROM ONLY category WHERE name = 'Technology' LIMIT 1);
	`}
	query={`
		SELECT title, category, author.name.full AS author_name FROM article
		WHERE author.age < 30
		FETCH author, category;
	`}
/>

## Without the `FETCH` clause

<SurrealistMini
	resultMode="single"
	setup={`
		CREATE category SET name = 'Technology', created_at = time::now();
		CREATE person:john SET
			name.first = 'John',
			name.last = 'Adams',
			name.full = string::join(' ', name.first, name.last),
			age = 29,
			admin = true,
			signup_at = time::now();
		CREATE article SET
			created_at = time::now(),
			author = person:john,
			title = 'Lorem ipsum dolor',
			text = 'Donec eleifend, nunc vitae commodo accumsan, mauris est fringilla.',
			category = (SELECT VALUE id FROM ONLY category WHERE name = 'Technology' LIMIT 1);
	`}
	query={`
		SELECT title, category, author.name.full AS author_name FROM article
		WHERE author.age < 30;
	`}
/>



