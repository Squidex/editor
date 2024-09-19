
/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

/* eslint-disable react-hooks/exhaustive-deps */

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

export function useDebouncedMemo<T>(timeout: number, calculator: () => T,  deps?: React.DependencyList) {
    const [state, setState] = React.useState<T>(calculator());

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setState(calculator());
        }, timeout);

        return () => {
            clearTimeout(timer);
        };
    }, deps);

    return state;
}

export function useDebounceBoolean(timeout: number, deps?: React.DependencyList) {
    const [state, setState] = React.useState<boolean>(true);

    React.useEffect(() => {
        setState(false);

        const timer = setTimeout(() => {
            setState(true);
        }, timeout);

        return () => {
            clearTimeout(timer);
        };
    }, deps);

    return state;
}


export function useStoredBoolean(key: string): [boolean, (value: boolean) => void] {
    const [state, setState] = React.useState(() => {
        const fromState = localStorage.getItem(key);

        return !!fromState;
    });

    React.useEffect(() => {
        const listener = (event: Event) => {
            const typed = event as ChangeEvent;

            if (typed.detail.key === key) {
                setState(typed.detail.value);
            }
        };

        document.addEventListener(CHANGE_EVENT, listener);

        return () => {
            document.removeEventListener(CHANGE_EVENT, listener);
        };
    }, []);

    const update = React.useCallback((newValue: boolean) => {
        setState(newValue);

        if (newValue) {
            localStorage.setItem(key, '1');
        } else {
            localStorage.removeItem(key);
        }

        document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key, value: newValue } }));
    }, []);

    return [state, update];
}

const NO_ANNOTATIONS: Annotation[] = [];
const NO_SELECTION: string[] = [];

const CHANGE_EVENT = 'storeChanged';

type ChangeEvent = CustomEvent<{ key: string, value: boolean }>;
