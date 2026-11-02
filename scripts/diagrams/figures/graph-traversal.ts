// Graph traversal and recursive path figures for
// learn/data-models/graph/* and reference/query-language/language-primitives/idioms.
// Every graph is the one the page's example builds, and every result is the
// output of that example on SurrealDB 4.0.

import {
    type Figure,
    link,
    MONO,
    markers,
    type Node,
    node,
    rect,
    svg,
    type Theme,
    text,
} from "../lib";

const at = (x: number, y: number, w = 220, h = 64): Node => ({ x, y, w, h });

// ->wrote->post from a user and <-wrote<-users from a post, with the edge as a record of its own
const edgeRecord: Figure = {
    name: "graph-edge-record",
    width: 2200,
    height: 760,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line])];
        const alice = at(330, 300, 300, 80);
        const post = at(1870, 300, 360, 80);
        const edge = { x: 1100, y: 300, w: 560, h: 220 };
        s.push(node(alice, "users:alice", t, { size: 32 }));
        s.push(node(post, "post:helloworld", t, { size: 32 }));
        s.push(
            rect(edge.x - edge.w / 2, edge.y - edge.h / 2, edge.w, edge.h, {
                fill: t.panel,
                stroke: t.line,
                r: 18,
            }),
        );
        s.push(
            text(edge.x, edge.y - 56, "wrote:8x2k…", {
                size: 32,
                fill: t.text,
                weight: 600,
                font: MONO,
            }),
        );
        s.push(
            text(edge.x, edge.y + 4, "in: users:alice", { size: 28, fill: t.muted, font: MONO }),
        );
        s.push(
            text(edge.x, edge.y + 50, "out: post:helloworld", {
                size: 28,
                fill: t.muted,
                font: MONO,
            }),
        );
        s.push(link(alice, edge, t.line, { width: 3 }));
        s.push(link(edge, post, t.line, { width: 3 }));
        s.push(
            text(edge.x, 140, "An edge is a record in the wrote table, with in and out fields", {
                size: 30,
                fill: t.muted,
            }),
        );
        // The two walks
        s.push(
            text(330, 520, "SELECT ->wrote->post FROM users:alice", {
                size: 30,
                fill: t.accent,
                weight: 600,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(
            `<line x1="330" y1="560" x2="1860" y2="560" stroke="${t.accent}" stroke-width="5" marker-end="url(#ah-${t.accent.replace(/[^a-z0-9]/gi, "")})"/>`,
        );
        s.push(
            text(1870, 640, "SELECT <-wrote<-users FROM post:helloworld", {
                size: 30,
                fill: t.text,
                weight: 600,
                anchor: "end",
                font: MONO,
            }),
        );
        s.push(
            `<line x1="1870" y1="680" x2="340" y2="680" stroke="${t.line}" stroke-width="5" marker-end="url(#ah-${t.line.replace(/[^a-z0-9]/gi, "")})"/>`,
        );
        return svg(edgeRecord, t, s.join(""));
    },
};

// The friend network on idioms#path-and-unique-node-collection-shortest-path
const PEOPLE: Record<string, [number, number, number]> = {
    you: [90, 330, 110],
    friend1: [280, 150, 160],
    friend2: [280, 430, 160],
    acquaintance1: [510, 250, 220],
    acquaintance2: [510, 430, 220],
    acquaintance3: [510, 610, 220],
    star: [730, 610, 110],
};
const KNOWS: [string, string][] = [
    ["you", "friend1"],
    ["you", "friend2"],
    ["friend1", "friend2"],
    ["friend2", "acquaintance1"],
    ["friend2", "acquaintance2"],
    ["friend2", "acquaintance3"],
    ["acquaintance3", "star"],
];

const pathAlgorithms: Figure = {
    name: "recursive-path-algorithms",
    width: 2560,
    height: 1150,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line])];
        type Panel = {
            title: string;
            query: string;
            highlight?: string[];
            order?: string[];
            lines: string[];
        };
        const panels: Panel[] = [
            {
                title: "+path",
                query: "person:you.{..+path}->knows->person",
                lines: [
                    "every route to a record with no further edge:",
                    "friend2, acquaintance2",
                    "friend2, acquaintance1",
                    "friend1, friend2, acquaintance2",
                    "friend1, friend2, acquaintance1",
                    "friend2, acquaintance3, star",
                    "friend1, friend2, acquaintance3, star",
                ],
            },
            {
                title: "+shortest=person:star",
                query: "person:you.{..+shortest=person:star}->knows->person",
                highlight: ["you", "friend2", "acquaintance3", "star"],
                lines: ["the fewest steps to person:star:", "friend2, acquaintance3, star"],
            },
            {
                title: "+collect",
                query: "person:you.{..+collect}->knows->person",
                order: [
                    "friend1",
                    "friend2",
                    "acquaintance2",
                    "acquaintance1",
                    "acquaintance3",
                    "star",
                ],
                lines: [
                    "each record once, nearest first:",
                    "friend1, friend2, acquaintance2,",
                    "acquaintance1, acquaintance3, star",
                ],
            },
        ];
        panels.forEach((p, k) => {
            const ox = 40 + k * 840;
            const oy = 150;
            s.push(rect(ox, oy, 820, 960, { fill: t.panel, r: 28 }));
            s.push(
                text(ox, 70, p.title, {
                    size: 38,
                    fill: t.accent,
                    weight: 700,
                    anchor: "start",
                    font: MONO,
                }),
            );
            s.push(
                text(ox, 118, p.query, { size: 22, fill: t.muted, anchor: "start", font: MONO }),
            );
            const box = (name: string): Node => {
                const [x, y, w] = PEOPLE[name];
                return { x: ox + x, y: oy + y, w, h: 58 };
            };
            for (const [a, b] of KNOWS) {
                const on =
                    p.highlight?.includes(a) &&
                    p.highlight?.includes(b) &&
                    p.highlight.indexOf(b) === p.highlight.indexOf(a) + 1;
                s.push(link(box(a), box(b), on ? t.accent : t.line, { width: on ? 5 : 3 }));
            }
            for (const name of Object.keys(PEOPLE)) {
                const active = p.highlight?.includes(name) ?? false;
                s.push(node(box(name), name, t, { size: 22, state: active ? "active" : "normal" }));
                const n = p.order?.indexOf(name) ?? -1;
                if (n >= 0) {
                    const b = box(name);
                    s.push(
                        `<circle cx="${b.x + b.w / 2}" cy="${b.y - b.h / 2}" r="22" fill="${t.accent}"/>`,
                    );
                    s.push(
                        text(b.x + b.w / 2, b.y - b.h / 2 + 9, String(n + 1), {
                            size: 26,
                            fill: t.bg,
                            weight: 700,
                        }),
                    );
                }
            }
            p.lines.forEach((line, i) => {
                s.push(
                    text(ox + 40, oy + 740 + i * 36, line, {
                        size: i ? 24 : 24,
                        fill: i ? t.text : t.muted,
                        anchor: "start",
                        font: i ? MONO : undefined,
                    }),
                );
            });
        });
        s.push(
            text(
                40,
                1140,
                "Every record is in the person table, and every arrow is a knows edge.",
                { size: 24, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(pathAlgorithms, t, s.join(""));
    },
};

// A tree drawn with one row per depth, and a note per row of which paths return it
type TreeNode = { id: string; children?: TreeNode[] };

function drawTree(
    s: string[],
    t: Theme,
    root: TreeNode,
    o: {
        x0: number;
        y0: number;
        width: number;
        rowH: number;
        boxW: number;
        size: number;
        vertical: boolean;
        edges?: boolean;
    },
): Map<string, Node> {
    const leaves: TreeNode[] = [];
    const walk = (n: TreeNode) => (n.children?.length ? n.children.forEach(walk) : leaves.push(n));
    walk(root);
    const pos = new Map<string, Node>();
    const place = (n: TreeNode, depth: number): number => {
        let c: number;
        if (!n.children?.length) c = leaves.indexOf(n);
        else
            c =
                n.children.map((ch) => place(ch, depth + 1)).reduce((a, b) => a + b) /
                n.children.length;
        const step = o.width / leaves.length;
        const along = o.x0 + step * (c + 0.5);
        const across = o.y0 + depth * o.rowH;
        pos.set(
            n.id,
            o.vertical
                ? { x: along, y: across, w: o.boxW, h: 58 }
                : { x: across, y: along, w: o.boxW, h: 54 },
        );
        return c;
    };
    place(root, 0);
    const edges = (n: TreeNode) =>
        n.children?.forEach((ch) => {
            s.push(link(pos.get(n.id) as Node, pos.get(ch.id) as Node, t.line, { width: 2.5 }));
            edges(ch);
        });
    if (o.edges !== false) edges(root);
    for (const [id, b] of pos) s.push(node(b, id, t, { size: o.size }));
    return pos;
}

const PLANET: TreeNode = {
    id: "planet:earth",
    children: [
        {
            id: "country:us",
            children: [
                {
                    id: "state:california",
                    children: [{ id: "city:los_angeles" }, { id: "city:san_francisco" }],
                },
                { id: "state:texas", children: [{ id: "city:houston" }, { id: "city:dallas" }] },
            ],
        },
        {
            id: "country:canada",
            children: [
                {
                    id: "province:ontario",
                    children: [{ id: "city:toronto" }, { id: "city:ottawa" }],
                },
                {
                    id: "province:bc",
                    children: [{ id: "city:vancouver" }, { id: "city:victoria" }],
                },
            ],
        },
    ],
};

const recursionDepth: Figure = {
    name: "recursive-depth",
    width: 2560,
    height: 1100,
    draw(t: Theme) {
        const s: string[] = [markers([t.line])];
        const rowH = 180;
        const y0 = 100;
        const TX = 620;
        const labels: [string, string[], "hit" | "empty" | "none"][] = [
            ["depth 0", ["the starting record"], "none"],
            ["depth 1", [], "none"],
            ["depth 2", ["planet:earth.{2}->has->(?)"], "hit"],
            ["depth 3", ["planet:earth.{1..4}->has->(?)", "planet:earth.{..}->has->(?)"], "hit"],
            ["depth 4", ["planet:earth.{4}->has->(?)", "returns []"], "empty"],
        ];
        labels.forEach(([depth, queries, kind], i) => {
            const y = y0 + i * rowH;
            const fill = kind === "hit" ? t.accentBg : kind === "empty" ? t.redBg : t.panel;
            s.push(rect(40, y - 75, 2480, 150, { fill, r: 20 }));
            s.push(
                text(70, y - 26, depth, { size: 26, fill: t.muted, weight: 600, anchor: "start" }),
            );
            queries.forEach((q, k) => {
                const colour = kind === "hit" ? t.accent : kind === "empty" ? t.red : t.muted;
                s.push(
                    text(70, y + 14 + k * 34, q, {
                        size: 22,
                        fill: colour,
                        weight: 600,
                        anchor: "start",
                        font: kind === "none" ? undefined : MONO,
                    }),
                );
            });
        });
        s.push(
            text(TX + 950, y0 + 4 * rowH + 10, "no record at depth 3 has a has edge", {
                size: 26,
                fill: t.red,
            }),
        );
        drawTree(s, t, PLANET, {
            x0: TX,
            y0,
            width: 2500 - TX,
            rowH,
            boxW: 222,
            size: 19,
            vertical: true,
        });
        s.push(
            text(
                40,
                1060,
                "A fixed depth returns the records at that depth. A range returns the records where the walk stops, here depth 3, however far the range reaches.",
                { size: 26, fill: t.text, anchor: "start" },
            ),
        );
        return svg(recursionDepth, t, s.join(""));
    },
};

// The ancestors of person:1 on recursive-traversals#family-tree-example
const ancestors = (id: number, depth: number): TreeNode =>
    depth === 3
        ? { id: `person:${id}` }
        : {
              id: `person:${id}`,
              children: [ancestors(id * 2, depth + 1), ancestors(id * 2 + 1, depth + 1)],
          };

const familyTree: Figure = {
    name: "recursive-family-tree",
    width: 2200,
    height: 1080,
    draw(t: Theme) {
        const s: string[] = [markers([t.line])];
        const colW = 560;
        const cols: [string, string][] = [
            ["person:1", ""],
            ["@.{1}->child_of->person", "parents"],
            ["@.{2}->child_of->person", "grandparents"],
            ["@.{3}->child_of->person", "great_grandparents"],
        ];
        cols.forEach(([q, label], i) => {
            const x = 200 + i * colW;
            if (i) s.push(rect(x - 200, 110, 400, 950, { fill: t.panel, r: 24 }));
            s.push(
                text(x, 50, label || "the starting record", {
                    size: 30,
                    fill: t.text,
                    weight: 600,
                }),
            );
            if (q !== "person:1")
                s.push(text(x, 90, q, { size: 22, fill: t.accent, weight: 600, font: MONO }));
        });
        drawTree(s, t, ancestors(1, 0), {
            x0: 120,
            y0: 200,
            width: 920,
            rowH: colW,
            boxW: 200,
            size: 24,
            vertical: false,
        });
        return svg(familyTree, t, s.join(""));
    },
};

// The org chart on graph-traversal#automatic-flattening-in-graph-queries, with
// employee1's walk up to the president and back down
const ORG: TreeNode = {
    id: "president",
    children: [
        { id: "manager1", children: [{ id: "employee1" }, { id: "employee2" }] },
        { id: "manager2", children: [{ id: "employee3" }, { id: "employee4" }] },
    ],
};

const flattening: Figure = {
    name: "graph-flattening",
    width: 2400,
    height: 980,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent])];
        const pos = drawTree(s, t, ORG, {
            x0: 380,
            y0: 140,
            width: 1000,
            rowH: 280,
            boxW: 210,
            size: 26,
            vertical: true,
            edges: false,
        });
        const p = (id: string) => pos.get(id) as Node;
        const shift = (n: Node, dx: number): Node => ({ ...n, x: n.x + dx });
        // Up from employee1 to the president, along its works_for edges
        s.push(link(shift(p("employee1"), -24), shift(p("manager1"), -24), t.accent, { width: 5 }));
        s.push(link(shift(p("manager1"), -24), shift(p("president"), -24), t.accent, { width: 5 }));
        // Down again, following works_for edges backwards to everyone below
        s.push(
            link(shift(p("president"), 24), shift(p("manager1"), 24), t.accent, {
                width: 5,
                dash: "12 8",
            }),
        );
        s.push(link(p("president"), p("manager2"), t.accent, { width: 5, dash: "12 8" }));
        for (const e of ["employee1", "employee2"])
            s.push(
                link(shift(p("manager1"), 24), shift(p(e), 24), t.accent, {
                    width: 5,
                    dash: "12 8",
                }),
            );
        for (const e of ["employee3", "employee4"])
            s.push(link(p("manager2"), p(e), t.accent, { width: 5, dash: "12 8" }));
        const label = (x: number, y: number, s1: string, anchor: "start" | "end") =>
            s.push(
                text(x, y, s1, {
                    size: 22,
                    fill: t.accent,
                    weight: 600,
                    anchor,
                    font: MONO,
                    halo: t.bg,
                }),
            );
        label(
            p("employee1").x - 120,
            (p("employee1").y + p("manager1").y) / 2,
            "1  ->works_for->person",
            "end",
        );
        label(
            p("manager1").x - 120,
            (p("manager1").y + p("president").y) / 2,
            "2  ->works_for->person",
            "end",
        );
        label(p("president").x + 150, p("president").y - 40, "3  <-works_for<-person", "start");
        label(p("manager2").x + 100, p("manager2").y + 110, "4  <-works_for<-person", "start");
        s.push(
            text(
                80,
                900,
                "Solid: the walk up from person:employee1. Dashed: the walk back down, which reaches every employee.",
                { size: 26, fill: t.muted, anchor: "start" },
            ),
        );
        // The output shape
        const X = 1600;
        s.push(
            text(X, 120, "One array per starting record", {
                size: 30,
                fill: t.text,
                weight: 600,
                anchor: "start",
            }),
        );
        ["employee1", "employee2", "employee3", "employee4"].forEach((e, i) => {
            const y = 180 + i * 150;
            s.push(
                rect(X, y, 740, 120, {
                    fill: i === 0 ? t.accentBg : t.card,
                    stroke: i === 0 ? t.accent : undefined,
                }),
            );
            s.push(
                text(X + 30, y + 50, `from person:${e}`, {
                    size: 26,
                    fill: t.muted,
                    anchor: "start",
                    font: MONO,
                }),
            );
            s.push(
                text(X + 30, y + 92, "[ all four employees ]", {
                    size: 28,
                    fill: t.text,
                    weight: 600,
                    anchor: "start",
                    font: MONO,
                }),
            );
        });
        s.push(
            text(X, 820, "Calling .flatten() at each step merges", {
                size: 26,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(
            text(X, 858, "the four arrays into one.", { size: 26, fill: t.muted, anchor: "start" }),
        );
        return svg(flattening, t, s.join(""));
    },
};

// Posts that share tags with post:a, on graph-traversal#ranking-records-by-shared-connections
const sharedConnections: Figure = {
    name: "graph-shared-connections",
    width: 2200,
    height: 900,
    draw(t: Theme) {
        const s: string[] = [markers([t.line, t.accent])];
        const a = at(260, 420, 200, 70);
        const tags: Record<string, Node> = {
            rust: at(1000, 200, 220, 70),
            db: at(1000, 420, 220, 70),
            web: at(1000, 640, 220, 70),
        };
        const posts: Record<string, Node> = {
            b: at(1740, 200, 200, 70),
            c: at(1740, 640, 200, 70),
            d: at(1740, 420, 200, 70),
        };
        const tagged: [string, string][] = [
            ["b", "rust"],
            ["b", "db"],
            ["b", "web"],
            ["c", "web"],
            ["d", "db"],
        ];
        for (const tag of ["rust", "db"]) s.push(link(a, tags[tag], t.accent, { width: 5 }));
        for (const [p, tag] of tagged) {
            const reached = tag !== "web";
            s.push(
                link(posts[p], tags[tag], reached ? t.accent : t.line, {
                    width: reached ? 5 : 3,
                    dash: reached ? undefined : "8 8",
                }),
            );
        }
        s.push(node(a, "post:a", t, { state: "active", size: 30 }));
        for (const [k, n] of Object.entries(tags)) s.push(node(n, `tag:${k}`, t, { size: 28 }));
        const counts: Record<string, string> = { b: "2 routes", d: "1 route", c: "not reached" };
        for (const [k, n] of Object.entries(posts)) {
            s.push(node(n, `post:${k}`, t, { size: 30, state: k === "c" ? "muted" : "normal" }));
            s.push(
                text(n.x + 140, n.y + 10, counts[k], {
                    size: 28,
                    fill: k === "c" ? t.muted : t.accent,
                    weight: 700,
                    anchor: "start",
                }),
            );
        }
        s.push(
            text(260, 110, "$post->tagged->tag", {
                size: 26,
                fill: t.accent,
                weight: 600,
                font: MONO,
            }),
        );
        s.push(
            text(1400, 110, "<-tagged<-post", {
                size: 26,
                fill: t.accent,
                weight: 600,
                font: MONO,
            }),
        );
        s.push(
            text(
                80,
                820,
                "post:b is reached through two shared tags and post:d through one, so counting the repeats gives { B: 2 } and { D: 1 }.",
                { size: 28, fill: t.text, anchor: "start" },
            ),
        );
        s.push(
            text(
                80,
                862,
                "Arrows point the way each tagged edge runs. The path also reaches post:a again through its own tags, which the filter removes.",
                { size: 24, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(sharedConnections, t, s.join(""));
    },
};

export default [
    edgeRecord,
    pathAlgorithms,
    recursionDepth,
    familyTree,
    flattening,
    sharedConnections,
];
