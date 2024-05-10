/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { command, CommandFunction, DOMCompatibleAttributes, DOMOutputSpec, extension, ExtensionTag, NodeExtension, NodeExtensionSpec, PrimitiveSelection } from 'remirror';
import { PlainHtmlRenderView } from './PlainHtmlRenderView';

interface PlainHtmlOptions {}

@extension<PlainHtmlOptions>({
    defaultOptions: {},
})
export class PlainHtmlExtension extends NodeExtension<PlainHtmlOptions> {
    public get name(): string {
        return 'plainHtml' as const;
    }

    constructor() {
        super({ disableExtraAttributes: true });
    }

    public createTags() {
        return [ExtensionTag.Block, ExtensionTag.TextBlock, ExtensionTag.FormattingNode];
    }

    public createNodeSpec(): NodeExtensionSpec {
        return {
            attrs: {
                html: { default: '' },
            },
            toDOM: node => {
                const html = node.attrs.html;

                return ['div', { class: '__editor_html' }, ...parseDOM(html)];
            },
            parseDOM: [
                {
                    tag: 'div[class~=__editor_html]',
                    getAttrs: (dom) => {
                        return {
                            html: (dom as HTMLDivElement).innerHTML
                        };
                    },
                    priority: 10000,
                },
            ],
        };
    }

    public ReactComponent = PlainHtmlRenderView;

    @command({})
    public insertPlainHtml(selection?: PrimitiveSelection): CommandFunction {
        return this.store.commands.insertNode.original(this.type, {
            attrs: {
                content: '',
            },
            selection
        });
    }
}

function parseDOM(innerHtml: string): DOMOutputSpec[] {
    if (!innerHtml) {
        return [''];
    }

    const div = document.createElement('div');

    div.innerHTML = innerHtml;

    return parseChildren(div);
}

function parseElement(element: HTMLElement): DOMOutputSpec {
    const attributes: DOMCompatibleAttributes = {};

    for (let i = 0; i < element.attributes.length; i++) {
        const attribute = element.attributes[i];

        attributes[attribute.name] = attribute.value;
    }

    return [element.nodeName, attributes, ...parseChildren(element)];
}

function parseChildren(element: HTMLElement) {
    const result: DOMOutputSpec[] = [];

    for (const child of element.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) {
            result.push(parseElement(child as HTMLElement));
        } else if (child.nodeType === Node.TEXT_NODE && child.textContent != null) {
            result.push(child.textContent);
        }
    }

    return result;
}