// Modelling figures for learn/data-models/graph/record-links-vs-graph-relations
// and build/migrating/from-other-databases/from-postgresql.

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

const at = (x: number, y: number, w = 260, h = 64): Node => ({ x, y, w, h });

// The same user and two comments, linked three ways
const linkKinds: Figure = {
    name: "record-link-kinds",
    width: 2400,
    height: 1000,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line, t.muted])];
        const PW = 760;
        const panel = (k: number, title: string, sub: string) => {
            const ox = 40 + k * (PW + 20);
            s.push(rect(ox, 40, PW, 920, { fill: t.panel, r: 28 }));
            s.push(
                text(ox + 40, 110, title, { size: 36, fill: t.text, weight: 700, anchor: "start" }),
            );
            s.push(text(ox + 40, 154, sub, { size: 24, fill: t.muted, anchor: "start" }));
            return ox;
        };
        const userBox = (ox: number, field?: string): Node => {
            const n = { x: ox + PW / 2, y: 290, w: 520, h: field ? 130 : 70 };
            s.push(rect(n.x - n.w / 2, n.y - n.h / 2, n.w, n.h, { fill: t.card, r: 16 }));
            s.push(
                text(n.x, n.y - (field ? 18 : -10), "user:mcuserson", {
                    size: 28,
                    fill: t.text,
                    weight: 600,
                    font: MONO,
                }),
            );
            if (field) s.push(text(n.x, n.y + 30, field, { size: 22, fill: t.muted, font: MONO }));
            return n;
        };
        const comments = (ox: number) => [
            at(ox + PW / 2 - 170, 760, 280, 70),
            at(ox + PW / 2 + 170, 760, 280, 70),
        ];

        // 1. A record link: a field holding record IDs
        let ox = panel(0, "Record link", "a field that holds record IDs");
        let u = userBox(ox, "comments: [comment:1, comment:2]");
        for (const [i, c] of comments(ox).entries()) {
            s.push(link(u, c, t.accent, { width: 4 }));
            s.push(node(c, `comment:${i + 1}`, t, { size: 26 }));
        }
        s.push(
            text(ox + 40, 880, "comments.text follows the link.", {
                size: 24,
                fill: t.text,
                anchor: "start",
            }),
        );
        s.push(
            text(ox + 40, 916, "The way back needs a subquery on user.", {
                size: 24,
                fill: t.muted,
                anchor: "start",
            }),
        );

        // 2. A graph edge: a record of its own in a relation table
        ox = panel(1, "Graph relation", "an edge record in the wrote table");
        u = userBox(ox);
        for (const [i, c] of comments(ox).entries()) {
            const e = at(c.x, 530, 240, 90);
            s.push(
                rect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, { fill: t.bg, stroke: t.line, r: 14 }),
            );
            s.push(
                text(e.x, e.y - 8, `wrote:${i + 1}`, {
                    size: 24,
                    fill: t.text,
                    weight: 600,
                    font: MONO,
                }),
            );
            s.push(text(e.x, e.y + 26, "in / out", { size: 20, fill: t.muted, font: MONO }));
            s.push(link(u, e, t.accent, { width: 4 }));
            s.push(link(e, c, t.accent, { width: 4 }));
            s.push(node(c, `comment:${i + 1}`, t, { size: 26 }));
        }
        s.push(
            text(ox + 40, 880, "->wrote->comment and <-wrote<-user", {
                size: 24,
                fill: t.text,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(
            text(ox + 40, 916, "walk it in either direction.", {
                size: 24,
                fill: t.muted,
                anchor: "start",
            }),
        );

        // 3. A link with REFERENCE, and a computed field for the way back
        ox = panel(2, "Reference", "a link that the target can see");
        u = userBox(ox, "comments: REFERENCE");
        for (const [i, c] of comments(ox).entries()) {
            // Forward links on the inside, the computed way back on the outside
            const side = i ? 1 : -1;
            s.push(
                link({ ...u, x: u.x + side * 60 }, { ...c, x: c.x - side * 20 }, t.accent, {
                    width: 4,
                }),
            );
            s.push(
                link({ ...c, x: c.x + side * 90 }, { ...u, x: u.x + side * 230 }, t.line, {
                    width: 3,
                    dash: "10 8",
                    label: "<~user",
                    labelColour: t.muted,
                    halo: t.panel,
                }),
            );
            s.push(node(c, `comment:${i + 1}`, t, { size: 26, sub: "author: <~user" }));
        }
        s.push(
            text(ox + 40, 880, "author is computed from the incoming", {
                size: 24,
                fill: t.text,
                anchor: "start",
            }),
        );
        s.push(
            text(ox + 40, 916, "references, so it never goes stale.", {
                size: 24,
                fill: t.muted,
                anchor: "start",
            }),
        );
        return svg(linkKinds, t, s.join(""));
    },
};

// The blog schema on record-links-vs-graph-relations#one-to-one-one-to-many-and-many-to-many
type Table = { name: string; x: number; fields: [string, boolean][] };
const TABLES: Table[] = [
    { name: "user", x: 260, fields: [["name", false]] },
    {
        name: "blog",
        x: 860,
        fields: [
            ["title", false],
            ["owner", false],
            ["posts  <~post", true],
        ],
    },
    {
        name: "post",
        x: 1460,
        fields: [
            ["title", false],
            ["blog", false],
            ["tags", false],
        ],
    },
    {
        name: "tag",
        x: 2060,
        fields: [
            ["name", false],
            ["posts  <~post", true],
        ],
    },
];

const blogSchema: Figure = {
    name: "blog-schema-links",
    width: 2320,
    height: 760,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line])];
        const W = 360;
        const top = 260;
        const rowH = 64;
        const fieldY = (table: string, field: string) => {
            const tb = TABLES.find((x) => x.name === table) as Table;
            return top + 90 + tb.fields.findIndex(([f]) => f.startsWith(field)) * rowH + 32;
        };
        const X = (table: string) => (TABLES.find((x) => x.name === table) as Table).x;
        for (const tb of TABLES) {
            const h = 90 + tb.fields.length * rowH + 20;
            s.push(rect(tb.x - W / 2, top, W, h, { fill: t.panel, r: 20 }));
            s.push(rect(tb.x - W / 2, top, W, 80, { fill: t.card, r: 20 }));
            s.push(
                text(tb.x, top + 52, tb.name, { size: 32, fill: t.text, weight: 700, font: MONO }),
            );
            tb.fields.forEach(([f, computed], i) => {
                s.push(
                    text(tb.x - W / 2 + 30, top + 90 + i * rowH + 42, f, {
                        size: 26,
                        fill: computed ? t.muted : t.text,
                        anchor: "start",
                        font: MONO,
                    }),
                );
            });
        }
        // Stored links: from the field that holds them to the table they point at
        const stored: [string, string, string, string, string][] = [
            ["blog", "owner", "user", "one-to-one", "record<user>, UNIQUE index"],
            ["post", "blog", "blog", "one-to-many", "record<blog>, ON DELETE CASCADE"],
            ["post", "tags", "tag", "many-to-many", "array<record<tag>>"],
        ];
        stored.forEach(([from, field, to, kind, type]) => {
            const y1 = fieldY(from, field);
            const toLeft = X(to) < X(from);
            const x1 = X(from) + (toLeft ? -W / 2 : W / 2);
            const x2 = X(to) + (toLeft ? W / 2 : -W / 2);
            const y2 = top + 52;
            s.push(
                `<path d="M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2 + (toLeft ? 12 : -12)},${y2}" fill="none" stroke="${t.accent}" stroke-width="4" marker-end="url(#ah-${t.accent.replace(/[^a-z0-9]/gi, "")})"/>`,
            );
            const lx = (x1 + x2) / 2;
            s.push(text(lx, 150, kind, { size: 28, fill: t.accent, weight: 700 }));
            s.push(text(lx, 190, type, { size: 22, fill: t.muted, font: MONO }));
        });
        s.push(
            text(
                80,
                660,
                "Each link is stored once, on the side that holds it. blog.posts and tag.posts are computed from the incoming references,",
                { size: 26, fill: t.text, anchor: "start" },
            ),
        );
        s.push(
            text(80, 700, "so they never need updating by hand.", {
                size: 26,
                fill: t.text,
                anchor: "start",
            }),
        );
        return svg(blogSchema, t, s.join(""));
    },
};

