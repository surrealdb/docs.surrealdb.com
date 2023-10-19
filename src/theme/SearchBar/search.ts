interface Offset {
	e: number;
	s: number;
}

interface Chunks {
	bold: boolean;
	value: string;
}

export interface Doc {
	url: string;
	title: string;
	content: string[];
	offsets: Record<number, Offset[]>;
	chunks?: Chunks[];
}

export async function search(keywords: string): Promise<Doc[]> {
    const sql = templatedQuery(keywords);
    const docs = await query(sql);
    const processed = docs
        .filter((match) => match.offsets)
        .map(processResult);
  	return processed;
}

const templatedQuery = (keywords: string) => {
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
		ORDER BY score DESC LIMIT 10;
	`;
};

async function query(sql: string) {
	const raw = await fetch('https://blog-db.surrealdb.com/sql', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			NS: 'doc',
			DB: 'search',
		},
		body: sql,
	});
	const json = await raw.json();
	const result: Doc[] = json[0].result ?? []
	return result;
}

function processResult(doc: Doc) {
	// Will:
	// - group offsets per line (see groupOffsets() function)
	// - Sort descending based on the length of the offsets
	// - pick the biggest offset
	let maxOffsetSize = -1;
	let linenumber = null;
	let offsets = null;

	for (const [line, off] of Object.entries(doc.offsets)) {
    const currentOffsetSize = findBiggestOffsets(off);
		if (currentOffsetSize > maxOffsetSize) {
			maxOffsetSize = currentOffsetSize;
			linenumber = line;
			offsets = off;
		}
	}

	// - Grab the actual content of the line.
	// - Split up in chunks of what to highlight and what not.
	const line = doc.content[Number(linenumber)];
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
		...doc,
		chunks,
	};
}

function findBiggestOffsets(offsets) {
	return offsets.reduce((sum, { s, e }) => sum + (e - s), 0);
}
