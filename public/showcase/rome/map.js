// The Rome timeline demo: see map.html. Data files sit beside this one.
(async () => {
	// ---- data ------------------------------------------------------------------
	// Everything the page shows is baked in up front; it never calls Agent Memory.
	const [events, geo] = await Promise.all([fetch("events.json").then(r => r.json()), fetch("geo.json").then(r => r.json())]);
	events.sort((a, b) => a.auc - b.auc || (a.day ?? "").localeCompare(b.day ?? ""));

	// Value histories. out/memory.json holds what Agent Memory's /history endpoint
	// returned, captured after the upload; without it, the same chains are rebuilt
	// from the state facts the events carry.
	const aucOf = t => Number(String(t).slice(0, 4));
	let histories, fromMemory = false; // reassigned below when aliases merge
	try {
		const m = await (await fetch("memory.json")).json();
		histories = m.histories.map(h => ({ ...h, chain: h.chain.map(c => ({ value: c.value, from: aucOf(c.validFrom), until: c.validUntil ? aucOf(c.validUntil) : null })) }));
		fromMemory = true;
	} catch {
		const by = new Map();
		for (const e of events) for (const s of e.states ?? []) {
			const k = s.entity + "|" + s.key;
			if (!by.has(k)) by.set(k, { entity: s.entity, key: s.key, chain: [] });
			by.get(k).chain.push({ value: s.value, from: e.auc });
		}
		histories = [...by.values()].map(h => {
			h.chain.sort((a, b) => a.from - b.from);
			h.chain.forEach((c, i) => c.until = h.chain[i + 1]?.from ?? null);
			return h;
		});
	}
	// A value written twice in a row, or an empty one, says nothing new.
	const PLACEHOLDER = /^\s*$|^(none|unknown|n\/a)$/i;
	const tidyChains = () => { for (const h of histories) {
		const tidy = [];
		for (const c of h.chain) {
			// "none" or "unknown" ends the previous value; it is not a value of its own.
			if (PLACEHOLDER.test(c.value)) { if (tidy.length && (tidy.at(-1).until === null || tidy.at(-1).until > c.from)) tidy.at(-1).until = c.from; continue; }
			if (tidy.length && tidy.at(-1).value === c.value) { tidy.at(-1).until = c.until; continue; }
			tidy.push({ ...c });
		}
		h.chain = tidy;
	} };
	tidyChains();
	// Names for the same thing (Milan and Mediolanum), found by aliases.ts. Agent Memory
	// keeps them as separate entities, so the page merges each group under its main name.
	let aliases = {};
	try { aliases = await (await fetch("aliases.json")).json(); } catch {}
	const canonOf = new Map();
	for (const [main, others] of Object.entries(aliases)) for (const o of others) canonOf.set(o, main);
	const canon = n => canonOf.get(n) ?? n;
	for (const e of events) {
		if (e.names) e.names = [...new Set(e.names.map(canon))];
		if (e.cast) e.cast = [...new Set(e.cast.map(canon))];
		if (e.states) e.states = e.states.map(st => ({ ...st, entity: canon(st.entity), value: canon(st.value) }));
		if (e.actor) e.actor = canon(e.actor);
		if (e.object) e.object = canon(e.object);
	}
	// Histories of one group with the same key become one chain, rebuilt in order.
	const merged = new Map();
	for (const h of histories) {
		const k = canon(h.entity) + "|" + h.key;
		const m = merged.get(k) ?? { entity: canon(h.entity), key: h.key, chain: [] };
		m.chain.push(...h.chain.map(c => ({ ...c, value: canon(c.value) })));
		merged.set(k, m);
	}
	for (const h of merged.values()) {
		if (h.chain.length < 2) continue;
		h.chain.sort((a, b) => a.from - b.from);
		h.chain.forEach((c, i) => { if (h.chain[i + 1]) c.until = h.chain[i + 1].from; });
	}
	histories = [...merged.values()];
	tidyChains();
	const historiesOf = new Map();
	for (const h of histories) historiesOf.set(h.entity, [...(historiesOf.get(h.entity) ?? []), h]);

	// Every name an event involves, with how many events mention it.
	const nameCount = new Map();
	for (const e of events) for (const n of e.names ?? []) nameCount.set(n, (nameCount.get(n) ?? 0) + 1);
	for (const n of historiesOf.keys()) if (!nameCount.has(n)) nameCount.set(n, 0);
	const names = [...nameCount].sort((a, b) => b[1] - a[1]);

	// ---- years -------------------------------------------------------------------
	const label = auc => auc <= 753 ? `${754 - auc} BC` : `AD ${auc - 753}`;
	const parseYear = s => {
		const m = String(s).trim().match(/^(AD\s*)?(\d+)\s*(BC|AD)?$/i);
		if (!m) return null;
		const n = Number(m[2]);
		return m[3]?.toUpperCase() === "BC" ? 754 - n : n + 753;
	};
	const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	const dayLabel = d => d ? `${Number(d.slice(3))} ${MONTHS[Number(d.slice(0, 2)) - 1]}` : "";
	const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

	// ---- state ---------------------------------------------------------------------
	const $ = id => document.getElementById(id);
	// entities: everything chosen in the search; entity: the one in focus (panel, comparison,
	// life view); join: whether an event must involve any or all of them.
	const state = { mode: "year", auc: 253, from: parseYear("150 BC"), to: parseYear("100 BC"), entities: [], entity: null, join: "any" };
	const matches = e => !state.entities.length || (state.join === "all" ? state.entities.every(n => involves(e, n)) : state.entities.some(n => involves(e, n)));
	const entityPhrase = () => state.entities.join(state.join === "all" ? " and " : " or ");
	const map = L.map("map", { worldCopyJump: true, preferCanvas: true }).setView([41.9, 12.5], 5);
	// Land, lakes and rivers from Natural Earth, drawn rather than tiled: no tile server,
	// and no modern borders on a map of ancient Rome.
	const base = L.canvas({ padding: .5 });
	L.polygon(geo.land, { renderer: base, stroke: true, color: "#b9ab8e", weight: .8, fillColor: "#efe6d2", fillOpacity: 1, interactive: false }).addTo(map);
	L.polygon(geo.lakes, { renderer: base, stroke: false, fillColor: "#c9dbe0", fillOpacity: 1, interactive: false }).addTo(map);
	L.polyline(geo.rivers, { renderer: base, color: "#8fb3c2", weight: 1, interactive: false }).addTo(map);
	map.attributionControl.addAttribution('Map: Natural Earth · Events: <a href="https://en.wikipedia.org/wiki/Timeline_of_Roman_history" target="_blank" rel="noopener">Wikipedia</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>');
	map.setMaxBounds([[geo.box.south - 8, geo.box.west - 20], [geo.box.north + 8, geo.box.east + 20]]);
	map.setMinZoom(3);
	const layer = L.layerGroup().addTo(map);
	window.aucMap = map; // for scripted checks

	const involves = (e, n) => e.names?.includes(n) || e.states?.some(s => s.entity === n);
	function passes(e, { ignoreView = false } = {}) {
		if (!$({ event: "kEvent", birth: "kBirth", death: "kDeath" }[e.kind]).checked) return false;
		if (!$(e.rome === "core" ? "sCore" : "sContact").checked) return false;
		if (!matches(e)) return false;
		if (!ignoreView && $("inView").checked) {
			if (!e.place) return false;
			if (!map.getBounds().contains([e.place.lat, e.place.lon])) return false;
		}
		return true;
	}
	const span = () => state.mode === "year" ? [state.auc, state.auc] : [Math.min(state.from, state.to), Math.max(state.from, state.to)];
	const selected = () => { const [a, b] = span(); return events.filter(e => e.auc >= a && e.auc <= b && passes(e)); };

	// ---- rendering ---------------------------------------------------------------------
	function dot(e, opts) {
		if (!e.place || (!$("inferred").checked && e.place.basis === "inferred")) return;
		const inferred = e.place.basis === "inferred";
		L.circleMarker([e.place.lat, e.place.lon], { radius: 6, color: "#b0302a", weight: inferred ? 2 : 3, fillOpacity: inferred ? 0 : .75, dashArray: inferred ? "3 3" : null, ...opts })
			.bindTooltip(`<b>${esc(e.year)}${e.day ? ", " + dayLabel(e.day) : ""}</b><br>${esc(e.summary)}<br><i>${esc(e.place.title)}${inferred ? " (inferred)" : ""}</i>`)
			.addTo(layer);
	}

	function render() {
		const [a, b] = span();
		$("title").textContent = a === b ? label(a) : `${label(a)} to ${label(b)}`;
		$("subtitle").textContent = a === b ? `AUC ${a}, ${2206 - a} years before the fall of Constantinople` : `AUC ${a} to ${b}, ${b - a + 1} years`;
		const sel = selected();
		layer.clearLayers();
		if (state.mode === "year" && $("trail").checked) {
			for (const e of events) if (e.auc < a && e.auc >= a - 30 && passes(e, { ignoreView: true })) dot(e, { radius: 4, opacity: .15 + .25 * (1 - (a - e.auc) / 30), fillOpacity: .1, weight: 1 });
		}
		for (const e of sel) dot(e, state.mode === "period" && b > a ? { opacity: .35 + .65 * (e.auc - a) / (b - a), radius: 5 } : {});
		const shown = sel.slice(0, 400);
		const onMap = sel.filter(e => e.place).length;
		$("listTitle").textContent = `${sel.length} ${sel.length === 1 ? "entry" : "entries"}, ${onMap} on the map${sel.length > shown.length ? ` (first ${shown.length} listed)` : ""}`;
		$("list").innerHTML = shown.map((e, i) => `<div class="ev" data-i="${i}">
			<div class="tag">${a !== b ? `<span class="yr">${esc(e.year)}</span> · ` : ""}${e.day ? dayLabel(e.day) + " · " : ""}${e.kind}${e.rome === "contact" ? " · contact" : ""}${e.approximate ? " · approximate" : ""} · <b>${e.place ? esc(e.place.title) + (e.place.basis === "inferred" ? " (inferred)" : "") : "no place"}</b></div>
			${esc(e.summary)}</div>`).join("");
		$("list").querySelectorAll(".ev").forEach(el => el.onclick = () => {
			const e = shown[Number(el.dataset.i)];
			if (e.place) map.flyTo([e.place.lat, e.place.lon], Math.max(map.getZoom(), 7), { duration: .6 });
		});
		renderEntity();
		if (story.on) { buildStory(); renderStory(); } else { $("storyPanel").hidden = true; $("list").hidden = $("listTitle").hidden = false; story.lines.clearLayers(); }
	}

	// ---- entity ------------------------------------------------------------------------
	function valueAt(h, auc) { return h.chain.find(c => c.from <= auc && (c.until === null || auc < c.until))?.value; }

	function renderEntity() {
		$("entityPanel").hidden = !state.entities.length;
		$("lifetime").hidden = !state.entities.length;
		if (!state.entities.length) return;
		const colour = n => PALETTE[state.entities.indexOf(n) % PALETTE.length];
		$("chips").innerHTML = state.entities.map(n => `<span class="chip ${n === state.entity ? "focus" : ""}" data-n="${esc(n)}" title="Click to focus the panel on ${esc(n)}"><i style="background:${colour(n)}"></i>${esc(n)}<button class="link" data-x="${esc(n)}" title="Remove">×</button></span>`).join("");
		$("chips").querySelectorAll(".chip").forEach(el => el.onclick = ev => {
			const x = ev.target.dataset.x;
			if (x) { state.entities = state.entities.filter(n => n !== x); if (state.entity === x) state.entity = state.entities.at(-1) ?? null; }
			else state.entity = el.dataset.n;
			render();
		});
		$("joinRow").hidden = state.entities.length < 2;
		$("joinAny").setAttribute("aria-pressed", state.join === "any");
		$("joinAll").setAttribute("aria-pressed", state.join === "all");
		const mine = events.filter(e => involves(e, state.entity));
		const shared = events.filter(matches);
		$("entityCount").textContent = state.entities.length > 1
			? `${shared.length} events involve ${entityPhrase()}; ${state.entity} alone has ${mine.length}`
			: `${mine.length} events${mine.length ? `, ${mine[0].year} to ${mine.at(-1).year}` : ""}`;
		// Activity per decade across the whole timeline, one colour per chosen entity.
		const [a, b] = span();
		let bars = "", peak = 1;
		const binsOf = state.entities.map(n => { const m = new Map(); for (const e of events) if (involves(e, n)) { const d = Math.floor((e.auc - 1) / 10); m.set(d, (m.get(d) ?? 0) + 1); } return m; });
		for (const m of binsOf) peak = Math.max(peak, ...m.values());
		binsOf.forEach((m, k) => { const w = 9 / state.entities.length; for (const [d, c] of m) bars += `<rect x="${d * 10 + k * w}" y="${44 - 42 * c / peak}" width="${Math.max(1, w)}" height="${42 * c / peak}" fill="${colour(state.entities[k])}"/>`; });
		$("spark").innerHTML = `<rect x="${a - 1}" y="0" width="${Math.max(6, b - a + 1)}" height="44" fill="#efe1c8"/>` + bars;
		// What memory holds for this entity at the selected time.
		const hs = historiesOf.get(state.entity) ?? [];
		const at = b;
		const rows = hs.map(h => ({ key: h.key, value: valueAt(h, at), changes: h.chain.filter(c => c.from >= a && c.from <= b) })).filter(r => r.value !== undefined || r.changes.length);
		$("stateBox").innerHTML = !hs.length ? `<p class="note">No changing values (rulers, control, offices) are recorded for ${esc(state.entity)}.</p>` : `
			<div class="card"><b>In memory as of ${label(at)}</b> <span class="note">${fromMemory ? "captured from Agent Memory's history endpoint" : "rebuilt from the uploaded state facts"}</span>
			${rows.length ? `<table><tr><th>key</th><th>value</th><th>changes in this period</th></tr>${rows.map(r => `<tr><td>${esc(r.key)}</td><td>${esc(r.value ?? "-")}</td><td>${r.changes.map(c => `${label(c.from)}: ${esc(c.value)}`).join("<br>") || ""}</td></tr>`).join("")}</table>` : `<p class="note">Nothing recorded yet at this date.</p>`}</div>`;
		$("compareBox").hidden = !hs.length;
		if (!$("cmpA").value && mine.length) { $("cmpA").value = mine[0].year; $("cmpB").value = mine.at(-1).year; }
	}

	function compare() {
		const A = parseYear($("cmpA").value), B = parseYear($("cmpB").value);
		if (A === null || B === null) { $("cmpOut").innerHTML = `<p class="note">Years look like "216 BC" or "AD 1204".</p>`; return; }
		const hs = historiesOf.get(state.entity) ?? [];
		$("cmpOut").innerHTML = `<table><tr><th>key</th><th>${label(A)}</th><th>${label(B)}</th></tr>${hs.map(h => {
			const x = valueAt(h, A), y = valueAt(h, B);
			if (x === undefined && y === undefined) return "";
			return `<tr class="${x !== y ? "changed" : ""}"><td>${esc(h.key)}</td><td>${esc(x ?? "not yet known")}</td><td>${esc(y ?? "not yet known")}</td></tr>`;
		}).join("")}</table>`;
	}

	// ---- search ------------------------------------------------------------------------
	let hits = [], hi = 0;
	function suggest() {
		const q = $("q").value.trim().toLowerCase();
		if (q.length < 2) { $("suggest").style.display = "none"; return; }
		hits = names.filter(([n]) => n.toLowerCase().includes(q) || (aliases[n] ?? []).some(a => a.toLowerCase().includes(q))).sort((x, y) => (y[0].toLowerCase().startsWith(q) - x[0].toLowerCase().startsWith(q)) || y[1] - x[1]).slice(0, 12);
		hi = 0;
		$("suggest").innerHTML = hits.map(([n, c], i) => `<div data-i="${i}" class="${i === hi ? "on" : ""}"><span>${esc(n)}${aliases[n] ? ` <span class="sub">also ${esc(aliases[n].join(", "))}</span>` : ""}</span><span class="sub">${c}</span></div>`).join("");
		$("suggest").style.display = hits.length ? "block" : "none";
		$("suggest").querySelectorAll("div").forEach(el => el.onmousedown = () => pick(hits[Number(el.dataset.i)][0]));
	}
	function pick(n) {
		if (!state.entities.includes(n)) state.entities.push(n);
		state.entity = n;
		$("q").value = "";
		$("suggest").style.display = "none";
		$("cmpA").value = $("cmpB").value = "";
		$("cmpOut").innerHTML = "";
		render();
	}
	$("q").oninput = suggest;
	$("q").onkeydown = ev => {
		if (ev.key === "ArrowDown" || ev.key === "ArrowUp") { hi = (hi + (ev.key === "ArrowDown" ? 1 : hits.length - 1)) % Math.max(1, hits.length); suggest.call(null); $("suggest").querySelectorAll("div").forEach((el, i) => el.classList.toggle("on", i === hi)); ev.preventDefault(); }
		if (ev.key === "Enter" && hits[hi]) pick(hits[hi][0]);
		if (ev.key === "Escape") $("suggest").style.display = "none";
	};
	$("q").onblur = () => setTimeout(() => $("suggest").style.display = "none", 150);
	$("clearEntity").onclick = () => { state.entities = []; state.entity = null; render(); };
	$("joinAny").onclick = () => { state.join = "any"; render(); };
	$("joinAll").onclick = () => { state.join = "all"; render(); };
	$("cmpGo").onclick = compare;

	// ---- controls ----------------------------------------------------------------------
	function setMode(m) {
		state.mode = m;
		$("modeYear").setAttribute("aria-pressed", m === "year");
		$("modePeriod").setAttribute("aria-pressed", m === "period");
		$("yearCtl").hidden = m !== "year";
		$("periodCtl").hidden = m !== "period";
		$("trailWrap").hidden = m !== "year";
		render();
	}
	$("modeYear").onclick = () => setMode("year");
	$("modePeriod").onclick = () => setMode("period");
	$("slider").oninput = () => { state.auc = Number($("slider").value); render(); };
	for (const id of ["from", "to"]) $(id).onchange = () => {
		const v = parseYear($(id).value);
		if (v !== null) { state[id] = Math.min(2206, Math.max(1, v)); $(id).value = label(state[id]); render(); }
	};
	$("lifetime").onclick = () => {
		const mine = events.filter(e => state.entities.length && matches(e));
		if (!mine.length) return;
		state.from = mine[0].auc; state.to = mine.at(-1).auc;
		$("from").value = label(state.from); $("to").value = label(state.to);
		render();
	};
	for (const id of ["kEvent", "kBirth", "kDeath", "sCore", "sContact", "inferred", "inView", "trail"]) $(id).onchange = render;
	map.on("moveend", () => { if ($("inView").checked) render(); });

	// ---- story -------------------------------------------------------------------------
	// Picks the main events of the current selection and steps through them in order.
	const story = { on: false, steps: [], i: 0, timer: null, lines: L.layerGroup().addTo(map) };
	// Importance: confirmed by both sources, a named battle or treaty, Rome itself, a dated event.
	const NAMED = /^(Battle|Siege|Sack|Fall|Treaty|Peace|Council|Second Council|Massacre|Conquest|Revolt|Capture) (of|at)\b/;
	const score = e => (e.rome === "core" ? 2 : 1) + ({ event: 2, death: 1, birth: .3 }[e.kind])
		+ (e.confirmed ? 2.5 : 0) + (e.source.includes("Timeline") ? 1 : 0) + ((e.names ?? []).some(n => NAMED.test(n)) ? 2 : 0)
		+ (e.states?.length ? .75 : 0) + .25 * Math.min(e.cast?.length ?? 0, 4) + (e.day ? .5 : 0) - (e.approximate ? .5 : 0);
	const people = e => (e.cast ?? []).filter(n => n !== e.place?.title);

	function buildStory() {
		const n = Math.max(3, Math.min(40, Number($("storyN").value) || 15));
		const sel = selected();
		// The best event of each year first, so a long period is not all one decade.
		const ranked = [...sel].sort((a, b) => score(b) - score(a));
		const seenYear = new Set(), first = [], rest = [];
		for (const e of ranked) (seenYear.has(e.auc) ? rest : (seenYear.add(e.auc), first)).push(e);
		story.steps = [...first, ...rest].slice(0, n).sort((a, b) => a.auc - b.auc || (a.day ?? "").localeCompare(b.day ?? ""));
		story.i = 0;
	}

	function castOf(steps) {
		const count = new Map(), pair = new Map();
		for (const e of steps) {
			const ns = [...new Set(people(e))];
			for (const x of ns) count.set(x, (count.get(x) ?? 0) + 1);
			for (let i = 0; i < ns.length; i++) for (let j = i + 1; j < ns.length; j++) {
				const k = [ns[i], ns[j]].sort().join("\u0000");
				pair.set(k, (pair.get(k) ?? 0) + 1);
			}
		}
		// Entities seen more than once, or the most frequent if few repeat.
		let cast = [...count].filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1]);
		if (cast.length < 6) cast = [...count].sort((a, b) => b[1] - a[1]);
		cast = cast.slice(0, 12).map(([n]) => n);
		return { cast, count, pair };
	}

	function renderStory() {
		$("storyPanel").hidden = !story.on;
		$("list").hidden = $("listTitle").hidden = story.on;
		story.lines.clearLayers();
		if (!story.on) return;
		const steps = story.steps;
		if (!steps.length) { $("storyCard").innerHTML = `<p class="note">Nothing matches the current period and filters.</p>`; $("castGraph").innerHTML = ""; $("storyList").innerHTML = ""; return; }
		const e = steps[story.i];
		$("storyStep").textContent = `${story.i + 1} of ${steps.length}`;
		const chips = people(e).map(n => `<span class="ent" data-n="${esc(n)}">${esc(n)}</span>`).join("");
		$("storyCard").innerHTML = `<div class="tag sub"><b style="color:var(--accent)">${esc(e.year)}${e.day ? ", " + dayLabel(e.day) : ""}</b>${e.approximate ? " · approximate" : ""} · ${e.place ? esc(e.place.title) + (e.place.basis === "inferred" ? " (inferred)" : "") : "no place"}</div>
			<div style="font-size:16px; margin:4px 0 6px">${esc(e.summary)}</div>
			${e.actor ? `<div class="sub">${esc(e.actor)} → <i>${esc((e.verb ?? "").replace(/_/g, " "))}</i>${e.object ? " → " + esc(e.object) : ""}</div>` : ""}
			${e.states?.length ? `<div class="sub">Changes recorded: ${e.states.map(s => `${esc(s.entity)}.${esc(s.key)} = ${esc(s.value)}`).join("; ")}</div>` : ""}
			<div style="margin-top:6px">${chips}</div>`;
		// Map: every step faintly, this one strongly, and lines back to earlier steps that share an entity.
		layer.clearLayers();
		steps.forEach((s, k) => s.place && dot(s, k === story.i ? { radius: 9 } : { radius: 5, opacity: k < story.i ? .5 : .2, fillOpacity: k < story.i ? .3 : .05 }));
		if (e.place) L.circleMarker([e.place.lat, e.place.lon], { radius: 22, color: "#b0302a", weight: 2, opacity: .5, fillOpacity: .08, interactive: false }).addTo(story.lines);
		$("storyProgress").firstElementChild.style.width = `${100 * (story.i + 1) / steps.length}%`;
		if (e.place) {
			const mine = new Set(people(e));
			for (const s of steps.slice(0, story.i)) {
				if (!s.place || !people(s).some(n => mine.has(n))) continue;
				L.polyline([[s.place.lat, s.place.lon], [e.place.lat, e.place.lon]], { color: "#7a1f1a", weight: 2, opacity: .55, dashArray: "6 6" })
					.bindTooltip(people(s).filter(n => mine.has(n)).join(", ")).addTo(story.lines);
			}
			map.flyTo([e.place.lat, e.place.lon], Math.max(map.getZoom(), 5), { duration: .8 });
		}
		// Cast graph: entities on a circle, joined when they share a step.
		const { cast, count, pair } = castOf(steps);
		const now = new Set(people(e));
		const pos = new Map(cast.map((n, k) => { const a = 2 * Math.PI * k / cast.length - Math.PI / 2; return [n, [200 + 125 * Math.cos(a), 150 + 110 * Math.sin(a)]]; }));
		let svg = "";
		for (const [k, w] of pair) {
			const [x, y] = k.split("\u0000");
			if (!pos.has(x) || !pos.has(y)) continue;
			const [x1, y1] = pos.get(x), [x2, y2] = pos.get(y);
			const lit = now.has(x) && now.has(y);
			svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${lit ? "#b0302a" : "#c9bfae"}" stroke-width="${1 + w}" opacity="${lit ? 1 : .7}"/>`;
		}
		for (const [n, [x, y]] of pos) {
			const lit = now.has(n);
			svg += `<circle cx="${x}" cy="${y}" r="${4 + 2 * Math.min(count.get(n), 6)}" fill="${lit ? "#b0302a" : "#e2d6c2"}"/>
				<text x="${x}" y="${y + (y < 150 ? -12 : 20)}" text-anchor="middle" data-n="${esc(n)}" font-weight="${lit ? 700 : 400}">${esc(n.length > 26 ? n.slice(0, 25) + "…" : n)}</text>`;
		}
		$("castGraph").innerHTML = svg;
		$("storyList").innerHTML = steps.map((s, k) => `<div class="step ${k === story.i ? "on" : ""}" data-k="${k}"><b>${esc(s.year)}</b> ${esc(s.summary)}</div>`).join("");
		$("storyList").querySelectorAll(".step").forEach(el => el.onclick = () => { stopPlay(); story.i = Number(el.dataset.k); renderStory(); });
		// Keep the current step in view inside the list, without moving the panel (and the card) itself.
		const on = $("storyList").querySelector(".step.on"), box = $("storyList");
		if (on) box.scrollTo({ top: on.offsetTop - box.offsetTop - box.clientHeight / 3, behavior: "smooth" });
		if (story.timer) $("scroll").scrollTo({ top: $("storyPanel").offsetTop - $("scroll").offsetTop, behavior: "smooth" });
		if (!story.timer) $("storyPlay").textContent = story.i >= steps.length - 1 && steps.length > 1 ? "Replay" : "Play";
		document.querySelectorAll("#storyCard .ent, #castGraph text").forEach(el => el.onclick = () => { stopPlay(); story.on = false; pick(el.dataset.n); });
	}
	const stopPlay = () => {
		clearInterval(story.timer); story.timer = null;
		$("storyPlay").textContent = story.on && story.i >= story.steps.length - 1 && story.steps.length > 1 ? "Replay" : "Play";
	};
	// A story needs a span of time. From Year mode it takes the 30 years up to the selected
	// year (the trail's "generation's memory"), or a chosen entity's whole span.
	$("storyBtn").onclick = () => {
		if (state.mode === "year") {
			const mine = state.entities.length ? events.filter(matches) : [];
			[state.from, state.to] = mine.length ? [mine[0].auc, mine.at(-1).auc] : [Math.max(1, state.auc - 30), state.auc];
			$("from").value = label(state.from); $("to").value = label(state.to);
			story.on = true;
			setMode("period");
		} else {
			story.on = true; buildStory(); renderStory();
		}
	};
	$("storyExit").onclick = () => { stopPlay(); story.on = false; render(); };
	$("storyNext").onclick = () => { stopPlay(); story.i = Math.min(story.steps.length - 1, story.i + 1); renderStory(); };
	$("storyPrev").onclick = () => { stopPlay(); story.i = Math.max(0, story.i - 1); renderStory(); };
	$("storyN").onchange = () => { buildStory(); renderStory(); };
	$("storyPlay").onclick = () => {
		if (story.timer) return stopPlay();
		if (story.i >= story.steps.length - 1) story.i = -1; // Replay from the start
		const next = () => {
			if (story.i >= story.steps.length - 1) return stopPlay();
			story.i++;
			renderStory();
			if (story.i >= story.steps.length - 1) stopPlay();
		};
		story.timer = setInterval(next, 4000);
		$("storyPlay").textContent = "Pause";
		next();
	};

	// ---- life view ---------------------------------------------------------------------
	// One entity's history in lanes on a shared time axis: value histories from Agent
	// Memory as bars, events as marks, places it was active in, and the people it meets.
	const PALETTE = ["#b0302a", "#2f6b8a", "#7a8b2f", "#8a5a2f", "#6b3f8a", "#2f8a6b", "#a07a1f", "#4a4a4a", "#c0607a", "#3f6b3f"];
	function lifeView() {
		const n = state.entity;
		const everything = events.filter(e => involves(e, n));
		// Detail: how much to show, most important first; "all" is everything, noise and all.
		const LEVEL = { few: { events: 15, people: 5, named: 4 }, more: { events: 40, people: 10, named: 8 }, lots: { events: 120, people: 20, named: 16 }, all: { events: Infinity, people: Infinity, named: Infinity } }[$("lifeDetail").value];
		const keep = new Set([...everything].sort((a, b) => score(b) - score(a)).slice(0, LEVEL.events));
		const mine = everything.filter(e => keep.has(e));
		const all = $("lifeAll").checked;
		// The span follows what is shown (and the entity's own birth and death), not stray
		// mentions at the edges such as a relative born decades earlier.
		const own_ = everything.filter(e => (e.kind === "birth" || e.kind === "death") && (e.actor === n || e.cast?.[0] === n));
		const shown = [...mine, ...own_].map(e => e.auc);
		let lo = all ? 1 : Math.max(1, Math.min(...shown) - 3), hi = all ? 2206 : Math.min(2206, Math.max(...shown) + 3);
		// Value lanes: the entity's own histories, then histories that name it as a value.
		const own = (historiesOf.get(n) ?? []).map(h => ({ label: h.key.replace(/_/g, " "), chain: h.chain }));
		const asValue = [];
		for (const h of histories) {
			if (h.entity === n) continue;
			const segs = h.chain.filter(c => String(c.value).split(/ and |, /).includes(n) || c.value === n);
			if (segs.length) asValue.push({ label: `${h.entity} · ${h.key.replace(/_/g, " ")}`, chain: segs, entity: h.entity, full: h.chain });
		}
		// A value held by a person ends at their death, when nothing in the data supersedes it.
		const died = everything.find(e => e.kind === "death" && (e.actor === n || e.cast?.[0] === n))?.auc;
		if (died) for (const l of [...own, ...asValue]) l.chain = l.chain.filter(c => c.from <= died).map(c => ({ ...c, until: c.until === null || c.until > died ? died : c.until }));
		if (!all && !mine.length) { const cs = [...own, ...asValue].flatMap(l => l.chain.map(c => c.from)); if (cs.length) { lo = Math.max(1, Math.min(...cs) - 5); hi = Math.min(2206, Math.max(...cs) + 5); } }
		// People: who shares the most events with this entity.
		const met = new Map();
		for (const e of mine) for (const m of new Set(e.cast ?? [])) if (m !== n && m !== e.place?.title) met.set(m, [...(met.get(m) ?? []), e]);
		for (const e of everything) if (!keep.has(e)) for (const m of new Set(e.cast ?? [])) if (m !== n && m !== e.place?.title) met.set(m, [...(met.get(m) ?? []), e]);
		for (const [m, evs] of met) met.set(m, evs.sort((a, b) => a.auc - b.auc));
		const people = [...met].sort((a, b) => b[1].length - a[1].length).slice(0, LEVEL.people);
		// Places: where its events happened, the most frequent eight get colours.
		const placeCount = new Map();
		for (const e of mine) if (e.place?.title) placeCount.set(e.place.title, (placeCount.get(e.place.title) ?? 0) + 1);
		const topPlaces = [...placeCount].sort((a, b) => b[1] - a[1]).slice(0, PALETTE.length).map(([p]) => p);
		const colourOf = p => PALETTE[topPlaces.indexOf(p)] ?? "#bbb";

		const W = Math.max(900, Math.min(1360, window.innerWidth * .94)), L0 = 230, R0 = 20, laneH = 22;
		const x = a => L0 + (a - lo) / Math.max(1, hi - lo) * (W - L0 - R0);
		let y = 34, svg = "";
		const lanes = [];
		const group = t => { svg += `<text class="group" x="8" y="${y + 14}">${esc(t)}</text>`; y += 22; };
		const laneLabel = (t, target) => `<text x="8" y="${y + 15}" ${target ? `class="lane-label" data-n="${esc(target)}"` : ""}>${esc(t.length > 34 ? t.slice(0, 33) + "…" : t)}</text>`;
		const bar = (c, i, title) => {
			const a = Math.max(lo, c.from), b = Math.min(hi, c.until ?? Math.max(c.from + 1, hi));
			if (b < lo || a > hi) return "";
			const w = Math.max(2, x(b) - x(a));
			return `<rect class="mark" x="${x(a)}" y="${y + 4}" width="${w}" height="${laneH - 8}" rx="3" fill="${PALETTE[i % PALETTE.length]}" opacity=".8" data-tip="${esc(`${title}: ${c.value}, from ${label(c.from)}${c.until ? " to " + label(c.until) : ""}`)}"/>`
				+ (w > 60 ? `<text x="${x(a) + 4}" y="${y + 15}" style="fill:#fff; pointer-events:none">${esc(String(c.value).slice(0, Math.floor(w / 6.5)))}</text>` : "");
		};
				// axis
		const step = [10, 25, 50, 100, 200, 250, 500].find(s => (hi - lo) / s <= 12) ?? 500;
		let axis = "";
		for (let a = Math.ceil(lo / step) * step; a <= hi; a += step) {
			const yr = a <= 753 ? 754 - a : a - 753, nice = Math.round(yr / step) * step;
			const at = a <= 753 ? 754 - nice : nice + 753;
			if (at < lo || at > hi) continue;
			axis += `<line x1="${x(at)}" x2="${x(at)}" y1="24" y2="100%" stroke="#eee"/><text x="${x(at)}" y="16" text-anchor="middle">${esc(label(at))}</text>`;
		}
		// the selected year on the map
		const now = state.mode === "year" ? state.auc : null;

		if (own.length) {
			group("In memory: " + n);
			for (const [i, l] of own.entries()) { svg += laneLabel(l.label) + l.chain.map(c => bar(c, i, l.label)).join(""); y += laneH; }
		}
		if (asValue.length) {
			group(`Named in other histories`);
			const ranked = asValue.map(l => ({ ...l, weight: l.chain.reduce((t, c) => t + Math.max(1, Math.min(c.until ?? c.from + 1, 2206) - c.from), 0) })).sort((p, q) => q.weight - p.weight);
			if (ranked.length > LEVEL.named) group(`(${ranked.length - LEVEL.named} more at a higher detail level)`);
			for (const [i, l] of ranked.slice(0, LEVEL.named).entries()) { svg += laneLabel(l.label, l.entity) + l.chain.map(c => bar(c, i + 3, l.label)).join(""); y += laneH; }
		}
		group(`Events (${mine.length} of ${everything.length}, most important first)`);
		const kindShape = (e, cx, cy) => e.kind === "birth" ? `<circle cx="${cx}" cy="${cy}" r="4" fill="#fff" stroke="#2f6b8a" stroke-width="2"` : e.kind === "death" ? `<rect x="${cx - 4}" y="${cy - 4}" width="8" height="8" fill="#333"` : `<path d="M${cx} ${cy - 5} L${cx + 5} ${cy} L${cx} ${cy + 5} L${cx - 5} ${cy} Z" fill="${e.rome === "core" ? "#b0302a" : "#c98c86"}"`;
		const tipOf = e => `${e.year}${e.day ? ", " + dayLabel(e.day) : ""}: ${e.summary}${e.place ? ` (${e.place.title})` : ""}`;
		svg += laneLabel("births ○  deaths ■  events ◆");
		mine.forEach((e, i) => { svg += `${kindShape(e, x(e.auc), y + 11)} class="mark" data-i="${i}" data-tip="${esc(tipOf(e))}"/>`; });
		y += laneH;
		if (topPlaces.length) {
			svg += laneLabel("Places") ;
			mine.forEach((e, i) => { if (e.place?.title) svg += `<rect class="mark" x="${x(e.auc) - 2}" y="${y + 5}" width="4" height="${laneH - 10}" fill="${colourOf(e.place.title)}" data-i="${i}" data-tip="${esc(tipOf(e))}"/>`; });
			y += laneH;
			svg += `<text x="${L0}" y="${y + 12}">${topPlaces.map(p => `<tspan fill="${colourOf(p)}">■</tspan> ${esc(p)} (${placeCount.get(p)})`).join("   ")}</text>`;
			y += laneH;
		}
		if (people.length) {
			group("People and powers it meets most");
			for (const [m, evs] of people) {
				const a = evs[0].auc, b = evs.at(-1).auc;
				svg += laneLabel(`${m} (${evs.length})`, m) + `<line x1="${x(a)}" x2="${x(Math.max(b, a + .5))}" y1="${y + 11}" y2="${y + 11}" stroke="#d9cfbf" stroke-width="4" stroke-linecap="round"/>`;
				for (const e of evs) svg += `<circle class="mark" cx="${x(e.auc)}" cy="${y + 11}" r="${keep.has(e) ? 4 : 2.5}" fill="${keep.has(e) ? "#7a1f1a" : "#c9a9a6"}" data-g="${events.indexOf(e)}" data-tip="${esc(tipOf(e))}"/>`;
				y += laneH;
			}
		}
		const H = y + 10;
		const nowLine = now && now >= lo && now <= hi ? `<line x1="${x(now)}" x2="${x(now)}" y1="24" y2="${H}" stroke="#7a1f1a" stroke-dasharray="4 3"/>` : "";
		$("lifeBody").innerHTML = `<svg width="${W}" height="${H}">${axis}${nowLine}${svg}</svg>`;
		$("lifeTitle").textContent = n;
		$("lifeSub").textContent = everything.length ? `${everything.length} events, ${everything[0].year} to ${everything.at(-1).year}${own.length ? `; ${own.length} value histories` : ""}${asValue.length ? `; named in ${asValue.length} other histories` : ""}` : "no events";
		// interactions
		const tip = $("lifeTip");
		$("lifeBody").querySelectorAll("[data-tip]").forEach(el => {
			el.onmousemove = ev => { tip.hidden = false; tip.textContent = el.dataset.tip; tip.style.left = Math.min(ev.clientX + 12, window.innerWidth - 360) + "px"; tip.style.top = ev.clientY + 12 + "px"; };
			el.onmouseleave = () => tip.hidden = true;
		});
		$("lifeBody").querySelectorAll("[data-i], [data-g]").forEach(el => el.onclick = () => {
			const e = el.dataset.g !== undefined ? events[Number(el.dataset.g)] : mine[Number(el.dataset.i)];
			$("lifeDlg").close(); tip.hidden = true;
			setMode("year"); state.auc = e.auc; $("slider").value = e.auc; render();
			if (e.place) map.flyTo([e.place.lat, e.place.lon], Math.max(map.getZoom(), 6), { duration: .6 });
		});
		$("lifeBody").querySelectorAll(".lane-label").forEach(el => el.onclick = () => { tip.hidden = true; pick(el.dataset.n); lifeView(); });
	}
	$("lifeBtn").onclick = () => { lifeView(); if (!$("lifeDlg").open) $("lifeDlg").showModal(); };
	$("lifeAll").onchange = lifeView;
	$("lifeDetail").onchange = lifeView;
	$("lifeClose").onclick = () => { $("lifeTip").hidden = true; $("lifeDlg").close(); };

	// ---- tour ----------------------------------------------------------------------------
	// A short walk through the page: each step spotlights one part and some act it out.
	const TOUR = [
		{ el: "#map", title: "The map", text: "Every dot is an event in the history of Rome, from its founding in 753 BC to the fall of Constantinople in 1453. A solid dot's place is stated in the source; a hollow, dashed one was worked out from the event. Hover a dot to read it." },
		{ el: "#yearCtl", title: "Pick a year", text: "Drag the slider to move through time, one year at a time. The faded dots are the previous 30 years, about a generation's memory.", before: () => { setMode("year"); state.auc = 538; $("slider").value = 538; render(); } },
		{ el: ".seg", title: "Year or period", text: "Year shows a single year. Period shows a span, such as a war or a reign, with older events drawn lighter." },
		{ el: ".search", title: "Follow a person, place or state", text: "Type a name and press Enter. Add several, then choose whether to show events involving any of them or all of them: Hannibal or Scipio, or only the events they share.", before: () => { state.entities = []; pick("Julius Caesar"); setMode("period"); $("lifetime").click(); } },
		{ el: "#entityPanel", title: "What memory holds", text: "The panel shows the chosen entity's activity over time and its values in Agent Memory as of the selected time: rulers, offices, who controlled a place. Compare two years to see what changed between them.", before: () => { $("scroll").scrollTop = 0; } },
		{ el: "#lifeBtn", title: "Life view", text: "Opens a timeline of the entity's whole history: offices held, events, places, and the people it met most. Start with a few of the most important and raise the detail when you want more." },
		{ el: "#storyBtn", title: "Story", text: "Picks the main events of the current period and filters and plays them in order, flying the map from one to the next and showing who appears together." },
		{ el: "#filters", title: "Filters", text: "Show or hide births, deaths and events, Rome itself or the peoples it dealt with, places that were inferred, and only what is inside the map's current view." },
		{ el: "#exportBtn", title: "Export for an LLM", text: "Builds a prompt with the facts that match your period and filters, for you to paste into the LLM of your choice to write an article. Agent Memory stores and retrieves facts; it does not write the text.", after: () => { stopPlay(); story.on = false; state.entities = []; state.entity = null; setMode("year"); state.auc = 253; $("slider").value = 253; render(); } },
	];
	let tourAt = 0;
	function tourShow() {
		const t = TOUR[tourAt];
		t.before?.();
		const el = document.querySelector(t.el);
		const r = el.getBoundingClientRect(), pad = 6;
		const sx = r.left - pad, sy = r.top - pad, sw = r.width + 2 * pad, sh = Math.min(r.height, innerHeight - 20) + 2 * pad;
		Object.assign($("tourSpot").style, { left: sx + "px", top: sy + "px", width: sw + "px", height: sh + "px" });
		// Dim everything except the spotlight: the whole screen, with the spot cut out.
		$("tourDim").firstElementChild.setAttribute("d", `M0 0H${innerWidth}V${innerHeight}H0Z M${sx} ${sy}h${sw}v${sh}h${-sw}Z`);
		$("tourCount").textContent = `${tourAt + 1} of ${TOUR.length}`;
		$("tourTitle").textContent = t.title;
		$("tourText").textContent = t.text;
		$("tourBack").disabled = tourAt === 0;
		$("tourNext").textContent = tourAt === TOUR.length - 1 ? "Done" : "Next";
		// The card goes beside the spotlight where there is room, else over the map.
		const card = $("tourCard"), cw = 320, ch = card.offsetHeight || 180;
		let left = r.right + 16 + cw < innerWidth ? r.right + 16 : r.left - cw - 16;
		if (left < 8) left = Math.min(Math.max(8, r.left), innerWidth - cw - 8);
		let top = Math.min(Math.max(8, r.top), innerHeight - ch - 8);
		if (r.width > innerWidth * .5 && r.height > innerHeight * .6) { left = 24; top = innerHeight - ch - 24; }
		Object.assign(card.style, { left: left + "px", top: top + "px" });
	}
	function tourEnd() { TOUR[TOUR.length - 1].after?.(); $("tour").hidden = true; }
	$("tourBtn").onclick = () => { tourAt = 0; $("tour").hidden = false; tourShow(); };
	$("tourNext").onclick = () => { if (tourAt >= TOUR.length - 1) return tourEnd(); tourAt++; tourShow(); };
	$("tourBack").onclick = () => { if (tourAt > 0) { tourAt--; tourShow(); } };
	$("tourSkip").onclick = tourEnd;
	addEventListener("resize", () => { if (!$("tour").hidden) tourShow(); });
	addEventListener("keydown", ev => { if ($("tour").hidden) return; if (ev.key === "Escape") tourEnd(); if (ev.key === "ArrowRight") $("tourNext").click(); if (ev.key === "ArrowLeft") $("tourBack").click(); });

	// ---- export ------------------------------------------------------------------------
	function filtersSummary() {
		const off = [];
		if (!$("kEvent").checked) off.push("events"); if (!$("kBirth").checked) off.push("births"); if (!$("kDeath").checked) off.push("deaths");
		if (!$("sCore").checked) off.push("Roman events"); if (!$("sContact").checked) off.push("Rome's contacts");
		const parts = [];
		if (state.entities.length) parts.push(`only entries involving ${entityPhrase()}`);
		if ($("inView").checked) { const c = map.getBounds(); parts.push(`only places between latitudes ${c.getSouth().toFixed(1)} and ${c.getNorth().toFixed(1)} and longitudes ${c.getWest().toFixed(1)} and ${c.getEast().toFixed(1)}`); }
		if (off.length) parts.push(`excluding ${off.join(", ")}`);
		return parts.length ? parts.join("; ") : "none";
	}
	function defaultSubject() {
		const [a, b] = span();
		const when = a === b ? label(a) : `${label(a)} to ${label(b)}`;
		// The facts are where the entity meets Roman history, not its whole life.
		if (state.entities.length) return `${entityPhrase()}, as recorded in the history of Rome`;
		if ($("inView").checked) return `The Roman world in the area shown on the map, ${when}`;
		return `Rome, ${when}`;
	}
	function buildPrompt() {
		const [a, b] = span();
		const sel = selected();
		const words = Number($("exWords").value) || 2000;
		const subj = $("exSubject").value.trim() || defaultSubject();
		// The period stated is the span of the facts themselves, not of the controls.
		const [fa, fb] = sel.length ? [sel[0].auc, sel.at(-1).auc] : [a, b];
		const states = [];
		// 1. The chosen entities' own values: where each one starts and every change.
		for (const n of state.entities) for (const h of historiesOf.get(n) ?? []) {
			const start = valueAt(h, fa), changes = h.chain.filter(c => c.from > fa && c.from <= fb);
			if (start === undefined && !changes.length) continue;
			const parts = [...(start !== undefined ? [`${start} at the start`] : []), ...changes.map(c => `${c.value} from ${label(c.from)}`)];
			states.push(`- ${n}, ${h.key.replace(/_/g, " ")}: ${parts.join("; ")}`);
		}
		// 2. The places of the events, as they stood when each event happened: only the
		// values current then, and a new line only when they differ from the last one.
		const SLOW_KEYS = /^(controlled_by|government|capital|founded_by|state_religion)$/;
		const lastAt = new Map();
		for (const e of sel) {
			const pl = e.place?.title;
			if (!pl || state.entities.includes(pl)) continue;
			// A value lasts until something supersedes it, and in sparse data that can be
			// centuries. Keep values set in the 60 years before the event, apart from
			// slow-changing keys, and give the year each one dates from.
			const vals = (historiesOf.get(pl) ?? []).map(h => {
				const c = h.chain.find(c => c.from <= e.auc && (c.until === null || e.auc < c.until));
				if (!c || PLACEHOLDER.test(c.value)) return null;
				if (!SLOW_KEYS.test(h.key) && e.auc - c.from > 60) return null;
				return [h.key.replace(/_/g, " "), `${c.value} (from ${label(c.from)})`];
			}).filter(Boolean);
			if (!vals.length) continue;
			const sig = JSON.stringify(vals);
			if (lastAt.get(pl) === sig) continue;
			lastAt.set(pl, sig);
			states.push(`- ${pl} in ${e.year}: ${vals.map(([k, v]) => `${k} ${v}`).join("; ")}`);
		}
		// 3. Anything else the events themselves change.
		const elsewhere = new Map();
		for (const e of sel) for (const st of e.states ?? []) {
			if (state.entities.includes(st.entity) || lastAt.has(st.entity) || PLACEHOLDER.test(st.value)) continue;
			const k = `${st.entity}, ${st.key.replace(/_/g, " ")}`;
			const ln = `${st.value} from ${e.year}`;
			if (!(elsewhere.get(k) ?? []).includes(ln)) elsewhere.set(k, [...(elsewhere.get(k) ?? []), ln]);
		}
		for (const [k, v] of elsewhere) states.push(`- ${k}: ${v.join("; ")}`);
		const line = e => {
			const marks = [e.approximate && "approximate date", e.precision === "decade" && "from a decade summary"].filter(Boolean);
			const place = e.place ? ` Place: ${e.place.title}${e.place.basis === "inferred" ? " (inferred from context)" : ""}.` : "";
			const orig = $("exText").checked && e.text !== e.summary ? ` Original wording: "${e.text}"` : "";
			return `- ${e.year}${e.day ? ", " + dayLabel(e.day) : ""}${marks.length ? ` (${marks.join(", ")})` : ""}: ${e.summary}${place}${orig} Source: ${e.source}`;
		};
		const text = `Write an article of about ${words} words for ${$("exAudience").value}.

Subject: ${subj}
Period: ${label(fa)} to ${label(fb)}

Use only the facts listed below. They were exported from SurrealDB Agent Memory, which holds events taken from Wikipedia's year pages and its "Timeline of Roman history" for every year from the founding of Rome (753 BC) to the fall of Constantinople (AD 1453). Agent Memory stores and retrieves facts; it did not write any of this text.

- Keep the uncertainty a fact carries, in natural wording: an "approximate date" or one "from a decade summary" is not exact ("around 600 BC"), a place "inferred from context" was worked out rather than stated ("probably at Como"), and many early Roman dates are traditional rather than recorded. Do not repeat these labels in the article.
- Do not add events, people or numbers that are not in the list. Where the facts leave a gap the subject needs, say briefly that little is recorded, without discussing the data itself.
- Some events appear twice from different source pages; treat them as one.
- Stay close to the requested length.
- Give the sources you relied on at the end, using the links provided.${state.entities.length ? `
- The facts are the points where ${entityPhrase()} appear${state.entities.length === 1 ? "s" : ""} in the history of Rome. Write about those, not a full account of everything else known about ${state.entities.length === 1 ? "the subject" : "them"}.` : ""}

Filters applied to the facts: ${filtersSummary()}.
${states.length ? `
## Rulers, control and offices (from Agent Memory's value histories)

Values for a place are as they stood when the event at that place happened.

${states.join("\n")}
` : ""}
## Events (${sel.length})

${sel.map(line).join("\n")}
`;
		$("exOut").value = text;
		const tokens = Math.round(text.length / 4);
		$("exStats").textContent = `${sel.length} events, ${text.length.toLocaleString()} characters, about ${tokens.toLocaleString()} tokens${tokens > 120000 ? " - too long for some LLMs; narrow the period or filters" : ""}`;
	}
	$("exportBtn").onclick = () => { $("exSubject").value = defaultSubject(); buildPrompt(); $("exportDlg").showModal(); };
	$("exportClose").onclick = () => $("exportDlg").close();
	$("exBuild").onclick = buildPrompt;
	$("exCopy").onclick = async () => { await navigator.clipboard.writeText($("exOut").value); $("exCopy").textContent = "Copied"; setTimeout(() => $("exCopy").textContent = "Copy", 1500); };
	$("exSave").onclick = () => {
		const a = document.createElement("a");
		a.href = URL.createObjectURL(new Blob([$("exOut").value], { type: "text/markdown" }));
		a.download = ($("exSubject").value || "rome").replace(/[^\w]+/g, "-").toLowerCase() + ".md";
		a.click();
	};

	// Links can open a chosen view: ?year=216 BC, ?from=218 BC&to=201 BC, ?entity=Hannibal
	// (several separated by "|", with &join=all for events involving all of them).
	const params = new URLSearchParams(location.search);
	if (params.get("year") && parseYear(params.get("year")) !== null) state.auc = parseYear(params.get("year"));
	for (const n of (params.get("entity") ?? "").split("|").map(x => x.trim()).filter(Boolean)) {
		const c = canon(n);
		if (nameCount.has(c)) { if (!state.entities.includes(c)) state.entities.push(c); state.entity = c; }
	}
	if (params.get("join") === "all") state.join = "all";
	const at = (params.get("at") ?? "").split(",").map(Number); // ?at=lat,lon,zoom
	if (at.length === 3 && at.every(Number.isFinite)) map.setView([at[0], at[1]], at[2], { animate: false });
	if (params.get("from") && params.get("to") && parseYear(params.get("from")) !== null && parseYear(params.get("to")) !== null) {
		state.from = parseYear(params.get("from")); state.to = parseYear(params.get("to"));
		$("from").value = label(state.from); $("to").value = label(state.to);
		state.mode = "period";
	}
	$("slider").value = state.auc;
	setMode(state.mode);
	// The tour runs only from the How to use button, never on its own.
})();
