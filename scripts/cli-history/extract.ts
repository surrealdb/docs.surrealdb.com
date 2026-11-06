// biome-ignore-all lint/complexity/useOptionalChain: ported unchanged from the script that built data.json, which generate.ts reproduces exactly
// biome-ignore-all lint/correctness/noEmptyCharacterClassInRegex: ported unchanged from the script that built data.json, which generate.ts reproduces exactly
// biome-ignore-all lint/correctness/noUnusedImports: ported unchanged from the script that built data.json, which generate.ts reproduces exactly
// biome-ignore-all lint/style/noNonNullAssertion: ported unchanged from the script that built data.json, which generate.ts reproduces exactly
// biome-ignore-all lint/style/useNodejsImportProtocol: ported unchanged from the script that built data.json, which generate.ts reproduces exactly
// biome-ignore-all lint/style/useTemplate: ported unchanged from the script that built data.json, which generate.ts reproduces exactly
// biome-ignore-all lint/suspicious/noAssignInExpressions: ported unchanged from the script that built data.json, which generate.ts reproduces exactly
// biome-ignore-all lint/suspicious/noExplicitAny: ported unchanged from the script that built data.json, which generate.ts reproduces exactly
// Extracts SURREAL_* env vars and `surreal` CLI flags per release tag from a clone of
// surrealdb/surrealdb (~/surrealdb, or SURREALDB_REPO). Run through generate.ts.
// Reads only via `git ls-tree` / `git grep` / `git cat-file`; never checks out anything.
import { $ } from "bun";
import { homedir } from "os";

const REPO = process.env.SURREALDB_REPO ?? `${homedir()}/surrealdb`;
const git = async (...args: string[]) =>
    await Bun.spawn(["git", "-C", REPO, ...args], { stdout: "pipe", stderr: "pipe" }).stdout.text();

// ---------------------------------------------------------------- tags
const TAG_RE = /^v([1-9])\.(\d+)\.(\d+)(?:-(alpha|beta|rc)\.(\d+))?$/;
const PRE_RANK: Record<string, number> = { alpha: 0, beta: 1, rc: 2 };
const releases: Record<string, string> = Object.fromEntries(
    (await Bun.file("releases.json").json()).map((r: any) => [r.tagName, r.publishedAt]),
);
const rawTags = (await git("tag", "--format=%(refname:short)|%(creatordate:short)"))
    .trim()
    .split("\n");
type Tag = { tag: string; date: string; published: string | null; key: number[] };
const tags: Tag[] = [];
for (const line of rawTags) {
    const [tag, date] = line.split("|");
    const m = TAG_RE.exec(tag);
    if (!m) continue;
    const pre = m[4] ? PRE_RANK[m[4]] : 9;
    tags.push({
        tag,
        date: releases[tag] ? releases[tag].slice(0, 10) : date,
        published: releases[tag] ?? null,
        key: [+m[1], +m[2], +m[3], pre, m[5] ? +m[5] : 0],
    });
}
tags.sort((a, b) => {
    for (let i = 0; i < 5; i++) if (a.key[i] !== b.key[i]) return a.key[i] - b.key[i];
    return 0;
});

// ---------------------------------------------------------------- source helpers
const EXCLUDED_PATH =
    /(^|\/)(tests?|benches|examples|fuzz|language-tests|test-helpers|testing)(\/|$)|_tests?\.rs$|\/tests?\.rs$/;
const ws = (s: string) => s.replace(/\s+/g, " ").trim();

function stripComments(src: string, keepDocs = false): string {
    // Doc comments become `#[doc_line = "..."]` pseudo-attributes so field and static docs survive the strip.
    if (keepDocs)
        src = src.replace(
            /^[ \t]*\/\/\/(?!\/)[ \t]?(.*)$/gm,
            (_m, t: string) => `#[doc_line = "${t.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"]`,
        );
    // Block comments, then line comments not preceded by ':' (keeps URLs in strings).
    return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'\\])\/\/[^\n]*/g, "$1");
}

/** Remove `#[cfg(test)] mod x { ... }` blocks. */
function stripTestModules(src: string): string {
    const re = /#\[cfg\(test\)\]\s*(?:pub\s+)?mod\s+\w+\s*\{/g;
    let out = "";
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) {
        const open = m.index + m[0].length - 1;
        const close = matchClose(src, open);
        out += src.slice(last, m.index);
        last = close + 1;
        re.lastIndex = last;
    }
    return out + src.slice(last);
}

