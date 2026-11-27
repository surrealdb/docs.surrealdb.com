/**
 * What the release has that is not documented for users. `check-cli-reference.ts`
 * and `check-features.ts` both leave these out, so the reasons are written once.
 */

/** Variables the release reads that are not settings for a user, with the reason. */
export const INTERNAL: Record<string, string> = {
    SURREAL_BUILD_ID: "read at compile time, when the engine is built",
    SURREAL_BUILD_VERSION: "read at compile time by the build script",
    SURREAL_COMPILE_CACHE_STATS: "a measurement switch for engine development",
    SURREAL_HOLD_CREATES: "a benchmark switch for engine development",
    SURREAL_INVOKED_AS: "set by the Surreal CLI itself when it runs the database",
    SURREAL_MORSEL_LOOPBACK_PLACES: "a conformance setting for testing the host-place contract",
    SURREAL_MORSEL_NEEDS_VIEW: "a test setting that runs the parallel merge on every backend",
    SURREAL_MORSEL_STEAL_ALWAYS: "a test setting that forces the most work stealing a run can see",
    SURREAL_ONLINE_VERSION_CHECK: "accepted so old invocations parse; it has no effect",
    SURREAL_SURREALISM_REFETCH_AFTER_REFUSAL: "read only by debug builds, for integration tests",
    SURREAL_TELEMETRY_RPC_LIVE_ID: "accepted but no longer applied; the server logs a warning",
    SURREAL_TRACE_COMPILES: "a tracing switch for engine development",
    SURREAL_VM_LEAF: "a debugging report for engine development",
};

/** Flags the release hides from `--help`, with the reason. */
export const HIDDEN_FLAGS: Record<string, string> = {
    "surreal start --key": "hidden; not currently in use",
    "surreal start --no-banner": "hidden; the database prints no banner",
    "surreal start --planner-strategy": "hidden; retired, and refused with an error",
    "surreal sql --planner-strategy": "hidden; retired, and refused with an error",
    "surreal mcp --planner-strategy": "hidden; retired, and refused with an error",
    "surreal mcp --strict": "hidden from `--help`",
};
