#!/usr/bin/env bash
set -euo pipefail

show_help() {
  cat <<'EOF'
Usage:
  scripts/fix-img-import.sh [--dry-run] [root]

Description:
  Recursively scans all .ts, .tsx, .css, .scss, .md, and .mdx files under
  [root] (defaults to current directory), and rewrites @assets/img references
  that end in .png, .jpg, or .jpeg to .avif.

Options:
  --dry-run   Show what would change, but do not write files
  -h, --help  Show this help
EOF
}

dry_run=0
root="."

while (($#)); do
  case "$1" in
    --dry-run)
      dry_run=1
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      root="$1"
      ;;
  esac
  shift
done

if [[ ! -d "$root" ]]; then
  echo "Error: directory does not exist: $root" >&2
  exit 1
fi

python3 - "$root" "$dry_run" <<'PY'
import pathlib
import re
import sys

root = pathlib.Path(sys.argv[1]).resolve()
dry_run = sys.argv[2] == "1"

extensions = {".ts", ".tsx", ".css", ".scss", ".md", ".mdx"}
skip_dirs = {".git", "node_modules", "dist", "build", ".next", ".vike"}

# Match alias path references like:
# ~/assets/img/foo/bar.png
# ~/assets/img/hero.jpg?raw
# ~/assets/img/something.jpeg#hash
pattern = re.compile(r'(~/assets/img[^\s"\'`)\]}]*?)\.(?:png|jpe?g|webp)\b', re.IGNORECASE)

files_scanned = 0
files_changed = 0
total_replacements = 0
changed_paths = []

for path in root.rglob("*"):
    if not path.is_file():
        continue

    if any(part in skip_dirs for part in path.parts):
        continue

    if path.suffix.lower() not in extensions:
        continue

    files_scanned += 1

    try:
        content = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        continue

    updated, replacements = pattern.subn(r"\1.avif", content)
    if replacements == 0:
        continue

    files_changed += 1
    total_replacements += replacements
    changed_paths.append((path, replacements))

    if not dry_run:
        path.write_text(updated, encoding="utf-8")

mode = "DRY RUN" if dry_run else "UPDATED"
print(f"{mode}: scanned {files_scanned} files")
print(f"{mode}: changed {files_changed} files")
print(f"{mode}: replaced {total_replacements} image reference(s)")

if changed_paths:
    print()
    for path, replacements in changed_paths:
        rel = path.relative_to(root)
        print(f"- {rel} ({replacements})")
PY
