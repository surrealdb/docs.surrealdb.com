// Tooltip for the belief chart.
const tip = document.querySelector(".tip");
for (const a of document.querySelectorAll(".pt")) {
	const show = (e) => {
		const [head, score, pos] = a.dataset.tip.split("|");
		tip.innerHTML = "";
		const b = document.createElement("b"); b.textContent = a.dataset.name + " · " + score; tip.append(b);
		const s = document.createElement("div"); s.className = "s"; s.textContent = head; tip.append(s);
		const t = document.createElement("div"); t.textContent = pos; tip.append(t);
		tip.style.display = "block";
		const r = a.getBoundingClientRect();
		tip.style.left = Math.min(innerWidth - tip.offsetWidth - 8, Math.max(8, r.left + r.width / 2 - tip.offsetWidth / 2)) + "px";
		tip.style.top = (r.top - tip.offsetHeight - 10 < 8 ? r.bottom + 10 : r.top - tip.offsetHeight - 10) + "px";
	};
	a.addEventListener("mouseenter", show);
	a.addEventListener("focus", show);
	a.addEventListener("mouseleave", () => (tip.style.display = "none"));
	a.addEventListener("blur", () => (tip.style.display = "none"));
}
// Tabs: one chart per question.
const tabs = [...document.querySelectorAll("[role=tab]")];
for (const t of tabs) t.addEventListener("click", () => {
	for (const u of tabs) {
		const on = u === t;
		u.setAttribute("aria-selected", on);
		u.tabIndex = on ? 0 : -1;
		document.getElementById(u.getAttribute("aria-controls")).hidden = !on;
	}
});
