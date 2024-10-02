import { StandardSQL } from '@codemirror/lang-sql';
import { parser as bashParser } from '@fig/lezer-bash';
import { parseMixed } from '@lezer/common';
import { parser as goParser } from '@lezer/go';
import { highlightCode, tagHighlighter, tags } from '@lezer/highlight';
import { parser as javascriptParser } from '@lezer/javascript';
import { parser as jsonParser } from '@lezer/json';
import { parser as pythonParser } from '@lezer/python';
import { parser as rustParser } from '@lezer/rust';
import { parser as yamlParser } from '@lezer/yaml';
import { parser as _surrealqlParser } from '@surrealdb/lezer';
import { toText } from 'hast-util-to-text';
import { parser as tomlParser } from 'lezer-toml';
import { visit } from 'unist-util-visit';

const surrealqlParser = _surrealqlParser.configure({
    wrap: parseMixed((node) => {
        return node.name === 'JavaScriptContent'
            ? { parser: javascriptParser }
            : null;
    }),
});

const parser = {
    bash: bashParser,
    rs: rustParser,
    rust: rustParser,
    js: javascriptParser,
    ts: javascriptParser,
    jsx: javascriptParser,
    tsx: javascriptParser,
    javascript: javascriptParser,
    typescript: javascriptParser,
    surql: surrealqlParser,
    surrealql: surrealqlParser,
    json: jsonParser,
    sql: StandardSQL.parser,
    go: goParser,
    py: pythonParser,
    python: pythonParser,
    toml: tomlParser,
    sh: bashParser,
    syntax: _surrealqlParser.configure({ top: 'Syntax' }),
    yaml: yamlParser,
    yml: yamlParser,
};

const classHighlighter = tagHighlighter([
    { tag: tags.link, class: 'tok-link' },
    { tag: tags.heading, class: 'tok-heading' },
    { tag: tags.emphasis, class: 'tok-emphasis' },
    { tag: tags.strong, class: 'tok-strong' },
    { tag: tags.keyword, class: 'tok-keyword' },
    { tag: tags.atom, class: 'tok-atom' },
    { tag: tags.bool, class: 'tok-bool' },
    { tag: tags.url, class: 'tok-url' },
    { tag: tags.labelName, class: 'tok-labelName' },
    { tag: tags.inserted, class: 'tok-inserted' },
    { tag: tags.deleted, class: 'tok-deleted' },
    { tag: tags.literal, class: 'tok-literal' },
    { tag: tags.string, class: 'tok-string' },
    { tag: tags.number, class: 'tok-number' },
    {
        tag: [tags.regexp, tags.escape, tags.special(tags.string)],
        class: 'tok-string2',
    },
    { tag: tags.variableName, class: 'tok-variableName' },
    { tag: tags.local(tags.variableName), class: 'tok-variableName tok-local' },
    {
        tag: tags.definition(tags.variableName),
        class: 'tok-variableName tok-definition',
    },
    { tag: tags.special(tags.variableName), class: 'tok-variableName2' },
    {
        tag: tags.definition(tags.propertyName),
        class: 'tok-propertyName tok-definition',
    },
    { tag: tags.typeName, class: 'tok-typeName' },
    { tag: tags.namespace, class: 'tok-namespace' },
    { tag: tags.className, class: 'tok-className' },
    { tag: tags.macroName, class: 'tok-macroName' },
    { tag: tags.propertyName, class: 'tok-propertyName' },
    { tag: tags.operator, class: 'tok-operator' },
    { tag: tags.comment, class: 'tok-comment' },
    { tag: tags.meta, class: 'tok-meta' },
    { tag: tags.invalid, class: 'tok-invalid' },
    { tag: tags.punctuation, class: 'tok-punctuation' },
    { tag: tags.function(tags.name), class: 'tok-function' },
]);

export function rehypeCodemirrorPlugin() {
    return (tree) => {
        visit(tree, 'element', (node) => {
            if (node.tagName === 'code') {
                const text = toText(node, { whitespace: 'pre' }).trim();
                const lang = language(node);

                node.children = createHighlightedCode(text, lang);

                if (node.properties.metastring) {
                    const [type, val] = processMetastring(
                        node.properties.metastring
                    );
                    if (type === 'title') {
                        node.children = [
                            {
                                type: 'element',
                                tagName: 'div',
                                properties: {
                                    className: ['code-title'],
                                },
                                children: [{ type: 'text', value: val }],
                            },
                            {
                                type: 'element',
                                tagName: 'div',
                                properties: {
                                    className: ['code-container'],
                                },
                                children: node.children,
                            },
                        ];
                    }
                }
            }
        });
    };
}

function createHighlightedCode(code, lang) {
    const children = [];

    function emit(text, classes) {
        const node = {
            type: 'text',
            value: text,
        };

        if (classes) {
            children.push({
                type: 'element',
                tagName: 'span',
                properties: { className: classes },
                children: [node],
            });
        } else {
            children.push(node);
        }
    }

    function emitBreak() {
        children.push({
            type: 'text',
            value: '\n',
        });
    }

    if (!parser[lang]) {
        children.push({
            type: 'text',
            value: code,
        });
    } else {
        highlightCode(
            code,
            parser[lang].parse(code),
            classHighlighter,
            emit,
            emitBreak
        );
    }

    return children;
}

function language(node) {
    const className = node.properties.className;
    if (!className) return;
    return className
        .find((c) => c.startsWith('lang-') || c.startsWith('language-'))
        ?.split('-')[1];
}

function processMetastring(metastring) {
    const [type, raw] = metastring.split('=');
    return [type, JSON.parse(raw)];
}
