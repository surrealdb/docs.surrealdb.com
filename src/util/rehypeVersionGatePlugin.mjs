import { visit } from 'unist-util-visit';
import { getVersionFromPath, versionMatches } from '../util/surrealqlVersion.js';

/**
 * Rehype plugin to filter content based on version markers
 * Removes content blocks that don't match the current version
 */
export function rehypeVersionGatePlugin(currentPath) {
    return (tree) => {
        // Check if we're on a SurrealQL page
        const isSurrealQL = currentPath.startsWith('/docs/surrealql') || 
                           currentPath.startsWith('/docs/2.x/surrealql') || 
                           currentPath.startsWith('/docs/3.x/surrealql');
        
        if (!isSurrealQL) {
            return; // No filtering for non-SurrealQL pages
        }
        
        const currentVersion = getVersionFromPath(currentPath);
        
        // Find and process version-gated content
        visit(tree, 'mdxJsxFlowElement', (node, index, parent) => {
            if (!parent || index === undefined) return;
            
            // Check for VersionGate or VersionBlock components
            if (node.name === 'VersionGate' || node.name === 'VersionBlock') {
                const sinceAttr = node.attributes?.find(attr => attr.name === 'since');
                if (!sinceAttr) return;
                
                const sinceVersion = sinceAttr.value;
                const shouldRender = versionMatches(sinceVersion, currentVersion);
                
                if (!shouldRender) {
                    // Remove this node and its children
                    parent.children.splice(index, 1);
                    return index - 1; // Adjust index after removal
                }
            }
        });
        
        // Also handle sections that follow a <Since> component
        // This is a heuristic: if a <Since> component is followed by content,
        // and the version doesn't match, we might want to hide that content
        // But this is more complex and might need manual wrapping
    };
}

