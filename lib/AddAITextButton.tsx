import { CommandButton, useChainedCommands } from '@remirror/react';
import * as React from 'react';
import { OnSelectAIText } from './props';

export const AddAITextButton = ({ onSelectAIText }: { onSelectAIText: OnSelectAIText }) => {
    const chained = useChainedCommands();

    const doSelectText = React.useCallback(async () => {
        const text = await onSelectAIText();

        if (isString(text) && text.length > 0) {      
            chained.insertText(text);
        }

        chained.run();
    }, [chained, onSelectAIText]);

    return (
        <CommandButton commandName='addImage' enabled={true} onSelect={doSelectText} label='Add AI generated Text' icon={
            <span style={{ height: '16px', lineHeight: '16px' }}>AI</span>
        } />
    );
};

function isString(value: unknown): value is string {
    return typeof value === 'string' || value instanceof String;
}