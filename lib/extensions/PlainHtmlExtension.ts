import { DOMCompatibleAttributes, DOMOutputSpec, ExtensionTag, NodeExtension, NodeExtensionSpec } from 'remirror';
import { PlainHtmlRenderView } from './PlainHtmlRenderView';

export class PlainHtmlExtension extends NodeExtension {
    public get name(): string {
        return 'plain-html' as const;
    }

    constructor() {
        super({ disableExtraAttributes: true });
    }
    
    public createTags() {
        return [ExtensionTag.Block];
    }

    public createNodeSpec(): NodeExtensionSpec {
        return {
            attrs: {
                html: { default: '' },
            },
            toDOM: node => {
                const content = node.attrs.html;

                return ['div', { class: 'raw-content' }, ...parseDOM(content)];
            },
            parseDOM: [
                {
                    tag: 'div[class~=raw-content]',
                    getAttrs: (dom) => {
                        return {
                            content: (dom as HTMLDivElement).innerHTML
                        };
                    },
                    priority: 10000,
                },
            ],
        };
    }

    ReactComponent = PlainHtmlRenderView;
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