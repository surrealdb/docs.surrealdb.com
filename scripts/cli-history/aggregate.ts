// biome-ignore-all lint/correctness/noUnusedFunctionParameters: ported unchanged from the script that built data.json, which generate.ts reproduces exactly
// biome-ignore-all lint/style/noNonNullAssertion: ported unchanged from the script that built data.json, which generate.ts reproduces exactly
// biome-ignore-all lint/style/useTemplate: ported unchanged from the script that built data.json, which generate.ts reproduces exactly
// biome-ignore-all lint/suspicious/noExplicitAny: ported unchanged from the script that built data.json, which generate.ts reproduces exactly
// Turns per-tag snapshots into one history file: first/last tag, default changes, gaps, counts.
type Item = {
    global?: boolean;
    kind: "env" | "flag" | "arg";
    name: string;
    default?: string | null;
    help?: string | null;
    sources?: string[];
    flag?: string[];
    env?: string;
    short?: string;
    hidden?: boolean;
    file?: string;
};
type Snap = {
    tag: string;
    date: string;
    items: Record<string, Item>;
    looseEnvNames: string[];
    warnings: string[];
};
const snaps: Snap[] = await Bun.file("snapshots.json").json();
// A subcommand flag counts as present while the same long name is a global flag of the top-level command.
const globalLongs = snaps.map(
    (x) =>
        new Set(
            Object.values(x.items)
                .filter((i: any) => i.global)
                .map((i) => i.name.split(" ").pop()!),
        ),
);
const at = (i: number, k: string): Item | undefined => {
    const own = snaps[i].items[k];
    if (own) return own;
    const last = k.split(" ").pop()!;
    return k !== "surreal " + last && last.startsWith("--") && globalLongs[i].has(last)
        ? snaps[i].items["surreal " + last]
        : undefined;
};
const semverKey = (tag: string) => {
    const m = /^v(\d+)\.(\d+)\.(\d+)(?:-(alpha|beta|rc)\.(\d+))?$/.exec(tag)!;
    return [
        +m[1],
        +m[2],
        +m[3],
        m[4] ? { alpha: 0, beta: 1, rc: 2 }[m[4] as "alpha"] : 9,
        m[5] ? +m[5] : 0,
    ];
};
const cmpKey = (a: number[], b: number[]) => {
    for (let i = 0; i < 5; i++) if (a[i] !== b[i]) return a[i] - b[i];
    return 0;
};
// "Leading edge": walking releases by date, a tag is mainline when its version is the highest seen so far.
// Everything else (1.5.x after 2.0 alphas, 2.1.5-2.1.9, 2.4-2.7 after 3.0 alphas) is a maintenance release.
const dateOrder = snaps
    .map((s, i) => i)
    .sort(
        (a, b) =>
            snaps[a].date.localeCompare(snaps[b].date) ||
            cmpKey(semverKey(snaps[a].tag), semverKey(snaps[b].tag)),
    );
const mainline = new Set<number>();
let maxKey: number[] | null = null;
for (const i of dateOrder) {
    if (!(snaps[i] as any).published) continue; // tags with no GitHub release (v1.1.2, v1.4.1) never lead
    const k = semverKey(snaps[i].tag);
    if (!maxKey || cmpKey(k, maxKey) > 0) {
        mainline.add(i);
        maxKey = k;
    }
}
const tags = snaps.map((s, i) => ({
    i,
    tag: s.tag,
    date: s.date,
    published: (s as any).published ?? null,
    released: !!(s as any).published,
    line: mainline.has(i) ? "mainline" : "maintenance",
}));
const mainIdx = [...mainline].sort((a, b) => a - b);
const keys = new Set<string>();
for (const s of snaps) for (const k of Object.keys(s.items)) keys.add(k);

const groupOf = (it: Item) => {
    if (it.kind !== "env") return it.name.replace(/ (<[^>]+>|--?[\w-]+)$/, "");
    if (!it.name.startsWith("SURREAL_")) return "(unprefixed, early builds)";
    return it.name.slice(8).split("_")[0];
};

