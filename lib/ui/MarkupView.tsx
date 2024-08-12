/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import * as React from 'react';
import AceEditor from 'react-ace';
import { SquidexEditorMode } from '../props';
import { isString } from '../utils';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-github';

export interface MarkupViewProps {
    // The mode of the editor.
    mode: SquidexEditorMode;

    // True, if the content can be changed.
    editable: boolean;

    // The value to show.
    value?: unknown;

    // Invoked when the value has been changed.
    onChange: (value: string) => void;
}

export const MarkupView = ({ editable, mode, onChange, value }: MarkupViewProps) => {
    const [editValue, setEditValue] = React.useState('');

    React.useEffect(() => {
        let text: string;
        if (!value) {
            text = '';
        } else if (!isString(value)) {
            text = JSON.stringify(value, undefined, 2);
        } else {
            text = value;
        }

        if (mode === 'Html') {
            text = format(text);
        }

        setEditValue(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const aceMode = React.useMemo(() => {
        switch (mode) {
            case 'Markdown':
                return 'markdown';
            case 'Html':
                return 'html';
            default:
                return 'javascript';
        }
    }, [mode]);

    const doChange = React.useCallback((value: string) => {
        setEditValue(value);

        if (editable) {
            onChange(value);
        }
    }, [editable, onChange]);

    return (
        <AceEditor mode={aceMode} value={editValue} height='100%' width='100%' readOnly={!editable} onChange={doChange} wrapEnabled />
    );
};

const HTML_TAB = '\t';

function format(html: string) {
    let result = '', indent = '';

    html.split(/>\s*</).forEach(element => {
        if (element.match( /^\/\w/ )) {
            indent = indent.substring(HTML_TAB.length);
        }

        result += indent + '<' + element + '>\r\n';

        if (element.match( /^<?\w[^>]*[^/]$/ ) && !element.startsWith("input")  ) {
            indent += HTML_TAB;
        }
    });

    return result.substring(1, result.length-3);
}