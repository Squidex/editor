/* eslint-disable @typescript-eslint/no-explicit-any */
import { command, CommandFunction, extension, ExtensionTag, isElementDomNode, NodeExtension, NodeExtensionSpec, PrimitiveSelection } from 'remirror';
import { Content } from './../props';
import { getContentId } from './../utils';
import { ContentLinkRenderView } from './ContentLinkRenderView';

export interface ContentLinkExtensionOptions {
    // The base url.
    baseUrl: string;

    // The name to the app.
    appName: string;
}

@extension<ContentLinkExtensionOptions>({
    defaultOptions: { baseUrl: '', appName: '' }
})
export class ContentLinkExtension extends NodeExtension<ContentLinkExtensionOptions> {
    public get name(): string {
        return 'content-link' as const;
    }

    constructor(options: ContentLinkExtensionOptions) {
        super({ ...options, disableExtraAttributes: true });
    }
    
    public createTags() {
        return [ExtensionTag.Block];
    }

    public createNodeSpec(): NodeExtensionSpec {
        return {
            attrs: {
                contentId: { default: '' },
                contentTitle: { default: '' },
                schemaName: { default: '' },
            },
            toDOM: node => {
                const href = `${this.options.baseUrl}/api/content/${this.options.appName}/${node.attrs.schemaName}/${node.attrs.contentId}`;

                return ['a', { href }, node.attrs.contentTitle];
            },
            parseDOM: [
                {
                    tag: 'a[href]',
                    getAttrs: (dom) => {
                        if (!isElementDomNode(dom)) {
                            return false;
                        }
                        
                        const href = (dom as HTMLAnchorElement).getAttribute('href');

                        if (!href) {
                            return false;
                        }

                        const content = getContentId(href, this.options.baseUrl, this.options.appName);
                        
                        if (!content) {
                            return false;
                        }

                        return {
                            contentId: content.id,
                            contentTitle: (dom as HTMLElement).innerText,
                            schemaName: content.schemaName,
                        };
                    },
                    priority: 10000,
                },
            ],
        };
    }

    public ReactComponent = ContentLinkRenderView;
    
    @command({})
    public addContent(content: Content, selection?: PrimitiveSelection): CommandFunction {
        return this.store.commands.insertNode.original(this.type, {
            attrs: {
                contentId: content,
                contentTitle: content.title,
                schemaName: content.schemaName,
            },
            selection
        });
    }
}