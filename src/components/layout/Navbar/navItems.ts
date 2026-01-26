import type { Props as ImageProps } from '@components/Image.astro';

import DarkDotnet from '@img/icon/dark/dotnet.png';
import DarkGolang from '@img/icon/dark/golang.png';
import DarkJava from '@img/icon/dark/java.png';
import DarkJavascript from '@img/icon/dark/javascript.png';
import DarkNodejs from '@img/icon/dark/nodejs.png';
import DarkPhp from '@img/icon/dark/php.png';
import DarkPython from '@img/icon/dark/python.png';
import DarkRust from '@img/icon/dark/rust.png';
import DarkWasm from '@img/icon/dark/webassembly.png';

import DarkBook from '@img/icon/dark/book.png';
import DarkExamples from '@img/icon/dark/examples.png';
import DarkSidekick from '@img/icon/dark/sidekick.png';
import DarkTutorials from '@img/icon/dark/tutorials.png';
import DarkUniversity from '@img/icon/dark/university.png';

import LightDotnet from '@img/icon/light/dotnet.png';
import LightGolang from '@img/icon/light/golang.png';
import LightJava from '@img/icon/light/java.png';
import LightJavascript from '@img/icon/light/javascript.png';
import LightNodejs from '@img/icon/light/nodejs.png';
import LightPhp from '@img/icon/light/php.png';
import LightPython from '@img/icon/light/python.png';
import LightRust from '@img/icon/light/rust.png';
import LightWasm from '@img/icon/light/webassembly.png';

import LightBook from '@img/icon/light/book-light.png';
import LightExamples from '@img/icon/light/examples.png';
import LightSidekick from '@img/icon/light/sidekick-light.png';
import LightTutorials from '@img/icon/light/tutorials-light.png';
import LightUniversity from '@img/icon/light/university-light.png';

export type NavSubItem = {
    title: string;
    icon?: ImageProps['src'];
    href?: string;
    external?: boolean;
};

export type NavItem = {
    label: string;
    href: string | NavSubItem[];
};

export const navItems: NavItem[] = [
    { label: 'SurrealDB', href: '/docs/surrealdb' },
    { label: 'SurrealQL', href: '/docs/surrealql' },
    { label: 'Surrealist UI', href: '/docs/surrealist' },
    { label: 'Cloud', href: '/docs/cloud' },
    { label: 'Extensions', href: '/docs/surrealdb/extensions' },
    {
        label: 'SDKs',
        href: [
            {
                title: 'Rust',
                href: '/docs/sdk/rust',
                icon: { light: LightRust, dark: DarkRust },
            },
            {
                title: 'JavaScript',
                href: '/docs/sdk/javascript',
                icon: { light: LightJavascript, dark: DarkJavascript },
            },
            {
                title: 'Node.js',
                href: '/docs/sdk/javascript/engines/node',
                icon: { light: LightNodejs, dark: DarkNodejs },
            },
            {
                title: 'WebAssembly',
                href: '/docs/sdk/javascript/engines/wasm',
                icon: { light: LightWasm, dark: DarkWasm },
            },
            {
                title: 'Java',
                href: '/docs/sdk/java',
                icon: { light: LightJava, dark: DarkJava },
            },
            {
                title: 'Golang',
                href: '/docs/sdk/golang',
                icon: { light: LightGolang, dark: DarkGolang },
            },
            {
                title: 'Python',
                href: '/docs/sdk/python',
                icon: { light: LightPython, dark: DarkPython },
            },
            {
                title: '.NET',
                href: '/docs/sdk/dotnet',
                icon: { light: LightDotnet, dark: DarkDotnet },
            },
            {
                title: 'PHP',
                href: '/docs/sdk/php',
                icon: { light: LightPhp, dark: DarkPhp },
            },
        ],
    },
    { label: 'Integrations', href: '/docs/integrations' },
    { label: 'Examples', href: [{
                title: 'Lab Examples',
                href: '/docs/labs?filters=examples',
                icon: { light: LightExamples, dark: DarkExamples },
            },
            {
                title: 'Lab Tutorials',
                href: '/docs/labs?filters=tutorials',
                icon: { light: LightTutorials, dark: DarkTutorials },
            },] },
    {
        label: 'Education',
        href: [
                        {
                title: 'Quick tour',
                href: '/learn/tour',
                icon: { light: LightUniversity, dark: DarkUniversity },
                external: true,
            },
            {
                title: 'Fundamentals',
                href: '/learn/fundamentals',
                icon: { light: LightUniversity, dark: DarkUniversity },
                external: true,
            },
            {
                title: 'Book',
                href: '/learn/book',
                icon: { light: LightBook, dark: DarkBook },
                external: true,
            },
                        {
                title: 'Movie database',
                href: '/learn/movies',
                icon: { light: LightBook, dark: DarkBook },
                external: true,
            },
            {
                title: 'Sidekick assistant',
                href: 'https://app.surrealdb.com/chat',
                icon: { light: LightSidekick, dark: DarkSidekick },
                external: true,
            },
        ],
    },
];

export const socialLinks = [
    {
        href: 'https://github.com/surrealdb/surrealdb',
        icon: 'fa6-brands:github',
        label: 'GitHub',
    },
    {
        href: 'https://discord.gg/surrealdb',
        icon: 'fa6-brands:discord',
        label: 'Discord',
    },
    {
        href: 'https://x.com/surrealdb',
        icon: 'fa6-brands:x-twitter',
        label: 'X',
    },
    {
        href: 'https://www.youtube.com/@SurrealDB',
        icon: 'fa6-brands:youtube',
        label: 'YouTube',
    },
    {
        href: 'https://bsky.app/profile/surrealdb.com',
        icon: 'fa6-brands:bluesky',
        label: 'Bluesky',
    },
];
