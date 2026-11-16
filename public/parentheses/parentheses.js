// Steps through SurrealQL expressions one parenthesised group at a time.
// Each step names the text that resolves next (`h`), and the following step
// holds the expression with that text replaced by its value. The values come
// from running each example on SurrealDB.

const select = (() => {
	const start =
		"(SELECT\n    (name) AS name,\n    (math::sum((SELECT VALUE total FROM order WHERE ((buyer) = ($parent.id))))) AS spent\nFROM (person)\nWHERE ((age) > (math::mean((SELECT VALUE age FROM person)))))";
	const moves = [
		["(person)", "person", "FROM resolves first: the records to read come from the person table. The steps that follow are for person:ann, and every person goes through the same ones."],
		["(age)", "36", "WHERE runs before the fields are built. Ann's age is 36."],
		["(SELECT VALUE age FROM person)", "[36, 19, 50]", "The subquery reads every person's age."],
		["math::mean([36, 19, 50])", "35f", "math::mean returns a float, 35f."],
		["(35f)", "35f", "A group holding one value gives that value."],
		["(36 > 35f)", "true", "36 is greater than 35, so Ann is kept. Bo, at 19, is dropped at this point."],
		["(name)", "'Ann'", "Now the fields. Ann's name."],
		["($parent.id)", "person:ann", "Inside the subquery, $parent is the outer record, so $parent.id is person:ann."],
		["(SELECT VALUE total FROM order WHERE ((buyer) = person:ann))", "[40, 25]", "The subquery runs its own WHERE for each order. (buyer) is that order's buyer, so orders 1 and 2 match."],
		["math::sum([40, 25])", "65", "math::sum adds the totals."],
		["(65)", "65", "A group holding one value gives that value."],
	];
	const steps = [];
	let expr = start;
	for (const [h, value, n] of moves) {
		steps.push({ e: expr, h, n });
		expr = expr.replace(h, value);
	}
	steps.push({ e: expr, h: expr, n: "The SELECT finishes, and each person who was kept gives one object. Cy, at 50, is kept too and spent 90." });
	steps.push({ e: "[\n    { name: 'Ann', spent: 65 },\n    { name: 'Cy', spent: 90 }\n]", n: "Done." });
	return steps;
})();

