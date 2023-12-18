/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { useRemirrorContext } from '@remirror/react';
import * as React from 'react';
import { getTextSelection, ProsemirrorNode, within } from 'remirror';
import { AnnotationExtension } from 'remirror/extensions';
import { Annotation } from '../props';

export type EditableNode = { node: ProsemirrorNode, getPos: () => number | undefined };

export function useStateWithRef<T>(initial: T): [T, (value: T) => void, React.MutableRefObject<T>] {
    const [state, setState] = React.useState(initial);
    const stateRef = React.useRef(initial);

    stateRef.current = state;

    return [state, setState, stateRef];
}

type AnnotationState = { annotations: Annotation[] };

export function useSelectedAnnotations() {
    const { getState, getPluginState } = useRemirrorContext<AnnotationExtension>({ autoUpdate: true });
    const { doc, selection } = getState();
    const { from, to } = getTextSelection(selection, doc);
    const state: AnnotationState = getPluginState('annotation');

    let available: Annotation[] = NO_ANNOTATIONS, selected: string[] = NO_SELECTION;

    for (const a of state.annotations) {
        if (within(from, a.from, a.to) || within(to, a.from, a.to) || within(a.from, from, to) || within(a.to, from, to)) {
            if (selected === NO_SELECTION) {
                selected = [];
            }

            selected.push(a.id);
        }

        if (available === NO_ANNOTATIONS) {
            available = [];
        }

        available.push(a);
    }

    return { selected, available };
}

const NO_ANNOTATIONS: Annotation[] = [];
const NO_SELECTION: string[] = [];