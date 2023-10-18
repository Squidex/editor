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
    const updateReason = useUpdateReason();;
    const chain = useChainedCommands();
    const attrSet = useAttrs();
    const attrLink = attrSet.link();
    const attrUrl = attrLink?.href as string ?? '';
    const selection = useCurrentSelection();
    const [href, setHref] = React.useState<string>(attrUrl);

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
        setHref(attrUrl);
    }, [attrUrl]);

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

    const cancelHref = React.useCallback(() => {
        setIsEditing(false);
    }, [setIsEditing]);

    const clickEdit = React.useCallback(() => {
        setIsEditing(true);
    }, [chain, selection.empty, setIsEditing]);

    return React.useMemo(() => ({
        href,
        setHref,
        linkShortcut,
        isEditing,
        clickEdit,
        onRemove,
        submitHref,
        cancelHref,
    }), [href, linkShortcut, isEditing, clickEdit, onRemove, submitHref, cancelHref]);
}

const DelayAutoFocusInput = ({ autoFocus, ...rest }: React.HTMLProps<HTMLInputElement>) => {
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
        <input ref={inputRef} {...rest} />
    );
};

export const FloatingLinkToolbar = (props: React.PropsWithChildren) => {
    const { isEditing, clickEdit, onRemove, submitHref, href, setHref, cancelHref } = useFloatingLinkState();
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
            cancelHref();
        }
    }, [cancelHref, submitHref]);

    return (
        <FloatingToolbar className='floating'>
            {isEditing &&
                <CommandButtonGroup>
                    <DelayAutoFocusInput placeholder='Enter link...'
                        value={href}
                        onChange={doSetHref}
                        onKeyPress={doComplete}
                    />

                    <CommandButton commandName='submitLink' enabled
                        onSelect={submitHref} icon={<Icon type='Check' />} />

                    <CommandButton commandName='cancelLink' enabled
                        onSelect={cancelHref} icon={<Icon type='Cancel' />} />
                </CommandButtonGroup>
            }

            {!isEditing && 
                <CommandButtonGroup>
                    {props.children}
                    
                    {activeLink ? (
                        <>
                            <CommandButton commandName='updateLink' enabled
                                onSelect={clickEdit} icon='pencilLine' />
                
                            <CommandButton commandName='removeLink' enabled
                                onSelect={onRemove} icon='linkUnlink' />
                        </>
                    ) : (
                        <>
                            <CommandButton commandName='updateLink' enabled
                                onSelect={clickEdit} icon='link' />
                        </>
                    )}
                </CommandButtonGroup>
            }
        </FloatingToolbar>
    );
};