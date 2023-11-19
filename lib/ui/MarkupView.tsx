/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import * as React from 'react';
import AceEditor from 'react-ace';
import { SquidexEditorMode } from './../props';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-github';

export interface MarkupViewProps {
    // The mode of the editor.
    mode: SquidexEditorMode;

    // The value to show.
    value?: string;
}

export const MarkupView = ({ mode, value }: MarkupViewProps) => {
    const formattedValue = React.useMemo(() => {
        if (mode === 'Markdown') {
            return { value, mode: 'markdown' };
        } else {
            return { value: format(value || ''), mode: 'html' };
        }
    }, [mode, value]);

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