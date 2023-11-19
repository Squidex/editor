/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { useHelpers, useRemirrorContext, useUpdateReason } from '@remirror/react';
import * as React from 'react';
import { EditorProps } from './../props';

export const OnChangeLink = (props: Pick<EditorProps, 'mode' | 'onChange' | 'value'>) => {
    const {
        mode,
        onChange,
        value,
    } = props;

    const { setContent, getState } = useRemirrorContext();
    const { getMarkdown, getHTML } = useHelpers();
    const valueCurrent = React.useRef<string | undefined>(null!);
    const valueWasSet = React.useRef(false);
    const updateCount = React.useRef<number>(0);
    const updateReason = useUpdateReason();
    const { doc } = getState();

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
                    return getMarkdown({ doc } as never);
                default:
                    return getHTML({ doc } as never);
            }
        }

        // There was no manual update since the last change.
        if (updateCount.current <= 0) {
            return;
        }

        const value = clearValue(getExport());

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
    }, [doc, mode, getHTML, getMarkdown, onChange]);

    return null;
};

function clearValue(value: string) {
    value = value.trim();

    if (value && value.length > 0 && EMPTY_RESULTS.indexOf(value) >= 0) {
        value = '';
    }

    return value;
}

const EMPTY_RESULTS = [
    '<p></p>',
    '<p style=""></p>',
    '<p class=""></p>'
];