/** Index of the bracket closing the one at `open`, skipping string literals. */
function matchClose(s: string, open: number): number {
    const pairs: Record<string, string> = { "(": ")", "[": "]", "{": "}" };
    const stack: string[] = [pairs[s[open]]];
    for (let i = open + 1; i < s.length; i++) {
        const c = s[i];
        if (c === '"') {
            i++;
            while (i < s.length && s[i] !== '"') i += s[i] === "\\" ? 2 : 1;
            continue;
        }
        if (c === "'" && /^'(\\.|[^'\\])'/.test(s.slice(i, i + 4))) {
            i += s[i + 1] === "\\" ? 3 : 2;
            continue;
        }
        if (pairs[c]) stack.push(pairs[c]);
        else if (c === stack[stack.length - 1]) {
            stack.pop();
            if (!stack.length) return i;
        }
    }
    return s.length - 1;
}

/** Split `s` at top-level commas. */
function splitTop(s: string): string[] {
    const out: string[] = [];
    let depth = 0,
        cur = "";
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c === '"') {
            let j = i + 1;
            while (j < s.length && s[j] !== '"') j += s[j] === "\\" ? 2 : 1;
            cur += s.slice(i, j + 1);
            i = j;
            continue;
        }
        if ("([{".includes(c)) depth++;
        else if (")]}".includes(c)) depth--;
        if (c === "," && depth === 0) {
            out.push(cur);
            cur = "";
        } else cur += c;
    }
    if (cur.trim()) out.push(cur);
    return out;
}

const kebab = (s: string) =>
    s
        .replace(/_/g, "-")
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .toLowerCase();
const unq = (s: string) =>
    s
        .trim()
        .replace(/^"(.*)"$/s, "$1")
        .replace(/^'(.*)'$/s, "$1");

// ---------------------------------------------------------------- env scan
type EnvHit = {
    name: string;
    src: "cli" | "runtime" | "build" | "config" | "other";
    def?: string;
    doc?: string;
};

function balancedAfter(s: string, openIdx: number): string {
    return s.slice(openIdx + 1, matchClose(s, openIdx));
}

