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
	score: number;
	hostname: string;
	chunks?: Chunks[];
}

export async function search(keywords: string): Promise<Doc[]> {
    const sql = templatedQuery(keywords);
    const docs = await query(sql);
	const hostname = getHostname();
	const version = getVersion(location.pathname);
	console.log(version);
    const processed = docs
        .filter((match) => {
			return match.offsets && match.hostname == hostname && validateUrl(match.url, version)
		})
        .map(processResult);
  	return processed;
}

function getHostname() {
	const mapped = {
		'docs.surrealdb.com': 'main--surrealdb-docs.netlify.app',
		'surrealdb-docs.netlify.app': 'main--surrealdb-docs.netlify.app',
	};

	return mapped[location.hostname] || location.hostname;
}

function getVersion(pathname: string) {
	pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
	const part = pathname.split('/')[2];
	if (part === 'nightly' || part.match(/\d.\d.\d/i)) return part;
	return undefined;
}

function validateUrl(url: string, version?: string) {
	console.log(1, getVersion(url));
	return getVersion(url) == version
}

const templatedQuery = (keywords: string) => {
	const escaped = JSON.stringify(keywords);
	const hostname = JSON.stringify(getHostname());
	return /* surrealql */ `
		SELECT
			path as url,
			hostname,
			title,
			content,
			search::offsets(6) AS offsets,
			(
				  (search::score(0) * 8) 
				+ (search::score(1) * 7)
				+ (search::score(2) * 5)
				+ (search::score(3) * 4)
				+ (search::score(4) * 3)
				+ (search::score(5) * 2)
				+ search::score(6) 
			) AS score
		FROM page
			WHERE 
				-- hostname = ${hostname}
				-- AND (
					title @0@ ${escaped}
					OR path @1@ ${escaped}
					OR h1 @2@ ${escaped}
					OR h2 @3@ ${escaped}
					OR h3 @4@ ${escaped}
					OR h4 @5@ ${escaped}
					OR content @6@ ${escaped}
				-- )
		ORDER BY score DESC LIMIT 100;
	`;
};

async function query(sql: string) {
	const raw = await fetch('https://blog-db.surrealdb.com/sql', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
		},
		body: `USE NS docs DB search; ${sql}`,
	});
	const json = (await raw.json()).slice(1);
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
