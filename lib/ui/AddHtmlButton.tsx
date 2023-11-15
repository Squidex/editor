/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { CommandButton, useChainedCommands } from '@remirror/react';
import * as React from 'react';
import { Icon } from './internal';

export const AddHtmlButton = () => {
    const chained = useChainedCommands();

    const doSelectText = React.useCallback(async () => {
        chained.insertPlainHtml().run();
    }, [chained]);

    return (
        <CommandButton commandName='addImage' enabled onSelect={doSelectText} label='Add HTML' icon={
            <Icon type='HTML'/>
        } />
    );
};