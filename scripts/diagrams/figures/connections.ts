// Connection, authentication and SDK figures for the language quickstarts, the
// SDK connecting pages, the security pages and the AI framework pages. Each one
// was checked against a SurrealDB 4.0 server and the SDK source it names: the
// JavaScript SDK (surrealdb.js), the Go SDK (surrealdb.go contrib/rews), and the
// HTTP engines of the Python, Rust, Java and .NET SDKs.

import { arrow, type Figure, line, MONO, markers, rect, SANS, svg, type Theme, text } from "../lib";
import type { Verified } from "../provenance";

export const verified: Verified = {
    against:
        "SurrealDB 4.0.0-beta.1, surrealdb.js and surrealdb.go origin/main, and the Rust SDK HTTP engine in surrealdb-private 0f7faf9edd",
    on: "2026-11-02",
};

type Kind = "plain" | "accent" | "bad" | "good" | "muted";

const fillOf = (t: Theme, k: Kind) =>
    k === "accent"
        ? t.accentBg
        : k === "bad"
          ? t.redBg
          : k === "good"
            ? t.greenBg
            : k === "muted"
              ? t.panel
              : t.card;

const strokeOf = (t: Theme, k: Kind) =>
    k === "accent" ? t.accent : k === "bad" ? t.red : k === "good" ? t.green : undefined;

// A box with one or more centred lines of text
function box(
    s: string[],
    t: Theme,
    x: number,
    y: number,
    w: number,
    h: number,
    lines: string[],
    o: { kind?: Kind; size?: number; mono?: boolean; bold?: boolean; sub?: string } = {},
) {
    const { kind = "plain", size = 26, mono = false, bold = true, sub } = o;
    s.push(rect(x, y, w, h, { fill: fillOf(t, kind), stroke: strokeOf(t, kind), r: 14 }));
    const all = sub ? [...lines, sub] : lines;
    const lh = size * 1.3;
    const top = y + h / 2 - ((all.length - 1) * lh) / 2 + size * 0.35;
    all.forEach((l, i) => {
        const isSub = sub && i === all.length - 1;
        s.push(
            text(x + w / 2, top + i * lh, l, {
                size: isSub ? size * 0.82 : size,
                fill: isSub ? t.muted : t.text,
                weight: isSub ? 500 : bold ? 600 : 500,
                font: mono && !isSub ? MONO : SANS,
            }),
        );
    });
}

// Left-aligned lines of text, one per entry
function para(
    s: string[],
    x: number,
    y: number,
    lines: string[],
    fill: string,
    size = 24,
    lh = 1.45,
    font = SANS,
) {
    lines.forEach((l, i) => {
        s.push(text(x, y + i * size * lh, l, { size, fill, anchor: "start", font }));
    });
}

// A labelled message between two lifelines
function msg(
    s: string[],
    t: Theme,
    x1: number,
    x2: number,
    y: number,
    label: string,
    colour: string,
    o: { mono?: boolean; dash?: string; size?: number } = {},
) {
    const { mono = false, dash, size = 23 } = o;
    const dir = Math.sign(x2 - x1);
    s.push(arrow(x1 + dir * 4, y, x2 - dir * 8, y, colour, 4, dash));
    s.push(
        text((x1 + x2) / 2, y - 14, label, {
            size,
            fill: colour === t.line ? t.text : colour,
            weight: 600,
            font: mono ? MONO : SANS,
            halo: t.panel,
        }),
    );
}

// ---------------------------------------------------------------------------
// 1. WebSocket, HTTP and embedded connections

