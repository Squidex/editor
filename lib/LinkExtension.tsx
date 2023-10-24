import * as React from 'react';
import { LinkExtension, ShortcutHandlerProps } from 'remirror/extensions';
import { CommandButton, CommandButtonGroup, FloatingToolbar, useActive, useAttrs, useChainedCommands, useCurrentSelection, useExtensionEvent, useUpdateReason } from '@remirror/react';
import { Icon } from './Icon';

function useLinkShortcut() {
    const [linkShortcut, setLinkShortcut] = React.useState<ShortcutHandlerProps | undefined>();
    const [isEditing, setIsEditing] = React.useState(false);

    useExtensionEvent(LinkExtension, 'onShortcut',
        React.useCallback((props) => {
            if (!isEditing) {
                setIsEditing(true);
            }

            return setLinkShortcut(props);
        }, [isEditing]));

    return { linkShortcut, isEditing, setIsEditing };
}

function useFloatingLinkState() {
    const { isEditing, linkShortcut, setIsEditing } = useLinkShortcut();
    const updateReason = useUpdateReason();
    const chain = useChainedCommands();
    const linkAttr = useAttrs(true).link();
    const linkHref = linkAttr?.href as string ?? '';
    const selection = useCurrentSelection();
    const [href, setHref] = React.useState<string>(linkHref);

    const onRemove = React.useCallback(() => {
        chain.removeLink().focus().run();
    }, [chain]);

    React.useLayoutEffect(() => {
        if (!isEditing) {
            return;
        }

        if (updateReason.doc || updateReason.selection) {
            setIsEditing(false);
        }
    }, [isEditing, setIsEditing, updateReason.doc, updateReason.selection]);

    React.useEffect(() => {
        setHref(linkHref);
    }, [linkHref, selection]);

    const submitHref = React.useCallback(() => {
        setIsEditing(false);

        const range = linkShortcut ?? undefined;

        if (!href) {
            chain.removeLink();
        } else {
            chain.updateLink({ href, auto: false }, range);
        }

        chain.focus(range?.to ?? selection.to).run();
    }, [setIsEditing, linkShortcut, chain, href, selection]);

    const stopEdit = React.useCallback(() => {
        setIsEditing(false);
    }, [setIsEditing]);

    const startEdit = React.useCallback(() => {
        setIsEditing(true);
    }, [setIsEditing]);

    return React.useMemo(() => ({
        href,
        isEditing,
        linkShortcut,
        onRemove,
        setHref,
        startEdit,
        stopEdit,
        submitHref,
    }), [href, linkShortcut, isEditing, onRemove, startEdit, stopEdit, submitHref]);
}

const DelayAutoFocusInput = (props: React.HTMLProps<HTMLInputElement>) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            inputRef.current?.focus();
        });

        return () => {
            window.cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <input ref={inputRef} {...props} />
    );
};

export const FloatingLinkToolbar = (props: React.PropsWithChildren) => {
    const { isEditing, onRemove, href, setHref, startEdit, stopEdit, submitHref } = useFloatingLinkState();
    const activeMarks = useActive();
    const activeLink = activeMarks.link();

    const doSetHref = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setHref(event.target.value);
    }, [setHref]);

    const doComplete = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        const { code } = event;

        if (code === 'Enter') {
            submitHref();
        }

        if (code === 'Escape') {
            stopEdit();
        }
    }, [stopEdit, submitHref]);

    return (
        <FloatingToolbar className='squidex-editor-floating'>
            {isEditing &&
                <CommandButtonGroup>
                    <DelayAutoFocusInput placeholder='Enter link...'
                        value={href}
                        onChange={doSetHref}
                        onKeyDown={doComplete}
                    />

                    <CommandButton commandName='submitLink' enabled
                        onSelect={submitHref} icon={<Icon type='Check' />} />

                    <CommandButton commandName='cancelLink' enabled
                        onSelect={stopEdit} icon={<Icon type='Cancel' />} />
                </CommandButtonGroup>
            }

            {!isEditing &&
                <CommandButtonGroup>
                    {props.children}

                    {activeLink ? (
                        <>
                            <CommandButton commandName='updateLink' enabled
                                onSelect={startEdit} icon='pencilLine' />

                            <CommandButton commandName='removeLink' enabled
                                onSelect={onRemove} icon='linkUnlink' />
                        </>
                    ) : (
                        <>
                            <CommandButton commandName='updateLink' enabled
                                onSelect={startEdit} icon='link' />
                        </>
                    )}
                </CommandButtonGroup>
            }
        </FloatingToolbar>
    );
};