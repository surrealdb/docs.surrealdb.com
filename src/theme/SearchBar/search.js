export async function search(keywords) {
    let sql = templatedQuery(keywords);
    let raw = await query(sql);
    const processed = raw
        .filter((match) => match.offsets)
        .map(processResult);
    return processed;
}

const templatedQuery = (keywords) => {
	const escaped = JSON.stringify(keywords);
	return /* surrealql */ `
		SELECT
			meta::id(id) as url,
			title,
			content,
			search::offsets(6) AS offsets,
			search::score(0) * 7 + search::score(1) * 6 + search::score(2) * 5 + search::score(3) * 4
			+ search::score(4) * 3 + search::score(5) * 2 + search::score(6) AS score
		FROM page
			WHERE title @0@ ${escaped}
			OR path @1@ ${escaped}
			OR h1 @2@ ${escaped}
			OR h2 @3@ ${escaped}
			OR h3 @4@ ${escaped}
			OR h4 @5@ ${escaped}
			OR content @6@ ${escaped}
		ORDER BY score DESC;
	`;
};

async function query(sql) {
	const raw = await fetch('http://localhost:4201/sql', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: `Basic ${btoa('root:surrealdb')}`,
			NS: 'test',
			DB: 'test',
		},
		body: sql,
	});

	const json = await raw.json();
	return json[0].result ?? [];
}

function processResult(result) {
	// Will:
	// - group offsets per line (see groupOffsets() function)
	// - Sort descending based on the length of the offsets
	// - pick the biggest offset
	const [linenumber, offsets] = Object.entries(result.offsets).sort(
		([, a], [, b]) => findBiggestOffsets(b) - findBiggestOffsets(a)
	)[0];

	// - Grab the actual content of the line.
	// - Split up in chunks of what to highlight and what not.
	const line = result.content[linenumber];
	const chunks = offsets
		.flatMap(({ s, e }, i, arr) => {
			const next = arr[i + 1];
			return [
				i == 0 && { bold: false, value: line.slice(0, s) },
				{ bold: true, value: line.slice(s, e) },
				{ bold: false, value: line.slice(e, next?.s) },
			];
		})
		.filter((a) => a);

	return {
		...result,
		chunks,
	};
}

function findBiggestOffsets(offsets) {
	return offsets.map(({ s, e }) => e - s).reduce((a, b) => a + b, 0);
}
