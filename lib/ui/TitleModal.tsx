/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { CommandButton, CommandButtonGroup, useCommands } from '@remirror/react';
import * as React from 'react';
import { EditableNode, useStateWithRef } from './../utils';
import { DelayedAutoFocusInput, Icon, Modal } from './internal';

export const TitleModal = (props: { onClose: () => void, node: EditableNode }) => {
    const {
        onClose,
        node,
    } = props;

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