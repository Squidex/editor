/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { DOMSerializer, DOMParser } from '@remirror/pm/model';
import { CreateExtensionPlugin, PlainExtension, Slice } from 'remirror';
import { htmlToMarkdown, markdownToHtml } from '../utils';
import { SquidexEditorMode } from '../props';

export interface ClipboardExtensionOptions {
    // The mode of the editor.
    mode: SquidexEditorMode;
}

export class ClipboardExtension extends PlainExtension<ClipboardExtensionOptions> {
    get name() {
        return 'htmlCopy' as const;
    }

    public createPlugin(): CreateExtensionPlugin {
        const isHtmlMode = this.options.mode === 'Html';

        const clipboardTextSerializer =
            (slice: Slice) => {
                const domSerializer = DOMSerializer.fromSchema(this.store.schema);
                const domFragment = domSerializer.serializeFragment(slice.content);

                const wrapper = document.createElement('div');
                wrapper.append(domFragment);

                let result = wrapper.innerHTML;

                if (!isHtmlMode) {
                    result = htmlToMarkdown(result);
                }

                return result;
            };

        const clipboardTextParser = !isHtmlMode ?
            (input: string) => {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = markdownToHtml(input);

                const domParser = DOMParser.fromSchema(this.store.schema);
                const domSlice = domParser.parseSlice(wrapper);

                return domSlice;
            } : undefined;

        return {
            props: {
                clipboardTextParser,
                clipboardTextSerializer,
            },
        };
    }
}