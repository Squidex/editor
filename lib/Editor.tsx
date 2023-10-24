import { BlockquoteExtension, BoldExtension, BulletListExtension, CodeBlockExtension, CodeExtension, HardBreakExtension, HorizontalRuleExtension, HeadingExtension, ImageExtension, ItalicExtension, LinkExtension, ListItemExtension, MarkdownExtension, OrderedListExtension, StrikeExtension, TrailingNodeExtension, UnderlineExtension } from 'remirror/extensions';
import { CommandButtonGroup, EditorComponent, HeadingLevelButtonGroup, HistoryButtonGroup, InsertHorizontalRuleButton, Remirror, ThemeProvider, ToggleBlockquoteButton, ToggleBoldButton, ToggleBulletListButton, ToggleCodeBlockButton, ToggleCodeButton, ToggleItalicButton, ToggleOrderedListButton, ToggleUnderlineButton, Toolbar, useRemirror } from '@remirror/react';
import * as React from 'react';
import { AllStyledComponent } from '@remirror/styles/emotion';
import { EditorProps } from './props';
import { FloatingLinkToolbar } from './LinkExtension';
import { AddAITextButton } from './AddAITextButton';
import { AddAssetsButton } from './AddAssetsButton';
import { AddContentsButton } from './AddContentsButton';
import { OnChangeLink } from './OnChangeLink';
import { CountExtension } from '@remirror/extension-count';
import { Counter } from './Counter';
import { HtmlCopyExtension } from './HtmlCopyExtension';
import './Editor.css';

export const Editor = (props: EditorProps) => {
    const {
        canSelectAIText,
        canSelectAssets,
        canSelectContents,
        isDisabled,
        mode,
        onChange,
        onSelectAIText,
        onSelectAssets,
        onSelectContents,
        onUpload,
        value,
    } = props;

    const extensions = React.useCallback(() => {
        return [
            new BlockquoteExtension(),
            new BoldExtension({}),
            new BulletListExtension({ enableSpine: true }),
            new CodeBlockExtension({}),
            new CodeExtension(),
            new CountExtension({}),
            new HardBreakExtension(),
            new HeadingExtension({}),
            new HorizontalRuleExtension(),
            new HtmlCopyExtension({ copyAsHtml: mode === 'Html' }),
            new ImageExtension({ uploadHandler: onUpload }),
            new ItalicExtension(),
            new LinkExtension({ autoLink: true }),
            new ListItemExtension({ enableCollapsible: true }),
            new MarkdownExtension({ copyAsMarkdown: mode === 'Markdown' }),
            new OrderedListExtension(),
            new StrikeExtension(),
            new TrailingNodeExtension(),
            new UnderlineExtension(),
        ];
    }, [mode, onUpload]);

    const { manager, state, setState } = useRemirror({
        extensions,
        stringHandler: mode === 'Markdown' ? 'markdown' : 'html',
        content: value
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
                    <div className='menu'>
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
                        </Toolbar>
                    </div>

                    <OnChangeLink mode={mode} onChange={onChange} state={state} value={value} />

                    <FloatingLinkToolbar>
                        <ToggleBoldButton />
                        <ToggleItalicButton />
                        <ToggleUnderlineButton />
                        <ToggleCodeButton />
                    </FloatingLinkToolbar>

                    <EditorComponent />

                    <Counter />
                </Remirror>
            </ThemeProvider>
        </AllStyledComponent>
    );
};