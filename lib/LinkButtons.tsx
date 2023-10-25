import { CommandButton, useActive, useChainedCommands, useCurrentSelection } from '@remirror/react';
import * as React from 'react';

export const LinkButtons = ({ onEdit }: { onEdit: () => void }) => {
    const chain = useChainedCommands();
    const activeMarks = useActive();
    const activeLink = activeMarks['link']();
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