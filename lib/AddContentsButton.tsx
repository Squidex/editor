import { CommandButton, useChainedCommands } from '@remirror/react';
import * as React from 'react';
import { Icon } from './Icon';
import { OnSelectContents } from './props';

export const AddContentsButton = ({ onSelectContents }: { onSelectContents: OnSelectContents }) => {
    const chained = useChainedCommands();

    const doSelectContent = React.useCallback(async () => {
        const contents = await onSelectContents();

        for (const content of contents) {
            chained.insertText(content.title, {
                marks: {
                    link: {
                        href: content.href
                    }
                }
            });
            chained.insertText(' ');
        }

        chained.run();
    }, [chained, onSelectContents]);

    return (
        <CommandButton commandName='addContent' enabled={true} onSelect={doSelectContent} label='Add Content' icon={
            <Icon type='Contents' />
        } />
    );
};