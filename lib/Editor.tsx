import * as React from 'react';
import { BlockquoteExtension, BoldExtension, BulletListExtension, CodeBlockExtension, CodeExtension, HardBreakExtension, HorizontalRuleExtension, HeadingExtension, ImageExtension, ItalicExtension, LinkExtension, ListItemExtension, MarkdownExtension, OrderedListExtension, StrikeExtension, TrailingNodeExtension, UnderlineExtension } from 'remirror/extensions';
import { CommandButton, CommandButtonGroup, EditorComponent, HeadingLevelButtonGroup, HistoryButtonGroup, InsertHorizontalRuleButton, Remirror, ThemeProvider, ToggleBlockquoteButton, ToggleBoldButton, ToggleBulletListButton, ToggleCodeBlockButton, ToggleCodeButton, ToggleItalicButton, ToggleOrderedListButton, ToggleUnderlineButton, Toolbar, useChainedCommands, useHelpers, useRemirror, useRemirrorContext } from '@remirror/react';
import { useCallback } from 'react';
import { AllStyledComponent } from '@remirror/styles/emotion';
import { Icon } from './Icon';
import { EditorState } from '@remirror/pm/state';
import { FloatingLinkToolbar } from './LinkExtension';
import './Editor.css';

export type Asset = {
    // The alternative text of the image.
    alt?: string;

    // The src to the asset.
    src: string;

    // The title of the asset link.
    title?: string;

    // The file name of the content item.
    fileName?: string;
}

export type Content = {
    // The link of the content item. 
    href: string;

    // The title of the content item.
    title: string;
}

type OnSelectAssets = () => Promise<Asset[]>;
type OnSelectContents = () => Promise<Content[]>;

type OnChange = (value: string) => void;

type EditorMode = 'Html' | 'Markdown';

export interface EditorProps {
    // The mode of the editor.
    mode: EditorMode;

    // The incoming value.
    value?: string;

    // Called when the value has been changed.
    onChange?: OnChange;

    // Called when assets are selected.
    onSelectAssets: OnSelectAssets;

    // Called when content items should be selected.
    onSelectContents: OnSelectContents;
    
    // Indicates whether assets can be selected.
    canSelectAssets?: boolean;

    // Indicates whether content items can be selected.
    canSelectContents?: boolean;
}

export const Editor = (props: EditorProps) => {
    const {
        canSelectAssets,
        canSelectContents,
        mode,
        onChange,
        onSelectAssets,
        onSelectContents,
        value,
    } = props;

    const extensions = useCallback(() => {
        return [
            new BlockquoteExtension(),
            new BoldExtension(),
            new BulletListExtension({ enableSpine: true }),
            new CodeBlockExtension(),
            new CodeExtension(),
            new HardBreakExtension(),
            new HeadingExtension(),
            new HorizontalRuleExtension(),
            new ImageExtension(),
            new ItalicExtension(),
            new LinkExtension({ autoLink: true }),
            new ListItemExtension({ enableCollapsible: true }),
            new MarkdownExtension({ copyAsMarkdown: false }),
            new OrderedListExtension(),
            new StrikeExtension(),
            new TrailingNodeExtension(),
            new UnderlineExtension(),
        ]
    }, []);

    const { manager, state, setState } = useRemirror({
        extensions,
        stringHandler: mode === 'Markdown' ? 'markdown' : 'html',
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
                <Remirror manager={manager} state={state} onChange={event => setState(event.state)}>
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
                                {canSelectAssets &&
                                    <AssetsButton onSelectAssets={onSelectAssets} />
                                }

                                {canSelectContents &&
                                    <ContentsButton onSelectContents={onSelectContents} />
                                }
                            </CommandButtonGroup>
                        </Toolbar>
                    </div>

                    <OnChange mode={mode} onChange={onChange} state={state} value={value} />

                    <FloatingLinkToolbar>
                        <ToggleBoldButton />
                        <ToggleItalicButton />
                        <ToggleUnderlineButton />
                        <ToggleCodeButton />
                    </FloatingLinkToolbar>

                    <EditorComponent />
                </Remirror>
            </ThemeProvider>
        </AllStyledComponent>
    );
}

const OnChange = ({ mode, onChange, state, value }: { mode: EditorMode, onChange?: OnChange, state: EditorState, value?: string }) => {
    const { setContent } = useRemirrorContext();
    const { getMarkdown, getHTML } = useHelpers();
    const previousValue = React.useRef('');

    React.useEffect(() => {
        const actualValue = value || '';

        if (previousValue.current !== actualValue) {
            previousValue.current = actualValue;

            setContent(actualValue);
        }
    }, [setContent, value]);

    React.useEffect(() => {
        if (!onChange) {
            return;
        }

        function getExport() {
            switch (mode) {
                case 'Markdown':
                    return getMarkdown(state);
                default:
                    return getHTML(state);
            }
        }

        const value = getExport();

        if (previousValue.current !== value) {
            previousValue.current = value;

            onChange(value);
        }
    }, [mode, onChange, state]);

    return null;
};

const AssetsButton = ({ onSelectAssets }: { onSelectAssets: OnSelectAssets }) => {
    const chained = useChainedCommands();

    const doSelectAsset = React.useCallback(async () => {
        const assets = await onSelectAssets();

        for (const asset of assets) {
            chained.insertImage(asset);
        }

        chained.run();
    }, [onSelectAssets]);

    return (
        <CommandButton commandName='addImage' enabled={true} onSelect={doSelectAsset} label='Select Asset' icon={
            <Icon type='Assets' />
        } />
    )
};

const ContentsButton = ({ onSelectContents }: { onSelectContents: OnSelectContents }) => {
    const chained = useChainedCommands();

    const doSelectContent = React.useCallback(async () => {
        const contents = await onSelectContents();

        for (const content of contents) {
            chained.insertText(content.title, {
                marks: {
                    link: {
                        href: content.href
                    }
                }
            });
            chained.insertText(' ');
        }

        chained.run();
    }, [onSelectContents]);

    return (
        <CommandButton commandName='addContent' enabled={true} onSelect={doSelectContent} label='Select Content' icon={
            <Icon type='Contents' />
        } />
    )
};