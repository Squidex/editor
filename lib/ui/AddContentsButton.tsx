/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { CommandButton, useChainedCommands } from '@remirror/react';
import * as React from 'react';
import { OnSelectContents } from './../props';
import { Icon } from './internal';

export const AddContentsButton = ({ onSelectContents }: { onSelectContents: OnSelectContents }) => {
    const chained = useChainedCommands();

    const doSelectContent = React.useCallback(async () => {
        const contents = await onSelectContents();

        for (const content of contents) {
            chained.addContent(content);
        }

        chained.run();
    }, [chained, onSelectContents]);

    return (
        <CommandButton commandName='addContent' enabled={true} onSelect={doSelectContent} label='Add Content' icon={
            <Icon type='Contents' />
        } />
    );
};