/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import * as React from 'react';

export const Modal = ({ children, title }: { title?: string } & React.PropsWithChildren) => {
    return (
        <div className='squidex-editor-modal-wrapper'>
            <div className='squidex-editor-modal-backdrop'></div>
            <div className='squidex-editor-modal-window'>
                {title &&
                    <div className='squidex-editor-modal-title'>
                        {title}
                    </div>
                }

                <div className='squidex-editor-modal-body'>
                    {children}
                </div>
            </div>
        </div>
    );
};