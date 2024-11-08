import type { CollectionKey } from 'astro:content';
import type { Props as ImageProps } from '@components/Image.astro';

import LightDotnet from '@img/icon/light/dotnet.png';
import LightGolang from '@img/icon/light/golang.png';
import LightJava from '@img/icon/light/java.png';
import LightJavascript from '@img/icon/light/javascript.png';
import LightPhp from '@img/icon/light/php.png';
import LightPython from '@img/icon/light/python.png';
import LightRust from '@img/icon/light/rust.png';

import DarkDotnet from '@img/icon/dark/dotnet.png';
import DarkGolang from '@img/icon/dark/golang.png';
import DarkJava from '@img/icon/dark/java.png';
import DarkJavascript from '@img/icon/dark/javascript.png';
import DarkPhp from '@img/icon/dark/php.png';
import DarkPython from '@img/icon/dark/python.png';
import DarkRust from '@img/icon/dark/rust.png';

import LightSurrealDB from '@img/icon/light/surrealdb.png';
import LightSurrealist from '@img/icon/light/surrealdb.png';
import LightSurrealML from '@img/icon/light/surrealml.png';
import LightSurrealQL from '@img/icon/light/surrealql.png';

import DarkSurrealDB from '@img/icon/dark/surrealdb.png';
import DarkSurrealist from '@img/icon/dark/surrealist.png';
import DarkSurrealML from '@img/icon/dark/surrealml.png';
import DarkSurrealQL from '@img/icon/dark/surrealql.png';

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
        title: '.NET SDK',
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
            title: 'surrealdb/surrealdb.py',
            href: 'https://github.com/surrealdb/surrealdb.py',
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
    'doc-tutorials': {
        title: 'Tutorials',
        icon: {
            light: LightSurrealDB,
            dark: DarkSurrealDB,
        },
        repo: {
            title: 'surrealdb/examples',
            href: 'https://github.com/surrealdb/examples',
        },
    },
} satisfies Metadata;
