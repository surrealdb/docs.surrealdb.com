// Settings read by each engine's config struct in SurrealDB 3.3, grouped by what they control.
// The datastore-wide `versioned`, `retention` and `sync` settings are shared and left out.
const GROUPS = {
	threads: "Threads and jobs",
	files: "Files and logs",
	compaction: "Compaction",
	blob: "Large values",
	memory: "Memory and cache",
	commit: "Commits and writes",
	reads: "Reads and filters",
	versioning: "Versioning",
};

// A group that only one engine has borrows the colour of a related group.
const COLOURS = { versioning: "threads" };

const ENGINES = {
	rocksdb: {
		prefix: "SURREAL_ROCKSDB_",
		groups: {
			threads: ["thread_count", "jobs_count", "max_concurrent_subcompactions", "runtime_reserve", "!SURREAL_RUNTIME_WORKER_THREADS"],
			files: ["max_open_files", "wal_size_limit", "keep_log_file_num", "storage_log_level", "sst_max_allowed_space_usage"],
			compaction: [
				"compaction_style", "target_file_size_base", "target_file_size_multiplier", "file_compaction_trigger",
				"level0_slowdown_writes_trigger", "level0_stop_writes_trigger", "periodic_compaction_seconds",
				"compaction_readahead_size", "universal_size_ratio", "universal_min_merge_width", "universal_max_merge_width",
				"universal_max_size_amplification_percent", "universal_compression_size_percent", "universal_stop_style",
				"deletion_factory_window_size", "deletion_factory_delete_count", "deletion_factory_ratio",
				"compact_on_shutdown", "shutdown_wait_for_compact_seconds",
			],
			blob: [
				"enable_blob_files", "min_blob_size", "blob_file_size", "blob_compression_type", "enable_blob_gc",
				"blob_gc_age_cutoff", "blob_gc_force_threshold", "blob_compaction_readahead_size",
			],
			memory: ["block_size", "block_cache_size", "write_buffer_size", "max_write_buffer_number", "min_write_buffer_number_to_merge"],
			commit: ["enable_pipelined_writes", "grouped_commit_timeout", "grouped_commit_wait_threshold", "grouped_commit_max_batch_size"],
			reads: [
				"initial_auto_readahead_size", "max_auto_readahead_size", "file_reads_for_auto_readahead",
				"prefix_extractor_enabled", "whole_key_filtering", "memtable_prefix_bloom_ratio", "scan_verify_checksums",
			],
			versioning: [],
		},
		// Rows with no setting at all, shown as one dashed square with a note.
		notes: {
			versioning: {
				name: "Versioning on RocksDB",
				note: "RocksDB keeps versions with its user-defined timestamps feature, which SurrealDB adds through its own key comparator. In SurrealKV, versions are part of the storage format.",
			},
		},
	},
	surrealkv: {
		prefix: "SURREAL_SURREALKV_",
		groups: {
			threads: [],
			files: [],
			compaction: [],
			blob: ["enable_vlog", "vlog_threshold", "vlog_max_file_size"],
			memory: ["block_size", "block_cache_capacity", "max_memtable_size"],
			commit: ["grouped_commit_timeout", "grouped_commit_wait_threshold", "grouped_commit_max_batch_size"],
			reads: [],
			versioning: ["versioned_index"],
		},
		// The RocksDB settings in groups that both engines have, but which have no SurrealKV counterpart.
		unmatched: {
			blob: ["blob_compression_type", "enable_blob_gc", "blob_gc_age_cutoff", "blob_gc_force_threshold", "blob_compaction_readahead_size"],
			memory: ["max_write_buffer_number", "min_write_buffer_number_to_merge"],
			commit: ["enable_pipelined_writes"],
		},
		// Why each RocksDB setting without a SurrealKV counterpart is left to the engine.
		reasons: {
			threads:
				"SurrealKV runs its flushes and compactions as two background tasks on SurrealDB's own async runtime, so it has no thread pool or job count to size.",
			files:
				"SurrealKV writes no log files of its own, as its messages go to the SurrealDB log. It has no settings for open files, the size of the write-ahead log or a cap on disk space.",
			compaction:
				"SurrealKV has one compaction strategy, levelled compaction, and the engine sets the level sizes and file triggers. There is no compaction style to choose.",
			blob: "SurrealKV has no settings for compressing its value log or for garbage collecting it, which follows compaction.",
			memory: "SurrealKV sizes its memtable with one setting, and the engine decides how many memtables can wait to be flushed.",
			commit: "The commit pipeline of SurrealKV is always on, so there is nothing to enable.",
			reads: "SurrealKV always builds a bloom filter for each table file, and has no settings for prefetching or filters.",
		},
	},
};

const outName = document.getElementById("out-name");
const outNote = document.getElementById("out-note");
let selected = null;

function show(tile, name, note) {
	if (selected) selected.classList.remove("on");
	selected = tile;
	tile.classList.add("on");
	outName.textContent = name;
	outNote.textContent = note;
}

function addTile(tiles, name, note, colour, faded) {
	const tile = document.createElement("button");
	tile.type = "button";
	tile.className = faded ? "tile faded" : "tile";
	tile.style.setProperty("--c", `var(--${colour})`);
	tile.setAttribute("aria-label", note ? `${name}: ${note}` : name);
	for (const event of ["mouseenter", "focus", "click"]) {
		tile.addEventListener(event, () => show(tile, name, note));
	}
	tiles.appendChild(tile);
}

const rocksdb = ENGINES.rocksdb.groups;

for (const [id, engine] of Object.entries(ENGINES)) {
	const section = document.getElementById(id);
	for (const [group, settings] of Object.entries(engine.groups)) {
		const row = document.createElement("div");
		row.className = "group";
		const label = document.createElement("span");
		label.className = "label";
		label.textContent = GROUPS[group];
		const tiles = document.createElement("div");
		tiles.className = "tiles";
		const colour = COLOURS[group] ?? group;
		for (const setting of settings) {
			const name = setting.startsWith("!") ? setting.slice(1) : engine.prefix + setting.toUpperCase();
			addTile(tiles, name, "", colour, false);
		}
		// RocksDB settings in this group that SurrealKV leaves to the engine
		if (engine.reasons?.[group]) {
			const missing = engine.unmatched[group] ?? rocksdb[group];
			for (const setting of missing) {
				const name = setting.startsWith("!") ? setting.slice(1) : ENGINES.rocksdb.prefix + setting.toUpperCase();
				addTile(tiles, name, `No SurrealKV setting. ${engine.reasons[group]}`, colour, true);
			}
		}
		if (engine.notes?.[group]) {
			const { name, note } = engine.notes[group];
			addTile(tiles, name, note, colour, true);
		}
		row.append(label, tiles);
		section.appendChild(row);
	}
}
