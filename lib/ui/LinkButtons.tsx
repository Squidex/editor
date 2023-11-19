/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { CommandButton, useActive, useChainedCommands, useCurrentSelection } from '@remirror/react';
import * as React from 'react';
import { LinkExtension } from 'remirror/extensions';

export const LinkButtons = (props: { onEdit: () => void }) => {
    const {
        onEdit,
    } = props;

    const chain = useChainedCommands();
    const activeMarks = useActive<LinkExtension>();
    const activeLink = activeMarks.link();
    const selection = useCurrentSelection();

    const removeLink = React.useCallback(() => {
        chain.removeLink().focus().run();
    }, [chain]);

    return (
        <>
            <CommandButton commandName='updateLink' enabled={!selection.empty} label='Add or Edit Link'
                onSelect={onEdit} icon='link' />

            <CommandButton commandName='removeLink' enabled={activeLink} label='Remove Link'
                onSelect={removeLink} icon='linkUnlink' />
        </>
    );
};