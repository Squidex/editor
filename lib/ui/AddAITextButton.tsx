/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { CommandButton, useChainedCommands } from '@remirror/react';
import * as React from 'react';
import { OnSelectAIText } from './../props';
import { Icon } from './internal';

export const AddAITextButton = (props: { onSelectAIText: OnSelectAIText }) => {
    const {
        onSelectAIText,
    } = props;

    const chained = useChainedCommands();

    const doSelectText = React.useCallback(async () => {
        const text = await onSelectAIText();

        if (isString(text) && text.length > 0) {      
            chained.insertText(text);
        }

        chained.run();
    }, [chained, onSelectAIText]);

    return (
        <CommandButton commandName='addImage' enabled onSelect={doSelectText} label='Add AI generated Text' icon={
            <Icon type='AI'/>
        } />
    );
};

function isString(value: unknown): value is string {
    return typeof value === 'string' || value instanceof String;
}