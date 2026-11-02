// How two index structures avoid reading every record: the bitmaps that combine
// indexes in learn/querying/concepts-and-guides/query-optimisation, and the
// layers of an HNSW graph in learn/data-models/vector-search/vector-indexes.

import {
    arrow,
    circle,
    type Figure,
    line,
    MONO,
    markers,
    rect,
    svg,
    type Theme,
    text,
} from "../lib";

// Eight articles; doc IDs are 1-based, as the bitmaps hold them
const CATEGORY = [1, 3, 4, 7];
const PUBLISHED = [2, 3, 5, 7, 8];

const bitmaps: Figure = {
    name: "index-bitmaps",
    width: 2200,
    height: 880,
    draw(t: Theme) {
        const s: string[] = [];
        const X0 = 760;
        const C = 150;
        const row = (
            y: number,
            label: string,
            sub: string,
            ids: number[],
            colour: string,
            fill: string,
        ) => {
            s.push(
                text(X0 - 40, y + 52, label, {
                    size: 30,
                    fill: t.text,
                    weight: 600,
                    anchor: "end",
                    font: MONO,
                }),
            );
            s.push(text(X0 - 40, y + 92, sub, { size: 26, fill: t.muted, anchor: "end" }));
            for (let id = 1; id <= 8; id++) {
                const on = ids.includes(id);
                s.push(
                    rect(X0 + (id - 1) * C, y, C - 16, 110, {
                        fill: on ? fill : t.panel,
                        stroke: on ? colour : undefined,
                        r: 14,
                    }),
                );
                s.push(
                    text(X0 + (id - 1) * C + (C - 16) / 2, y + 70, on ? "1" : "0", {
                        size: 40,
                        fill: on ? colour : t.muted,
                        weight: 700,
                        font: MONO,
                    }),
                );
            }
        };
        s.push(text(X0 - 40, 70, "document ID", { size: 26, fill: t.muted, anchor: "end" }));
        for (let id = 1; id <= 8; id++)
            s.push(
                text(X0 + (id - 1) * C + (C - 16) / 2, 70, String(id), {
                    size: 28,
                    fill: t.muted,
                    font: MONO,
                }),
            );
        row(110, "idx_category", "category = 'databases'", CATEGORY, t.text, t.card);
        row(260, "idx_published", "published = true", PUBLISHED, t.text, t.card);
        s.push(line(X0, 410, X0 + 8 * C - 16, 410, t.line, 3));
        const both = CATEGORY.filter((id) => PUBLISHED.includes(id));
        row(440, "BitmapAnd", "set operation, reads no records", both, t.accent, t.accentBg);
        s.push(
            text(
                80,
                680,
                `Only the records left, ${both.map((id) => `doc ${id}`).join(" and ")}, are fetched and checked against the full WHERE clause.`,
                {
                    size: 30,
                    fill: t.text,
                    anchor: "start",
                },
            ),
        );
        s.push(
            text(
                80,
                730,
                `A count() with GROUP ALL is the number of 1s, ${both.length}, and reads no records at all.`,
                { size: 30, fill: t.text, anchor: "start" },
            ),
        );
        s.push(
            text(
                80,
                800,
                "Eight example articles. OR takes the union of two bitmaps, and AND NOT subtracts one from the other.",
                { size: 26, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(bitmaps, t, s.join(""));
    },
};

// A small HNSW graph built from fixed points. Each point's top layer is fixed
// rather than drawn at random, so the picture does not change between renders,
// and the search runs the real greedy descent over it.
type P = { x: number; y: number; top: number };

function points(): P[] {
    let seed = 7;
    const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
    };
    const out: P[] = [];
    for (let i = 0; i < 34; i++)
        out.push({ x: 0.04 + rand() * 0.92, y: 0.08 + rand() * 0.84, top: 0 });
    for (const i of [3, 9, 14, 21, 27, 30, 5, 17]) out[i].top = 1;
    for (const i of [3, 21, 30]) out[i].top = 2;
    return out;
}

const PTS = points();
const QUERY = { x: 0.78, y: 0.7 };
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y);
const M_PER_LAYER = [4, 3, 2];

// Each node links to its M nearest nodes in the same layer, and every link is drawn both ways
function edges(layer: number): [number, number][] {
    const ids = PTS.map((p, i) => [p, i] as const)
        .filter(([p]) => p.top >= layer)
        .map(([, i]) => i);
    const set = new Set<string>();
    for (const i of ids) {
        const near = ids
            .filter((j) => j !== i)
            .sort((a, b) => dist(PTS[i], PTS[a]) - dist(PTS[i], PTS[b]));
        for (const j of near.slice(0, M_PER_LAYER[layer]))
            set.add(i < j ? `${i}-${j}` : `${j}-${i}`);
    }
    return [...set].map((k) => k.split("-").map(Number) as [number, number]);
}

const EDGES = [edges(0), edges(1), edges(2)];

function greedy(start: number, layer: number): number[] {
    const path = [start];
    let cur = start;
    for (;;) {
        const next = EDGES[layer]
            .filter(([a, b]) => a === cur || b === cur)
            .map(([a, b]) => (a === cur ? b : a))
            .sort((a, b) => dist(PTS[a], QUERY) - dist(PTS[b], QUERY))[0];
        if (next === undefined || dist(PTS[next], QUERY) >= dist(PTS[cur], QUERY)) return path;
        path.push(next);
        cur = next;
    }
}

// The entry point is the top-layer node farthest from the query, so every layer shows a step
const ENTRY = PTS.map((p, i) => [p, i] as const)
    .filter(([p]) => p.top === 2)
    .sort(([a], [b]) => dist(b, QUERY) - dist(a, QUERY))[0][1];
const PATH2 = greedy(ENTRY, 2);
const PATH1 = greedy(PATH2[PATH2.length - 1], 1);
const PATH0 = greedy(PATH1[PATH1.length - 1], 0);
const EF = 6;
const K = 2;
// The candidate list at the bottom layer: the EF nodes nearest the query that
// the search reaches from where the descent lands
const CANDIDATES = (() => {
    const seen = new Set([PATH0[PATH0.length - 1]]);
    const frontier = [...seen];
    while (frontier.length) {
        const cur = frontier.shift() as number;
        for (const [a, b] of EDGES[0]) {
            const n = a === cur ? b : b === cur ? a : -1;
            if (n >= 0 && !seen.has(n)) {
                seen.add(n);
                if (seen.size < EF * 2) frontier.push(n);
            }
        }
    }
    return [...seen].sort((a, b) => dist(PTS[a], QUERY) - dist(PTS[b], QUERY)).slice(0, EF);
})();

const hnsw: Figure = {
    name: "hnsw-layers",
    width: 2400,
    height: 1200,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent])];
        const PW = 700;
        const PH = 820;
        const panels = [2, 1, 0];
        panels.forEach((layer, k) => {
            const ox = 80 + k * (PW + 60);
            const oy = 170;
            const X = (p: { x: number }) => ox + 30 + p.x * (PW - 60);
            const Y = (p: { y: number }) => oy + 30 + p.y * (PH - 60);
            s.push(rect(ox, oy, PW, PH, { fill: t.panel, r: 28 }));
            const titles = [
                "Layer 2: fewest nodes, long links",
                "Layer 1",
                "Layer 0: every node, M0 links",
            ];
            s.push(
                text(ox, 90, titles[k], { size: 34, fill: t.text, weight: 600, anchor: "start" }),
            );
            s.push(
                text(
                    ox,
                    136,
                    k === 0
                        ? "the search starts at the entry point"
                        : k === 1
                          ? "continues from where layer 2 ended"
                          : `keeps the ${EF} nearest it finds (EF), returns ${K} (K)`,
                    { size: 26, fill: t.muted, anchor: "start" },
                ),
            );
            for (const [a, b] of EDGES[layer])
                s.push(line(X(PTS[a]), Y(PTS[a]), X(PTS[b]), Y(PTS[b]), t.grid, 2));
            if (layer === 0) {
                for (const c of CANDIDATES) s.push(circle(X(PTS[c]), Y(PTS[c]), 24, t.accentSoft));
            }
            PTS.forEach((p, i) => {
                if (p.top < layer) {
                    s.push(circle(X(p), Y(p), 4, t.grid));
                    return;
                }
                const result = layer === 0 && CANDIDATES.slice(0, K).includes(i);
                s.push(circle(X(p), Y(p), result ? 14 : 10, result ? t.accent : t.line));
            });
            const path = [PATH2, PATH1, PATH0][k];
            for (let i = 1; i < path.length; i++) {
                const a = PTS[path[i - 1]];
                const b = PTS[path[i]];
                const len = Math.hypot(X(b) - X(a), Y(b) - Y(a));
                const ux = (X(b) - X(a)) / len;
                const uy = (Y(b) - Y(a)) / len;
                s.push(
                    arrow(
                        X(a) + ux * 14,
                        Y(a) + uy * 14,
                        X(b) - ux * 18,
                        Y(b) - uy * 18,
                        t.accent,
                        5,
                    ),
                );
            }
            const start = PTS[path[0]];
            s.push(circle(X(start), Y(start), 16, "none", t.accent, 5));
            if (k === 0)
                s.push(
                    text(X(start), Y(start) - 30, "entry point", {
                        size: 26,
                        fill: t.accent,
                        weight: 600,
                        halo: t.panel,
                    }),
                );
            // The query
            s.push(
                `<path d="M${X(QUERY) - 16},${Y(QUERY) - 16} L${X(QUERY) + 16},${Y(QUERY) + 16} M${X(QUERY) + 16},${Y(QUERY) - 16} L${X(QUERY) - 16},${Y(QUERY) + 16}" stroke="${t.text}" stroke-width="6"/>`,
            );
            s.push(
                text(X(QUERY) - 28, Y(QUERY) + 10, "query", {
                    size: 26,
                    fill: t.text,
                    weight: 600,
                    anchor: "end",
                    halo: t.panel,
                }),
            );
        });
        s.push(
            text(
                80,
                1080,
                "Each layer holds a sample of the one below. The search walks to the nearest node it can reach in each layer, then drops to the next.",
                { size: 28, fill: t.text, anchor: "start" },
            ),
        );
        s.push(
            text(
                80,
                1124,
                `An illustration with ${PTS.length} points and fewer links than the defaults (M = 12, M0 = 24); a real index works the same way at scale.`,
                { size: 26, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(hnsw, t, s.join(""));
    },
};

export default [bitmaps, hnsw];
