interface CacheEnvelope<T> {
    createdAt: string;
    validUntil: string;
    value: T;
}

export class FileCache {
    private readonly cacheDirectoryName: string;

    private readonly ttlMs: number;

    constructor(options?: { cacheDirectory?: string; ttlMs?: number }) {
        this.cacheDirectoryName = options?.cacheDirectory ?? ".cache";
        this.ttlMs = options?.ttlMs ?? 10 * 60 * 1000;
    }

    async getOrSet<T>(key: string, getFreshValue: () => Promise<T>): Promise<T> {
        // Browser runtimes cannot write project-root cache files.
        if (typeof window !== "undefined") {
            return getFreshValue();
        }

        const cachedValue = await this.read<T>(key);

        if (cachedValue !== undefined) {
            return cachedValue;
        }

        const freshValue = await getFreshValue();
        await this.write(key, freshValue);

        return freshValue;
    }

    private async read<T>(key: string): Promise<T | undefined> {
        const { readFile } = await import("node:fs/promises");
        const cacheFilePath = await this.getCacheFilePath(key);

        try {
            const file = await readFile(cacheFilePath, "utf8");
            const envelope = JSON.parse(file) as CacheEnvelope<T>;

            if (!envelope.validUntil || Date.now() > new Date(envelope.validUntil).getTime()) {
                return undefined;
            }

            return envelope.value;
        } catch (_error) {
            return undefined;
        }
    }

    private async write<T>(key: string, value: T): Promise<void> {
        const { mkdir, writeFile } = await import("node:fs/promises");
        const cacheDirectory = await this.getCacheDirectoryPath();
        await mkdir(cacheDirectory, { recursive: true });

        const cacheFilePath = await this.getCacheFilePath(key);
        const envelope: CacheEnvelope<T> = {
            createdAt: new Date().toISOString(),
            validUntil: new Date(Date.now() + this.ttlMs).toISOString(),
            value,
        };

        await writeFile(cacheFilePath, JSON.stringify(envelope), "utf8");
    }

    private async getCacheFilePath(key: string): Promise<string> {
        const { join } = await import("node:path");
        const cacheDirectory = await this.getCacheDirectoryPath();
        const safeName = key.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
        return join(cacheDirectory, `${safeName}.json`);
    }

    private async getCacheDirectoryPath(): Promise<string> {
        const { dirname, isAbsolute, resolve } = await import("node:path");
        const { fileURLToPath } = await import("node:url");

        if (isAbsolute(this.cacheDirectoryName)) {
            return this.cacheDirectoryName;
        }

        const moduleDirectory = dirname(fileURLToPath(import.meta.url));
        const projectRoot = resolve(moduleDirectory, "../..");
        const baseDirectory =
            process.env.GITHUB_WORKSPACE ??
            process.env.INIT_CWD ??
            (process.cwd() === "/" ? projectRoot : process.cwd());

        return resolve(baseDirectory, this.cacheDirectoryName);
    }
}

export const apiRequestCache = new FileCache();