// Four joined tables against one graph path, for the PostgreSQL migration page
const joinVsGraph: Figure = {
    name: "join-vs-graph",
    width: 2400,
    height: 1000,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line])];
        // Left: the relational schema, each JOIN a foreign key
        s.push(
            text(60, 80, "PostgreSQL: three JOINs across four tables", {
                size: 32,
                fill: t.text,
                weight: 600,
                anchor: "start",
            }),
        );
        const tables: [string, string][] = [
            ["customer", "customer_id, name"],
            ["customer_order", "order_id, customer_id"],
            ["order_item", "order_id, product_id"],
            ["product", "id, name"],
        ];
        const boxes = tables.map(([name, cols], i): Node => {
            const n = at(330, 200 + i * 190, 520, 120);
            s.push(rect(n.x - n.w / 2, n.y - n.h / 2, n.w, n.h, { fill: t.card, r: 16 }));
            s.push(text(n.x, n.y - 8, name, { size: 30, fill: t.text, weight: 700, font: MONO }));
            s.push(text(n.x, n.y + 32, cols, { size: 22, fill: t.muted, font: MONO }));
            return n;
        });
        for (let i = 0; i < 3; i++) {
            s.push(link(boxes[i], boxes[i + 1], t.line, { width: 3 }));
            s.push(
                text(360, 306 + i * 190, "JOIN", {
                    size: 24,
                    fill: t.muted,
                    weight: 700,
                    anchor: "start",
                    font: MONO,
                }),
            );
        }
        // Right: the same data as records and bought edges
        const X0 = 1160;
        s.push(
            text(X0, 80, "SurrealDB: one path", {
                size: 32,
                fill: t.text,
                weight: 600,
                anchor: "start",
            }),
        );
        s.push(
            text(X0, 124, "customer:tobie->bought->product<-bought<-customer", {
                size: 24,
                fill: t.accent,
                weight: 600,
                anchor: "start",
                font: MONO,
            }),
        );
        const tobie = at(1330, 520, 300, 70);
        const products = {
            iphone: at(1800, 330, 300, 70),
            ipad: at(1800, 710, 300, 70),
            watch: at(1800, 900, 300, 70),
        };
        const customers = {
            jaime: at(2200, 330, 250, 70),
            pratim: at(2200, 710, 250, 70),
            martin: at(2200, 900, 250, 70),
        };
        s.push(link(tobie, products.iphone, t.accent, { width: 5, label: "bought", halo: t.bg }));
        s.push(link(tobie, products.ipad, t.accent, { width: 5, label: "bought", halo: t.bg }));
        s.push(link(customers.jaime, products.iphone, t.accent, { width: 5 }));
        s.push(link(customers.pratim, products.ipad, t.accent, { width: 5 }));
        s.push(link(customers.martin, products.watch, t.line, { width: 3, dash: "8 8" }));
        s.push(node(tobie, "customer:tobie", t, { size: 24, state: "active" }));
        for (const [k, n] of Object.entries(products))
            s.push(
                node(n, `product:${k}`, t, { size: 24, state: k === "watch" ? "muted" : "normal" }),
            );
        for (const [k, n] of Object.entries(customers))
            s.push(
                node(n, `customer:${k}`, t, {
                    size: 22,
                    state: k === "martin" ? "muted" : "active",
                }),
            );
        s.push(
            text(
                X0,
                980,
                "Example data. Tobie's products lead back to Jaime and Pratim, and to Tobie; Martin bought neither.",
                { size: 24, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(joinVsGraph, t, s.join(""));
    },
};

export default [linkKinds, blogSchema, joinVsGraph];
