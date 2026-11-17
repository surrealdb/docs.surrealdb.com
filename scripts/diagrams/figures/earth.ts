// SurrealDB Earth figures for manage/instances/earth.

import { arrow, type Figure, markers, rect, svg, type Theme, text } from "../lib";
import type { Verified } from "../provenance";

export const verified: Verified = {
    against:
        "the Earth page's sizing example; capacity_msgs_per_s 1,300 with admit_fraction 0.8 in config/limits.toml, and about 3 units a commit in docs/design/EXECUTOR-CPU.md, of surrealdb/earth (9a218d9); large scans do not run across cells in production, so the figure no longer draws one",
    on: "2026-11-09",
};

const CELL_W = 240;
const CELL_H = 150;
const GAP = 28;
const X0 = 700;
const cellX = (i: number) => X0 + i * (CELL_W + GAP);

type Cell = { load: number; label: string } | null;

// One row of cells up to the limit: a started cell shows its load, a cell
// that is not running is a dashed outline
const cellRow = (s: string[], t: Theme, y: number, cells: Cell[]) => {
    cells.forEach((c, i) => {
        const x = cellX(i);
        if (c === null) {
            s.push(rect(x, y, CELL_W, CELL_H, { fill: "none", stroke: t.line, dash: "12 10" }));
            s.push(text(x + CELL_W / 2, y + 84, "not running", { size: 22, fill: t.muted }));
            return;
        }
        const full = c.load >= 1;
        s.push(rect(x, y, CELL_W, CELL_H, { fill: t.accentBg, stroke: t.accent }));
        s.push(
            text(x + 24, y + 48, `Cell ${i + 1}`, {
                size: 26,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );
        s.push(rect(x + 24, y + 72, CELL_W - 48, 18, { fill: t.card, r: 9 }));
        s.push(
            rect(x + 24, y + 72, (CELL_W - 48) * Math.min(c.load, 1), 18, { fill: t.accent, r: 9 }),
        );
        s.push(
            text(x + 24, y + 126, c.label, {
                size: 22,
                fill: full ? t.text : t.muted,
                weight: full ? 600 : 500,
                anchor: "start",
            }),
        );
    });
};

const rowLabel = (s: string[], t: Theme, y: number, title: string, lines: string[]) => {
    s.push(text(80, y + 48, title, { size: 30, fill: t.text, weight: 700, anchor: "start" }));
    lines.forEach((l, i) => {
        s.push(text(80, y + 92 + i * 36, l, { size: 24, fill: t.muted, anchor: "start" }));
    });
};

// How an Earth instance adds cells as load grows, up to its Cells limit
const earthCells: Figure = {
    name: "earth-cells",
    width: 2400,
    height: 1000,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line, t.red])];
        s.push(
            text(80, 76, "Earth fills one cell before it starts the next, up to the Cells limit", {
                size: 36,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );

        // Quiet: the page's example of 1,000 clients that each read a record every two seconds
        const r1 = 150;
        rowLabel(s, t, r1, "Quiet", ["1,000 clients, about 500", "reads a second"]);
        cellRow(s, t, r1, [
            { load: 0.5, label: "about 500 a second" },
            null,
            null,
            null,
            null,
            null,
        ]);

        // Peak: the same clients at five queries a second each
        const r2 = 410;
        rowLabel(s, t, r2, "Busy", ["1,000 clients, about 5,000", "reads a second"]);
        const full: Cell = { load: 1, label: "full" };
        cellRow(s, t, r2, [full, full, full, full, full, { load: 0.08, label: "new connections" }]);
        const c6 = cellX(5) + CELL_W / 2;
        s.push(text(c6, r2 - 54, "next connection", { size: 22, fill: t.muted }));
        s.push(arrow(c6, r2 - 44, c6, r2 - 8, t.accent, 4));

        // At the limit: every cell busy, so a new connection is told to retry
        const r3 = 670;
        rowLabel(s, t, r3, "At the limit", ["every cell is busy", "open connections keep running"]);
        cellRow(s, t, r3, [full, full, full, full, full, full]);
        const bx = cellX(5) + CELL_W - 420;
        s.push(rect(bx, r3 - 66, 420, 48, { fill: t.redBg, stroke: t.red, r: 12 }));
        s.push(
            text(bx + 210, r3 - 34, "new connection: 503, try again", {
                size: 22,
                fill: t.red,
                weight: 600,
            }),
        );

        s.push(
            text(
                80,
                960,
                "Six cells stand for the Cells limit here; the default is 100. A cell takes about 1,000 small reads a second, or about 200 small writes, before it takes no new connections.",
                { size: 24, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(earthCells, t, s.join(""));
    },
};

export default [earthCells];
