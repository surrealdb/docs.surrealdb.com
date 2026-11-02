// Shared drawing primitives for the docs diagrams. Each figure in
// `figures/` draws one SVG per theme from these, and `render.ts` turns the
// SVG into the light and dark WebP pair that a page references with
// `<img src="…light…" darkSrc="…" />`.

export type Theme = {
    name: "light" | "dark";
    bg: string;
    panel: string;
    card: string;
    text: string;
    muted: string;
    line: string;
    accent: string;
    accentBg: string;
    accentSoft: string;
    red: string;
    redBg: string;
    green: string;
    greenBg: string;
    land: string;
    water: string;
    grid: string;
};

export const THEMES: Theme[] = [
    {
        name: "dark",
        bg: "#0e0d13",
        panel: "#17161d",
        card: "#23212b",
        text: "#f3f1f8",
        muted: "#8f8c9c",
        line: "#6e6a80",
        accent: "#d35cff",
        accentBg: "#2e1d3a",
        accentSoft: "rgba(211, 92, 255, 0.22)",
        red: "#ff5d6c",
        redBg: "#3a1a20",
        green: "#3fd68f",
        greenBg: "#15302a",
        land: "#302e3b",
        water: "#121118",
        grid: "#3a3747",
    },
    {
        name: "light",
        bg: "#ffffff",
        panel: "#f6f6f9",
        card: "#ebebf1",
        text: "#1d1b26",
        muted: "#86839a",
        line: "#8a86a0",
        accent: "#b93fe0",
        accentBg: "#f6e6fd",
        accentSoft: "rgba(185, 63, 224, 0.18)",
        red: "#d93448",
        redBg: "#fde8eb",
        green: "#13985c",
        greenBg: "#e3f6ec",
        land: "#e6e5ec",
        water: "#f7f7fa",
        grid: "#c9c6d6",
    },
];

export type Figure = {
    // File name without extension, written to src/assets/img/diagrams/
    name: string;
    width: number;
    height: number;
    draw: (t: Theme) => string;
};

export const SANS = "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif";
export const MONO = "'SF Mono', Menlo, monospace";

const escapeXml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type TextOpts = {
    size?: number;
    fill: string;
    weight?: number;
    anchor?: "start" | "middle" | "end";
    font?: string;
    // Outline in this colour, so the label stays legible over lines and fills
    halo?: string;
};

export function text(x: number, y: number, s: string, o: TextOpts): string {
    const { size = 32, fill, weight = 500, anchor = "middle", font = SANS, halo } = o;
    const h = halo
        ? ` stroke="${halo}" stroke-width="${size / 4}" stroke-linejoin="round" paint-order="stroke"`
        : "";
    return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${h}>${escapeXml(s)}</text>`;
}

type RectOpts = {
    fill: string;
    r?: number;
    stroke?: string;
    strokeWidth?: number;
    dash?: string;
    opacity?: number;
};

export function rect(x: number, y: number, w: number, h: number, o: RectOpts): string {
    const { fill, r = 18, stroke, strokeWidth = 3, dash, opacity } = o;
    const st = stroke ? ` stroke="${stroke}" stroke-width="${strokeWidth}"` : "";
    const d = dash ? ` stroke-dasharray="${dash}"` : "";
    const op = opacity !== undefined ? ` opacity="${opacity}"` : "";
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${st}${d}${op}/>`;
}

export function circle(
    cx: number,
    cy: number,
    r: number,
    fill: string,
    stroke?: string,
    strokeWidth = 3,
): string {
    const st = stroke ? ` stroke="${stroke}" stroke-width="${strokeWidth}"` : "";
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${st}/>`;
}

const markerId = (color: string) => `ah-${color.replace(/[^a-z0-9]/gi, "")}`;

// Arrowhead markers for every colour an arrow in the figure uses.
export function markers(colors: string[]): string {
    const defs = colors.map(
        (c) =>
            `<marker id="${markerId(c)}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`,
    );
    return `<defs>${defs.join("")}</defs>`;
}

export function arrow(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    width = 4,
    dash?: string,
): string {
    const d = dash ? ` stroke-dasharray="${dash}"` : "";
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${d} marker-end="url(#${markerId(color)})"/>`;
}

export function line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    width = 3,
    dash?: string,
): string {
    const d = dash ? ` stroke-dasharray="${dash}"` : "";
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${d}/>`;
}

export function path(
    d: string,
    o: { fill?: string; stroke?: string; strokeWidth?: number; dash?: string },
): string {
    const { fill = "none", stroke, strokeWidth = 3, dash } = o;
    const st = stroke
        ? ` stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"`
        : "";
    const ds = dash ? ` stroke-dasharray="${dash}"` : "";
    return `<path d="${d}" fill="${fill}"${st}${ds}/>`;
}

// A record drawn as a rounded box centred on (x, y), for graph figures
export type Node = { x: number; y: number; w: number; h: number };

export function node(
    n: Node,
    label: string,
    t: Theme,
    o: { state?: "normal" | "active" | "muted"; size?: number; sub?: string } = {},
): string {
    const { state = "normal", size = 28, sub } = o;
    const fill = state === "active" ? t.accentBg : state === "muted" ? t.panel : t.card;
    const stroke = state === "active" ? t.accent : undefined;
    const colour = state === "muted" ? t.muted : t.text;
    const parts = [
        rect(n.x - n.w / 2, n.y - n.h / 2, n.w, n.h, { fill, stroke, r: 14 }),
        text(n.x, n.y + (sub ? -4 : size * 0.36), label, {
            size,
            fill: colour,
            weight: 600,
            font: MONO,
        }),
    ];
    if (sub) parts.push(text(n.x, n.y + size, sub, { size: size * 0.8, fill: t.muted }));
    return parts.join("");
}

// The point where the line from a node's centre towards (tx, ty) leaves its box
function boxEdge(n: Node, tx: number, ty: number, pad: number): [number, number] {
    const dx = tx - n.x;
    const dy = ty - n.y;
    const sx = dx === 0 ? Number.POSITIVE_INFINITY : (n.w / 2 + pad) / Math.abs(dx);
    const sy = dy === 0 ? Number.POSITIVE_INFINITY : (n.h / 2 + pad) / Math.abs(dy);
    const s = Math.min(sx, sy);
    return [n.x + dx * s, n.y + dy * s];
}

// An arrow from one node box to another, optionally with a label at its middle
export function link(
    a: Node,
    b: Node,
    color: string,
    o: { width?: number; dash?: string; label?: string; labelColour?: string; halo?: string } = {},
): string {
    const { width = 4, dash, label, labelColour, halo } = o;
    const [x1, y1] = boxEdge(a, b.x, b.y, 6);
    const [x2, y2] = boxEdge(b, a.x, a.y, 10);
    const parts = [arrow(x1, y1, x2, y2, color, width, dash)];
    if (label) {
        parts.push(
            text((x1 + x2) / 2, (y1 + y2) / 2 + 9, label, {
                size: 24,
                fill: labelColour ?? color,
                weight: 600,
                font: MONO,
                halo,
            }),
        );
    }
    return parts.join("");
}

export function svg(f: Figure, t: Theme, body: string): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${f.width}" height="${f.height}" viewBox="0 0 ${f.width} ${f.height}">${rect(0, 0, f.width, f.height, { fill: t.bg, r: 0 })}${body}</svg>`;
}
