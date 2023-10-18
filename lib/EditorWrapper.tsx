import * as  ReactDOM from 'react-dom/client';
import { Editor } from './Editor';
import { EditorProps } from './props';

export class EditorWrapper {
    constructor(
        private readonly element: HTMLElement,
        private props: EditorProps
    ) {
        this.render();
    }

    public update(newProps: Partial<EditorProps>) {
        this.props = { ...this.props, ...newProps };
    }

    public setValue(value: string) {
        this.update({ value });
    }

    public setIsDisabled(isDisabled: boolean) {
        this.update({ isDisabled });
    }

    private render() {
        ReactDOM.createRoot(this.element).render(
            <Editor {...this.props} />,
        );
    }
}