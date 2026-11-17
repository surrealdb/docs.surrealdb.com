(() => {
	const $ = (id) => document.getElementById(id);
	const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
	const t0 = Date.parse(DATA.first);
	const t1 = Date.parse("2026-10-31");
	const pos = (d) => (100 * ((d ? Date.parse(d) : t1) - t0)) / (t1 - t0);
	const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
	const tip = $("tip");
	const showTip = (e, html) => {
		tip.innerHTML = html;
		tip.style.display = "block";
		tip.style.left = `${Math.min(e.clientX + 12, innerWidth - 330)}px`;
		tip.style.top = `${e.clientY + 14}px`;
	};
	const hideTip = () => (tip.style.display = "none");
	const hover = (el, html) => {
		el.addEventListener("mousemove", (e) => showTip(e, html));
		el.addEventListener("mouseleave", hideTip);
	};

	$("lede").textContent =
		`The English Wikipedia article on Vulcan, a town of 1,769 people in southern Alberta, has been edited ${DATA.revisions} times since ${fmt(DATA.first)}. Today's page is the result of all those edits. The history underneath it holds claims that were added, questioned and removed, and vandalism that was reverted within minutes. This history is what Agent Memory was given.`;
	$("stamp").textContent = `${DATA.revisions} revisions to ${fmt(DATA.last)} · ${DATA.undone} of them reverted by a later edit`;

	// Axes
	const axis = (el) => {
		for (let y = 2004; y <= 2026; y += 2) {
			const s = document.createElement("span");
			s.style.left = `${pos(`${y}-01-01`)}%`;
			s.textContent = y;
			el.append(s);
		}
	};
	axis($("axis1"));
	axis($("axis2"));

	// Activity
	const max = Math.max(...DATA.activity.map((m) => m.edits));
	const monthWidth = 100 / ((t1 - t0) / (30.44 * 864e5));
	for (const m of DATA.activity) {
		const left = pos(`${m.month}-01`);
		const kept = m.edits - m.undone;
		const scale = (n) => `${(100 * Math.sqrt(n)) / Math.sqrt(max)}%`;
		const bar = document.createElement("b");
		bar.style.cssText = `left:${left}%;width:${Math.max(monthWidth, 0.25)}%;height:${scale(m.edits)}`;
		$("activity").append(bar);
		if (m.undone) {
			const red = document.createElement("b");
			red.className = "undone";
			red.style.cssText = `left:${left}%;width:${Math.max(monthWidth, 0.25)}%;height:${scale(m.undone)}`;
			$("activity").append(red);
		}
		const when = new Date(`${m.month}-01`).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
		const html = `<b>${when}</b><br>${m.edits} edit${m.edits > 1 ? "s" : ""}${m.undone ? `, ${m.undone} reverted later` : ""}<br>${kept} kept`;
		hover(bar, html);
	}

	// Claims
	const groups = [
		["B2", ["nimoyfail", "nimoyvisit"]],
		["B4", ["tornado1926", "tornado1927"]],
		["C1", ["streets"]],
		["C2", ["nine", "wooden", "demolished"]],
		["C3", ["trekcetera"]],
		["C4", ["hospital"]],
		["D5", ["britannica"]],
	];
	const claims = Object.fromEntries(DATA.claims.map((c) => [c.id, c]));
	const questions = Object.fromEntries(DATA.questions.map((q) => [q.id, q]));
	const summary = (s) => s.replace(/\/\*\s*(.*?)\s*\*\//, "$1 section:").replace(/\s+/g, " ").trim() || "(no edit summary)";
	const rows = [];
	const select = (c, row) => {
		for (const r of rows) r.classList.toggle("on", r === row);
		const lines = c.spans.map(([a, b]) => `${fmt(a)} to ${b ? fmt(b) : "today"}`);
		const flags = c.flags.map(([a, b]) => `${fmt(a)} to ${b ? fmt(b) : "today"}`);
		const ends = c.ends.map((e) => `${fmt(e.date)}: "${esc(summary(e.summary))}"`);
		$("detail").innerHTML =
			`<q>${esc(c.quote)}</q><dl><dt>On the page</dt><dd>${lines.join("<br>")}</dd>` +
			(flags.length ? `<dt>Citation needed</dt><dd>${flags.join("<br>")}</dd>` : "") +
			(ends.length ? `<dt>Removed by</dt><dd>${ends.join("<br>")}</dd>` : "") +
			`<dt>Question</dt><dd>${c.question}: ${esc(questions[c.question].question)}</dd></dl>`;
	};
	for (const [qid, ids] of groups) {
		const g = document.createElement("div");
		g.className = "group";
		g.innerHTML = `<h3><b>${qid}</b>${esc(questions[qid].question)}</h3>`;
		for (const id of ids) {
			const c = claims[id];
			const row = document.createElement("div");
			row.className = "row";
			row.innerHTML = `<div class="label">${esc(c.label)}</div><div class="bar"><div class="grid"></div></div>`;
			const bar = row.querySelector(".bar");
			for (let y = 2004; y <= 2026; y += 2) {
				const line = document.createElement("i");
				line.style.left = `${pos(`${y}-01-01`)}%`;
				bar.firstChild.append(line);
			}
			for (const [a, b] of c.spans) {
				const s = document.createElement("div");
				s.className = b ? "span gone" : "span";
				s.style.cssText = `left:${pos(a)}%;width:${pos(b) - pos(a)}%`;
				bar.append(s);
				hover(s, `${fmt(a)} to ${b ? fmt(b) : "today"}`);
			}
			for (const [a, b] of c.flags) {
				const f = document.createElement("div");
				f.className = "flag";
				f.style.cssText = `left:${pos(a)}%;width:${pos(b) - pos(a)}%`;
				bar.append(f);
				hover(f, `Marked "citation needed" ${fmt(a)} to ${b ? fmt(b) : "today"}`);
			}
			for (const e of c.ends) {
				const m = document.createElement("div");
				m.className = "end";
				m.style.left = `${pos(e.date)}%`;
				bar.append(m);
				hover(m, `Removed ${fmt(e.date)}<br>"${esc(summary(e.summary))}"`);
			}
			row.addEventListener("click", () => select(c, row));
			rows.push(row);
			g.append(row);
		}
		$("claims").append(g);
	}
	for (const r of rows) if (r.querySelector(".label").textContent === claims.streets.label) select(claims.streets, r);

	// Today's article: the longer a sentence's wording has stood, the heavier it looks.
	const now = Date.parse(DATA.last);
	const TIERS = [
		{ years: 10, cls: "t4", label: "Unchanged for 10 years or more" },
		{ years: 5, cls: "t3", label: "5 to 10 years" },
		{ years: 2, cls: "t2", label: "2 to 5 years" },
		{ years: 0, cls: "t1", label: "Less than 2 years" },
	];
	const tier = (d) => TIERS.find((t) => (now - Date.parse(d)) / 31557600000 >= t.years);
	$("scale").innerHTML = TIERS.map((t) => `<span class="${t.cls}">${t.label}</span>`).join("");
	let section = null;
	let para = null;
	for (const s of DATA.text) {
		if (s.section !== section) {
			section = s.section;
			if (section !== "Introduction") {
				const h = document.createElement("h4");
				h.textContent = section;
				$("article").append(h);
			}
			para = document.createElement("p");
			$("article").append(para);
		}
		const el = document.createElement("s");
		el.textContent = s.text;
		el.className = tier(s.unchanged).cls;
		const reworded = s.versions > 1 ? `, in ${s.versions} wordings` : "";
		hover(el, s.unchanged === s.since ? `Unchanged since ${fmt(s.since)}` : `Worded this way since ${fmt(s.unchanged)}<br>First written ${fmt(s.since)}${reworded}`);
		// A line with no full stop is an item in a bulleted list on the page.
		if (s.item) {
			if (para.tagName !== "UL") {
				para = document.createElement("ul");
				$("article").append(para);
			}
			const li = document.createElement("li");
			li.append(el);
			para.append(li);
			continue;
		}
		if (para.tagName === "UL") {
			para = document.createElement("p");
			$("article").append(para);
		}
		para.append(el, " ");
	}
})();
