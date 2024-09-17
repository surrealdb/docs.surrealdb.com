import type { CollectionKey } from 'astro:content';
import type { Props as ImageProps } from '@components/Image.astro';

import LightDotnet from '@img/light/dotnet.png';
import LightGolang from '@img/light/golang.png';
import LightJava from '@img/light/java.png';
import LightJavascript from '@img/light/javascript.png';
import LightPhp from '@img/light/php.png';
import LightPython from '@img/light/python.png';
import LightRust from '@img/light/rust.png';

import DarkDotnet from '@img/dotnet-icon.png';
import DarkGolang from '@img/golang-icon.png';
import DarkJava from '@img/java-icon.png';
import DarkJavascript from '@img/javascript-icon.png';
import DarkPhp from '@img/php-icon.png';
import DarkPython from '@img/python-icon.png';
import DarkRust from '@img/rust-icon.png';

import LightSurrealML from '@img/light/doc-surrealml.png';
import LightSurrealDB from '@img/light/surreal.png';
import LightSurrealQL from '@img/light/surreal.png';
import LightSurrealist from '@img/light/surreal.png';

import DarkSurrealDB from '@img/doc-surrealdb.png';
import DarkSurrealist from '@img/doc-surrealist.png';
import DarkSurrealML from '@img/doc-surrealml.png';
import DarkSurrealQL from '@img/surreal-icon.png';

type Metadata = {
    [K in CollectionKey]?: {
        title: string;
        icon: ImageProps['src'];
        repo?: {
            title: string;
            href: string;
        };
    };
};

export const metadata = {
    'doc-sdk-dotnet': {
        title: 'Dotnet SDK',
        icon: {
            light: LightDotnet,
            dark: DarkDotnet,
        },
        repo: {
            title: 'surrealdb/surrealdb.net',
            href: 'https://github.com/surrealdb/surrealdb.net',
        },
    },
    'doc-sdk-golang': {
        title: 'Golang SDK',
        icon: {
            light: LightGolang,
            dark: DarkGolang,
        },
        repo: {
            title: 'surrealdb/surrealdb.go',
            href: 'https://github.com/surrealdb/surrealdb.go',
        },
    },
    'doc-sdk-java': {
        title: 'Java SDK',
        icon: {
            light: LightJava,
            dark: DarkJava,
        },
        repo: {
            title: 'surrealdb/surrealdb.java',
            href: 'https://github.com/surrealdb/surrealdb.java',
        },
    },
    'doc-sdk-javascript': {
        title: 'JavaScript SDK',
        icon: {
            light: LightJavascript,
            dark: DarkJavascript,
        },
        repo: {
            title: 'surrealdb/surrealdb.js',
            href: 'https://github.com/surrealdb/surrealdb.js',
        },
    },
    'doc-sdk-php': {
        title: 'PHP SDK',
        icon: {
            light: LightPhp,
            dark: DarkPhp,
        },
        repo: {
            title: 'surrealdb/surrealdb.php',
            href: 'https://github.com/surrealdb/surrealdb.php',
        },
    },
    'doc-sdk-python': {
        title: 'Python SDK',
        icon: {
            light: LightPython,
            dark: DarkPython,
        },
        repo: {
            title: 'surrealdb/surrealdb.python',
            href: 'https://github.com/surrealdb/surrealdb.python',
        },
    },
    'doc-sdk-rust': {
        title: 'Rust SDK',
        icon: {
            light: LightRust,
            dark: DarkRust,
        },
        repo: {
            title: 'surrealdb/surrealdb',
            href: 'https://github.com/surrealdb/surrealdb',
        },
    },
    'doc-surrealdb': {
        title: 'SurrealDB',
        icon: {
            light: LightSurrealDB,
            dark: DarkSurrealDB,
        },
        repo: {
            title: 'surrealdb/surrealdb',
            href: 'https://github.com/surrealdb/surrealdb',
        },
    },
    'doc-surrealist': {
        title: 'Surrealist',
        icon: {
            light: LightSurrealist,
            dark: DarkSurrealist,
        },
        repo: {
            title: 'surrealdb/surrealist',
            href: 'https://github.com/surrealdb/surrealist',
        },
    },
    'doc-surrealml': {
        title: 'SurrealML',
        icon: {
            light: LightSurrealML,
            dark: DarkSurrealML,
        },
        repo: {
            title: 'surrealdb/surrealml',
            href: 'https://github.com/surrealdb/surrealml',
        },
    },
    'doc-surrealql': {
        title: 'SurrealQL',
        icon: {
            light: LightSurrealQL,
            dark: DarkSurrealQL,
        },
        repo: {
            title: 'surrealdb/surrealdb',
            href: 'https://github.com/surrealdb/surrealdb',
        },
    },
} satisfies Metadata;
