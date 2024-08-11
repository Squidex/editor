/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { Remirror, useRemirror } from '@remirror/react';
import { CodeBlockExtension, DocExtension } from 'remirror/extensions';
import md from 'refractor/lang/markdown.js';
import { useCallback, useEffect, useRef } from 'react';
import { RemirrorEventListenerProps } from 'remirror';

export interface MarkdownTextEditorProps {
    // The value to show.
    value: string;

    // Invoked when the value has been changed.
    onChange: (value: string) => void;
}

export const MarkdownTextEditor = (props: MarkdownTextEditorProps) => {
    const { value, onChange } = props;
    
    const initialized = useRef(false);
    const { manager, getContext } = useRemirror({
        extensions: () => [
            new DocExtension({ content: 'codeBlock' }),
            new CodeBlockExtension({
                supportedLanguages: [md],
                defaultLanguage: 'markdown',
                defaultWrap: true,
                syntaxTheme: 'base16_ateliersulphurpool_light',
            }),
        ],
        builtin: {
            exitMarksOnArrowPress: false,
        },

        stringHandler: 'html',
    });

    useEffect(() => {
        getContext()?.setContent({
            type: 'doc',
            content: [
                {
                    type: 'codeBlock',
                    attrs: { language: 'markdown' },
                    content: value ? [{ type: 'text', text: value }] : undefined,
                },
            ],
        });

        initialized.current = true;
    }, []);

    const doChange = useCallback(({ helpers, state }: RemirrorEventListenerProps<any>) => {
        if (!initialized.current) {
            return;
        }

        const text = helpers.getText({ state });

        onChange(text);
    }, [onChange]);

    return (
        <div className='squidex-editor-markdown'>

            <Remirror
                autoRender='end'
                autoFocus={true}
                manager={manager}
                onChange={doChange}>
            </Remirror>
        </div>
    );
};
