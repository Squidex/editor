import { CommandButton, useCommands } from '@remirror/react';

export const AlignmentButtons = () => {
    const commands = useCommands();
    
    return (
        <>
            <CommandButton commandName='alignLeft' enabled label='Align text left'
                onSelect={commands.leftAlign} icon='alignLeft' />

            <CommandButton commandName='alignLeft' enabled label='Align text center'
                onSelect={commands.centerAlign} icon='alignCenter' />

            <CommandButton commandName='alignRight' enabled label='Align text right'
                onSelect={commands.rightAlign} icon='alignRight' />
                
            <CommandButton commandName='alignJustify' enabled label='Justify text'
                onSelect={commands.justifyAlign} icon='alignJustify' />
        </>
    );
};