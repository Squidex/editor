/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { CountExtension } from '@remirror/extension-count';
import { CodeBlockLanguageSelect } from '@remirror/extension-react-language-select';
import { CommandButton, CommandButtonGroup, EditorComponent, FloatingToolbar, HeadingLevelButtonGroup, HistoryButtonGroup, InsertHorizontalRuleButton, NodeViewComponentProps, Remirror, ThemeProvider, ToggleBlockquoteButton, ToggleBoldButton, ToggleBulletListButton, ToggleCodeBlockButton, ToggleCodeButton, ToggleItalicButton, ToggleOrderedListButton, ToggleUnderlineButton, Toolbar, useActive, useCurrentSelection, useRemirror } from '@remirror/react';
import { AllStyledComponent } from '@remirror/styles/emotion';
import classNames from 'classnames';
import * as React from 'react';
import { cx, ExtensionCodeBlockTheme } from 'remirror';
import { AnnotationExtension, BlockquoteExtension, BoldExtension, BulletListExtension, CodeBlockExtension, CodeExtension, HardBreakExtension, HeadingExtension, HorizontalRuleExtension, ImageExtension, ItalicExtension, LinkExtension, ListItemExtension, MarkdownExtension, OrderedListExtension, StrikeExtension, TrailingNodeExtension, UnderlineExtension } from 'remirror/extensions';
import { BackspaceKeyExtension, ClassNameExtension, ClipboardExtension, ContentLinkExtension, CustomImageView, OnChangeLink, PlainHtmlExtension } from './extensions';
import { EditorProps } from './props';
import { AddAITextButton, AddAssetsButton, AddContentsButton, AddHtmlButton, AnnotateButton, AnnotationView, ClassNameButton, Counter, LinkButtons, LinkModal, MarkupView, TitleModal } from './ui';
import { Icon } from './ui/internal';
import { EditableNode, htmlToMarkdown, markdownToHtml, supportedLanguages, useDebounceBoolean, useStoredBoolean } from './utils';
import './Editor.scss';

