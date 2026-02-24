export const packageName = 'SurrealDb.Net';

export const fetchNugetVersion = async (): Promise<string | null> => {
    const result = await fetch(
        `https://api.nuget.org/v3/registration5-gz-semver2/${packageName.toLocaleLowerCase()}/index.json`
    );
    const data = await result.json();

    return data?.items?.[0].upper || '0.5.0';
};
