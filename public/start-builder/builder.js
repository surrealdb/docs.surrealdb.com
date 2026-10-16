// Builds a `surreal db start` command from the options selected on the page, with notes on what
// the chosen combination means. Flags and parameters follow `surreal db start --help` for 3.3.

const $ = (id) => document.getElementById(id);
const form = $("form");

const value = (name) => form.querySelector(`input[name="${name}"]:checked`).value;
const list = (id) =>
	$(id)
		.value.split(",")
		.map((item) => item.trim())
		.filter(Boolean)
		.join(",");

// Quote a shell word when it holds anything the shell would interpret.
const quote = (word) => (/^[A-Za-z0-9_@%+=:,./-]+$/.test(word) ? word : `"${word.replace(/(["\\$`])/g, "\\$1")}"`);

function storagePath(notes) {
	const engine = value("engine");
	if (engine === "memory") {
		if (!$("mem-persist").checked) {
			notes.push(["note", "Data is kept in memory only, so it is gone when the server stops."]);
			return "memory";
		}
		const params = [];
		if ($("mem-snapshot").checked) params.push(`snapshot=${Number($("mem-snapshot-secs").value) || 60}s`);
		if ($("mem-aol").checked) {
			params.push(`aol=${$("mem-aol-mode").value}`);
			if ($("mem-aol-mode").value === "async") {
				notes.push(["note", "With an asynchronous append-only log, the most recent commits can be lost if the machine stops suddenly."]);
			}
		}
		if (params.length === 0) {
			notes.push(["note", "Choose a snapshot interval or the append-only log, or nothing is written to disk."]);
		}
		const path = `mem://${$("mem-path").value.trim() || "data"}`;
		return params.length ? `${path}?${params.join("&")}` : path;
	}

	if (engine === "tikv") {
		return `tikv://${$("tikv-addr").value.trim() || "127.0.0.1:2379"}`;
	}

	const params = [];
	const sync = $("sync").value;
	if (sync === "interval") params.push(`sync=${Number($("sync-secs").value) || 5}s`);
	if (sync === "never") {
		params.push("sync=never");
		notes.push(["note", "Flushing is left to the operating system, so recent commits can be lost if the machine stops suddenly."]);
	}
	if (sync === "interval") {
		notes.push(["note", "Commits made since the last flush can be lost if the machine stops suddenly."]);
	}
	if ($("versioned").checked) {
		params.push("versioned=true");
		const days = Number($("retention-days").value);
		if (days > 0) params.push(`retention=${days}d`);
	}
	if (engine === "surrealkv") {
		notes.push(["note", "SurrealKV is in beta in SurrealDB 3.3. SurrealKV has since reached 1.0, and the upcoming 3.4 will use it as the recommended on-disk engine."]);
	}
	const path = `${engine}://${$("disk-path").value.trim() || "mydatabase.db"}`;
	return params.length ? `${path}?${params.join("&")}` : path;
}

