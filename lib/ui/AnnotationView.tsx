/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { useCommands } from '@remirror/react';
import * as React from 'react';
import { AnnotationExtension } from 'remirror/extensions';
import { Annotation, EditorProps } from '../props';
import { equals, useSelectedAnnotations } from '../utils';

export const AnnotationView = (props: Pick<EditorProps, 'annotations' | 'onAnnotationsFocus' | 'onAnnotationsUpdate'>) => {
    const {
        annotations,
        onAnnotationsFocus,
        onAnnotationsUpdate,
    } = props;

    const commands = useCommands<AnnotationExtension>();
    const currentAnnotations = React.useRef<ReadonlyArray<Annotation>>(DEFAULT_STATE);
    const currentSelection = React.useRef<ReadonlyArray<string>>(DEFAULT_STATE);
    const editorAnnotations = useSelectedAnnotations();

    React.useEffect(() => {
        currentAnnotations.current = annotations || [];
    }, [annotations]);

    React.useEffect(() => {
        // Debounce the update rate of the annotations a little bit.
        const timer = setTimeout(() => {
            const selected = editorAnnotations.selected;

            if (equals(currentSelection.current, selected)) {
                return;
            }

            currentSelection.current = selected;
            onAnnotationsFocus?.(selected);
        }, 200);

        return () => {
            clearTimeout(timer);
        };
    }, [onAnnotationsFocus, editorAnnotations.selected]);

    React.useEffect(() => {
        // Debounce the update rate of the annotations a little bit.
        const timer = setTimeout(() => {
            const available = editorAnnotations.available;

            if (equals(currentAnnotations.current, available)) {
                return;
            }

            currentAnnotations.current = available;
            onAnnotationsUpdate?.(available);
        }, 200);

        return () => {
            clearTimeout(timer);
        };
    }, [onAnnotationsUpdate, editorAnnotations.available]);

    React.useEffect(() => {
        commands.setAnnotations(annotations as never || []);
    }, [annotations, commands]);

    return null;
};

const DEFAULT_STATE: never[] = [];