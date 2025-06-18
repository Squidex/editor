/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { NodeSelection } from "@remirror/pm/state";
import { KeyBindingCommandFunction, PlainExtension } from "remirror";

export class BackspaceKeyExtension extends PlainExtension {
    get name() {
        return 'backspaceKey' as const;
    }

    createKeymap() {
        const backspaceHandler: KeyBindingCommandFunction = ({ state, dispatch }) => {
            const { selection, doc } = state;
            if (!selection.empty) {
                return false;
            }

            const position = selection.$from;
            const posBefore = position.nodeBefore;

            if (posBefore && posBefore.type.spec.selectable) {
                const pos = position.pos - posBefore.nodeSize;
                if (dispatch) {
                    dispatch(state.tr.setSelection(NodeSelection.create(doc, pos)));
                }

                return true;
            }

            return false;
        };

        return {
            'Backspace': backspaceHandler
        };
    }
}