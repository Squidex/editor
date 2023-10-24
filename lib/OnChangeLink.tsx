import * as React from 'react';
import { useHelpers, useRemirrorContext } from '@remirror/react';
import { EditorState } from 'remirror';
import { EditorMode, OnChange } from './props';

export const OnChangeLink = ({ mode, onChange, state, value }: { mode: EditorMode, onChange?: OnChange, state: EditorState, value?: string }) => {
    const { setContent } = useRemirrorContext();
    const { getMarkdown, getHTML } = useHelpers();
    const valueCurrent = React.useRef<string | undefined>(null!);
    const valueWasSet = React.useRef(false);

    React.useEffect(() => {
        valueWasSet.current = !!value && value.length > 0;
    
        if (valueCurrent.current !== value) {
            valueCurrent.current = value;

            setContent(value || '');
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

        let value = getExport().trim();

        if (value === '<p></p>') {
            value = '';
        }

        if (valueCurrent.current === value) {
            return;
        }

        if (!valueWasSet.current && value.length === 0) {
            onChange(undefined);
        } else {
            onChange(value);
        }

        valueCurrent.current = value;
        valueWasSet.current = !!value && value.length > 0;
    }, [getHTML, getMarkdown, mode, onChange, state]);

    return null;
};