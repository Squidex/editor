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
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-github';

export interface MarkupViewProps {
    // The mode of the editor.
    mode: SquidexEditorMode;

    // The value to show.
    value?: unknown;
}

export const MarkupView = ({ mode, value }: MarkupViewProps) => {
    const formattedValue = React.useMemo(() => {
        if (!isString(value)) {
            return { mode: 'markdown', value: null };
        }

        switch (mode) {
            case 'Markdown':
                return { mode: 'markdown', value };
            case 'Html':
                return { mode: 'html', value: format(value || '') };
            default:
                return { mode: 'markdown', value: null };
        }
    }, [mode, value]);

    if (formattedValue?.value == null) {
        return null;
    }

    return (
        <AceEditor mode={formattedValue.mode} value={formattedValue.value} height='100%' width='100%' readOnly wrapEnabled />
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