function scanEnv(raw: string): EnvHit[] {
    const src = stripComments(stripTestModules(raw), true);
    const hits: EnvHit[] = [];
    const re = /"(SURREAL_[A-Z0-9_]*[A-Z0-9])"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) {
        const name = m[1];
        const before = src.slice(Math.max(0, m.index - 160), m.index);
        // lazy_env_parse!(...) and variants: default is the argument after the type.
        const mi = src.lastIndexOf("lazy_env_parse", m.index);
        if (mi >= 0 && m.index - mi < 300 && !src.slice(mi, m.index).includes(";")) {
            const callOpen = src.indexOf("(", mi);
            const args = splitTop(balancedAfter(src, callOpen)).map(ws);
            const li = args.findIndex((a) => a.includes(`"${name}"`));
            const def = args.length > li + 2 ? args.slice(li + 2).join(", ") : undefined;
            hits.push({
                name,
                src: "runtime",
                def: def && cleanDefault(def),
                doc: docAbove(src, mi),
            });
            continue;
        }
        if (/\.prefix\(\s*$/.test(before)) continue; // tempfile prefix, not an env var
        if (/initialize_store\(\s*$/.test(before)) {
            hits.push({ name, src: "runtime" });
            continue;
        }
        if (/option_env!\s*\(\s*$/.test(before)) {
            hits.push({ name, src: "build" });
            continue;
        }
        if (/\benv\s*=\s*$/.test(before) || /\.env\(\s*$/.test(before)) {
            hits.push({ name, src: "cli" });
            continue;
        }
        if (/\bvar(_os)?\(\s*$/.test(before)) {
            // best effort default: unwrap_or(...) within the following expression
            const after = src.slice(m.index, m.index + 400).split(";")[0];
            const um = /unwrap_or(?:_else)?\s*\(/.exec(after);
            let def: string | undefined;
            if (um) {
                const o = m.index + um.index + um[0].length - 1;
                def = cleanDefault(ws(balancedAfter(src, o)));
            }
            hits.push({ name, src: "runtime", def, doc: docAbove(src, m.index) });
            continue;
        }
        hits.push({ name, src: "other" });
    }
    // ConfigMap era (3.1+): `.parse_key("rocksdb_thread_count", &mut self.thread_count)` reads SURREAL_ROCKSDB_THREAD_COUNT.
    const pm = /from_env_prefix\(\s*"(SURREAL_[A-Z0-9_]*_)"\s*\)/.exec(src);
    const prefix = pm ? pm[1] : "SURREAL_";
    const ck = /\.parse_key\w*\(\s*"([a-z0-9_]+)"/g;
    while ((m = ck.exec(src))) {
        const call = src.slice(m.index, m.index + 300);
        const fm = /&mut\s+self\.(\w+)/.exec(call);
        let def: string | undefined;
        if (fm) {
            const dm = new RegExp(`^\\s+${fm[1]}:\\s+([^\\n]+?),?\\s*$`, "m").exec(src);
            if (dm) def = cleanDefault(dm[1]);
        }
        let doc: string | undefined;
        if (fm) {
            const dm = new RegExp(
                `((?:#\\[doc_line = "(?:[^"\\\\]|\\\\.)*"\\]\\s*)+)(?:pub(?:\\([^)]*\\))?\\s+)?${fm[1]}\\s*:`,
            ).exec(src);
            if (dm)
                doc = docOf(
                    [...dm[1].matchAll(/#\[(doc_line = "(?:[^"\\]|\\.)*")\]/g)].map((x) => x[1]),
                );
        }
        hits.push({ name: prefix + m[1].toUpperCase(), src: "config", def, doc: doc || undefined });
    }
    return hits;
}

const unescapeRust = (t: string) =>
    t
        .replace(/\\\n\s*/g, "")
        .replace(/\\(["\\nt])/g, (_m, c) => (c === "n" ? " " : c === "t" ? " " : c));
const docOf = (attrs: string[]) =>
    ws(
        attrs
            .filter((a) => a.startsWith("doc_line"))
            .map((a) => a.replace(/^doc_line\s*=\s*"(.*)"$/s, "$1").replace(/\\(["\\])/g, "$1"))
            .join(" "),
    );

/** Doc lines directly above the statement containing `idx` (walks up lines until a statement boundary). */
function docAbove(src: string, idx: number): string | undefined {
    const lines = src.slice(0, idx).split("\n");
    const docs: string[] = [];
    for (let n = lines.length - 2; n >= 0; n--) {
        const l = lines[n].trim();
        if (l.startsWith("#[doc_line"))
            docs.unshift(
                l.replace(/^#\[doc_line\s*=\s*"(.*)"\]$/, "$1").replace(/\\(["\\])/g, "$1"),
            );
        else if (l.startsWith("#[")) continue;
        else if (!l || /[;{}]$/.test(l)) break;
    }
    const d = ws(docs.join(" "));
    return d || undefined;
}

function cleanDefault(d: string): string {
    return ws(d)
        .replace(/\s*,$/, "")
        .replace(/^\|[_a-z]*\|\s*(?:\{\s*(.*?)\s*\}|(.*))$/, "$1$2");
}

// ---------------------------------------------------------------- clap derive parse
type Field = { attrs: string[]; name: string; type: string };
type Variant = { attrs: string[]; name: string; type?: string; fields?: Field[] };
type Item = {
    file?: string;
    uses?: string;
    kind: "struct" | "enum";
    name: string;
    fields?: Field[];
    variants?: Variant[];
    attrs: string;
};

function parseAttrs(chunk: string): { attrs: string[]; rest: string } {
    const attrs: string[] = [];
    let rest = chunk.trim();
    while (rest.startsWith("#[")) {
        const close = matchClose(rest, 1);
        attrs.push(rest.slice(2, close));
        rest = rest.slice(close + 1).trim();
    }
    return { attrs, rest };
}

function parseItems(src: string): Item[] {
    const items: Item[] = [];
    const re = /\b(struct|enum)\s+(\w+)\s*(?:<[^>{]*>)?\s*\{/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) {
        const open = m.index + m[0].length - 1;
        const close = matchClose(src, open);
        const body = src.slice(open + 1, close);
        if (!/#\[(arg|command|clap)\b/.test(body) && m[1] === "struct") {
            re.lastIndex = close;
            continue;
        }
        const lookback = src.slice(Math.max(0, m.index - 400), m.index);
        const item: Item = { kind: m[1] as any, name: m[2], attrs: lookback };
        const chunks = splitTop(body);
        if (m[1] === "struct") {
            item.fields = [];
            for (const c of chunks) {
                const { attrs, rest } = parseAttrs(c);
                const fm = /^(?:pub(?:\([^)]*\))?\s+)?(\w+)\s*:\s*([^]*)$/.exec(rest);
                if (fm) item.fields.push({ attrs, name: fm[1], type: ws(fm[2]) });
            }
        } else {
            item.variants = [];
            for (const c of chunks) {
                const { attrs, rest } = parseAttrs(c);
                const sv = /^(\w+)\s*\{([^]*)\}\s*$/.exec(rest);
                if (sv) {
                    // struct-like variant: its fields are the subcommand's own arguments
                    const fields: Field[] = [];
                    for (const fc of splitTop(sv[2])) {
                        const pa = parseAttrs(fc);
                        const fm = /^(?:pub(?:\([^)]*\)\s+)?)?(\w+)\s*:\s*([^]*)$/.exec(pa.rest);
                        if (fm) fields.push({ attrs: pa.attrs, name: fm[1], type: ws(fm[2]) });
                    }
                    item.variants.push({ attrs, name: sv[1], fields });
                    continue;
                }
                const vm = /^(\w+)\s*(?:\(\s*([^)]*)\))?/.exec(rest);
                if (vm) item.variants.push({ attrs, name: vm[1], type: vm[2] && ws(vm[2]) });
            }
        }
        items.push(item);
        re.lastIndex = close;
    }
    return items;
}

const innerType = (t: string) => {
    let s = t.replace(/^(?:crate::|super::|\w+::)+/, "");
    for (;;) {
        const m = /^(?:Option|Vec|Box)<(.*)>$/.exec(s);
        if (!m) break;
        s = m[1].replace(/^(?:crate::|super::|\w+::)+/, "");
    }
    return s.replace(/<.*$/, "");
};

function attrMap(attrs: string[], names: string[]) {
    const map = new Map<string, string | true>();
    for (const a of attrs) {
        const m = /^(\w+)\s*\(([^]*)\)$/s.exec(a.trim());
        if (!m || !names.includes(m[1])) continue;
        for (const part of splitTop(m[2])) {
            const kv = /^\s*(\w+)\s*(?:=\s*([^]*))?$/s.exec(part);
            if (kv) map.set(kv[1], kv[2] === undefined ? true : ws(kv[2]));
        }
    }
    return map;
}

type Flag = {
    path: string;
    key: string;
    kind: "flag" | "arg";
    long?: string;
    short?: string;
    env?: string;
    def?: string;
    help?: string;
    global?: boolean;
    hidden?: boolean;
};

function derivedFlags(items: Item[], warnings: string[]): Flag[] {
    const byName = new Map<string, Item[]>();
    for (const i of items) byName.set(i.name, [...(byName.get(i.name) ?? []), i]);
    // Several structs share a name (two ExportCommandArguments, a local DatabaseConnectionArguments in import.rs),
    // so a reference resolves to the definition in the same file, else the one its `use` statement points at.
    const resolve = (name: string, from: Item): Item | undefined => {
        const c = byName.get(name);
        if (!c || c.length === 1) return c?.[0];
        const same = c.find((x) => x.file === from.file);
        if (same) return same;
        const m = new RegExp(`use\\s+([^;]*\\b${name}\\b[^;]*);`).exec(from.uses ?? "");
        if (m) {
            const segs = m[1]
                .replace(/\{[^}]*\}/g, "")
                .split("::")
                .map((x) => x.trim())
                .filter((x) => x && x !== name);
            const mod = segs[segs.length - 1];
            const dir = (from.file ?? "").replace(/[^/]*$/, "");
            const hit =
                c.find((x) => x.file === `${dir}${mod}.rs` || x.file === `${dir}${mod}/mod.rs`) ??
                c.find(
                    (x) => x.file && (x.file.includes(`/${mod}/`) || x.file.includes(`/${mod}.rs`)),
                );
            if (hit) return hit;
        }
        return c[0];
    };
    const referenced = new Set<Item>();
    for (const it of items) {
        for (const f of it.fields ?? []) {
            const c = attrMap(f.attrs, ["command", "clap"]);
            if (c.has("flatten") || c.has("subcommand")) {
                const t = resolve(innerType(f.type), it);
                if (t) referenced.add(t);
            }
        }
        for (const v of it.variants ?? [])
            if (v.type) {
                const t = resolve(innerType(v.type), it);
                if (t) referenced.add(t);
            }
    }
    const out: Flag[] = [];
    const seen = new Set<string>();
    const walk = (it: Item | undefined, path: string, fieldsOverride?: Field[]) => {
        const sig = it ? `${it.file}:${it.name}@${path}${fieldsOverride ? "#v" : ""}` : "";
        if (!it || seen.has(sig)) return;
        seen.add(sig);
        if (it.kind === "enum" && !fieldsOverride) {
            for (const v of it.variants!) {
                const cm = attrMap(v.attrs, ["command", "clap"]);
                const nm =
                    typeof cm.get("name") === "string"
                        ? unq(cm.get("name") as string)
                        : kebab(v.name);
                if (v.type) walk(resolve(innerType(v.type), it), `${path} ${nm}`);
                else if (v.fields) walk(it, `${path} ${nm}`, v.fields);
            }
            return;
        }
        for (const f of fieldsOverride ?? it.fields!) {
            const cm = attrMap(f.attrs, ["command", "clap"]);
            if (cm.has("flatten")) {
                walk(resolve(innerType(f.type), it), path);
                continue;
            }
            if (cm.has("subcommand")) {
                walk(resolve(innerType(f.type), it), path);
                continue;
            }
            const am = attrMap(f.attrs, ["arg", "clap"]);
            if (!f.attrs.some((a) => /^(arg|clap)\b/.test(a))) continue;
            let long: string | undefined;
            if (am.has("long"))
                long = am.get("long") === true ? kebab(f.name) : unq(am.get("long") as string);
            let short: string | undefined;
            if (am.has("short"))
                short = am.get("short") === true ? f.name[0] : unq(am.get("short") as string);
            const env =
                typeof am.get("env") === "string" ? unq(am.get("env") as string) : undefined;
            let def: string | undefined;
            for (const k of [
                "default_value",
                "default_value_t",
                "default_value_os_t",
                "default_values_t",
                "default_missing_value",
            ]) {
                const v = am.get(k);
                if (typeof v === "string") {
                    def = k === "default_value" ? unq(v) : v;
                    break;
                }
            }
            const hv = am.get("help") ?? am.get("long_help");
            const help =
                (typeof hv === "string" ? ws(unescapeRust(unq(hv))) : "") ||
                docOf(f.attrs) ||
                undefined;
            const global = am.get("global") === "true" || am.get("global") === true;
            const hidden = am.get("hide") === "true" || am.get("hide") === true;
            if (!long && !short) {
                out.push({
                    path,
                    key: `${path} <${f.name}>`,
                    kind: "arg",
                    env,
                    def,
                    help,
                    hidden,
                    global: global || undefined,
                });
            } else {
                out.push({
                    path,
                    key: `${path} ${long ? "--" + long : "-" + short}`,
                    kind: "flag",
                    long,
                    short,
                    env,
                    def,
                    help,
                    hidden,
                    global: global || undefined,
                });
            }
        }
    };
    // roots: unreferenced items that carry command info
    const roots = items.filter((i) => !referenced.has(i));
    for (const r of roots) {
        const hasSub = r.fields?.some((f) =>
            attrMap(f.attrs, ["command", "clap"]).has("subcommand"),
        );
        if (
            r.kind === "struct" &&
            (hasSub || /bin_name\s*=\s*"surreal"/.test(r.attrs) || r.name === "Cli")
        )
            walk(r, "surreal");
        else if (r.kind === "struct") warnings.push(`unreachable clap struct ${r.name}`);
    }
    return out;
}

// ---------------------------------------------------------------- clap builder parse (early 1.0 betas)
function builderFlags(raw: string): Flag[] {
    const src = stripComments(raw);
    const out: Flag[] = [];
    const cmdRe = /\b(?:Command|App)::new\(\s*"([^"]+)"\s*\)/g;
    const cmds: { idx: number; name: string }[] = [];
    let m: RegExpExecArray | null;
    while ((m = cmdRe.exec(src))) cmds.push({ idx: m.index, name: m[1] });
    const argRe = /\bArg::new\(\s*"([^"]+)"\s*\)/g;
    while ((m = argRe.exec(src))) {
        // chain extends until the `.arg(` call that wraps it closes
        let depth = 0,
            end = src.length;
        for (let i = m.index; i < src.length; i++) {
            const c = src[i];
            if (c === '"') {
                i++;
                while (i < src.length && src[i] !== '"') i += src[i] === "\\" ? 2 : 1;
            } else if (c === "(") depth++;
            else if (c === ")") {
                depth--;
                if (depth < 0) {
                    end = i;
                    break;
                }
            }
        }
        const chain = src.slice(m.index, end);
        const cmd = [...cmds].reverse().find((c) => c.idx < m!.index);
        const path = cmd && !/\s/.test(cmd.name) ? `surreal ${cmd.name}` : "surreal";
        const g = (n: string) =>
            new RegExp(`\\.${n}\\(\\s*(?:"([^"]*)"|'(.)')`).exec(chain)?.slice(1).find(Boolean);
        const long = g("long");
        const short = g("short");
        const env = g("env");
        const def = g("default_value");
        const help = g("help") ?? g("long_help");
        const global = /\.global\(\s*true\s*\)/.test(chain) || undefined;
        const id = m[1];
        if (!long && !short)
            out.push({ path, key: `${path} <${id}>`, kind: "arg", env, def, help });
        else
            out.push({
                path,
                key: `${path} ${long ? "--" + long : "-" + short}`,
                kind: "flag",
                long,
                short,
                env,
                def,
                help,
                global,
            });
    }
    return out;
}

// ---------------------------------------------------------------- per-blob cache
type BlobResult = { env: EnvHit[]; flags: Flag[]; items: Item[]; uses: string };
const blobCache = new Map<string, BlobResult>();

async function readBlobs(shas: string[]): Promise<Map<string, string>> {
    const out = new Map<string, string>();
    if (!shas.length) return out;
    const proc = Bun.spawn(["git", "-C", REPO, "cat-file", "--batch"], {
        stdin: "pipe",
        stdout: "pipe",
    });
    proc.stdin.write(shas.join("\n") + "\n");
    proc.stdin.end();
    const buf = Buffer.from(await new Response(proc.stdout).arrayBuffer());
    let pos = 0;
    for (const sha of shas) {
        const nl = buf.indexOf(10, pos);
        const header = buf.subarray(pos, nl).toString().split(" ");
        const size = +header[2];
        out.set(sha, buf.subarray(nl + 1, nl + 1 + size).toString("utf8"));
        pos = nl + 1 + size + 1;
    }
    return out;
}

// ---------------------------------------------------------------- per-tag snapshot
export type ItemState = {
    kind: "env" | "flag" | "arg";
    name: string;
    default?: string | null;
    help?: string | null;
    global?: boolean;
    sources?: string[];
    flag?: string[]; // for env: flags that read it
    env?: string; // for flag: env var
    short?: string;
    hidden?: boolean;
    file?: string;
};
type Snapshot = {
    tag: string;
    date: string;
    published: string | null;
    items: Record<string, ItemState>;
    looseEnvNames: string[];
    warnings: string[];
};

const serverRoot = (paths: string[]) => {
    const starts = paths
        .filter((p) => /(^|\/)cli\/start\.rs$/.test(p))
        .sort((x, y) => x.length - y.length);
    return starts.length ? starts[0].replace(/cli\/start\.rs$/, "") : "src/";
};

const snapshots: Snapshot[] = [];
for (const t of tags) {
    const tree = (await git("ls-tree", "-r", t.tag)).trim().split("\n");
    const rs = new Map<string, string>(); // path -> sha
    for (const line of tree) {
        const m = /^\d+ blob (\w+)\t(.*)$/.exec(line);
        if (m && m[2].endsWith(".rs")) rs.set(m[2], m[1]);
    }
    const root = serverRoot([...rs.keys()]);
    const cand = (
        await git(
            "grep",
            "-l",
            "-I",
            "-E",
            "SURREAL_|\\.parse_key|Arg::new\\(|#\\[(arg|command)\\(",
            t.tag,
            "--",
            "*.rs",
        )
    )
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((l) => l.slice(t.tag.length + 1));
    const files = cand.filter((p) => !EXCLUDED_PATH.test(p) && rs.has(p));
    const need = [...new Set(files.map((p) => rs.get(p)!).filter((s) => !blobCache.has(s)))];
    const texts = await readBlobs(need);
    for (const sha of need) {
        const raw = texts.get(sha)!;
        const clean = stripComments(stripTestModules(raw));
        const items = parseItems(stripComments(stripTestModules(raw), true));
        const flags = /\bArg::new\(/.test(clean) ? builderFlags(clean) : [];
        blobCache.set(sha, {
            env: scanEnv(raw),
            flags,
            items,
            uses: [...clean.matchAll(/\buse\s+[^;]+;/g)].map((x) => x[0]).join("\n"),
        });
    }
    const snap: Snapshot = {
        tag: t.tag,
        date: t.date,
        published: t.published,
        items: {},
        looseEnvNames: [],
        warnings: [],
    };
    const envAcc = new Map<
        string,
        {
            sources: Set<string>;
            defs: Partial<Record<string, string>>;
            docs: string[];
            file: string;
        }
    >();
    const flagList: Flag[] = [];
    const allItems: Item[] = [];
    for (const p of files) {
        const r = blobCache.get(rs.get(p)!)!;
        if (p.startsWith(root))
            allItems.push(...r.items.map((x) => ({ ...x, file: p, uses: r.uses })));
        for (const h of r.env) {
            const e = envAcc.get(h.name) ?? { sources: new Set(), defs: {}, docs: [], file: p };
            if (h.doc) e.docs.push(h.doc);
            e.sources.add(h.src);
            if (h.def && !e.defs[h.src]) e.defs[h.src] = h.def;
            envAcc.set(h.name, e);
        }
        if (p.startsWith(root)) flagList.push(...r.flags);
    }
    flagList.push(...derivedFlags(allItems, snap.warnings));
    // flags
    const flagsByEnv = new Map<string, string[]>();
    const flagDefByEnv = new Map<string, string>();
    const flagHelpByEnv = new Map<string, string>();
    for (const f of flagList) {
        const prior = snap.items[f.key];
        if (prior) continue;
        snap.items[f.key] = {
            kind: f.kind,
            name: f.key,
            default: f.def ?? null,
            help: f.help ?? null,
            global: f.global,
            env: f.env,
            short: f.short,
            hidden: f.hidden || undefined,
        };
        if (f.env) {
            // an env var read by several flags takes its default and help from `surreal start` if present, else the first command
            if (f.key.startsWith("surreal start ")) {
                if (f.def != null) flagDefByEnv.set(f.env, f.def);
                if (f.help) flagHelpByEnv.set(f.env, f.help);
            }
            flagsByEnv.set(f.env, [...(flagsByEnv.get(f.env) ?? []), f.key]);
            if (f.def != null && !flagDefByEnv.has(f.env)) flagDefByEnv.set(f.env, f.def);
            if (f.help && !flagHelpByEnv.has(f.env)) flagHelpByEnv.set(f.env, f.help);
        }
    }
    for (const [name, e] of envAcc) {
        const def = e.defs.runtime ?? flagDefByEnv.get(name) ?? null;
        snap.items[name] = {
            kind: "env",
            name,
            default: def,
            help: flagHelpByEnv.get(name) ?? e.docs[0] ?? null,
            sources: [...e.sources].sort(),
            flag: flagsByEnv.get(name),
            file: e.file,
        };
    }
    // Flag-bound env vars the literal scan cannot see (early builds used unprefixed names such as USER or PASS).
    for (const [env, fl] of flagsByEnv)
        if (!envAcc.has(env)) {
            snap.items[env] = {
                kind: "env",
                name: env,
                default: flagDefByEnv.get(env) ?? null,
                help: flagHelpByEnv.get(env) ?? null,
                sources: ["cli"],
                flag: fl,
            };
            if (env.startsWith("SURREAL_"))
                snap.warnings.push(`flag env ${env} not found by literal scan`);
        }
    // loose set: any SURREAL_NAME token in tracked files outside docs and tests (for comparison with the expected counts)
    const loose = await git(
        "grep",
        "-h",
        "-o",
        "-I",
        "-E",
        "SURREAL_[A-Z0-9_]*[A-Z0-9]",
        t.tag,
        "--",
        ".",
        ":!*.md",
        ":!*/tests/*",
        ":!tests/*",
        ":!*/test/*",
        ":!language-tests/*",
        ":!*.surql",
        ":!*.lock",
    );
    snap.looseEnvNames = [...new Set(loose.trim().split("\n").filter(Boolean))];
    snapshots.push(snap);
    const n = Object.values(snap.items);
    console.log(
        `${t.tag.padEnd(22)} env=${n.filter((i) => i.kind === "env").length} flags=${n.filter((i) => i.kind !== "env").length} loose=${snap.looseEnvNames.length} warn=${snap.warnings.length}`,
    );
}
await Bun.write("snapshots.json", JSON.stringify(snapshots));
