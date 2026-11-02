document.addEventListener("click", (e) => {
	const b = e.target.closest(".cell");
	if (!b) return;
	const box = b.closest(".audit");
	box.querySelectorAll(".cell.on").forEach((c) => c.classList.remove("on"));
	b.classList.add("on");
	box.querySelector(".detail").innerHTML = b.dataset.detail;
});
