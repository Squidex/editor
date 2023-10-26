import { NodeViewComponentProps } from '@remirror/react';
import * as React from 'react';
import { ExtensionTag, NodeExtension, NodeExtensionSpec } from 'remirror';
import { Icon } from './Icon';
import { getContentId } from './utils';

type EditingOptions = { baseUrl: string, appName: string };

export class CustomLinkExtension extends NodeExtension<EditingOptions> {
    public get name(): string {
        return 'content-link' as const;
    }

    constructor(options: EditingOptions) {
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
                        const href = (dom as HTMLAnchorElement).getAttribute('href');

                        if (!href) {
                            return null;
                        }

                        const content = getContentId(href, this.options.baseUrl, this.options.appName);
                        
                        if (!content) {
                            return null;
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

    ReactComponent = (props: NodeViewComponentProps) => {
        return (
            <RenderView {...props} {...this.options} />
        );
    };
}

export const RenderView = ({ appName, baseUrl, node }: NodeViewComponentProps & EditingOptions) => {
    const contentId = node.attrs.contentId;
    const contentTitle = node.attrs.contentTitle;
    const schemaName = node.attrs.schemaName;

    const url = React.useMemo(() => {
        return `${baseUrl}/app/${appName}/content/${schemaName}/${contentId}`;
    }, [appName, baseUrl, contentId, schemaName]);

    return (
        <div className='squidex-editor-content-link'>
            <a href={url} target='_blank' className='squidex-editor-button'>
                <Icon type='Contents' />
            </a>
            
            <div className='squidex-editor-content-schema'>{schemaName}</div>
            <div className='squidex-editor-content-name'>{contentTitle}</div>
        </div>
    );
};