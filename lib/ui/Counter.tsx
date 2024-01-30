/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { CountExtension } from '@remirror/extension-count';
import { useEditorState, useExtension } from '@remirror/react';
import { useDebouncedMemo } from '../utils';

export const Counter = () => {
    const extension = useExtension(CountExtension);
    const state = useEditorState();

    const wordCount = useDebouncedMemo(300, () => {
        return extension.getWordCount(state);
    }, [state]);

    const characterCount = useDebouncedMemo(300, () => {
        return extension.getCharacterCount(state);
    }, [state]);

    return (
        <div className='squidex-editor-counter'>
            Words: <strong>{wordCount}</strong>, Characters: <strong>{characterCount}</strong>
        </div>
    );
};