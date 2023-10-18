import { useExtension } from '@remirror/react';
import { CountExtension } from '@remirror/extension-count';

export const Counter = () => {
    const extension = useExtension(CountExtension);

    return (
        <div className='squidex-editor-counter'>
            Words: <strong>{extension.getWordCount()}</strong>, Characters: <strong>{extension.getCharacterCount()}</strong>
        </div>
    );
};