(async () => {
	// ?view=timeline, contents or totals shows one part, for embedding each on its own
	const view = new URLSearchParams(location.search).get("view");
	if (view) {
		document.body.classList.add("single");
		for (const s of document.querySelectorAll("section[data-view]")) s.hidden = s.dataset.view !== view;
	}
	const data = await (await fetch("data.json")).json();
	const tags = data.tags.map((t, i) => ({ ...t, i }));
	const items = data.items;
	const last = tags.length - 1;
	const $ = (id) => document.getElementById(id);
	const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
	const isEnv = (it) => it.kind === "env" || it.kind === "config";
	const isFlag = (it) => it.kind === "flag" || it.kind === "arg";
	const present = (it, i) => it.ranges.some(([a, b]) => a <= i && i <= b);
	const gone = (it) => it.ranges.every(([, b]) => b < last);
	const shown = (key) => key.replace(/^surreal /, "");
	const ver = (t) => t.name.replace(/^v/, "");
	const finals = tags.filter((t) => !t.pre);

	function tabs(el, options, initial, onChange) {
		let value = initial;
		el.innerHTML = options.map(([k, l]) => `<button type="button" data-k="${k}" aria-pressed="${k === value}">${l}</button>`).join("");
		el.onclick = (e) => {
			const b = e.target.closest("button");
			if (!b) return;
			value = b.dataset.k;
			for (const x of el.children) x.setAttribute("aria-pressed", x === b);
			onChange(value);
		};
		return () => value;
	}
	function defaultAt(it, i) {
		if (!it.defaults) return null;
		let v = null;
		for (const [idx, val] of it.defaults) if (idx <= i) v = val;
		return v;
	}
	function showDefault(v) {
		if (v == null) return "";
		if (/\blet\b|System::|\{|\.\.\.$/.test(v)) return '<span class="help">computed at run time</span>';
		return `<code>${esc(v)}</code>`;
	}

	// Release lines, newest first
	const lineOf = (t) => ver(t).split(".").slice(0, 2).join(".");
	const lines = [];
	for (const t of tags) {
		if (t.pre) continue;
		const key = lineOf(t);
		let l = lines.find((x) => x.key === key);
		if (!l) lines.push((l = { key, tags: [], first: t }));
		l.tags.push(t.i);
	}
	const num = (k) => k.split(".").map(Number);
	lines.sort((a, b) => { const [x, y] = [num(a.key), num(b.key)]; return y[0] - x[0] || y[1] - x[1]; });
	const year = (l) => tags.find((t) => !t.pre && lineOf(t) === l.key).date.slice(0, 4);
	// Alternate a faint band for each year so the dates read in the background
	let band = false, prevYear = null;
	for (const l of lines) {
		l.year = year(l);
		if (l.year !== prevYear) { band = !band; prevYear = l.year; }
		l.band = band;
	}
	document.documentElement.style.setProperty("--n", lines.length);
	$("tl-axis").innerHTML = lines.map((l, k) => {
		const major = l.key.endsWith(".0") || k === 0;
		const showYear = k === 0 || lines[k - 1].year !== l.year;
		return `<span class="${major ? "" : "minor"}" title="${l.key}.x"><b>${l.key}</b><small>${showYear ? l.year : "&nbsp;"}</small></span>`;
	}).join("");
	const bandCells = lines.map((l) => `<i class="${l.band ? "band" : ""}"></i>`).join("");

	function columns(it) {
		return lines.map((l) => l.tags.some((i) => present(it, i)));
	}
	function runs(it) {
		const on = columns(it), out = [];
		for (let k = 0; k < on.length; k++) {
			if (!on[k]) continue;
			let e = k;
			while (e + 1 < on.length && on[e + 1]) e++;
			out.push([k, e]);
			k = e;
		}
		return out;
	}

	// Timeline
	const tlKind = tabs($("tl-kind"), [["env", "Environment variables"], ["flag", "Flags"]], "env", () => renderTimeline());
	function renderTimeline() {
		const q = $("tl-q").value.trim().toLowerCase();
		const test = tlKind() === "env" ? isEnv : isFlag;
		const list = items
			.filter((it) => test(it) && (!q || it.key.toLowerCase().includes(q)) && (!$("tl-gone").checked || gone(it)))
			.sort((a, b) => a.key.localeCompare(b.key));
		$("tl-list").innerHTML = list.map((it) => {
			const bars = runs(it).map(([a, b]) => `<span class="bar" style="grid-column:${a + 1} / ${b + 2}"></span>`).join("");
			return `<div class="row ${it.kind}${gone(it) ? " removed" : ""}" data-k="${esc(it.key)}"><span class="name">${esc(shown(it.key))}</span><span class="track"><span class="cols">${bandCells}</span><span class="bars">${bars}</span></span></div>`;
		}).join("");
		$("tl-count").textContent = `${list.length} shown, ${list.filter(gone).length} of them not in ${ver(tags[last])}.`;
	}
	$("tl-q").oninput = renderTimeline;
	$("tl-gone").onchange = renderTimeline;
	renderTimeline();

	const tip = $("tip");
	function describe(it) {
		const r = it.ranges.map(([a, b]) => `${ver(tags[a])}${b < last ? ` to ${ver(tags[b])}` : " onwards"}`).join(", ");
		let h = `<b>${esc(it.key)}</b><br>${esc(r)}`;
		if (it.env) h += `<br>Environment variable: <code>${esc(it.env)}</code>`;
		if (it.flags) h += `<br>Flags: ${it.flags.map((f) => `<code>${esc(f)}</code>`).join(", ")}`;
		if (it.global) h += "<br>Accepted by every subcommand";
		if (it.kind === "config") h += "<br>Read from the configuration map";
		if (it.help) h += `<br><br>${esc(it.help)}`;
		return h;
	}
	$("tl-rows").addEventListener("mousemove", (e) => {
		const row = e.target.closest(".row");
		if (!row) { tip.style.display = "none"; return; }
		tip.innerHTML = describe(items.find((x) => x.key === row.dataset.k));
		tip.style.display = "block";
		const w = tip.offsetWidth, h = tip.offsetHeight;
		tip.style.left = Math.min(e.clientX + 14, innerWidth - w - 8) + "px";
		tip.style.top = (e.clientY + 14 + h > innerHeight ? e.clientY - h - 10 : e.clientY + 14) + "px";
	});
	$("tl-rows").addEventListener("mouseleave", () => (tip.style.display = "none"));

	// Release contents
	const opts = finals.slice().reverse().map((t) => `<option value="${t.i}">${esc(ver(t))} (${t.date})${t.line === "maintenance" ? ", maintenance release" : ""}</option>`).join("");
	$("v-ver").innerHTML = opts;
	$("v-cmp").innerHTML = `<option value="-1">None</option>` + opts;
	const vKind = tabs($("v-kind"), [["all", "All"], ["env", "Environment variables"], ["flag", "Flags"]], "all", () => renderVersion());
	const kindOk = (it) => vKind() === "all" || (vKind() === "env" ? isEnv(it) : isFlag(it));
	const kindName = (it) => ({ env: "env var", config: "config", flag: "flag", arg: "argument" })[it.kind];
	function renderVersion() {
		const i = +$("v-ver").value, j = +$("v-cmp").value;
		const q = $("v-q").value.trim().toLowerCase();
		const pool = items.filter((it) => kindOk(it) && (!q || it.key.toLowerCase().includes(q)));
		const sort = (l) => l.sort((a, b) => a.key.localeCompare(b.key));
		const head = `<thead><tr><th style="width:38%">Name</th><th style="width:13%">Kind</th><th style="width:19%">Default</th><th class="col-help">Help text</th></tr></thead>`;
		const row = (it, at, mark = "") => `<tr><td>${mark}<code>${esc(shown(it.key))}</code></td><td>${kindName(it)}</td><td>${showDefault(defaultAt(it, at))}</td><td class="col-help"><span class="help">${esc(it.help || "")}</span></td></tr>`;
		if (j < 0) {
			const list = sort(pool.filter((it) => present(it, i)));
			$("v-summary").textContent = `${ver(tags[i])} has ${list.filter(isEnv).length} environment variables and ${list.filter(isFlag).length} flags and arguments${q ? " that match the filter" : ""}.`;
			$("v-table").innerHTML = head + "<tbody>" + list.map((it) => row(it, i)).join("") + "</tbody>";
			return;
		}
		const [from, to] = tags[j].date <= tags[i].date ? [j, i] : [i, j];
		const added = sort(pool.filter((it) => !present(it, from) && present(it, to)));
		const removed = sort(pool.filter((it) => present(it, from) && !present(it, to)));
		const changed = sort(pool.filter((it) => present(it, from) && present(it, to) && defaultAt(it, from) !== defaultAt(it, to)));
		$("v-summary").textContent = `From ${ver(tags[from])} to ${ver(tags[to])}: ${added.length} added, ${removed.length} removed, ${changed.length} with a new default.`;
		$("v-table").innerHTML = head + "<tbody>" +
			added.map((it) => row(it, to, '<span class="tag added">Added</span> ')).join("") +
			removed.map((it) => row(it, from, '<span class="tag removed">Removed</span> ')).join("") +
			changed.map((it) => `<tr><td><span class="tag changed">Default</span> <code>${esc(shown(it.key))}</code></td><td>${kindName(it)}</td><td>${showDefault(defaultAt(it, from)) || "none"} to ${showDefault(defaultAt(it, to)) || "none"}</td><td class="col-help"><span class="help">${esc(it.help || "")}</span></td></tr>`).join("") +
			"</tbody>";
	}
	for (const id of ["v-ver", "v-cmp"]) $(id).onchange = renderVersion;
	$("v-q").oninput = renderVersion;
	renderVersion();

	// Totals chart, oldest on the left, by publication date
	const time = (d) => Date.parse(d + "T00:00:00Z");
	function drawChart() {
		const svg = $("chart");
		const W = Math.max(320, svg.clientWidth || 700);
		const H = 220, L = 34, R = 10, T = 10, B = 24;
		const pts = finals.filter((t) => t.line === "mainline");
		const counts = pts.map((t) => ({
			t,
			env: items.filter((it) => isEnv(it) && present(it, t.i)).length,
			flag: items.filter((it) => isFlag(it) && present(it, t.i)).length,
		}));
		const max = Math.ceil(Math.max(...counts.map((c) => Math.max(c.env, c.flag))) / 50) * 50;
		const c0 = time(pts[0].date) - 45 * 864e5, c1 = time(pts[pts.length - 1].date) + 20 * 864e5;
		const x = (d) => L + ((time(d) - c0) / (c1 - c0)) * (W - L - R);
		const y = (v) => T + (1 - v / max) * (H - T - B);
		let s = "";
		for (let v = 0; v <= max; v += 50) s += `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
		for (let yr = new Date(c0).getUTCFullYear() + 1; yr <= new Date(c1).getUTCFullYear(); yr++) s += `<text x="${x(yr + "-01-01")}" y="${H - 6}" text-anchor="middle">${yr}</text>`;
		for (const [key, colour, name] of [["env", "var(--env)", "environment variables"], ["flag", "var(--flag)", "flags and arguments"]]) {
			s += `<polyline fill="none" stroke="${colour}" stroke-width="2" points="${counts.map((c) => `${x(c.t.date)},${y(c[key])}`).join(" ")}"/>`;
			for (const c of counts) s += `<circle cx="${x(c.t.date)}" cy="${y(c[key])}" r="3" fill="${colour}"><title>${ver(c.t)}: ${c[key]} ${name}</title></circle>`;
		}
		svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
		svg.innerHTML = s;
	}
	drawChart();
	new ResizeObserver(drawChart).observe(document.body);
})();