const items: any[] = [];
for (const k of keys) {
    const present: number[] = [];
    const defaults: (string | null | undefined)[] = [];
    let last: Item | undefined;
    snaps.forEach((s, i) => {
        const it = at(i, k);
        if (it) {
            present.push(i);
            defaults[i] = it.default ?? null;
            last = snaps[i].items[k] ?? last ?? it;
        }
    });
    const toRanges = (arr: number[]) => {
        const out: [number, number][] = [];
        for (const i of arr) {
            const r = out[out.length - 1];
            if (r && r[1] === i - 1) r[1] = i;
            else out.push([i, i]);
        }
        return out;
    };
    const allRanges = toRanges(present);
    // Everything below follows the leading edge only, so a backport cannot look like a removal.
    const presentMain = present.filter((i) => mainline.has(i));
    const basis = presentMain.length ? presentMain : present;
    const ranges: [number, number][] = [];
    {
        // ranges are expressed in positions along the mainline list, then mapped back to tag indices
        const pos = basis.map((i) => mainIdx.indexOf(i)).filter((x) => x >= 0);
        let cur: [number, number] | null = null;
        for (const p of pos) {
            if (cur && cur[1] === p - 1) cur[1] = p;
            else {
                cur = [p, p];
                ranges.push(cur);
            }
        }
        ranges.forEach((r) => {
            r[0] = mainIdx[r[0]];
            r[1] = mainIdx[r[1]];
        });
    }
    const gaps = ranges.slice(1).map((r, n) => ({
        lastBefore: tags[ranges[n][1]].tag,
        returnedIn: tags[r[0]].tag,
        absentReleases: mainIdx.indexOf(r[0]) - mainIdx.indexOf(ranges[n][1]) - 1,
    }));
    const changes: { tag: string; from: string | null; to: string | null }[] = [];
    let prev: string | null | undefined;
    let first = true;
    for (const i of basis) {
        const d = defaults[i] ?? null;
        if (!first && d !== prev) changes.push({ tag: tags[i].tag, from: prev ?? null, to: d });
        prev = d;
        first = false;
    }
    const defaultRuns: [number, string | null][] = [];
    for (const i of present) {
        const d = defaults[i] ?? null;
        if (!defaultRuns.length || defaultRuns[defaultRuns.length - 1][1] !== d)
            defaultRuns.push([i, d]);
    }
    const helpRuns: [number, string | null][] = [];
    for (const i of present) {
        const h = at(i, k)!.help ?? null;
        if (!helpRuns.length || helpRuns[helpRuns.length - 1][1] !== h) helpRuns.push([i, h]);
    }
    const helpChanges: { tag: string; from: string | null; to: string | null }[] = [];
    {
        let ph: string | null | undefined,
            f = true;
        for (const i of basis) {
            const h = at(i, k)!.help ?? null;
            if (!f && h !== ph) helpChanges.push({ tag: tags[i].tag, from: ph ?? null, to: h });
            ph = h;
            f = false;
        }
    }
    const firstIdx = basis[0],
        lastIdx = basis[basis.length - 1];
    const lastMainIdx = mainIdx[mainIdx.length - 1];
    const allSources = new Set<string>();
    for (const s of snaps) for (const x of s.items[k]?.sources ?? []) allSources.add(x);
    const allFlags = new Set<string>();
    for (const s of snaps) for (const x of s.items[k]?.flag ?? []) allFlags.add(x);
    items.push({
        key: k,
        kind: last!.kind,
        group: groupOf(last!),
        first: tags[firstIdx].tag,
        firstIndex: firstIdx,
        last: tags[lastIdx].tag,
        lastIndex: lastIdx,
        present: ranges.length > 0 && ranges[ranges.length - 1][1] === lastMainIdx,
        firstAny: tags[present[0]].tag,
        lastAny: tags[present[present.length - 1]].tag,
        ranges,
        allRanges,
        defaultRuns,
        helpRuns,
        helpChanges,
        gaps,
        defaultChanges: changes,
        defaultFirst: defaults[firstIdx] ?? null,
        defaultLatest: defaults[lastIdx] ?? null,
        sources: [...allSources].sort(),
        flags: [...allFlags],
        env: last!.env,
        short: last!.short,
        hidden: last!.hidden,
        file: last!.file,
        global: last!.global || undefined,
    });
}
items.sort(
    (a, b) =>
        a.kind.localeCompare(b.kind) || a.firstIndex - b.firstIndex || a.key.localeCompare(b.key),
);

// counts and churn per tag
const counts = snaps.map((s, i) => {
    const v = Object.values(s.items);
    const mi = mainIdx.indexOf(i);
    const prev = mi > 0 ? snaps[mainIdx[mi - 1]] : null;
    const pi = mi > 0 ? mainIdx[mi - 1] : -1;
    const added = prev ? Object.keys(s.items).filter((k) => !prev.items[k] && !at(pi, k)) : [];
    const removed = prev ? Object.keys(prev.items).filter((k) => !at(i, k)) : [];
    return {
        tag: s.tag,
        date: s.date,
        env: v.filter((x) => x.kind === "env").length,
        envLiteral: v.filter(
            (x) => x.kind === "env" && !(x.sources?.length === 1 && x.sources[0] === "config"),
        ).length,
        envPrefixed: v.filter((x) => x.kind === "env" && x.name.startsWith("SURREAL_")).length,
        flag: v.filter((x) => x.kind === "flag").length,
        arg: v.filter((x) => x.kind === "arg").length,
        looseSurrealNames: s.looseEnvNames.length,
        line: tags[i].line,
        added: prev ? added.length : null,
        removed: prev ? removed.length : null,
    };
});

