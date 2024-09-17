import fs from 'node:fs';
import path from 'node:path';
import * as esbuild from 'esbuild';
import { parse as parseHTML } from 'node-html-parser';
import glob from 'tiny-glob';

const __root = path.dirname(__dirname);
const __dist = path.join(__root, 'dist/docs');
const __astro = path.join(__dist, '_astro');

const scripts = [
    'https://snap.licdn.com/li.lms-analytics/insight.min.js',
    'https://www.clarity.ms/tag/idmjleqtib',
    'https://www.googletagmanager.com/gtag/js?id=G-J1NWM32T1V',
    'https://static.ads-twitter.com/uwt.js',
];

await extractInlineResources();
await fetchRemoteResources();

async function fetchRemoteResources() {
    // Fetch the remote scripts
    for (const script of scripts) {
        console.log(`[FETCH] Downloading and saving ${script}`);
        const content = await (await fetch(script)).text();
        const hash = createHash(content);
        const name = `_extr-${hash}.js`;
        fs.writeFileSync(path.join(__astro, name), await minifyJS(content));
        // Scan the JS files in the dist folder
        console.log('[EXTRACT] Scanning JS files in dist/docs/ folder');
        const files = await glob('**/*.js', {
            cwd: __dist,
            dot: true,
            absolute: true,
            filesOnly: true,
        });
        // Loop over each file and process the content
        console.log(`[EXTRACT] Found ${files.length} JS files`);
        for (const file of files) {
            console.log(`[EXTRACT] Processing file: ${file}`);
            const raw = fs.readFileSync(file, { encoding: 'utf-8' });
            const src = raw.replaceAll(script, `/_astro/${name}`);
            fs.writeFileSync(file, src);
        }
    }
}

async function extractInlineResources() {
    // Scan the HTML files in the dist folder
    console.log('[EXTRACT] Scanning HTML files in dist/docs/ folder');
    const files = await glob('**/*.html', {
        cwd: __dist,
        dot: true,
        absolute: true,
        filesOnly: true,
    });
    // Loop over each file and process the content
    console.log(`[EXTRACT] Found ${files.length} HTML files`);
    for (const file of files) {
        console.log(`[EXTRACT] Processing file: ${file}`);
        const raw = fs.readFileSync(file, { encoding: 'utf-8' });
        const parsed = parseHTML(raw, {
            comment: true,
        });

        {
            const scripts = [...parsed.querySelectorAll('script')].filter(
                (el) => el.innerHTML.length > 0
            );
            console.log(`[EXTRACT] found ${scripts.length} script tags`);

            for (const script of scripts) {
                const content = script.innerHTML;
                const hash = createHash(content);
                const name = `_extr-${hash}.js`;

                fs.writeFileSync(
                    path.join(__astro, name),
                    await minifyJS(content)
                );
                script.setAttribute('src', `/_astro/${name}`);
                script.setAttribute('defer', '');
                script.innerHTML = '';
            }
        }

        fs.writeFileSync(file, parsed.toString());
    }
}

function createHash(value: string) {
    let hash = 5381;
    let i = value.length;
    while (i) hash = (hash * 33) ^ value.charCodeAt(--i);
    return (hash >>> 0).toString(36);
}

async function minifyJS(input: string) {
    const result = await esbuild.transform(input, {
        minify: true,
    });

    return result.code;
}