export const Editor = (props: EditorProps) => {
    const {
        annotations,
        appName,
        canAddAnnotation,
        canSelectAIText,
        canSelectAssets,
        canSelectContents,
        classNames,
        isDisabled,
        mode,
        onAnnotationCreate,
        onAnnotationsFocus,
        onAnnotationsUpdate,
        onChange,
        onEditAsset,
        onEditContent,
        onSelectAIText,
        onSelectAssets,
        onSelectContents,
        onUpload,
        value,
    } = props;

    const baseUrl = React.useMemo(() => {
        let result = props.baseUrl;

        if (result.endsWith('/')) {
            result = result.substring(0, result.length - 1);
        }

        return result;
    }, [props.baseUrl]);

    const [modalTitle, setModalTitle] = React.useState<EditableNode | undefined | null>();
    const [modalLink, setModalLink] = React.useState<boolean>(false);
    const [markup, setMarkup] = React.useState<boolean>(false);
    const [toolbar, setToolbar] = useStoredBoolean('toolbar');

    const doOpenModalLink = React.useCallback(() => {
        setModalLink(true);
    }, []);

    const doCloseModalLink = React.useCallback(() => {
        setModalLink(false);
    }, []);

    const doCloseModalTitle = React.useCallback(() => {
        setModalTitle(null);
    }, []);

    const doToggleMarkup = React.useCallback(() => {
        setMarkup(x => !x);
    }, []);

    const extensions = React.useCallback(() => {
        return [
            new AnnotationExtension({}),
            new BackspaceKeyExtension(),
            new BlockquoteExtension(),
            new BoldExtension({}),
            new BulletListExtension({ enableSpine: true }),
            new ClassNameExtension({ classNames: classNames || [] }),
            new ClipboardExtension({ mode }),
            new CodeBlockExtension({ supportedLanguages, nodeOverride: { selectable: false } }),
            new CodeExtension(),
            new ContentLinkExtension({
                appName,
                baseUrl,
                onEditContent
            }),
            new CountExtension({}),
            new HardBreakExtension(),
            new HeadingExtension({}),
            new HorizontalRuleExtension({}),
            new ImageExtension({ uploadHandler: onUpload, nodeOverride: { selectable: true} }),
            new ItalicExtension(),
            new LinkExtension({
                autoLink: true,
                markOverride: {
                    excludes: undefined
                }
            }),
            new ListItemExtension({
                enableCollapsible: true
            }),
            new MarkdownExtension({
                copyAsMarkdown: mode === 'Markdown',
                htmlToMarkdown,
                htmlSanitizer: undefined,
                markdownToHtml
            }),
            new OrderedListExtension(),
            new PlainHtmlExtension(),
            new StrikeExtension(),
            new TrailingNodeExtension({}),
            new UnderlineExtension(),
        ];
    }, [appName, baseUrl, classNames, mode, onEditContent, onUpload]);

    const { manager, getContext } = useRemirror({
        stringHandler: mode === 'Markdown' ? 'markdown' : 'html',
        content: value as never,
        nodeViewComponents: {
            'image': (props: NodeViewComponentProps) => {
                return (
                    <CustomImageView {...props}
                        appName={appName}
                        baseUrl={baseUrl}
                        onEditNode={setModalTitle}
                        onEditAsset={onEditAsset}
                    />
                );
            }
        },
        extensions,
    });

    const doChange = React.useCallback((value: string) => {
        getContext()?.setContent(value);
    }, [getContext]);

    return (
        <AllStyledComponent>
            <ThemeProvider theme={{
                color: {
                    primary: '#3389ff',
                    active: {
                        primary: '#3389ff'
                    }
                }
            }}>
                <Remirror classNames={isDisabled ? ['squidex-editor-disabled'] : []} manager={manager}>
                    <div className='squidex-editor-menu'>
                        <Toolbar>
                            <fieldset className='squidex-editor-menu-group' disabled={markup || isDisabled}>
                                <HistoryButtonGroup />

                                <HeadingLevelButtonGroup showAll />

                                <CommandButtonGroup>
                                    <ToggleBoldButton />
                                    <ToggleItalicButton />
                                    <ToggleUnderlineButton />
                                    <ToggleCodeButton />
                                </CommandButtonGroup>

                                <CommandButtonGroup>
                                    <ToggleBlockquoteButton />
                                    <ToggleCodeBlockButton />

                                    <InsertHorizontalRuleButton />
                                </CommandButtonGroup>

                                <CommandButtonGroup>
                                    <ToggleBulletListButton />
                                    <ToggleOrderedListButton />
                                </CommandButtonGroup>

                                {mode !== 'Markdown' && classNames && classNames.length > 0 &&
                                    <CommandButtonGroup>
                                        <ClassNameButton />
                                    </CommandButtonGroup>
                                }

                                <CommandButtonGroup>
                                    <LinkButtons onEdit={doOpenModalLink} />
                                </CommandButtonGroup>

                                <CommandButtonGroup>
                                    {canSelectAssets && onSelectAssets &&
                                        <AddAssetsButton onSelectAssets={onSelectAssets} />
                                    }

                                    {canSelectContents && onSelectContents &&
                                        <AddContentsButton onSelectContents={onSelectContents} />
                                    }

                                    {canSelectAIText && onSelectAIText &&
                                        <AddAITextButton onSelectAIText={onSelectAIText} />
                                    }
                                </CommandButtonGroup>

                                {canAddAnnotation && onAnnotationCreate &&
                                    <CommandButtonGroup>
                                        <AnnotateButton onAnnotationCreate={onAnnotationCreate} />
                                    </CommandButtonGroup>
                                }

                                {mode !== 'Markdown' &&
                                    <CommandButtonGroup>
                                        <AddHtmlButton />
                                    </CommandButtonGroup>
                                }
                            </fieldset>

                            <fieldset className='squidex-editor-menu-group'>
                                <CommandButtonGroup>
                                    {mode === 'Markdown' ? (
                                        <CommandButton commandName='toggleMarkup' enabled onSelect={doToggleMarkup} label='Edit Markup'
                                            icon={<Icon type='Edit' />} />
                                    ) : (
                                        <CommandButton commandName='toggleMarkup' enabled onSelect={doToggleMarkup} label='Show Markup (readonly)'
                                            icon={<Icon type='Preview' />} />
                                    )}
                                </CommandButtonGroup>
                            </fieldset>
                        </Toolbar>
                    </div>

                    <div className='squidex-editor-main'>
                        <div>
                            <OnChangeLink mode={mode} onChange={onChange} value={value} />

                            <EditorComponent />

                            {markup ? (
                                <>
                                    <MarkupView value={value} mode={mode} editable={mode === 'Markdown'} onChange={doChange} />
                                </>
                            ) : (
                                <>
                                    {modalLink ? (
                                        <LinkModal onClose={doCloseModalLink} />
                                    ) : modalTitle ? (
                                        <TitleModal node={modalTitle} onClose={doCloseModalTitle} />
                                    ) : toolbar ? (
                                        <ToolbarWrapper onLinkModal={doOpenModalLink} />
                                    ) : null}

                                    <CodeBlockLanguageSelect
                                        offset={{ x: 5, y: 5 }}
                                        className={cx(
                                            ExtensionCodeBlockTheme.LANGUAGE_SELECT_POSITIONER,
                                            ExtensionCodeBlockTheme.LANGUAGE_SELECT_WIDTH,
                                        )}
                                    />

                                    <AnnotationView
                                        annotations={annotations}
                                        onAnnotationsFocus={onAnnotationsFocus}
                                        onAnnotationsUpdate={onAnnotationsUpdate}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <div className='squidex-editor-counter'>
                        <label>
                            <input type="checkbox" checked={toolbar} onChange={ev => setToolbar(ev.target.checked)} />

                            Floating Toolbar
                        </label>

                        <Counter />
                    </div>
                </Remirror>
            </ThemeProvider>
        </AllStyledComponent>
    );
};

const ToolbarWrapper = ({ onLinkModal }: { onLinkModal: () => void }) => {
    const active = useActive<CodeBlockExtension>();
    const selection = useCurrentSelection();
    const visible = useDebounceBoolean(400, [selection.from, selection.to]);

    if (active.codeBlock()) {
        return null;
    }

    return (
        <FloatingToolbar className={classNames('squidex-editor-floating', { hidden: !visible })}>
            <fieldset className='squidex-editor-menu-group'>
                <CommandButtonGroup>
                    <ToggleBoldButton />
                    <ToggleItalicButton />
                    <ToggleUnderlineButton />
                    <ToggleCodeButton />
                    <LinkButtons onEdit={onLinkModal} />
                </CommandButtonGroup>
            </fieldset>
        </FloatingToolbar>
    );
};