const protocols: Figure = {
    name: "conn-protocols",
    width: 2400,
    height: 1230,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line, t.red, t.muted])];
        const PW = 760;
        const panel = (k: number, title: string, sub: string) => {
            const ox = 30 + k * (PW + 20);
            s.push(rect(ox, 30, PW, 1170, { fill: t.panel, r: 28 }));
            s.push(
                text(ox + 40, 98, title, { size: 36, fill: t.text, weight: 700, anchor: "start" }),
            );
            s.push(
                text(ox + 40, 142, sub, { size: 24, fill: t.muted, anchor: "start", font: MONO }),
            );
            return ox;
        };
        const lifelines = (ox: number, bottom: number) => {
            const a = ox + 170;
            const b = ox + PW - 170;
            box(s, t, a - 120, 180, 240, 70, ["your app"]);
            box(s, t, b - 120, 180, 240, 70, ["SurrealDB"], { kind: "accent" });
            s.push(line(a, 250, a, bottom, t.grid, 3, "6 8"));
            s.push(line(b, 250, b, bottom, t.grid, 3, "6 8"));
            return [a, b];
        };

        // WebSocket
        let ox = panel(0, "WebSocket", "ws:// and wss://");
        let [a, b] = lifelines(ox, 990);
        s.push(rect(a - 20, 280, b - a + 40, 700, { fill: t.accentSoft, r: 14 }));
        s.push(
            text((a + b) / 2, 318, "one socket, open the whole time", {
                size: 22,
                fill: t.accent,
                weight: 700,
            }),
        );
        msg(s, t, a, b, 390, "signin, once", t.line);
        msg(s, t, a, b, 480, "query", t.line);
        msg(s, t, b, a, 540, "result", t.muted);
        msg(s, t, a, b, 630, "LIVE SELECT", t.line, { mono: true });
        msg(s, t, b, a, 690, "live query id", t.muted);
        msg(s, t, b, a, 790, "notification, pushed", t.accent);
        msg(s, t, b, a, 870, "notification, pushed", t.accent);
        msg(s, t, a, b, 950, "query", t.line);
        para(
            s,
            ox + 40,
            1060,
            [
                "Many requests share one connection, and the",
                "server can send live query notifications",
                "without being asked. Signing in once",
                "authenticates every later request.",
            ],
            t.text,
        );

        // HTTP
        ox = panel(1, "HTTP", "http:// and https://");
        [a, b] = lifelines(ox, 990);
        const req = (y: number) => {
            s.push(rect(a - 20, y - 50, b - a + 40, 140, { fill: t.card, r: 14 }));
            msg(s, t, a, b, y, "request + credentials", t.line);
            msg(s, t, b, a, y + 60, "response", t.muted);
        };
        req(340);
        req(520);
        req(700);
        msg(s, t, a, b, 880, "LIVE SELECT", t.red, { mono: true });
        msg(s, t, b, a, 950, "refused", t.red);
        para(
            s,
            ox + 40,
            1060,
            [
                "Each request stands alone and carries its",
                "own credentials or token. A LIVE SELECT is",
                'refused with "Unable to perform the',
                'realtime query", as there is no socket to push to.',
            ],
            t.text,
        );

        // Embedded
        ox = panel(2, "Embedded", "an in-memory or SurrealKV engine");
        s.push(
            rect(ox + 40, 180, PW - 80, 800, { fill: t.bg, r: 20, stroke: t.line, dash: "10 8" }),
        );
        s.push(
            text(ox + 70, 225, "your application process", {
                size: 24,
                fill: t.muted,
                weight: 600,
                anchor: "start",
            }),
        );
        const cx = ox + PW / 2;
        box(s, t, cx - 220, 270, 440, 90, ["your app code"]);
        s.push(arrow(cx, 366, cx, 456, t.line, 4));
        s.push(text(cx + 20, 420, "function call", { size: 22, fill: t.muted, anchor: "start" }));
        box(s, t, cx - 220, 466, 440, 110, ["SurrealDB engine"], {
            kind: "accent",
            sub: "a library linked into the app",
        });
        s.push(arrow(cx - 120, 582, cx - 160, 700, t.line, 4));
        s.push(arrow(cx + 120, 582, cx + 160, 700, t.line, 4));
        box(s, t, ox + 70, 710, 300, 120, ["in memory"], {
            sub: "mem://, memory://",
        });
        box(s, t, ox + PW - 370, 710, 300, 120, ["SurrealKV"], {
            sub: "surrealkv://",
        });
        s.push(
            text(cx, 900, "no network, no server to run", {
                size: 24,
                fill: t.accent,
                weight: 700,
            }),
        );
        para(
            s,
            ox + 40,
            1060,
            [
                "The database runs inside the application",
                "that opened it. Data held in memory is",
                "gone when the process exits; SurrealKV",
                "keeps it in files.",
            ],
            t.text,
        );
        return svg(protocols, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 2. Which duration ends a session: token or session

const tokenSession: Figure = {
    name: "conn-token-session",
    width: 2400,
    height: 1200,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line, t.red, t.green])];
        const X0 = 860;
        const X1 = 2280;
        const H = (X1 - X0) / 2.2; // pixels per hour
        const X = (h: number) => X0 + h * H;

        // Time axis
        s.push(line(X0, 140, X(2.2), 140, t.grid, 3));
        for (const [h, label] of [
            [0, "sign-in"],
            [1, "1h"],
            [2, "2h"],
        ] as [number, string][]) {
            s.push(line(X(h), 130, X(h), 150, t.line, 3));
            s.push(text(X(h), 110, label, { size: 26, fill: t.muted, weight: 600 }));
        }
        s.push(line(X(1), 160, X(1), 940, t.red, 3, "10 8"));
        s.push(
            text(X(1) + 16, 196, "token expires (exp claim)", {
                size: 22,
                fill: t.red,
                weight: 600,
                anchor: "start",
            }),
        );

        const lane = (y: number, title: string, sub: string) => {
            s.push(
                text(X0 - 40, y - 6, title, { size: 28, fill: t.text, weight: 700, anchor: "end" }),
            );
            s.push(text(X0 - 40, y + 30, sub, { size: 22, fill: t.muted, anchor: "end" }));
        };
        const ok = (x: number, y: number) =>
            s.push(`<circle cx="${x}" cy="${y}" r="13" fill="${t.green}"/>`);
        const bad = (x: number, y: number) => {
            s.push(
                `<circle cx="${x}" cy="${y}" r="15" fill="${t.redBg}" stroke="${t.red}" stroke-width="3"/>`,
            );
            s.push(line(x - 7, y - 7, x + 7, y + 7, t.red, 4));
            s.push(line(x - 7, y + 7, x + 7, y - 7, t.red, 4));
        };

        // 1. WebSocket, credentials
        let y = 290;
        lane(y, "WebSocket, signin with credentials", "one session for the connection");
        s.push(rect(X0, y - 26, X(2.2) - X0, 52, { fill: t.accentSoft, r: 12 }));
        s.push(arrow(X(2.05), y, X(2.2) + 20, y, t.accent, 5));
        s.push(
            text(X0 + 20, y + 9, "session: no expiry by default (FOR SESSION NONE)", {
                size: 22,
                fill: t.text,
                weight: 600,
                anchor: "start",
            }),
        );
        for (const h of [0.3, 0.8, 1.3, 1.8]) ok(X(h), y + 62);
        s.push(
            text(X(1) + 16, y + 112, "keeps working after the token it returned has expired", {
                size: 22,
                fill: t.green,
                weight: 600,
                anchor: "start",
            }),
        );

        // 2. WebSocket, token
        y = 520;
        lane(y, "WebSocket, authenticate with a token", "one session, bound by the token");
        s.push(rect(X0, y - 26, X(1) - X0, 52, { fill: t.accentSoft, r: 12 }));
        s.push(
            text(X0 + 20, y + 9, "session ends at the token's exp", {
                size: 22,
                fill: t.text,
                weight: 600,
                anchor: "start",
            }),
        );
        for (const h of [0.3, 0.8]) ok(X(h), y + 62);
        for (const h of [1.3, 1.8]) bad(X(h), y + 62);
        s.push(
            text(X(1.3) + 30, y + 9, "The session has expired", {
                size: 22,
                fill: t.red,
                weight: 600,
                anchor: "start",
                font: MONO,
            }),
        );

        // 3. HTTP, Bearer
        y = 700;
        lane(y, "HTTP, the token on every request", "Authorization: Bearer");
        for (const h of [0.15, 0.45, 0.75]) ok(X(h), y);
        for (const h of [1.15, 1.45, 1.75, 2.05]) bad(X(h), y);
        s.push(
            text(X(1.15), y + 52, "401 once the token has expired", {
                size: 22,
                fill: t.red,
                weight: 600,
                anchor: "start",
            }),
        );
        s.push(
            text(X(0.15), y + 52, "each request is a new session", {
                size: 22,
                fill: t.muted,
                anchor: "start",
            }),
        );

        // 4. HTTP, Basic
        y = 870;
        lane(y, "HTTP, credentials on every request", "Authorization: Basic");
        for (const h of [0.15, 0.45, 0.75, 1.15, 1.45, 1.75, 2.05]) ok(X(h), y);
        s.push(
            text(X(0.15), y + 52, "each request signs in again", {
                size: 22,
                fill: t.muted,
                anchor: "start",
            }),
        );

        // Notes
        s.push(line(80, 990, 2320, 990, t.grid, 2));
        para(
            s,
            80,
            1050,
            [
                "Defaults: DURATION FOR TOKEN 1h, FOR SESSION NONE. A session duration that you set ends any of these sessions at that time,",
                "or at the token's exp if that comes first. Over HTTP, the JavaScript, Python and Go SDKs send the token from signin (third lane).",
                "The Rust, Java and .NET SDKs send a system user's username and password with every request (fourth lane), and a token for record users.",
            ],
            t.text,
            24,
            1.6,
        );
        return svg(tokenSession, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 3. What an SDK puts back after it reconnects

type ReconnectSpec = {
    name: string;
    states: { x: number; y: number; label: string; kind?: Kind }[];
    edges: {
        from: number;
        to: number;
        label: string;
        colour: "line" | "red" | "accent";
        bend?: number;
        labelDx?: number;
        labelDy?: number;
    }[];
    restored: string[][];
    notRestored: string[][];
    note: string[];
};

function reconnectFigure(spec: ReconnectSpec): Figure {
    const f: Figure = {
        name: spec.name,
        width: 2400,
        height: 1240,
        draw(t: Theme) {
            const s: string[] = [markers([t.accent, t.line, t.red])];
            const W = 300;
            const Hh = 84;
            s.push(rect(30, 30, 2340, 400, { fill: t.panel, r: 28 }));
            s.push(
                text(70, 92, "Connection states", {
                    size: 32,
                    fill: t.text,
                    weight: 700,
                    anchor: "start",
                }),
            );
            for (const e of spec.edges) {
                const a = spec.states[e.from];
                const b = spec.states[e.to];
                const colour =
                    e.colour === "red" ? t.red : e.colour === "accent" ? t.accent : t.line;
                const ax = a.x + (b.x > a.x ? W / 2 + 6 : b.x < a.x ? -W / 2 - 6 : 0);
                const bx = b.x + (b.x > a.x ? -W / 2 - 12 : b.x < a.x ? W / 2 + 12 : 0);
                if (e.bend) {
                    const ay = a.y + (e.bend < 0 ? -Hh / 2 - 4 : Hh / 2 + 4);
                    const by = b.y + (e.bend < 0 ? -Hh / 2 - 12 : Hh / 2 + 12);
                    const mx = (a.x + b.x) / 2;
                    const my = (a.y + b.y) / 2 + e.bend;
                    s.push(
                        `<path d="M${a.x},${ay} Q${mx},${my} ${b.x},${by}" fill="none" stroke="${colour}" stroke-width="4" marker-end="url(#ah-${colour.replace(/[^a-z0-9]/gi, "")})"/>`,
                    );
                    s.push(
                        text(
                            mx + (e.labelDx ?? 0),
                            (ay + my) / 2 + (e.bend < 0 ? -6 : 22) + (e.labelDy ?? 0),
                            e.label,
                            {
                                size: 22,
                                fill: colour === t.line ? t.muted : colour,
                                weight: 600,
                                halo: t.panel,
                            },
                        ),
                    );
                } else {
                    s.push(arrow(ax, a.y, bx, b.y, colour, 4));
                    s.push(
                        text(
                            (ax + bx) / 2 + (e.labelDx ?? 0),
                            a.y - 18 + (e.labelDy ?? 0),
                            e.label,
                            {
                                size: 22,
                                fill: colour === t.line ? t.muted : colour,
                                weight: 600,
                                halo: t.panel,
                            },
                        ),
                    );
                }
            }
            for (const st of spec.states) {
                box(s, t, st.x - W / 2, st.y - Hh / 2, W, Hh, [st.label], {
                    mono: true,
                    kind: st.kind ?? "plain",
                    size: 28,
                });
            }

            const column = (x: number, title: string, items: string[][], good: boolean) => {
                s.push(rect(x, 460, 1160, 600, { fill: good ? t.greenBg : t.redBg, r: 28 }));
                s.push(
                    text(x + 40, 522, title, {
                        size: 32,
                        fill: good ? t.green : t.red,
                        weight: 700,
                        anchor: "start",
                    }),
                );
                let y = 590;
                items.forEach((lines, i) => {
                    s.push(
                        text(x + 40, y, good ? `${i + 1}` : "x", {
                            size: 26,
                            fill: good ? t.green : t.red,
                            weight: 800,
                            anchor: "start",
                        }),
                    );
                    lines.forEach((l, j) => {
                        s.push(
                            text(x + 84, y + j * 36, l, {
                                size: j ? 22 : 26,
                                fill: j ? t.muted : t.text,
                                weight: j ? 500 : 600,
                                anchor: "start",
                            }),
                        );
                    });
                    y += 36 * lines.length + 40;
                });
            };
            column(30, "Restored, in this order", spec.restored, true);
            column(1210, "Not restored", spec.notRestored, false);
            para(s, 70, 1120, spec.note, t.muted, 24, 1.5);
            return svg(f, t, s.join(""));
        },
    };
    return f;
}

const reconnectJs = reconnectFigure({
    name: "conn-reconnect-js",
    states: [
        { x: 280, y: 240, label: "connecting" },
        { x: 900, y: 240, label: "connected", kind: "good" },
        { x: 1520, y: 240, label: "reconnecting", kind: "accent" },
        { x: 2140, y: 240, label: "disconnected", kind: "bad" },
    ],
    edges: [
        { from: 0, to: 1, label: "socket open" },
        { from: 1, to: 2, label: "socket drops" },
        { from: 2, to: 3, label: "attempts used up", colour: "red" as const },
        {
            from: 2,
            to: 1,
            label: "new socket, sessions restored",
            colour: "accent" as const,
            bend: 150,
        },
    ].map((e) => ({ colour: "line" as const, ...e })),
    restored: [
        ["Namespace and database", "from connect() or use()"],
        ["Variables", "set with set() on each session"],
        [
            "Authentication",
            "the token if it is still valid, then the refresh token,",
            "then connect() authentication, unless signin() replaced it",
        ],
        ["Live queries started with live()", "started again; the subscription keeps working"],
    ],
    notRestored: [
        [
            "A LIVE SELECT run with query()",
            "liveOf() stops receiving; start it again on the connected event",
        ],
        [
            "Authentication with nothing left to use",
            "the token expired and there is no refresh token or",
            "connect() authentication: the session is signed out",
        ],
        ["A query streaming when the socket dropped", "fails, and is not sent again"],
    ],
    note: [
        "Each session made with newSession() or forkSession() is restored the same way. Reconnecting is on by default with 5 attempts;",
        "the reconnect option of connect() changes both.",
    ],
});

const reconnectGo = reconnectFigure({
    name: "conn-reconnect-go",
    states: [
        { x: 280, y: 240, label: "Disconnected" },
        { x: 900, y: 240, label: "Connecting", kind: "accent" },
        { x: 1520, y: 240, label: "Connected", kind: "good" },
        { x: 2140, y: 240, label: "Closing → Closed" },
    ],
    edges: [
        { from: 0, to: 1, label: "Connect()", colour: "line" },
        { from: 1, to: 2, label: "socket open", colour: "line" },
        { from: 2, to: 3, label: "Close()", colour: "line" },
        {
            from: 2,
            to: 1,
            label: "closed socket found at the next CheckInterval: session restored",
            colour: "accent",
            bend: 150,
        },
        {
            from: 1,
            to: 0,
            label: "attempt failed: try again at the next check",
            colour: "red",
            bend: -130,
            labelDy: -6,
        },
    ],
    restored: [
        ["Namespace and database", "the last Use()"],
        [
            "Authentication",
            "the last token from SignIn, SignUp or Authenticate; if it is",
            "refused, the refresh token from SignInWithRefresh",
        ],
        ["Variables", "every Let() not removed with Unset()"],
        [
            "Live queries",
            "from Live(), and from Query() when the query starts with",
            "LIVE SELECT; notifications keep their original IDs",
        ],
    ],
    notRestored: [
        [
            "Authentication with an expired token",
            "and no refresh token: the reconnect fails, and is tried",
            "again at the next check",
        ],
        [
            "A LIVE SELECT that is not the start of the query",
            "for example after a LET in the same Query() call",
        ],
    ],
    note: [
        "This is the contrib/rews package. A plain connection from FromEndpointURLString does not reconnect. Without a Retryer, each",
        "check makes one connection attempt; with one, the attempt is retried with its delays.",
    ],
});

// ---------------------------------------------------------------------------
// 4. A value over CBOR and over JSON

const valueRoundTrip: Figure = {
    name: "conn-value-roundtrip",
    width: 2400,
    height: 1190,
    draw(t: Theme) {
        const s: string[] = [markers([t.line])];
        const cols = [
            { x: 40, w: 600, title: "SurrealQL value" },
            { x: 680, w: 560, title: "CBOR, as the SDKs use it" },
            { x: 1280, w: 400, title: "JavaScript SDK" },
            { x: 1720, w: 640, title: "JSON from HTTP /sql" },
        ];
        s.push(
            rect(cols[1].x - 20, 40, cols[2].x + cols[2].w - cols[1].x + 20, 980, {
                fill: t.panel,
                r: 28,
            }),
        );
        s.push(rect(cols[3].x - 20, 40, cols[3].w + 40, 980, { fill: t.redBg, r: 28 }));
        cols.forEach((c) => {
            s.push(
                text(c.x + 20, 104, c.title, {
                    size: 30,
                    fill: t.text,
                    weight: 700,
                    anchor: "start",
                }),
            );
        });
        const rows: [string, string, string, string, boolean, string?][] = [
            [
                "person:tobie",
                "tag 8 ['person', 'tobie']",
                "RecordId",
                '"person:tobie"',
                true,
                "a string, like any other",
            ],
            ["19.99dec", "tag 10 '19.99'", "Decimal", '"19.99"', true, "a string"],
            [
                "d'2026-11-02T09:15:30.123456789Z'",
                "tag 12 [1793610930, 123456789]",
                "DateTime",
                '"2026-11-02T09:15:30.123456789Z"',
                true,
                "a string; new Date() keeps milliseconds only",
            ],
            ["1h30m", "tag 14 [5400]", "Duration", '"1h30m"', true, "a string"],
            [
                "u'0192d1f2-…-2f1a3b4c5d6e'",
                "tag 37, 16 bytes",
                "Uuid",
                '"0192d1f2-…-2f1a3b4c5d6e"',
                true,
                "a string",
            ],
            ["<set>[1, 2]", "tag 56 [1, 2]", "Set", "[1, 2]", true, "an array"],
            ["NONE", "tag 6 null", "undefined", "null", true, "the same as NULL"],
            ["NULL", "null", "null", "null", false],
        ];
        rows.forEach(([v, cbor, js, json, lost, why], i) => {
            const y = 190 + i * 112;
            if (i) s.push(line(40, y - 52, 2360, y - 52, t.grid, 1.5));
            s.push(
                text(cols[0].x + 20, y + 9, v, {
                    size: 24,
                    fill: t.text,
                    weight: 600,
                    font: MONO,
                    anchor: "start",
                }),
            );
            s.push(
                text(cols[1].x + 20, y + 9, cbor, {
                    size: 24,
                    fill: t.accent,
                    weight: 600,
                    font: MONO,
                    anchor: "start",
                }),
            );
            s.push(
                text(cols[2].x + 20, y + 9, js, {
                    size: 26,
                    fill: t.text,
                    weight: 700,
                    font: MONO,
                    anchor: "start",
                }),
            );
            s.push(
                text(cols[3].x + 20, y + (why ? -4 : 9), json, {
                    size: 24,
                    fill: t.text,
                    weight: 600,
                    font: MONO,
                    anchor: "start",
                }),
            );
            if (why)
                s.push(
                    text(cols[3].x + 20, y + 30, why, {
                        size: 21,
                        fill: lost ? t.red : t.muted,
                        weight: 600,
                        anchor: "start",
                    }),
                );
        });
        para(
            s,
            60,
            1090,
            [
                "Each CBOR tag names the type, so the SDK can build the matching class and send it back unchanged. JSON has only strings, numbers, arrays,",
                "objects and null, so the server writes these values as strings or arrays and the type is no longer part of the value.",
            ],
            t.muted,
            24,
            1.5,
        );
        return svg(valueRoundTrip, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 5. A token from an identity provider, checked by SurrealDB

const jwtIdp: Figure = {
    name: "conn-jwt-idp",
    width: 2400,
    height: 1340,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line, t.red, t.muted])];
        // Sequence on the left
        s.push(rect(30, 30, 1180, 1280, { fill: t.panel, r: 28 }));
        const L = { user: 170, idp: 510, app: 850, db: 1110 };
        box(s, t, L.user - 120, 70, 240, 76, ["user"]);
        box(s, t, L.idp - 150, 70, 300, 76, ["identity provider"], { size: 24 });
        box(s, t, L.app - 120, 70, 240, 76, ["your app"]);
        box(s, t, L.db - 90, 70, 180, 76, ["SurrealDB"], { kind: "accent", size: 24 });
        for (const x of Object.values(L)) s.push(line(x, 146, x, 1270, t.grid, 3, "6 8"));
        msg(s, t, L.user, L.idp, 230, "signs in", t.line);
        msg(s, t, L.idp, L.app, 330, "signed JWT", t.line);
        s.push(rect(L.app - 250, 360, 500, 196, { fill: t.bg, r: 14, stroke: t.line }));
        para(
            s,
            L.app - 226,
            400,
            [
                '"ns": "main", "db": "main",',
                '"ac": "auth0",',
                '"email": "ana@example.com",',
                '"aud": [...], "exp": ...',
            ],
            t.text,
            22,
            1.45,
            MONO,
        );
        s.push(
            text(L.app, 590, "claims added by an Auth0 action", {
                size: 21,
                fill: t.muted,
                halo: t.panel,
            }),
        );
        s.push(
            text(L.app, 618, "or a Cognito pre-token lambda", {
                size: 21,
                fill: t.muted,
                halo: t.panel,
            }),
        );
        msg(s, t, L.app, L.db, 700, "token", t.line);
        s.push(text((L.app + L.db) / 2, 740, "authenticate() or", { size: 20, fill: t.muted }));
        s.push(text((L.app + L.db) / 2, 766, "Bearer header", { size: 20, fill: t.muted }));
        s.push(
            text((L.app + L.db) / 2, 830, "steps 1 to 4", {
                size: 22,
                fill: t.accent,
                weight: 700,
                halo: t.panel,
            }),
        );
        s.push(
            text((L.app + L.db) / 2, 1130, "step 5", {
                size: 22,
                fill: t.accent,
                weight: 700,
                halo: t.panel,
            }),
        );
        msg(s, t, L.app, L.db, 1000, "SELECT * FROM user", t.line, { mono: true, size: 21 });
        msg(s, t, L.db, L.app, 1090, "[user:ana] only", t.accent, { mono: true, size: 21 });
        msg(s, t, L.db, L.app, 1210, "401", t.red);
        s.push(text((L.app + L.db) / 2, 1250, "if any check fails", { size: 20, fill: t.red }));

        // Steps inside SurrealDB on the right
        s.push(rect(1240, 30, 1130, 1280, { fill: t.panel, r: 28 }));
        s.push(
            text(1280, 96, "Inside SurrealDB", {
                size: 32,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );
        const steps: [string, string[], string][] = [
            [
                "Find the access method",
                ["ns, db and ac name it:", "DEFINE ACCESS auth0 ON DATABASE"],
                "no such method",
            ],
            [
                "Verify the signature",
                [
                    "with its KEY, or the keys published at",
                    "WITH JWT URL (a JWKS); check exp and nbf",
                ],
                "bad signature or expired",
            ],
            [
                "Run AUTHENTICATE",
                ["check $token.aud and other claims;", "RETURN the user record, or THROW"],
                "THROW, or no record",
            ],
            [
                "Start the session",
                ["$token = the claims, $access = 'auth0',", "$auth = user:ana"],
                "",
            ],
            [
                "Apply table PERMISSIONS",
                ["on every query: WHERE $access = 'auth0'", "AND id = $auth"],
                "",
            ],
        ];
        steps.forEach(([title, lines, fail], i) => {
            const y = 140 + i * 228;
            s.push(
                rect(1280, y, 720, 180, {
                    fill: i === 4 ? t.accentBg : t.card,
                    stroke: i === 4 ? t.accent : undefined,
                    r: 16,
                }),
            );
            s.push(
                text(1310, y + 50, `${i + 1}. ${title}`, {
                    size: 28,
                    fill: t.text,
                    weight: 700,
                    anchor: "start",
                }),
            );
            lines.forEach((l, j) =>
                s.push(
                    text(1310, y + 100 + j * 36, l, {
                        size: 23,
                        fill: t.text,
                        anchor: "start",
                        font: j || i ? MONO : SANS,
                    }),
                ),
            );
            if (i < steps.length - 1) s.push(arrow(1640, y + 184, 1640, y + 222, t.line, 4));
            if (fail) {
                s.push(arrow(2004, y + 90, 2060, y + 90, t.red, 4));
                s.push(
                    text(2070, y + 82, "refused:", {
                        size: 22,
                        fill: t.red,
                        weight: 700,
                        anchor: "start",
                    }),
                );
                const words = fail.split(" ");
                const half = Math.ceil(words.length / 2);
                const l1 = words.length > 3 ? words.slice(0, half).join(" ") : fail;
                const l2 = words.length > 3 ? words.slice(half).join(" ") : "";
                s.push(text(2070, y + 112, l1, { size: 22, fill: t.red, anchor: "start" }));
                if (l2) s.push(text(2070, y + 140, l2, { size: 22, fill: t.red, anchor: "start" }));
            }
        });
        return svg(jwtIdp, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 6. An agent calling a SurrealDB retrieval tool

const agentRetrieval: Figure = {
    name: "conn-agent-retrieval",
    width: 2400,
    height: 1000,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line, t.muted])];
        box(s, t, 60, 160, 240, 150, ["user"], { size: 30 });
        box(s, t, 480, 160, 380, 150, ["model"], { size: 30, sub: "the agent's LLM" });
        s.push(rect(1140, 40, 1220, 540, { fill: t.panel, r: 28 }));
        s.push(
            text(1180, 100, "retrieval tool, your code", {
                size: 30,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );
        box(s, t, 1180, 140, 600, 120, ["1. embed the search text"], {
            sub: "with the model that embedded the stored records",
            size: 26,
        });
        box(s, t, 1180, 380, 600, 140, ["2. KNN query"], {
            sub: "nearest records by their embedding",
            size: 26,
        });
        box(s, t, 1920, 340, 400, 220, ["SurrealDB"], {
            kind: "accent",
            size: 30,
            sub: "HNSW index",
        });
        s.push(arrow(1480, 266, 1480, 374, t.line, 4));
        s.push(text(1500, 328, "vector", { size: 22, fill: t.muted, anchor: "start" }));
        s.push(arrow(1786, 425, 1914, 425, t.line, 4));
        s.push(arrow(1914, 485, 1786, 485, t.accent, 4));
        s.push(text(1850, 408, "$vector", { size: 21, fill: t.muted, font: MONO }));
        s.push(text(1850, 523, "records", { size: 21, fill: t.accent, weight: 600 }));

        s.push(arrow(306, 205, 474, 205, t.line, 4));
        s.push(text(390, 185, "question", { size: 22, fill: t.muted }));
        s.push(arrow(474, 265, 306, 265, t.accent, 4));
        s.push(text(390, 301, "answer", { size: 22, fill: t.accent, weight: 600 }));

        s.push(arrow(866, 200, 1134, 200, t.line, 4));
        s.push(text(1000, 178, "tool call", { size: 22, fill: t.muted }));
        s.push(text(1000, 234, "retrieve(search text)", { size: 19, fill: t.muted, font: MONO }));
        s.push(arrow(1134, 280, 866, 280, t.accent, 4));
        s.push(text(1000, 316, "records as text", { size: 22, fill: t.accent, weight: 600 }));

        // The model can go round again
        s.push(
            `<path d="M560,316 C520,450 820,450 780,316" fill="none" stroke="${t.muted}" stroke-width="3" stroke-dasharray="8 8" marker-end="url(#ah-${t.muted.replace(/[^a-z0-9]/gi, "")})"/>`,
        );
        s.push(text(670, 480, "can call the tool again", { size: 22, fill: t.muted }));
        s.push(text(670, 510, "before it answers", { size: 22, fill: t.muted }));

        // The query from the Pydantic AI example
        s.push(rect(60, 620, 2300, 210, { fill: t.panel, r: 24 }));
        s.push(
            text(100, 674, "The query inside the tool, from the Pydantic AI example:", {
                size: 24,
                fill: t.muted,
                anchor: "start",
            }),
        );
        para(
            s,
            100,
            728,
            [
                "SELECT url, title, content, vector::distance::knn() AS dist",
                "FROM doc_sections WHERE embedding <|8, 40|> $vector ORDER BY dist ASC",
            ],
            t.text,
            28,
            1.5,
            MONO,
        );
        para(
            s,
            60,
            900,
            [
                "The model decides when to search and with what text. The tool turns that text into a vector, SurrealDB returns the 8 nearest records",
                "from its HNSW index (40 is the size of the search's candidate list), and the model writes its answer from them.",
            ],
            t.muted,
            24,
            1.5,
        );
        return svg(agentRetrieval, t, s.join(""));
    },
};

export default [
    protocols,
    tokenSession,
    reconnectJs,
    reconnectGo,
    valueRoundTrip,
    jwtIdp,
    agentRetrieval,
];
