/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { command, CommandFunction, extension, ExtensionTag, NodeExtension, NodeExtensionSpec, PrimitiveSelection } from 'remirror';
import { Content } from './../props';
import { getContentId } from './../utils';
import { ContentLinkRenderView } from './ContentLinkRenderView';

export interface ContentLinkExtensionOptions {
    // The base url.
    baseUrl: string;

    // The name to the app.
    appName: string;

    // Called when a content is to be edited.
    onEditContent: (schemaName: string, id: string) => void;
}

@extension<ContentLinkExtensionOptions>({
    defaultOptions: {} as never
})
export class ContentLinkExtension extends NodeExtension<ContentLinkExtensionOptions> {
    public get name(): string {
        return 'contentLink' as const;
    }

    constructor(options: ContentLinkExtensionOptions) {
        super({ ...options, disableExtraAttributes: true });
    }

    public createTags() {
        return [ExtensionTag.InlineNode, ExtensionTag.Media];
    }

    public createNodeSpec(): NodeExtensionSpec {
        return {
            inline: true,
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
                    priority: 100000,
                },
            ],
        };
    }

    public ReactComponent = ContentLinkRenderView;

    @command({})
    public addContent(content: Content, selection?: PrimitiveSelection): CommandFunction {
        return this.store.commands.insertNode.original(this.type, {
            attrs: {
                contentId: content.id,
                contentTitle: content.title,
                schemaName: content.schemaName,
            },
            selection
        });
    }
}