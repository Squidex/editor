import * as React from 'react';
import { useHelpers, useRemirrorContext } from "@remirror/react";
import { EditorState } from "remirror";
import { EditorMode, OnChange } from "./props";

export const OnChangeLink = ({ mode, onChange, state, value }: { mode: EditorMode, onChange?: OnChange, state: EditorState, value?: string }) => {
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