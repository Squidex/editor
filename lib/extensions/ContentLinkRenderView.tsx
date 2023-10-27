import { NodeViewComponentProps, useExtension } from '@remirror/react';
import * as React from 'react';
import { Icon } from './../ui/internal/Icon';
import { ContentLinkExtension } from './ContentLinkExtension';

export const ContentLinkRenderView = ({ node }: NodeViewComponentProps) => {
    const extension = useExtension(ContentLinkExtension);

    const contentId = node.attrs.contentId;
    const contentTitle = node.attrs.contentTitle;
    const schemaName = node.attrs.schemaName;

    const url = React.useMemo(() => {
        return `${extension.options.baseUrl}/app/${extension.options.appName}/content/${schemaName}/${contentId}`;
    }, [contentId, extension.options.appName, extension.options.baseUrl, schemaName]);

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