await Bun.write(
    "history.json",
    JSON.stringify({
        note: "Tags are ordered by version. line=mainline marks the leading edge of releases; item ranges, gaps and default changes follow it. allRanges follow every tag.",
        generated: new Date().toISOString().slice(0, 10),
        tags,
        counts,
        items,
    }),
);
console.log(
    "items",
    items.length,
    "gapped",
    items.filter((i) => i.gaps.length).length,
    "with default changes",
    items.filter((i) => i.defaultChanges.length).length,
);

// report helpers
const byName = (x: any) => x.key;
const top = (arr: any[], f: (x: any) => number, n = 12) =>
    arr
        .filter((x) => f(x) > 0)
        .sort((a, b) => f(b) - f(a))
        .slice(0, n)
        .map((x) => `${byName(x)} (${f(x)})`)
        .join(", ");
console.log(
    "\nMost removals+readds (gaps):",
    top(items, (x) => x.gaps.length),
);
console.log(
    "Most default changes:",
    top(
        items.filter((x) => x.kind === "env"),
        (x) => x.defaultChanges.length,
    ),
);
console.log(
    "\nBiggest adds:",
    [...counts]
        .filter((c) => c.added !== null)
        .sort((a, b) => b.added! - a.added!)
        .slice(0, 8)
        .map((c) => `${c.tag} +${c.added}`)
        .join(", "),
);
console.log(
    "Biggest removals:",
    [...counts]
        .filter((c) => c.removed !== null)
        .sort((a, b) => b.removed! - a.removed!)
        .slice(0, 8)
        .map((c) => `${c.tag} -${c.removed}`)
        .join(", "),
);
const gone = items.filter((x) => !x.present);
console.log(
    "\nenv ever:",
    items.filter((x) => x.kind === "env").length,
    "flags ever:",
    items.filter((x) => x.kind !== "env").length,
    "no longer present:",
    gone.length,
);
for (const t of ["v1.0.0", "v2.0.0", "v3.0.0", "v3.3.0"]) {
    const c = counts.find((x) => x.tag === t)!;
    console.log(t, JSON.stringify(c));
}
// unreliable-tag heuristics: large single-step swings between consecutive leading-edge releases
console.log(
    "maintenance tags:",
    tags.filter((t) => t.line === "maintenance").length,
    "mainline:",
    mainIdx.length,
);
mainIdx.forEach((ti, n) => {
    if (!n) return;
    const c = counts[ti],
        p = counts[mainIdx[n - 1]];
    if (Math.abs(c.env - p.env) > 25 || Math.abs(c.flag - p.flag) > 15)
        console.log(
            "  swing",
            p.tag,
            "->",
            c.tag,
            `env ${p.env}->${c.env} flag ${p.flag}->${c.flag}`,
        );
});

// ---- public-data.json: compact, for shipping in a web page
const trunc = (v: string | null, n: number) =>
    v == null ? null : v.length > n ? v.slice(0, n - 3) + "..." : v;
const pub = {
    generated: new Date().toISOString().slice(0, 10),
    note: "Tags are in version order. Item ranges are [first, last] tag indices, inclusive, over all tags; a subcommand flag counts as present while the same long name is a global flag of the top-level command. Defaults are runs of [tag index, source text or null]; help is the text at the latest tag that has the item.",
    tags: tags.map((t) => ({
        name: t.tag,
        date: t.date,
        line: t.line,
        pre: /-(alpha|beta|rc)\./.test(t.tag),
        released: t.released,
    })),
    items: items.map((it) => {
        const flagKind =
            it.kind === "env"
                ? it.sources.length === 1 && it.sources[0] === "config"
                    ? "config"
                    : "env"
                : it.kind;
        const cmd = it.kind === "env" ? null : it.key.replace(/ (<[^>]+>|--?[\w-]+)$/, "");
        const o: any = { key: it.key, kind: flagKind, ranges: it.allRanges };
        if (cmd) o.command = cmd;
        if (it.global) o.global = true;
        if (it.hidden) o.hidden = true;
        if (it.kind === "env") {
            if (it.flags.length) o.flags = it.flags;
        } else if (it.env) o.env = it.env;
        const defs = it.defaultRuns.map((r: any) => [r[0], trunc(r[1], 120)]);
        if (defs.some((d: any) => d[1] !== null)) o.defaults = defs;
        const lastHelp = it.helpRuns[it.helpRuns.length - 1][1];
        if (lastHelp) o.help = trunc(lastHelp, 400);
        return o;
    }),
};
await Bun.write("public-data.json", JSON.stringify(pub));
console.log("public-data.json", (JSON.stringify(pub).length / 1024).toFixed(0) + " KB");
