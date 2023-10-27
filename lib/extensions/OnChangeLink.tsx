import { useHelpers, useRemirrorContext, useUpdateReason } from '@remirror/react';
import * as React from 'react';
import { EditorState } from 'remirror';
import { EditorMode, OnChange } from './../props';

export const OnChangeLink = ({ mode, onChange, state, value }: { mode: EditorMode, onChange?: OnChange, state: EditorState, value?: string }) => {
    const { setContent } = useRemirrorContext();
    const { getMarkdown, getHTML } = useHelpers();
    const valueCurrent = React.useRef<string | undefined>(null!);
    const valueWasSet = React.useRef(false);
    const updateCount = React.useRef<number>(0);
    const updateReason = useUpdateReason();

    React.useEffect(() => {
        updateCount.current += 1;
    }, [updateReason]);

    React.useEffect(() => {
        valueWasSet.current = !!value && value.length > 0;
    
        if (valueCurrent.current !== value) {
            valueCurrent.current = value;

            setContent(value || '');

            // Reset the update count to prevent noop updates of the original value.
            updateCount.current = -1;
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

        // There was no manual update since the last change.
        if (updateCount.current <= 0) {
            return;
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