import { defaultImport } from 'remirror';
import _TurndownService from 'turndown';

const TurndownService = defaultImport(_TurndownService);

const turnDownService = new TurndownService({
    hr: '---'
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


turnDownService.addRule('link2', {
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

function cleanAttribute(attribute: string | undefined | null) {
    return attribute?.replace(/(\n+\s*)+/g, '\n') || '';
}

export function htmlToMarkdown(html: string) {
    return turnDownService.turndown(html);
}