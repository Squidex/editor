/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { NodeViewComponentProps } from '@remirror/react';
import * as React from 'react';

export const PlainHtmlRenderView = ({ node, getPosition, view }: NodeViewComponentProps) => {
    const doChangeContent = React.useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const tr = view.state.tr.setNodeAttribute(getPosition()!, 'html', event.target.value);

        view.dispatch(tr);
    }, [getPosition, view]);

    return (
        <div className='squidex-editor-html'>
            <div className='squidex-editor-html-label'>Plain HTML</div>

            <textarea spellCheck="false" value={node.attrs.content} onChange={doChangeContent}></textarea>
        </div>
    );
};