import { CommandButton, CommandButtonGroup, useCommands } from '@remirror/react';
import * as React from 'react';
import { DelayedAutoFocusInput } from './DelayedAutoFocusInput';
import { Icon } from './Icon';
import { Modal } from './Modal';
import { EditableNode, useStateWithRef } from './utils';

export const TitleModal = ({ onClose, node }: { onClose: () => void, node: EditableNode }) => {
    const [title, setTitle, titleRef] = useStateWithRef<string>('');
    const cmd = useCommands();
    
    React.useEffect(() => {
        setTitle(node.node.attrs.title || '');
    }, [node, setTitle]);

    const doSetTitle = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }, [setTitle]);

    const submitTitle = React.useCallback(() => {
        cmd.updateNodeAttributes(node.getPos() || 0, { ...node.node.attrs || {}, title: titleRef.current });

        onClose();
    }, [cmd, node, onClose, titleRef]);

    const doComplete = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        const { code } = event;

        if (code === 'Enter') {
            submitTitle();
        }

        if (code === 'Escape') {
            onClose();
        }
    }, [onClose, submitTitle]);

    return (
        <Modal title='Change Image Title'>
            <DelayedAutoFocusInput
                value={title}
                onChange={doSetTitle}
                onKeyDown={doComplete}
                placeholder='Enter Title...'
            />

            <CommandButtonGroup>
                <CommandButton commandName='submitLink' enabled
                    onSelect={submitTitle} icon={<Icon type='Check' />} />

                <CommandButton commandName='cancelLink' enabled
                    onSelect={onClose} icon={<Icon type='Cancel' />} />
            </CommandButtonGroup>
        </Modal>
    );
};