const EXAMPLES = [
	{
		id: "score",
		name: "Arithmetic",
		context: "With age = 36.",
		steps: [
			{ e: "((((age) * (2)) + (1)))", h: "(age)", n: "A field in parentheses is looked up: age is 36." },
			{ e: "(((36 * (2)) + (1)))", h: "(2)", n: "A literal in parentheses is the literal itself." },
			{ e: "(((36 * 2) + (1)))", h: "(36 * 2)", n: "Both operands are values now, so the multiplication runs." },
			{ e: "((72 + (1)))", h: "(1)", n: "The right operand of + is resolved next." },
			{ e: "((72 + 1))", h: "(72 + 1)", n: "The addition runs." },
			{ e: "(73)", h: "(73)", n: "A group holding one value gives that value." },
			{ e: "73", n: "Done." },
		],
	},
	{
		id: "where",
		name: "Conditions",
		context: "With age = 36 and langs = ['en', 'fr'].",
		steps: [
			{ e: "((((age) >= (18)) AND (((langs) CONTAINS ('en')))))", h: "(age)", n: "The left side comes first. Look up age." },
			{ e: "(((36 >= (18)) AND (((langs) CONTAINS ('en')))))", h: "(18)", n: "The literal 18." },
			{ e: "(((36 >= 18) AND (((langs) CONTAINS ('en')))))", h: "(36 >= 18)", n: "The comparison runs." },
			{ e: "((true AND (((langs) CONTAINS ('en')))))", h: "(langs)", n: "The left side of AND is true, so the right side is needed. Look up langs." },
			{ e: "((true AND ((['en', 'fr'] CONTAINS ('en')))))", h: "('en')", n: "The literal 'en'." },
			{ e: "((true AND ((['en', 'fr'] CONTAINS 'en'))))", h: "(['en', 'fr'] CONTAINS 'en')", n: "CONTAINS runs." },
			{ e: "((true AND (true)))", h: "(true)", n: "A group holding one value gives that value." },
			{ e: "((true AND true))", h: "(true AND true)", n: "AND runs." },
			{ e: "(true)", h: "(true)", n: "The outermost group." },
			{ e: "true", n: "Done." },
		],
	},
	{
		id: "chain",
		name: "Method chain",
		context: "",
		steps: [
			{ e: "((((((([1, 2, 3, 4]).map(|$n| (($n) * ($n))))).filter(|$sq| (($sq) > (4))))).fold(0, |$acc, $x| (($acc) + ($x)))))", h: "([1, 2, 3, 4])", n: "The innermost group is the array itself." },
			{ e: "(((((([1, 2, 3, 4].map(|$n| (($n) * ($n))))).filter(|$sq| (($sq) > (4))))).fold(0, |$acc, $x| (($acc) + ($x)))))", h: "[1, 2, 3, 4].map(|$n| (($n) * ($n)))", n: "map runs its closure once for each element. The body resolves in the same way: for $n = 3, ((3) * (3)) gives (3 * 3), which gives 9." },
			{ e: "(((((([1, 4, 9, 16])).filter(|$sq| (($sq) > (4))))).fold(0, |$acc, $x| (($acc) + ($x)))))", h: "([1, 4, 9, 16])", n: "Grey brackets belong to a function or method call. They stay until their call runs." },
			{ e: "((((([1, 4, 9, 16]).filter(|$sq| (($sq) > (4))))).fold(0, |$acc, $x| (($acc) + ($x)))))", h: "([1, 4, 9, 16])", n: "A group holding one value gives that value." },
			{ e: "(((([1, 4, 9, 16].filter(|$sq| (($sq) > (4))))).fold(0, |$acc, $x| (($acc) + ($x)))))", h: "[1, 4, 9, 16].filter(|$sq| (($sq) > (4)))", n: "filter keeps the squares above 4." },
			{ e: "(((([9, 16])).fold(0, |$acc, $x| (($acc) + ($x)))))", h: "([9, 16])", n: "A group holding one value gives that value." },
			{ e: "((([9, 16]).fold(0, |$acc, $x| (($acc) + ($x)))))", h: "([9, 16])", n: "A group holding one value gives that value." },
			{ e: "(([9, 16].fold(0, |$acc, $x| (($acc) + ($x)))))", h: "[9, 16].fold(0, |$acc, $x| (($acc) + ($x)))", n: "fold adds the values, starting from 0: 0 + 9 is 9, then 9 + 16 is 25." },
			{ e: "((25))", h: "(25)", n: "A group holding one value gives that value." },
			{ e: "(25)", h: "(25)", n: "The outermost group." },
			{ e: "25", n: "Done." },
		],
	},
	{ id: "select", name: "SELECT with subqueries", context: "", steps: select },
];

const DELAYS = [2800, 2000, 1400, 950, 600];
const $ = (id) => document.getElementById(id);
const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let example = Math.max(0, EXAMPLES.findIndex((e) => e.id === new URLSearchParams(location.search).get("example")));
let index = 0;
let timer = null;

// A bracket that directly follows a name is a call, such as `math::sum(`.
// A keyword such as `WHERE (` or `CONTAINS (` has a space before the bracket.
function isCall(text, at) {
	return at > 0 && /[A-Za-z0-9_]/.test(text[at - 1]);
}

// The group about to resolve and the value that just appeared can overlap, so
// each character takes its own classes and runs of equal classes share a span.
function render(text, hiStart, hiEnd, newStart, newEnd) {
	let out = "";
	let open = "";
	let depth = 0;
	const calls = [];
	for (let k = 0; k < text.length; k++) {
		let piece = escape(text[k]);
		if (text[k] === "(") {
			const call = isCall(text, k);
			calls.push(call);
			piece = call ? '<span class="call">(</span>' : `<span class="p p${(depth % 8) + 1}">(</span>`;
			if (!call) depth++;
		} else if (text[k] === ")") {
			const call = calls.pop();
			if (!call) depth--;
			piece = call ? '<span class="call">)</span>' : `<span class="p p${(depth % 8) + 1}">)</span>`;
		}
		const classes = [k >= hiStart && k < hiEnd ? "hi" : "", k >= newStart && k < newEnd ? "new" : ""]
			.filter(Boolean)
			.join(" ");
		if (classes !== open) {
			if (open) out += "</span>";
			if (classes) out += `<span class="${classes}">`;
			open = classes;
		}
		out += piece;
	}
	return open ? `${out}</span>` : out;
}

