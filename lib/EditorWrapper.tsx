/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import * as  ReactDOM from 'react-dom/client';
import { Editor } from './Editor';
import { Annotation, EditorProps } from './props';

export class EditorWrapper {
    private readonly root: ReactDOM.Root;

    constructor(
        private readonly element: HTMLElement,
        private props: EditorProps
    ) {
        this.root = ReactDOM.createRoot(this.element);
        this.render();
    }

    public update(newProps: Partial<EditorProps>) {
        this.props = { ...this.props, ...newProps };

        this.render();
    }

    public setValue(value: string) {
        this.update({ value });
    }

    public setAnnotations(annotations?: ReadonlyArray<Annotation>) {
        this.update({ annotations });
    }

    public setIsDisabled(isDisabled: boolean) {
        this.update({ isDisabled });
    }

    public destroy() {
        this.root.unmount();
    }

    private render() {
        this.root.render(
            <Editor {...this.props} />,
        );
    }
}