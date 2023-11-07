import { CountExtension } from '@remirror/extension-count';
import { CommandButtonGroup, EditorComponent, FloatingToolbar, HeadingLevelButtonGroup, HistoryButtonGroup, InsertHorizontalRuleButton, NodeViewComponentProps, Remirror, ThemeProvider, ToggleBlockquoteButton, ToggleBoldButton, ToggleBulletListButton, ToggleCodeBlockButton, ToggleCodeButton, ToggleItalicButton, ToggleOrderedListButton, ToggleUnderlineButton, Toolbar, useRemirror } from '@remirror/react';
import { AllStyledComponent } from '@remirror/styles/emotion';
import * as React from 'react';
import { BlockquoteExtension, BoldExtension, BulletListExtension, CodeBlockExtension, CodeExtension, HardBreakExtension, HeadingExtension, HorizontalRuleExtension, ImageExtension, ItalicExtension, LinkExtension, ListItemExtension, MarkdownExtension, OrderedListExtension, StrikeExtension, TrailingNodeExtension, UnderlineExtension } from 'remirror/extensions';
import { ClassNameExtension, ContentLinkExtension, CustomImageView, HtmlCopyExtension, OnChangeLink, PlainHtmlExtension } from './extensions';
import { EditorProps } from './props';
import { AddAITextButton, AddAssetsButton, AddContentsButton, AddHtmlButton, ClassNameButton, Counter, LinkButtons, LinkModal, TitleModal } from './ui';
import { EditableNode, htmlToMarkdown } from './utils';
import './Editor.scss';

export const Editor = (props: EditorProps) => {
    const {
        appName,
        classNames,
        canSelectAIText,
        canSelectAssets,
        canSelectContents,
        isDisabled,
        mode,
        onChange,
        onEditAsset,
        onEditContent,
        onSelectAIText,
        onSelectAssets,
        onSelectContents,
        onUpload: uploadHandler,
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

    const doOpenModalLink = React.useCallback(() => {
        setModalLink(true);
    }, []);

    const doCloseModalLink = React.useCallback(() => {
        setModalLink(false);
    }, []);

    const doCloseModalTitle = React.useCallback(() => {
        setModalTitle(null);
    }, []);

    const extensions = React.useCallback(() => {
        return [
            new BlockquoteExtension(),
            new BoldExtension({}),
            new BulletListExtension({ enableSpine: true }),
            new ClassNameExtension({ classNames }),
            new CodeBlockExtension({}),
            new CodeExtension(),
            new ContentLinkExtension({ appName, baseUrl, onEditContent }),
            new CountExtension({}),
            new HardBreakExtension(),
            new HeadingExtension({}),
            new HorizontalRuleExtension(),
            new HtmlCopyExtension({ copyAsHtml: mode === 'Html' }),
            new ImageExtension({ uploadHandler }),
            new ItalicExtension(),
            new LinkExtension({ autoLink: true }),
            new ListItemExtension({ enableCollapsible: true }),
            new MarkdownExtension({ copyAsMarkdown: mode === 'Markdown', htmlToMarkdown }),
            new OrderedListExtension(),
            new PlainHtmlExtension(),
            new StrikeExtension(),
            new TrailingNodeExtension(),
            new UnderlineExtension(),
        ];
    }, [appName, baseUrl, classNames, mode, onEditContent, uploadHandler]);

    const { manager, state, setState } = useRemirror({
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
                <Remirror classNames={isDisabled ? ['squidex-editor-disabled'] : []} manager={manager} state={state} onChange={event => setState(event.state)}>
                    <div className='squidex-editor-menu'>
                        <Toolbar>
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

                            {mode === 'Html' &&
                                <CommandButtonGroup>
                                    <AddHtmlButton />
                                </CommandButtonGroup>
                            }
                        </Toolbar>
                    </div>

                    <OnChangeLink mode={mode} onChange={onChange} state={state} value={value} />

                    <EditorComponent />

                    {modalLink ? (
                        <LinkModal onClose={doCloseModalLink} />
                    ) : modalTitle ? (
                        <TitleModal node={modalTitle} onClose={doCloseModalTitle} />
                    ) : (
                        <FloatingToolbar className='squidex-editor-floating'>
                            <ToggleBoldButton />
                            <ToggleItalicButton />
                            <ToggleUnderlineButton />
                            <ToggleCodeButton />

                            <LinkButtons onEdit={doOpenModalLink} />
                        </FloatingToolbar>
                    )}

                    <Counter />
                </Remirror>
            </ThemeProvider>
        </AllStyledComponent>
    );
};