/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { NodeViewComponentProps, useExtension } from '@remirror/react';
import { Icon } from './../ui/internal/Icon';
import { ContentLinkExtension } from './ContentLinkExtension';

export const ContentLinkRenderView = ({ node }: NodeViewComponentProps) => {
    const extension = useExtension(ContentLinkExtension);

    const contentId = node.attrs.contentId;
    const contentTitle = node.attrs.contentTitle;
    const schemaName = node.attrs.schemaName;
    const onEditContent = extension.options.onEditContent;

    return (
        <div className='squidex-editor-content-link'>
            <button type='button' className='squidex-editor-button' onClick={() => onEditContent(schemaName, contentId)}>
                <Icon type='Contents' />
            </button>

            <div className='squidex-editor-content-schema'>{schemaName}</div>
            <div className='squidex-editor-content-name'>{contentTitle}</div>
        </div>
    );
};