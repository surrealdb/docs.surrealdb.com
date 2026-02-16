import fs from 'node:fs';
import path from 'node:path';

interface VersionMarker {
    file: string;
    line: number;
    version: string;
    context: string;
    section?: string;
}

interface FileInventory {
    file: string;
    markers: VersionMarker[];
    hasV2: boolean;
    hasV3: boolean;
    hasV1: boolean;
}

const SURREALQL_DIR = path.join(process.cwd(), 'src/content/doc-surrealql');

function findMdxFiles(dir: string, baseDir: string = dir): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...findMdxFiles(fullPath, baseDir));
        } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
            files.push(path.relative(baseDir, fullPath));
        }
    }

    return files;
}

function findSinceMarkers(): FileInventory[] {
    const files = findMdxFiles(SURREALQL_DIR, SURREALQL_DIR);
    const inventories: FileInventory[] = [];

    for (const file of files) {
        const filePath = path.join(SURREALQL_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        const markers: VersionMarker[] = [];
        let currentSection = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNum = i + 1;

            // Track section headings
            if (line.match(/^#{1,6}\s+/)) {
                currentSection = line.replace(/^#{1,6}\s+/, '').trim();
            }

            // Find <Since v="vX.Y.Z" /> components
            const sinceMatch = line.match(
                /<Since\s+v=["'](v[\d.]+(?:-[a-zA-Z]+)?(?:\.\d+)?)["']\s*\/?>/
            );
            if (sinceMatch) {
                const version = sinceMatch[1];
                const context = lines
                    .slice(Math.max(0, i - 2), Math.min(lines.length, i + 3))
                    .join('\n');
                markers.push({
                    file,
                    line: lineNum,
                    version,
                    context: context.substring(0, 200),
                    section: currentSection || undefined,
                });
            }

            // Also find text-based "Since vX.Y.Z" or "Available since: vX.Y.Z"
            const textMatch = line.match(
                /(?:Since|Available since)[:\s]+(v[\d.]+(?:-[a-zA-Z]+)?(?:\.\d+)?)/i
            );
            if (textMatch && !line.includes('<Since')) {
                const version = textMatch[1];
                const context = lines
                    .slice(Math.max(0, i - 2), Math.min(lines.length, i + 3))
                    .join('\n');
                markers.push({
                    file,
                    line: lineNum,
                    version,
                    context: context.substring(0, 200),
                    section: currentSection || undefined,
                });
            }
        }

        if (markers.length > 0) {
            const hasV2 = markers.some((m) => /^v2\./.test(m.version));
            const hasV3 = markers.some((m) => /^v3\./.test(m.version));
            const hasV1 = markers.some((m) => /^v1\./.test(m.version));

            inventories.push({
                file,
                markers,
                hasV2,
                hasV3,
                hasV1,
            });
        }
    }

    return inventories;
}

function categorizeVersion(version: string): 'v1' | 'v2' | 'v3' | 'other' {
    if (/^v1\./.test(version)) return 'v1';
    if (/^v2\./.test(version)) return 'v2';
    if (/^v3\./.test(version)) return 'v3';
    return 'other';
}

function generateInventory() {
    const inventories = findSinceMarkers();

    // Count by version
    const v1Count = inventories.filter((i) => i.hasV1).length;
    const v2Count = inventories.filter((i) => i.hasV2).length;
    const v3Count = inventories.filter((i) => i.hasV3).length;

    // Count all markers
    const allMarkers = inventories.flatMap((i) => i.markers);
    const v1Markers = allMarkers.filter(
        (m) => categorizeVersion(m.version) === 'v1'
    );
    const v2Markers = allMarkers.filter(
        (m) => categorizeVersion(m.version) === 'v2'
    );
    const v3Markers = allMarkers.filter(
        (m) => categorizeVersion(m.version) === 'v3'
    );

    // Generate markdown report
    let report = '# SurrealQL Version Inventory Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;
    report += '## Summary\n\n';
    report += `- **Total files with version markers**: ${inventories.length}\n`;
    report += `- **Files with v1.x markers**: ${v1Count}\n`;
    report += `- **Files with v2.x markers**: ${v2Count}\n`;
    report += `- **Files with v3.x markers**: ${v3Count}\n\n`;
    report += `- **Total v1.x markers**: ${v1Markers.length}\n`;
    report += `- **Total v2.x markers**: ${v2Markers.length}\n`;
    report += `- **Total v3.x markers**: ${v3Markers.length}\n\n`;

    report += '## Files Requiring Version Separation\n\n';

    // Files that need separation (have both v2 and v3)
    const needsSeparation = inventories.filter(
        (i) => (i.hasV2 && i.hasV3) || (i.hasV1 && (i.hasV2 || i.hasV3))
    );
    report += `### Files with Mixed Versions (${needsSeparation.length} files)\n\n`;
    report +=
        'These files contain markers from multiple version ranges and need version gating:\n\n';

    for (const inv of needsSeparation.sort((a, b) =>
        a.file.localeCompare(b.file)
    )) {
        report += `#### \`${inv.file}\`\n\n`;
        report += `- Has v1.x: ${inv.hasV1}\n`;
        report += `- Has v2.x: ${inv.hasV2}\n`;
        report += `- Has v3.x: ${inv.hasV3}\n\n`;
        report += '**Markers:**\n\n';
        for (const marker of inv.markers) {
            const category = categorizeVersion(marker.version);
            report += `- Line ${marker.line}: \`${marker.version}\` (${category})`;
            if (marker.section) {
                report += ` - Section: ${marker.section}`;
            }
            report += '\n';
        }
        report += '\n';
    }

    // Files with only v2
    const v2Only = inventories.filter((i) => i.hasV2 && !i.hasV3 && !i.hasV1);
    report += `### Files with Only v2.x Markers (${v2Only.length} files)\n\n`;
    report += 'These files should appear in 2.x docs:\n\n';
    for (const inv of v2Only
        .slice(0, 20)
        .sort((a, b) => a.file.localeCompare(b.file))) {
        report += `- \`${inv.file}\` (${inv.markers.length} marker(s))\n`;
    }
    if (v2Only.length > 20) {
        report += `- ... and ${v2Only.length - 20} more files\n`;
    }
    report += '\n';

    // Files with only v3
    const v3Only = inventories.filter((i) => i.hasV3 && !i.hasV2 && !i.hasV1);
    report += `### Files with Only v3.x Markers (${v3Only.length} files)\n\n`;
    report += 'These files should appear in 3.x/latest docs:\n\n';
    for (const inv of v3Only
        .slice(0, 20)
        .sort((a, b) => a.file.localeCompare(b.file))) {
        report += `- \`${inv.file}\` (${inv.markers.length} marker(s))\n`;
    }
    if (v3Only.length > 20) {
        report += `- ... and ${v3Only.length - 20} more files\n`;
    }
    report += '\n';

    // All files detailed
    report += '## Complete File Inventory\n\n';
    for (const inv of inventories.sort((a, b) =>
        a.file.localeCompare(b.file)
    )) {
        report += `### \`${inv.file}\`\n\n`;
        report += `- v1.x: ${inv.hasV1}, v2.x: ${inv.hasV2}, v3.x: ${inv.hasV3}\n`;
        report += `- Total markers: ${inv.markers.length}\n\n`;
    }

    // Write report
    const reportPath = path.join(
        process.cwd(),
        'docs/surrealql-version-audit.md'
    );
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, report, 'utf-8');

    console.log(`✅ Inventory report generated: ${reportPath}`);
    console.log('\nSummary:');
    console.log(`- Files with markers: ${inventories.length}`);
    console.log(`- Files needing separation: ${needsSeparation.length}`);
    console.log(`- v2.x markers: ${v2Markers.length}`);
    console.log(`- v3.x markers: ${v3Markers.length}`);
}

generateInventory();
