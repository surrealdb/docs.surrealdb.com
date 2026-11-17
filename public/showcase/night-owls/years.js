// Tooltips for the twenty-years page: hover, keyboard focus or a tap shows an element's data-tip.
const tip = document.querySelector(".tip");
let pinned = null;
const show = (el) => {
	tip.textContent = el.dataset.tip;
	tip.style.display = "block";
	const r = el.getBoundingClientRect();
	tip.style.left = Math.min(innerWidth - tip.offsetWidth - 8, Math.max(8, r.left + r.width / 2 - tip.offsetWidth / 2)) + "px";
	tip.style.top = (r.top - tip.offsetHeight - 10 < 8 ? r.bottom + 10 : r.top - tip.offsetHeight - 10) + "px";
};
const hide = () => { if (!pinned) tip.style.display = "none"; };
for (const el of document.querySelectorAll("[data-tip]")) {
	el.addEventListener("mouseenter", () => show(el));
	el.addEventListener("mouseleave", hide);
	el.addEventListener("focus", () => show(el));
	el.addEventListener("blur", hide);
	el.addEventListener("click", (e) => { e.stopPropagation(); pinned = pinned === el ? null : el; pinned ? show(el) : hide(); });
}
document.addEventListener("click", () => { pinned = null; hide(); });
addEventListener("scroll", () => { pinned = null; tip.style.display = "none"; }, { passive: true });
