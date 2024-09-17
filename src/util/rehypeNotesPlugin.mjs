import iconCaution from '@iconify-icons/fa6-solid/circle-exclamation';
import iconNote from '@iconify-icons/fa6-solid/circle-info';
import iconImportant from '@iconify-icons/fa6-solid/message';
import iconWarning from '@iconify-icons/fa6-solid/triangle-exclamation';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import { visit } from 'unist-util-visit';

const regex = /^(\[!([a-zA-Z ]+)(?:\: ?([a-zA-Z ]+))?\] *\n)/;
const kindMap = {
    note: { icon: iconNote.body },
    important: { icon: iconImportant.body },
    warning: { icon: iconWarning.body },
    caution: { icon: iconCaution.body },
};

export function rehypeNotesPlugin() {
    return (tree) => {
        visit(tree, 'element', (node) => {
            if (node.tagName === 'blockquote') {
                let text = toText(node, { whitespace: 'pre' }).trim();
                const match = text.match(regex);
                if (match) {
                    const kind = match[2].toLowerCase();
                    if (!(kind in kindMap))
                        throw new Error(`Unknown blockqoute kind: ${kind}`);
                    const heading =
                        match[3] ?? kind[0].toUpperCase() + kind.slice(1);
                    text = text.slice(match[1].length);
                    node.properties.className = [`kind-${kind}`];
                    // Strip the tag
                    node.children[1].children[0].value =
                        node.children[1].children[0].value.slice(
                            match[1].length
                        );

                    node.children = [
                        {
                            type: 'element',
                            tagName: 'div',
                            properties: {
                                className: ['kind-heading'],
                            },
                            children: [
                                {
                                    type: 'element',
                                    tagName: 'svg',
                                    properties: {
                                        viewBox: ['0 0 576 512'],
                                    },
                                    children: fromHtml(kindMap[kind].icon, {
                                        fragment: true,
                                    }).children,
                                },
                                {
                                    type: 'text',
                                    value: heading,
                                },
                            ],
                        },
                        ...node.children.slice(1),
                    ];
                }
            }
        });
    };
}
