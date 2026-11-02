// Record IDs in key order, and what three of the ranges on
// reference/query-language/language-primitives/data-types/record-ids#record-ranges read.

import { type Figure, MONO, markers, rect, svg, type Theme, text } from "../lib";

const KEYS: [string, string][] = [
    ["Amsterdam", "08:02:51"],
    ["Amsterdam", "08:07:14"],
    ["London", "08:00:12"],
    ["London", "08:03:39"],
    ["London", "08:06:20"],
    ["London", "08:09:31"],
    ["London", "08:12:47"],
    ["Munich", "08:01:05"],
    ["Munich", "08:05:58"],
];

const X0 = 80;
const KEY_W = 236;
const GAP = 12;
const kx = (i: number) => X0 + i * (KEY_W + GAP);

type Range = {
    label: string;
    from: number;
    to: number;
    excluded?: number;
    open?: boolean;
    bad?: boolean;
    note: string;
};

// Positions are key indices; a half step sits between two keys, where NONE
// and `..` fall.
const RANGES: Range[] = [
    { label: "['London', NONE]..=['London', ..]", from: 1.5, to: 6.5, note: "every London record" },
    {
        label: "['London', '08:03:39']..['London', '08:09:31']",
        from: 3,
        to: 4,
        excluded: 5,
        note: "the end key is excluded",
    },
    {
        label: "['London', '08:03:39']..",
        from: 3,
        to: 8,
        open: true,
        bad: true,
        note: "an open end runs on into Munich",
    },
];

function draw(t: Theme): string {
    const s: string[] = [markers([t.muted])];
    s.push(
        text(X0, 80, "temperature records in key order", {
            size: 34,
            fill: t.muted,
            anchor: "start",
        }),
    );
    KEYS.forEach(([city, time], i) => {
        const london = city === "London";
        s.push(rect(kx(i), 120, KEY_W, 120, { fill: london ? t.card : t.panel, r: 14 }));
        s.push(
            text(kx(i) + KEY_W / 2, 170, `'${city}'`, {
                size: 28,
                fill: london ? t.text : t.muted,
                weight: 600,
                font: MONO,
            }),
        );
        s.push(
            text(kx(i) + KEY_W / 2, 212, `'${time}'`, {
                size: 26,
                fill: london ? t.text : t.muted,
                font: MONO,
            }),
        );
    });
    // NONE sorts before every value and .. after every value
    for (const [pos, label] of [
        [1.5, "NONE"],
        [6.5, ".."],
    ] as [number, string][]) {
        const x = kx(Math.floor(pos)) + KEY_W + GAP / 2;
        s.push(
            `<line x1="${x}" y1="104" x2="${x}" y2="256" stroke="${t.accent}" stroke-width="4"/>`,
        );
        s.push(text(x, 290, label, { size: 26, fill: t.accent, weight: 600, font: MONO }));
    }
    RANGES.forEach((r, i) => {
        const y = 340 + i * 150;
        const colour = r.bad ? t.red : t.accent;
        const fill = r.bad ? t.redBg : t.accentBg;
        const edge = (pos: number, side: "left" | "right") =>
            Number.isInteger(pos)
                ? kx(pos) + (side === "right" ? KEY_W : 0)
                : kx(Math.floor(pos)) + KEY_W + GAP / 2;
        const left = edge(r.from, "left");
        const right = r.open ? kx(KEYS.length - 1) + KEY_W + 40 : edge(r.to, "right");
        s.push(text(X0, y + 30, r.label, { size: 28, fill: t.text, anchor: "start", font: MONO }));
        s.push(
            text(kx(KEYS.length - 1) + KEY_W, y + 30, r.note, {
                size: 28,
                fill: r.bad ? t.red : t.muted,
                weight: r.bad ? 600 : 400,
                anchor: "end",
            }),
        );
        s.push(
            rect(left, y + 52, right - left, 52, { fill, stroke: colour, strokeWidth: 3, r: 12 }),
        );
        if (r.excluded !== undefined) {
            s.push(
                rect(kx(r.excluded), y + 52, KEY_W, 52, {
                    fill: "none",
                    stroke: t.muted,
                    strokeWidth: 3,
                    r: 12,
                    dash: "10 8",
                }),
            );
        }
        if (r.open)
            s.push(
                text(right - 20, y + 90, "→", {
                    size: 34,
                    fill: colour,
                    weight: 700,
                    anchor: "end",
                }),
            );
    });
    return svg(figure, t, s.join(""));
}

const figure: Figure = {
    name: "record-range",
    width: X0 * 2 + KEYS.length * (KEY_W + GAP) - GAP + 40,
    height: 800,
    draw,
};
export default figure;