function build() {
	const notes = [];
	const flags = [];
	const path = storagePath(notes);

	// Authentication
	const auth = value("auth");
	if (auth === "user") {
		const user = $("user").value.trim();
		const pass = $("pass").value;
		if (user) flags.push(`--user ${quote(user)}`);
		if (pass) flags.push(`--pass ${quote(pass)}`);
		if (!user || !pass) notes.push(["note", "A root user needs both a username and a password."]);
		else if (user === pass) notes.push(["note", "The password is the same as the username."]);
	} else if (auth === "none") {
		notes.push(["note", "No root user is created, so nobody can sign in to a new datastore. This suits a datastore that already has users."]);
	} else {
		flags.push("--unauthenticated");
	}

	// Network
	const bindAll = value("bind") === "all";
	const port = Number($("port").value) || 8000;
	if (bindAll || port !== 8000) flags.push(`--bind ${bindAll ? "0.0.0.0" : "127.0.0.1"}:${port}`);
	if (auth === "unauthenticated") {
		notes.push(
			bindAll
				? ["caution", "Any machine that can reach this port gets full owner access, with no sign-in. Set a user and password before the server is reachable from other machines."]
				: ["note", "Anyone on this machine gets full owner access without signing in, which suits local experiments."],
		);
	}
	if ($("tls").checked) {
		flags.push(`--web-crt ${quote($("tls-crt").value.trim() || "cert.pem")}`);
		flags.push(`--web-key ${quote($("tls-key").value.trim() || "key.pem")}`);
	} else if (bindAll && auth !== "unauthenticated") {
		notes.push(["note", "Other machines can connect, and traffic is unencrypted unless TLS is set up here or in a proxy in front of the server."]);
	}

	// Capabilities
	const caps = value("caps");
	if (caps === "allow") {
		flags.push("--allow-all");
		notes.push(["note", "Every capability except eval is allowed, including outbound network access to any host. For a server other people use, denying all and allowing only what you need keeps the surface small."]);
	}
	if (caps === "deny") {
		flags.push("--deny-all");
		if ($("funcs").value === "list") {
			const funcs = list("funcs-list");
			if (funcs) flags.push(`--allow-funcs=${quote(funcs)}`);
			else notes.push(["note", "List at least one function family, such as string or math."]);
		} else {
			flags.push("--allow-funcs");
		}
	}
	if (caps !== "allow") {
		const net = $("net").value;
		if (net === "any") {
			flags.push("--allow-net");
			notes.push(["note", "Queries can reach any host, including addresses on your internal network. Listing the hosts you need, such as --allow-net=api.example.com, limits that."]);
		}
		if (net === "list") {
			const hosts = list("net-list");
			if (hosts) flags.push(`--allow-net=${quote(hosts)}`);
			else notes.push(["note", "List at least one host, or choose no access."]);
			// A host name listed with a port is refused when the name is looked up, so no request to it succeeds.
			const withPort = hosts.split(",").filter((host) => /^[^\d\[][^:/]*:\d+$/.test(host));
			if (withPort.length) {
				const bare = withPort.map((host) => host.replace(/:\d+$/, "")).join(",");
				notes.push(["caution", `A host name listed with a port, such as ${withPort[0]}, blocks every request to that host in this version, because the port is checked when the name is looked up. List it without the port: --allow-net=${bare}.`]);
			}
		}
		if ($("scripting").checked) flags.push("--allow-scripting");
		if ($("guests").checked) {
			flags.push("--allow-guests");
			notes.push(["note", "Guests can run queries without signing in. Table permissions decide what they can read and change."]);
		}
	}
	if ($("eval").checked) flags.push("--allow-eval-query=system");
	const experimental = ["files", "surrealism"].filter((name) => $(`exp-${name}`).checked);
	if (experimental.length) {
		flags.push(`--allow-experimental=${experimental.join(",")}`);
		notes.push(["note", "Experimental features can change between releases."]);
	}

	// Other
	const log = $("log").value;
	if (log !== "info") flags.push(`--log ${log}`);
	if (log === "debug" || log === "trace") notes.push(["note", `The ${log} level writes a lot of output and slows the server, so it suits debugging rather than production.`]);
	if ($("import").checked) flags.push(`--import-file ${quote($("import-path").value.trim() || "schema.surql")}`);
	advancedFlags(flags, notes);

	// The path goes first, so that a flag with optional values cannot take it as one of them.
	const parts = ["surreal db start", quote(path), ...flags];
	const command = parts.length > 3 ? parts.join(" \\\n  ") : parts.join(" ");
	$("cmd").textContent = command;

	const ul = $("notes");
	ul.replaceChildren(
		...notes.map(([kind, text]) => {
			const li = document.createElement("li");
			li.className = kind;
			li.textContent = text;
			return li;
		}),
	);
}

function updateVisibility() {
	const engine = value("engine");
	$("mem-opts").hidden = engine !== "memory";
	$("disk-opts").hidden = engine === "memory" || engine === "tikv";
	$("tikv-opts").hidden = engine !== "tikv";
	$("mem-persist-opts").hidden = !$("mem-persist").checked;
	$("sync-interval-wrap").hidden = $("sync").value !== "interval";
	$("retention-wrap").hidden = !$("versioned").checked;
	$("user-opts").hidden = value("auth") !== "user";
	$("tls-opts").hidden = !$("tls").checked;
	const caps = value("caps");
	$("caps-opts").querySelectorAll("#net, #scripting, #guests").forEach((el) => {
		el.disabled = caps === "allow";
	});
	$("net-list").hidden = caps === "allow" || $("net").value !== "list";
	$("funcs-row").hidden = caps !== "deny";
	$("funcs-list").hidden = $("funcs").value !== "list";
	$("import-path").hidden = !$("import").checked;
}

// Every other option of `surreal db start`, grouped as `--help` groups them. A text option is
// left out of the command while it is empty, and its placeholder shows the default.
const LEVELS = ["", "none", "full", "error", "warn", "info", "debug", "trace"];
const ADVANCED = [
	{
		group: "Timeouts",
		options: [
			{ flag: "query-timeout", label: "Longest time a set of statements can run", placeholder: "no limit, e.g. 30s" },
			{ flag: "transaction-timeout", label: "Longest time a single transaction can run", placeholder: "no limit, e.g. 10s" },
			{ flag: "startup-operation-timeout", label: "How long each startup operation retries", placeholder: "60s" },
		],
	},
	{
		group: "Postgres wire protocol",
		options: [{ flag: "postgres-bind", label: "Address to accept Postgres clients on", placeholder: "off, e.g. 127.0.0.1:5432" }],
	},
	{
		group: "HTTP server",
		options: [
			{ flag: "allow-origin", label: "Origins allowed for CORS requests", placeholder: "all origins" },
			{
				flag: "client-ip",
				label: "Where to read the client IP address from",
				choices: ["", "none", "socket", "CF-Connecting-IP", "Fly-Client-IP", "True-Client-IP", "X-Real-IP", "X-Forwarded-For", "Forwarded"],
				defaultLabel: "socket (default)",
			},
			{ flag: "no-identification-headers", label: "Leave out the server name and version headers", bool: true },
		],
	},
	{
		group: "Capabilities in detail",
		options: [
			{ flag: "allow-arbitrary-query", label: "User groups allowed arbitrary queries", placeholder: "guest, record, system", list: true },
			{ flag: "deny-arbitrary-query", label: "User groups denied arbitrary queries", placeholder: "guest, record, system", list: true },
			{ flag: "deny-eval-query", label: "User groups denied eval", placeholder: "guest, record, system", list: true },
			{ flag: "deny-net", label: "Hosts that are always denied", placeholder: "e.g. 169.254.169.254, 10.0.0.0/8", list: true },
			{ flag: "deny-funcs", label: "Functions that are always denied", placeholder: "e.g. http, crypto::argon2", list: true },
			{ flag: "allow-rpc", label: "RPC methods to allow", placeholder: "all", list: true },
			{ flag: "deny-rpc", label: "RPC methods to deny", placeholder: "none", list: true },
			{ flag: "allow-http", label: "HTTP routes to allow", placeholder: "all", list: true },
			{ flag: "deny-http", label: "HTTP routes to deny", placeholder: "none", list: true },
			{ flag: "deny-scripting", label: "Deny embedded scripting", bool: true },
			{ flag: "deny-guests", label: "Deny guest access", bool: true },
		],
	},
	{
		group: "Namespaces and databases",
		options: [
			{ flag: "default-namespace", label: "Namespace created for a new instance", placeholder: "main" },
			{ flag: "default-database", label: "Database created for a new instance", placeholder: "main" },
			{ flag: "no-defaults", label: "Create no default namespace or database", bool: true },
		],
	},
	{
		group: "Sessions",
		options: [
			{ flag: "durable-sessions", label: "Keep HTTP RPC sessions in the datastore across restarts", bool: true },
			{ flag: "durable-session-ttl", label: "How long an unused session lasts", placeholder: "24h" },
			{ flag: "durable-session-gc-interval", label: "How often expired sessions are removed", placeholder: "60s" },
		],
	},
	{
		group: "Logging outputs",
		options: [
			{ flag: "log-format", label: "Terminal log format", choices: ["", "text", "json"], defaultLabel: "text (default)" },
			{ flag: "log-file-enabled", label: "Also write logs to files", bool: true },
			{ flag: "log-file-path", label: "Log file directory", placeholder: "logs" },
			{ flag: "log-file-name", label: "Log file name", placeholder: "surrealdb.log" },
			{ flag: "log-file-format", label: "Log file format", choices: ["", "text", "json"], defaultLabel: "text (default)" },
			{ flag: "log-file-rotation", label: "Log file rotation", choices: ["", "daily", "hourly", "never"], defaultLabel: "daily (default)" },
			{ flag: "log-file-level", label: "Log file level", choices: LEVELS, defaultLabel: "same as --log" },
			{ flag: "log-socket", label: "Send logs to host:port", placeholder: "off" },
			{ flag: "log-socket-format", label: "Socket log format", choices: ["", "text", "json"], defaultLabel: "text (default)" },
			{ flag: "log-socket-level", label: "Socket log level", choices: LEVELS, defaultLabel: "same as --log" },
			{ flag: "log-otel-level", label: "OpenTelemetry log level", choices: LEVELS, defaultLabel: "same as --log" },
		],
	},
	{
		group: "Slow query log",
		options: [
			{ flag: "slow-log-threshold", label: "Log queries slower than", placeholder: "off, e.g. 500ms" },
			{ flag: "slow-log-param-allow", label: "Parameters to include in the log", placeholder: "all", list: true },
			{ flag: "slow-log-param-deny", label: "Parameters to leave out of the log", placeholder: "none", list: true },
		],
	},
	{
		group: "Storage and background work",
		options: [
			{ flag: "temporary-directory", label: "Directory for temporary files", placeholder: "system default" },
			{ flag: "index-compaction-interval", label: "Index compaction interval", placeholder: "5s" },
			{ flag: "async-event-interval", label: "Asynchronous event interval", placeholder: "5s" },
			{ flag: "changefeed-gc-interval", label: "Change feed cleanup interval", placeholder: "30s" },
			{ flag: "graph-fold-interval", label: "Graph edge packing interval", placeholder: "5s" },
			{ flag: "index-build-resume-interval", label: "Interval to resume unfinished index builds", placeholder: "30s" },
			{ flag: "reclaim-interval", label: "Interval to reclaim space from removed resources", placeholder: "60s" },
			{ flag: "reclaim-grace", label: "Age a removed resource must reach before its data is deleted", placeholder: "10m" },
		],
	},
	{
		group: "Clusters and TiKV",
		options: [
			{ flag: "node-membership-refresh-interval", label: "Node registration refresh interval", placeholder: "3s" },
			{ flag: "node-membership-check-interval", label: "Inactive node check interval", placeholder: "15s" },
			{ flag: "node-membership-cleanup-interval", label: "Archived node cleanup interval", placeholder: "300s" },
			{ flag: "kvs-ca", label: "CA file for the remote store", placeholder: "none" },
			{ flag: "kvs-crt", label: "Certificate file for the remote store", placeholder: "none" },
			{ flag: "kvs-key", label: "Private key file for the remote store", placeholder: "none" },
			{ flag: "tikv-gc-interval", label: "TiKV garbage collection interval", placeholder: "10m" },
			{ flag: "tikv-gc-lifetime", label: "TiKV garbage collection lifetime", placeholder: "10m" },
			{ flag: "tikv-lock-cleanup-interval", label: "TiKV stale lock cleanup interval", placeholder: "60s" },
		],
	},
	{
		group: "Startup",
		options: [
			{ flag: "no-banner", label: "Hide the startup banner", bool: true },
			{ flag: "lazy-surrealism", label: "Load Surrealism modules on first use", bool: true },
			{
				flag: "planner-strategy",
				label: "Query planner strategy",
				choices: ["", "best-effort", "compute-only", "all-read-only"],
				defaultLabel: "best-effort (default)",
			},
		],
	},
];

function renderAdvanced() {
	const root = $("advanced");
	for (const { group, options } of ADVANCED) {
		const details = document.createElement("details");
		const summary = document.createElement("summary");
		summary.textContent = group;
		const count = document.createElement("span");
		count.className = "count";
		summary.appendChild(count);
		details.appendChild(summary);
		for (const option of options) {
			const id = `adv-${option.flag}`;
			const wrap = document.createElement("div");
			wrap.className = "opt";
			if (option.bool) {
				wrap.innerHTML = `<label><input type="checkbox" id="${id}"> ${option.label}</label>`;
			} else if (option.choices) {
				const items = option.choices.map((choice) => `<option value="${choice}">${choice || option.defaultLabel}</option>`).join("");
				wrap.innerHTML = `<label for="${id}">${option.label}</label><select id="${id}">${items}</select>`;
			} else {
				wrap.innerHTML = `<label for="${id}">${option.label}</label><input type="text" id="${id}" placeholder="${option.placeholder}">`;
			}
			const flag = document.createElement("span");
			flag.className = "flag";
			flag.textContent = `--${option.flag}`;
			wrap.appendChild(flag);
			details.appendChild(wrap);
		}
		root.appendChild(details);
	}
}

function advancedFlags(flags, notes) {
	for (const { options } of ADVANCED) {
		for (const option of options) {
			const el = $(`adv-${option.flag}`);
			if (option.bool) {
				if (el.checked) flags.push(`--${option.flag}`);
			} else if (option.list) {
				const items = list(`adv-${option.flag}`);
				if (items) flags.push(`--${option.flag}=${quote(items)}`);
			} else if (el.value.trim()) {
				flags.push(`--${option.flag} ${quote(el.value.trim())}`);
			}
		}
	}
	if ($("adv-planner-strategy").value) {
		notes.push(["note", "--planner-strategy is deprecated from SurrealDB 3.4, which ignores it."]);
	}
	const postgres = $("adv-postgres-bind").value.trim();
	if (postgres.startsWith("0.0.0.0")) {
		notes.push(["note", "Postgres clients on other machines can connect to this address."]);
	}
}

function updateCounts() {
	for (const details of $("advanced").querySelectorAll("details")) {
		const set = [...details.querySelectorAll("input, select")].filter((el) => (el.type === "checkbox" ? el.checked : el.value.trim())).length;
		details.querySelector(".count").textContent = set ? `${set} set` : "";
	}
}

form.addEventListener("input", () => {
	updateCounts();
	updateVisibility();
	build();
});
form.addEventListener("submit", (event) => event.preventDefault());

$("copy").addEventListener("click", async () => {
	const text = $("cmd").textContent;
	try {
		await navigator.clipboard.writeText(text);
		$("copy").textContent = "Copied";
	} catch {
		const range = document.createRange();
		range.selectNodeContents($("cmd"));
		const selection = getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
		$("copy").textContent = "Selected";
	}
	setTimeout(() => {
		$("copy").textContent = "Copy";
	}, 1500);
});

renderAdvanced();
updateVisibility();
build();
