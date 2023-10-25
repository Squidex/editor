import { CommandButton, CommandButtonGroup, useAttrs, useChainedCommands, useCurrentSelection } from '@remirror/react';
import * as React from 'react';
import { DelayedAutoFocusInput } from './DelayedAutoFocusInput';
import { Icon } from './Icon';
import { Modal } from './Modal';
import { useStateWithRef } from './utils';

export const LinkModal = ({ onClose }: { onClose: () => void }) => {
    const [href, setHref, hrefRef] = useStateWithRef<string>('');
    const chain = useChainedCommands();
    const linkAttr = useAttrs(true)['link']();
    const linkHref = linkAttr?.href as string ?? '';
    const selection = useCurrentSelection();

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