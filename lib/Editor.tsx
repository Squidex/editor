/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { CountExtension } from '@remirror/extension-count';
import { CodeBlockLanguageSelect } from '@remirror/extension-react-language-select';
import { CommandButton, CommandButtonGroup, EditorComponent, FloatingToolbar, HeadingLevelButtonGroup, HistoryButtonGroup, InsertHorizontalRuleButton, NodeViewComponentProps, Remirror, ThemeProvider, ToggleBlockquoteButton, ToggleBoldButton, ToggleBulletListButton, ToggleCodeBlockButton, ToggleCodeButton, ToggleItalicButton, ToggleOrderedListButton, ToggleUnderlineButton, Toolbar, useActive, useRemirror } from '@remirror/react';
import { AllStyledComponent } from '@remirror/styles/emotion';
import * as React from 'react';
import { cx, ExtensionCodeBlockTheme } from 'remirror';
import { AnnotationExtension, BlockquoteExtension, BoldExtension, BulletListExtension, CodeBlockExtension, CodeExtension, HardBreakExtension, HeadingExtension, HorizontalRuleExtension, ImageExtension, ItalicExtension, LinkExtension, ListItemExtension, MarkdownExtension, OrderedListExtension, StrikeExtension, TrailingNodeExtension, UnderlineExtension } from 'remirror/extensions';
import { ClassNameExtension, ContentLinkExtension, CustomImageView, HtmlCopyExtension, OnChangeLink, PlainHtmlExtension } from './extensions';
import { EditorProps } from './props';
import { AddAITextButton, AddAssetsButton, AddContentsButton, AddHtmlButton, AnnotateButton, AnnotationView, ClassNameButton, Counter, LinkButtons, LinkModal, MarkupView, TitleModal } from './ui';
import { Icon } from './ui/internal';
import { EditableNode, htmlToMarkdown, markdownToHtml, supportedLanguages } from './utils';
import './Editor.scss';

export const Editor = (props: EditorProps) => {
    const {
        annotations,
        appName,
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
            new AnnotationExtension(),
            new BlockquoteExtension(),
            new BoldExtension({}),
            new BulletListExtension({ enableSpine: true }),
            new ClassNameExtension({ classNames }),
            new CodeBlockExtension({ supportedLanguages }),
            new CodeExtension(),
            new ContentLinkExtension({ appName, baseUrl, onEditContent }),
            new CountExtension({}),
            new HardBreakExtension(),
            new HeadingExtension({}),
            new HorizontalRuleExtension(),
            new HtmlCopyExtension({ copyAsHtml: mode === 'Html' }),
            new ImageExtension({ uploadHandler: onUpload }),
            new ItalicExtension(),
            new LinkExtension({ autoLink: true }),
            new ListItemExtension({ enableCollapsible: true }),
            new MarkdownExtension({ copyAsMarkdown: mode === 'Markdown', htmlToMarkdown, markdownToHtml }),
            new OrderedListExtension(),
            new PlainHtmlExtension(),
            new StrikeExtension(),
            new TrailingNodeExtension(),
            new UnderlineExtension(),
        ];
    }, [appName, baseUrl, classNames, mode, onEditContent, onUpload]);

    const { manager } = useRemirror({
        stringHandler: mode === 'Markdown' ? 'markdown' : 'html',
        content: value,
        nodeViewComponents: {
            'image': (props: NodeViewComponentProps) => {
                return (
                    <CustomImageView {...props} appName={appName} baseUrl={baseUrl} onEditNode={setModalTitle} onEditAsset={onEditAsset} />
                );
            }
        },
        extensions,
    });

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
                            <fieldset disabled={markup} className='MuiStack-root'>
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
                                
                                {mode === 'Html' && classNames && classNames.length > 0 &&
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

                                {onAnnotationCreate &&
                                    <CommandButtonGroup>
                                        <AnnotateButton onAnnotationCreate={onAnnotationCreate} />
                                    </CommandButtonGroup>
                                }

                                {mode === 'Html' &&
                                    <CommandButtonGroup>
                                        <AddHtmlButton />
                                    </CommandButtonGroup>
                                }
                            </fieldset>

                            <CommandButton commandName='toggleMarkup' enabled onSelect={doToggleMarkup} label='Show Markup (readonly)' icon={
                                <Icon type='Preview' />
                            } />
                        </Toolbar>
                    </div>

                    <div className='squidex-editor-main'>
                        <OnChangeLink mode={mode} onChange={onChange} value={value} />

                        <EditorComponent />

                        {markup &&
                            <MarkupView value={value} mode={mode} />
                        }

                        {modalLink ? (
                            <LinkModal onClose={doCloseModalLink} />
                        ) : modalTitle ? (
                            <TitleModal node={modalTitle} onClose={doCloseModalTitle} />
                        ) : (
                            <ToolbarWrapper onLinkModal={doOpenModalLink} />
                        )}

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
                    </div>

                    <Counter />
                </Remirror>
            </ThemeProvider>
        </AllStyledComponent>
    );
};

const ToolbarWrapper = ({ onLinkModal }: { onLinkModal: () => void }) => {
    const active = useActive<CodeBlockExtension>();

    if (active.codeBlock()) {
        return null;
    }

    return (
        <FloatingToolbar className='squidex-editor-floating'>
            <ToggleBoldButton />
            <ToggleItalicButton />
            <ToggleUnderlineButton />
            <ToggleCodeButton />

            <LinkButtons onEdit={onLinkModal} />
        </FloatingToolbar>
    );
};