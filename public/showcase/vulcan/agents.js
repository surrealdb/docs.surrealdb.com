(() => {
	const $ = (id) => document.getElementById(id);
	const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
	const SETUPS = ["page", "history", "memory"];
	const HAS = {
		page: "Can fetch today's Wikipedia article and nothing else.",
		history: "Can fetch today's article, its revision history and the MediaWiki API, and is told to search the history when the page is not enough.",
		memory: "Can search Agent Memory, which holds the article's history, with read-only tools: recall, context, reflect and inspect.",
	};
	const runs = DATA.runs;
	const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
	// Every pairing of model and setup that has scored runs, in the order the page discusses them.
	const ORDER = [
		["claude-sonnet-5", "memory"],
		["claude-haiku-4-5-20251001", "memory"],
		["claude-opus-5-5", "history"],
		["claude-sonnet-5", "history"],
		["claude-sonnet-5", "page"],
		["claude-opus-5-5", "page"],
	];
	const TOOLS = { memory: "Agent Memory", history: "Page + history", page: "Today's page" };
	const configs = ORDER.filter(([m, s]) => runs.some((r) => r.model === m && r.setup === s)).map(([model, setup]) => {
		const mine = runs.filter((r) => r.model === model && r.setup === setup);
		const tags = [...new Set(mine.map((r) => r.run))];
		return {
			model,
			setup,
			label: `${TOOLS[setup]} (${DATA.models[model]})`,
			short: `${esc(TOOLS[setup])}<br><span class="nw">(${esc(DATA.models[model])})</span>`,
			score: mean(tags.map((t) => mine.filter((r) => r.run === t).reduce((a, r) => a + r.score, 0))),
			calls: mean(mine.map((r) => r.calls.length)),
			tokens: mean(mine.map((r) => r.tokens)),
			seconds: mean(mine.map((r) => r.seconds)),
			cost: mean(mine.map((r) => r.cost)),
			byQuestion: (q) => mean(mine.filter((r) => r.question === q).map((r) => r.score)),
		};
	});
	const pick = (model, setup, q, run) => runs.find((r) => r.model === model && r.setup === setup && r.question === q && r.run === run);

	const rowsHtml = configs
		.map(
			(c) =>
				`<tr><td><b>${esc(TOOLS[c.setup])}</b> (${esc(DATA.models[c.model])})</td><td><b>${c.score.toFixed(1)}</b> / 38<span class="meter"><i style="width:${(100 * c.score) / 38}%"></i></span></td><td>${c.calls.toFixed(1)}</td><td>${Math.round(c.tokens / 1000)}k</td><td>${Math.round(c.seconds)} s</td><td>$${c.cost.toFixed(3)}</td></tr>`,
		)
		.join("");
	$("sum").innerHTML = `<tr><th>Agent</th><th>Score, mean of 3 runs</th><th>Tool calls</th><th>Input tokens</th><th>Time</th><th>Cost</th></tr>${rowsHtml}<tr><td colspan="6" style="color:var(--dim);font-size:12.5px;text-align:left;border:0">Tool calls, tokens, time and cost are means per question.</td></tr>`;

	// Accuracy against cost.
	{
		const W = 640;
		const H = 300;
		const L = 54;
		const B = 40;
		const maxCost = Math.max(...configs.map((c) => c.cost)) * 1.15;
		// Cost falls from left to right, so the best corner, accurate and cheap, is the top right.
		const x = (v) => W - 20 - ((W - L - 20) * v) / maxCost;
		const y = (v) => H - B - ((H - B - 14) * v) / 38;
		const colour = { memory: "var(--accent)", history: "var(--accent2)", page: "var(--ink2)" };
		let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Score against cost per question for each agent">`;
		// A shaded grid behind the points, blended between four corner colours:
		// accurate and cheap at the top right, costly and inaccurate at the bottom left.
		{
			const corners = { tl: [201, 162, 39], tr: [143, 181, 115], bl: [208, 119, 95], br: [127, 168, 184] };
			const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
			const x0 = L;
			const x1 = W - 20;
			const y0 = 14;
			const y1 = H - B;
			const cols = 24;
			const rows = 12;
			const cw = (x1 - x0) / cols;
			const ch = (y1 - y0) / rows;
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const tx = (c + 0.5) / cols;
					const ty = (r + 0.5) / rows;
					const rgb = mix(mix(corners.tl, corners.tr, tx), mix(corners.bl, corners.br, tx), ty).map(Math.round);
					svg += `<rect x="${x0 + c * cw}" y="${y0 + r * ch}" width="${cw}" height="${ch}" fill="rgb(${rgb})" fill-opacity="0.34" stroke="var(--bg)" stroke-opacity="0.5" stroke-width="1"/>`;
				}
			}
			const corner = (x, y, anchor, text) => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="zone">${text}</text>`;
			svg += corner(x0 + 8, y0 + 16, "start", "Accurate and costly");
			svg += corner(x1 - 8, y0 + 16, "end", "Accurate and cheap");
			svg += corner(x0 + 8, y1 - 8, "start", "Costly and inaccurate");
			svg += corner(x1 - 8, y1 - 8, "end", "Cheap and inaccurate");
		}
		for (let v = 0; v <= 38; v += 10) svg += `<line x1="${L}" x2="${W - 20}" y1="${y(v)}" y2="${y(v)}" class="g"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
		const step = maxCost > 0.3 ? 0.1 : 0.05;
		for (let v = 0; v <= maxCost; v += step) svg += `<text x="${x(v)}" y="${H - B + 18}" text-anchor="middle">$${v.toFixed(2)}</text>`;
		svg += `<text x="${(L + W) / 2}" y="${H - 4}" text-anchor="middle">Cost per question, falling to the right</text><text x="14" y="${(H - B) / 2}" text-anchor="middle" transform="rotate(-90 14 ${(H - B) / 2})">Score out of 38</text>`;
		// Place each label beside its point, trying the right, the left, then above
		// and below, and take the first spot that covers no other point or label.
		const width = (t) => t.length * 6.6;
		const pts = configs.map((c) => ({ c, cx: x(c.cost), cy: y(c.score) }));
		const placed = [];
		const clear = (bx0, by, bw) =>
			bx0 > L &&
			bx0 + bw < W - 20 &&
			!placed.some((b) => bx0 < b.x1 && bx0 + bw > b.x0 && Math.abs(by - b.y) < 15) &&
			!pts.some((p) => p.cx > bx0 - 8 && p.cx < bx0 + bw + 8 && p.cy > by - 18 && p.cy < by + 8);
		for (const p of [...pts].sort((a, b) => b.c.score - a.c.score)) {
			const w = width(p.c.label);
			const spots = [
				[p.cx + 11, p.cy + 4],
				[p.cx - 11 - w, p.cy + 4],
				[p.cx - w / 2, p.cy - 12],
				[p.cx - w / 2, p.cy + 22],
			];
			const [bx, by] = spots.find(([sx, sy]) => clear(sx, sy, w)) || spots[0];
			placed.push({ x0: bx, x1: bx + w, y: by });
			svg += `<circle cx="${p.cx}" cy="${p.cy}" r="6.5" fill="${colour[p.c.setup]}"/>`;
			p.label = `<text x="${bx}" y="${by}" class="pl">${esc(p.c.label)}</text>`;
		}
		svg += pts.map((p) => p.label).join("");
		$("chart").innerHTML = `${svg}</svg>`;
	}

	// Every question, scored for every agent.
	{
		const cell = (v) => `<td class="sc" style="background:rgba(143,181,115,${(0.08 + 0.5 * v) / 2 + 0.04})">${v.toFixed(v % 1 ? 1 : 0)}</td>`;
		let html = `<thead><tr><th>Question</th>${configs.map((c) => `<th>${c.short}</th>`).join("")}</tr></thead><tbody>`;
		let section = null;
		for (const q of DATA.questions) {
			if (q.section !== section) {
				section = q.section;
				html += `<tr class="sec"><td colspan="${configs.length + 1}">${esc(section)}</td></tr>`;
			}
			html += `<tr data-q="${q.id}"><td><b>${q.id}</b> ${esc(q.question)}</td>${configs.map((c) => cell(c.byQuestion(q.id))).join("")}</tr>`;
		}
		$("grid").innerHTML = `${html}</tbody>`;
		$("grid").addEventListener("click", (e) => {
			const tr = e.target.closest("tr[data-q]");
			if (tr) {
				current = tr.dataset.q;
				render();
				$("ask").scrollIntoView({ behavior: "smooth", block: "start" });
			}
		});
	}

	// A small markdown renderer: headings, lists, tables, bold, italic, code and links.
	const inline = (s) =>
		esc(s)
			.replace(/`([^`]+)`/g, "<code>$1</code>")
			.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
			.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>")
			.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
	const md = (text) => {
		const out = [];
		let list = null;
		let table = null;
		const close = () => {
			if (list) out.push(`</${list}>`);
			if (table) out.push("</table>");
			list = table = null;
		};
		for (const raw of text.split("\n")) {
			const line = raw.trimEnd();
			let m;
			if (!line.trim()) {
				close();
			} else if ((m = line.match(/^#{1,6}\s+(.*)/))) {
				close();
				out.push(`<h5>${inline(m[1])}</h5>`);
			} else if ((m = line.match(/^\s*([-*]|\d+\.)\s+(.*)/))) {
				const kind = /\d/.test(m[1]) ? "ol" : "ul";
				if (list !== kind) {
					close();
					out.push(`<${kind}>`);
					list = kind;
				}
				out.push(`<li>${inline(m[2])}</li>`);
			} else if (line.trim().startsWith("|")) {
				if (/^\|[\s:|-]+\|$/.test(line.trim())) continue;
				if (!table) {
					close();
					out.push("<table>");
					table = true;
				}
				const cells = line.trim().slice(1, -1).split("|");
				out.push(`<tr>${cells.map((c) => `<td>${inline(c.trim())}</td>`).join("")}</tr>`);
			} else if (/^-{3,}$/.test(line.trim())) {
				close();
			} else {
				if (list || table) close();
				out.push(`<p>${inline(line)}</p>`);
			}
		}
		close();
		return out.join("");
	};

	// Questions
	let current = "C2";
	let run = "1";
	const has = (m, setup) => configs.some((c) => c.model === m && c.setup === setup);
	const textModels = ["claude-sonnet-5", "claude-opus-5-5"].filter((m) => has(m, "page"));
	const memoryModels = ["claude-sonnet-5", "claude-haiku-4-5-20251001"].filter((m) => has(m, "memory"));
	let textModel = textModels[0];
	let memoryModel = memoryModels[0];
	const sections = [];
	for (const q of DATA.questions) {
		let sec = sections.find((s) => s.name === q.section);
		if (!sec) sections.push((sec = { name: q.section, qs: [] }));
		sec.qs.push(q);
	}
	$("qs").innerHTML = sections
		.map((s) => `<div class="sec"><span>${esc(s.name)}</span>${s.qs.map((q) => `<button data-q="${q.id}" title="${esc(q.question)}">${q.id}</button>`).join("")}</div>`)
		.join("");
	$("qs").addEventListener("click", (e) => {
		const b = e.target.closest("button");
		if (b) {
			current = b.dataset.q;
			render();
		}
	});
	$("runs").addEventListener("click", (e) => {
		const b = e.target.closest("button");
		if (!b) return;
		if (b.dataset.run) run = b.dataset.run;
		if (b.dataset.text) textModel = b.dataset.text;
		if (b.dataset.mem) memoryModel = b.dataset.mem;
		render();
	});

	const decode = (s) => {
		try {
			return decodeURIComponent(s);
		} catch {
			return s;
		}
	};
	const callText = (c) => {
		if (c.tool === "fetch") return `fetch <code>${esc(decode(c.detail).slice(0, 140))}</code>`;
		return `${esc(c.tool)} <code>${esc(c.detail)}</code>`;
	};
	const dots = (n) => `<span class="dots">${[0, 1].map((i) => `<i class="${i < n ? "f" : ""}"></i>`).join("")}</span>`;

	function render() {
		for (const b of $("qs").querySelectorAll("button")) b.setAttribute("aria-selected", b.dataset.q === current);
		const q = DATA.questions.find((x) => x.id === current);
		$("ask").innerHTML = `<p class="q">${esc(q.question)}</p><p class="exp"><b>Answer key:</b> ${inline(q.expected)}</p>`;
		const choice = (label, attr, models, chosen) =>
			models.length > 1
				? `<span class="gap">${label}</span>${models.map((m) => `<button data-${attr}="${m}" aria-selected="${m === chosen}">${esc(DATA.models[m])}</button>`).join("")}`
				: "";
		for (const r of $("grid").querySelectorAll("tr[data-q]")) r.classList.toggle("on", r.dataset.q === current);
		$("runs").innerHTML =
			"<span>Run</span>" +
			["1", "2", "3"].map((n) => `<button data-run="${n}" aria-selected="${n === run}">${n}</button>`).join("") +
			choice("Model for the text agents", "text", textModels, textModel) +
			choice("Model with Agent Memory", "mem", memoryModels, memoryModel);
		$("cols").innerHTML = SETUPS.map((s) => {
			const m = s === "memory" ? memoryModel : textModel;
			const r = pick(m, s, current, run);
			const all = ["1", "2", "3"].map((n) => pick(m, s, current, n)?.score ?? "-");
			return `<section class="col ${s === "memory" ? "mem" : ""}">
				<h3>${esc(DATA.setups[s])} <span class="mdl">${esc(DATA.models[m])}</span></h3>
				<p class="has">${esc(HAS[s])}</p>
				<p class="score">${dots(r.score)} ${r.score} of 2 <span style="color:var(--dim);font-weight:400">· runs: ${all.join(", ")}</span></p>
				<p class="why">${esc(r.why)}</p>
				<p class="cost">${Math.round(r.tokens / 1000)}k tokens · ${Math.round(r.seconds)} s · $${r.cost.toFixed(2)}</p>
				<details><summary>${r.calls.length} tool call${r.calls.length === 1 ? "" : "s"}</summary><ol>${r.calls.map((c) => `<li>${callText(c)}</li>`).join("")}</ol></details>
				<div class="ans">${md(r.answer)}</div>
			</section>`;
		}).join("");
	}
	render();
})();
