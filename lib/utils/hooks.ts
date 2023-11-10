/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import * as React from 'react';
import { ProsemirrorNode } from 'remirror';

export type EditableNode = { node: ProsemirrorNode, getPos: () => number | undefined };

export function useStateWithRef<T>(initial: T): [T, (value: T) => void, React.MutableRefObject<T>] {
    const [state, setState] = React.useState(initial);
    const stateRef = React.useRef(initial);

    stateRef.current = state;

    return [state, setState, stateRef];
}