function maxDepth(text) {
	let depth = 0;
	let max = 0;
	const calls = [];
	for (let k = 0; k < text.length; k++) {
		if (text[k] === "(") {
			const call = isCall(text, k);
			calls.push(call);
			if (!call) max = Math.max(max, ++depth);
		} else if (text[k] === ")" && !calls.pop()) depth--;
	}
	return max;
}

// The value a step's highlighted text turned into, read from the next step.
function valueOf(step, next) {
	const at = step.e.indexOf(step.h);
	return { at, value: next.e.slice(at, next.e.length - (step.e.length - at - step.h.length)) };
}

function oneLine(text) {
	const flat = text.replace(/\s+/g, " ");
	return flat.length > 72 ? `${flat.slice(0, 69)}...` : flat;
}

function show(withNew) {
	const steps = EXAMPLES[example].steps;
	const step = steps[index];
	let hiStart = -1;
	let hiEnd = -1;
	let newStart = -1;
	let newEnd = -1;
	if (step.h) {
		hiStart = step.e.indexOf(step.h);
		hiEnd = hiStart + step.h.length;
	}
	if (withNew && index > 0) {
		const before = steps[index - 1];
		const { at, value } = valueOf(before, step);
		newStart = at;
		newEnd = at + value.length;
	}
	$("expr").innerHTML = render(step.e, hiStart, hiEnd, newStart, newEnd);
	const context = index === 0 ? EXAMPLES[example].context : "";
	$("note").textContent = context ? `${context} ${step.n}` : step.n;
	$("count").textContent = `Step ${index + 1} of ${steps.length}`;
	$("log").innerHTML = steps
		.slice(0, index)
		.map((s, k) => {
			const { value } = valueOf(s, steps[k + 1]);
			return `<li class="${k === index - 1 ? "cur" : ""}">${escape(oneLine(s.h))} → ${escape(oneLine(value))}</li>`;
		})
		.join("");
}

function legend() {
	const depth = maxDepth(EXAMPLES[example].steps[0].e);
	let html = "<span>Depth</span>";
	for (let k = 0; k < depth; k++) {
		html += `<span><span class="sw" style="background:var(--d${(k % 8) + 1})"></span>${k + 1}</span>`;
	}
	html += '<span><span class="call" style="font-family:var(--mono)">( )</span> call</span>';
	$("legend").innerHTML = html;
}

function tabs() {
	$("tabs").innerHTML = EXAMPLES.map(
		(e, k) => `<button data-k="${k}" aria-pressed="${k === example}">${e.name}</button>`,
	).join("");
	for (const button of $("tabs").querySelectorAll("button")) {
		button.addEventListener("click", () => {
			stop();
			example = Number(button.dataset.k);
			index = 0;
			tabs();
			legend();
			show(false);
		});
	}
}

function advance() {
	const steps = EXAMPLES[example].steps;
	if (index >= steps.length - 1) return;
	for (const hi of $("expr").querySelectorAll(".hi")) hi.classList.add("fade");
	const wait = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 350;
	setTimeout(() => {
		index++;
		show(true);
	}, wait);
}

function tick() {
	advance();
	const last = index >= EXAMPLES[example].steps.length - 2;
	timer = setTimeout(last ? stop : tick, DELAYS[$("speed").value - 1]);
}

function play() {
	if (index >= EXAMPLES[example].steps.length - 1) {
		index = 0;
		show(false);
	}
	$("play").textContent = "Pause";
	timer = setTimeout(tick, 500);
}

function stop() {
	clearTimeout(timer);
	timer = null;
	$("play").textContent = "Play";
}

$("play").addEventListener("click", () => (timer ? stop() : play()));
$("next").addEventListener("click", () => {
	stop();
	advance();
});
$("back").addEventListener("click", () => {
	stop();
	if (index > 0) {
		index--;
		show(false);
	}
});
$("reset").addEventListener("click", () => {
	stop();
	index = 0;
	show(false);
});

tabs();
legend();
show(false);
