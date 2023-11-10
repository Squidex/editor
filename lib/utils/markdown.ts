/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { marked } from 'marked';
import { defaultImport } from 'remirror';
import _TurndownService from 'turndown';
import { escapeHTML } from './escape';

const TurndownService = defaultImport(_TurndownService);

const turnDownService = new TurndownService({
    hr: '---',
    codeBlockStyle: 'fenced'
});

turnDownService.addRule('link2', {
    filter: (node, options) => {
        return options.linkStyle === 'inlined' && node.nodeName === 'A' && !!node.getAttribute('href');
    },
    replacement: function (content, node) {
        const linkElement = node as HTMLElement;
        const linkHref = linkElement.getAttribute('href');

        if (!linkHref) {
            return '';
        }

        const linkTitle = cleanAttribute(linkElement.getAttribute('title'));

        if (linkTitle) {
            return `[${content}](${linkHref} '${linkTitle}')`;
        } else {
            return `[${content}](${linkHref})`;
        }
    }
});

turnDownService.addRule('img2', {
    filter: 'img',
    replacement: (_, node) => {
        const imageElement = node as HTMLImageElement;
        const imageSrc = imageElement.getAttribute('src') || '';

        if (!imageSrc) {
            return '';
        }

        const imageAlt = cleanAttribute(imageElement.getAttribute('alt'));
        const imageTitle = cleanAttribute(imageElement.getAttribute('title'));

        if (imageTitle) {
            return `![${imageAlt}](${imageSrc} '${imageTitle}')`;
        } else {
            return `![${imageAlt}](${imageSrc})`;
        }
    }
});

export const LANGUAGE_ATTRIBUTE = 'data-code-block-language';

turnDownService.addRule('code2', {
    filter: (node, options) => {
        return (
            options.codeBlockStyle === 'fenced' &&
            node.nodeName === 'PRE' &&
            node.firstChild !== null &&
            node.firstChild.nodeName === 'CODE'
        );
    },
    replacement: function (_, node, options) {
        const language = (node.firstChild! as HTMLElement).getAttribute(LANGUAGE_ATTRIBUTE);

        const codeText = node.firstChild!.textContent!;
        const codeFence = options.fence!.charAt(0);

        let fenceSize = 3;

        const fenceInCodeRegex = new RegExp('^' + codeFence + '{3,}', 'gm');

        let match;
        while ((match = fenceInCodeRegex.exec(codeText))) {
            if (match[0].length >= fenceSize) {
                fenceSize = match[0].length + 1;
            }
        }

        const fence = repeat(codeFence, fenceSize);

        return `\n\n${fence}${language}\n${codeText.replace(/\n$/, '')}\n${fence}\n\n`;
    }
});

function cleanAttribute(attribute: string | undefined | null) {
    return attribute?.replace(/(\n+\s*)+/g, '\n') || '';
}

marked.use({
    renderer: {
        code: (code: string, infostring: string | undefined, escaped: boolean) => {
            const lang = (infostring || '').match(/^\S*/)?.[0];

            code = code.replace(/\n$/, '');

            if (escaped) {
                code;
            } else {
                code = escapeHTML(code, true);
            }

            if (!lang) {
                return `<pre><code>${code}</code></pre>\n`;
            }

            return `<pre><code class="language-${escapeHTML(lang)}">${code}</code></pre>\n`;
        }
    }
});

export function htmlToMarkdown(html: string) {
    const markdown = turnDownService.turndown(html);

    return markdown;
}

export function markdownToHtml(markdown: string): string {
    const html = marked(markdown, { gfm: true });

    return html;
}

function repeat(character: string, count: number) {
    return Array(count + 1).join(character);
}