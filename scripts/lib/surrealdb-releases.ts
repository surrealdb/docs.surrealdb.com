/**
 * Reads a local clone of surrealdb/surrealdb with git only, at ~/surrealdb or
 * SURREALDB_REPO. Fetch its tags first (`git -C ~/surrealdb fetch --tags`).
 * Shared by the generators that read the engine source at each release.
 */
import { homedir } from "node:os";
import { join } from "node:path";

export const REPO = process.env.SURREALDB_REPO ?? join(homedir(), "surrealdb");

export function git(...args: string[]): string {
    const result = Bun.spawnSync(["git", "-C", REPO, ...args], { stderr: "pipe" });

    if (result.exitCode !== 0) {
        throw new Error(`git ${args.join(" ")}: ${result.stderr.toString().trim()}`);
    }

    return result.stdout.toString();
}

/** Stable release tags from a major version on, in version order. */
export function releaseTags(firstMajor: number): string[] {
    const version = (tag: string) => tag.slice(1).split(".").map(Number);

    return git("tag", "--list", "v*")
        .split("\n")
        .filter((tag) => /^v\d+\.\d+\.\d+$/.test(tag))
        .filter((tag) => (version(tag)[0] ?? 0) >= firstMajor)
        .sort((a, b) => {
            const [x, y] = [version(a), version(b)];

            return (
                (x[0] ?? 0) - (y[0] ?? 0) || (x[1] ?? 0) - (y[1] ?? 0) || (x[2] ?? 0) - (y[2] ?? 0)
            );
        });
}

/** Runs of consecutive tags, as [first, last] indices. */
export function ranges(present: boolean[]): [number, number][] {
    const found: [number, number][] = [];

    present.forEach((here, index) => {
        if (!here) return;

        const last = found[found.length - 1];

        if (last && last[1] === index - 1) last[1] = index;
        else found.push([index, index]);
    });

    return found;
}
