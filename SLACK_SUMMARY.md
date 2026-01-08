# 📚 SurrealQL Documentation Versioning System

## Overview
Implemented a comprehensive versioning system for SurrealQL documentation, allowing users to view docs for specific versions (2.x, 3.x, or latest).

## 🎯 Key Features

### Version Support
- **Three versions**: `latest`, `3.x`, and `2.x`
- **URL structure**: 
  - `/docs/surrealql/*` → latest version
  - `/docs/2.x/surrealql/*` → 2.x version
  - `/docs/3.x/surrealql/*` → 3.x version

### New Components
- **`VersionGate.astro`**: Conditionally renders content based on version
- **`VersionBlock.astro`**: Similar to VersionGate but supports `until` prop for deprecation
- **`SurrealQLVersionBanner.astro`**: Shows banner on 2.x pages when 3.0+ content exists
- **`SurrealQLVersionSwitcher.astro`**: Dropdown in sidebar to switch between versions
- **Enhanced `Since.astro`**: Now version-aware, shows warnings/links when feature isn't available in current version

### Smart Version Matching
- 3.x docs include both 2.x and 3.x content (superset)
- 2.x docs only show 2.x content
- Latest shows everything
- Automatic detection of version from URL path

### UI Updates
- **Sidebar**: Version switcher added for SurrealQL docs
- **Navigation**: Active state detection works across versions
- **Banners**: Alerts users when viewing 2.x but content has 3.0+ updates
- **Since badges**: Show "Not available in this version" with links to correct version

## 🔧 Technical Changes

### New Files
- `src/util/surrealqlVersion.ts` - Core versioning utilities
- `src/components/shared/VersionGate.astro`
- `src/components/shared/VersionBlock.astro`
- `src/components/shared/SurrealQLVersionBanner.astro`
- `src/components/shared/SurrealQLVersionSwitcher.astro`
- `src/pages/[version]/surrealql/index.astro` - Versioned index route
- `src/pages/[version]/surrealql/[...slug].astro` - Versioned catch-all route
- `src/util/rehypeVersionGatePlugin.mjs` - MDX plugin for version filtering
- `scripts/inventory-surrealql-versions.ts` - Script to audit version markers

### Modified Files
- `astro.config.mjs` - Sitemap filtering to exclude versioned routes
- `src/components/Sidebar/*` - Version-aware path matching
- `src/components/RenderDoc.astro` - Added version banner
- `src/components/shared/Since.astro` - Version-aware rendering
- Multiple content files - Cleaned up unnecessary `<Since>` tags

### Utilities
- `getVersionFromPath()` - Extract version from URL
- `versionMatches()` - Check if version string matches current version
- `toVersionedPath()` - Convert path to versioned path
- `compareVersions()` - Compare version strings
- `isSurrealQLPath()` - Detect SurrealQL doc paths

## 📋 Content Updates
- Removed some redundant `<Since v="v1.1.0" />` tags
- Added version gating where appropriate
- Updated robots.txt to exclude versioned routes from indexing

## 🚨 Note
There's a merge conflict in `package.json` for `@astrojs/sitemap` version (line 25-28). Currently resolved to `"3.6.0"` (without caret).

## 🧪 Testing
- Version switcher in sidebar
- Navigation between versions
- Version-aware content filtering
- Banner display on 2.x pages with 3.0+ content
- Since component behavior across versions

