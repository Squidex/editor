import { CommandButton, useChainedCommands } from '@remirror/react';
import * as React from 'react';

export const AddHtmlButton = () => {
    const chained = useChainedCommands();

    const doSelectText = React.useCallback(async () => {
        chained.insertPlainHtml().run();
    }, [chained]);

    return (
        <CommandButton commandName='addImage' enabled={true} onSelect={doSelectText} label='Add HTML' icon={
            <span style={{ height: '16px', lineHeight: '16px' }}>HTML</span>
        } />
    );
};