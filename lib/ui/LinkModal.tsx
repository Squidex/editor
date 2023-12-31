/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { CommandButton, CommandButtonGroup, useAttrs, useChainedCommands, useCurrentSelection } from '@remirror/react';
import * as React from 'react';
import { LinkExtension } from 'remirror/extensions';
import { useStateWithRef } from '../utils';
import { DelayedAutoFocusInput, Icon, Modal } from './internal';

export const LinkModal = (props: { onClose: () => void }) => {
    const {
        onClose,
    } = props;

    const chain = useChainedCommands();
    const linkAttr = useAttrs<LinkExtension>(true).link();
    const linkHref = linkAttr?.href as string ?? '';
    const selection = useCurrentSelection();
    const [href, setHref, hrefRef] = useStateWithRef<string>('');

    React.useEffect(() => {
        setHref(linkHref);
    }, [linkHref, selection, setHref]);

    const submitHref = React.useCallback(() => {
        const href = hrefRef.current;

        if (!href) {
            chain.removeLink();
        } else {
            chain.updateLink({ href, auto: false });
        }

        chain.focus(selection.to).run();

        onClose();
    }, [chain, hrefRef, onClose, selection.to]);

    const doSetHref = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setHref(event.target.value);
    }, [setHref]);

    const doComplete = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        const { code } = event;

        if (code === 'Enter') {
            submitHref();
        }

        if (code === 'Escape') {
            onClose();
        }
    }, [onClose, submitHref]);

    return (
        <Modal title='Change Link'>
            <DelayedAutoFocusInput
                value={href}
                onChange={doSetHref}
                onKeyDown={doComplete}
                placeholder='Enter Link...'
            />

            <CommandButtonGroup>
                <CommandButton commandName='submitLink' enabled
                    onSelect={submitHref} icon={<Icon type='Check' />} />

                <CommandButton commandName='cancelLink' enabled
                    onSelect={onClose} icon={<Icon type='Cancel' />} />
            </CommandButtonGroup>
        </Modal>
    );
};