// Decodes SPATIAL index cell ids, a port of the parts of
// surrealdb/idx/src/spatial.rs that turn an `IndexScan` range back into the
// cells it reads. Cells form a quadtree over the (lon, lat) plane, ordered
// along a Hilbert curve, so one key range is a run of neighbouring cells.

const MAX = 28n;
const HEADER = 1n << 60n;
const QUAD = [
    [0, 1, 3, 2],
    [0, 2, 3, 1],
    [3, 2, 0, 1],
    [3, 1, 0, 2],
];
const POS = [
    [0, 1, 3, 2],
    [0, 3, 1, 2],
    [2, 3, 1, 0],
    [2, 1, 3, 0],
];
const NEXT = [
    [1, 0, 3, 0],
    [0, 2, 1, 1],
    [2, 1, 2, 3],
    [3, 3, 0, 2],
];

export type Cell = {
    lonMin: number;
    lonMax: number;
    latMin: number;
    latMax: number;
    level: number;
};

const trailingZeros = (x: bigint) => {
    let n = 0n;
    while (((x >> n) & 1n) === 0n) n++;
    return n;
};
const parent = (c: bigint, level: bigint) => {
    const p = 3n + 2n * (MAX - level);
    return (c & ~((1n << (p + 1n)) - 1n)) | (1n << p);
};
const rangeMin = (c: bigint) => (c & ~(1n << trailingZeros(c))) | 8n;
const rangeMax = (c: bigint) => c | (((1n << trailingZeros(c)) - 1n) & ~7n);

function toCell(c: bigint): Cell {
    const level = Number(MAX - (trailingZeros(c) - 3n) / 2n);
    let state = 0;
    let ix = 0;
    let iy = 0;
    for (let k = 1; k <= level; k++) {
        const h = Number((c >> (4n + 2n * (MAX - BigInt(k)))) & 3n);
        const q = QUAD[state][h];
        state = NEXT[state][q];
        ix = ix * 2 + ((q >> 1) & 1);
        iy = iy * 2 + (q & 1);
    }
    const n = 2 ** level;
    return {
        lonMin: -180 + (360 * ix) / n,
        lonMax: -180 + (360 * (ix + 1)) / n,
        latMin: -90 + (180 * iy) / n,
        latMax: -90 + (180 * (iy + 1)) / n,
        level,
    };
}

// The fewest whole cells whose ids exactly fill the inclusive key range.
export function cellsInRange(from: bigint, to: bigint): Cell[] {
    const cells: Cell[] = [];
    let cur = from;
    while (cur <= to) {
        let best = cur;
        for (let level = 0n; level <= MAX; level++) {
            const c = parent(cur, level);
            if (rangeMin(c) === cur && rangeMax(c) <= to) {
                best = c;
                break;
            }
        }
        cells.push(toCell(best));
        cur = (rangeMax(best) + 8n) | 8n;
    }
    return cells;
}

// The leaf cell id of a point, to check which range a record falls in.
export function leafId(lon: number, lat: number): bigint {
    const n = 2 ** Number(MAX);
    const ix = Math.min(Math.floor(((lon + 180) / 360) * n), n - 1);
    const iy = Math.min(Math.floor(((lat + 90) / 180) * n), n - 1);
    let state = 0;
    let bits = HEADER;
    for (let k = 1n; k <= MAX; k++) {
        const shift = Number(MAX - k);
        const q = ((Math.floor(ix / 2 ** shift) & 1) << 1) | (Math.floor(iy / 2 ** shift) & 1);
        bits |= BigInt(POS[state][q]) << (4n + 2n * (MAX - k));
        state = NEXT[state][q];
    }
    return bits | 8n;
}
