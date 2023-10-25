import { NodeViewMethod, ProsemirrorNode } from '@remirror/core';
import { NodeView } from 'remirror';
import { ImageExtension, ImageOptions } from 'remirror/extensions';
import { EditableNode } from './utils';

type EditorHandler = (node: EditableNode) => void;

export class EditableImageExtension extends ImageExtension {
    private readonly onEdit: EditorHandler;

    constructor(options: ImageOptions & { onEdit: EditorHandler }) {
        super(options);

        this.onEdit = options.onEdit;
    }

    public createNodeViews(): NodeViewMethod | Record<string, NodeViewMethod> {
        return (node: ProsemirrorNode, _, getPos) => new EditableNodeView(node, getPos, this.onEdit);
    }
}

class EditableNodeView implements NodeView {
    dom: HTMLDivElement;

    contentDOM: HTMLImageElement;

    constructor(private node: ProsemirrorNode,
        getPos: () => number | undefined, onEdit: (node: EditableNode) => void
    ) {
        const inner = this.createElement(node);
        const outer = this.createWrapper();
        const button = this.createButton(() => onEdit({ node: this.node, getPos }));

        this.contentDOM = inner;
        this.dom = outer;
        this.dom.append(inner);
        this.dom.append(button);
    }

    public update(node: ProsemirrorNode) {
        this.contentDOM.setAttribute('src', node.attrs.src);

        this.node = node;

        return true;
    }

    private createElement(node: ProsemirrorNode) {
        const inner = document.createElement('img');
        inner.classList.add('remirror-editable-image');
        inner.setAttribute('src', node.attrs.src);

        return inner;
    }

    private createWrapper() {
        const outer = document.createElement('div');
        outer.classList.add('remirror-editable-image-view');
        outer.style.position = 'relative';

        return outer;
    }

    private createButton(handler: () => void) {
        const button = document.createElement('button');
        button.classList.add('remirror-editable-image-button');
        button.style.position = 'absolute';
        button.innerHTML = SVG_ICON;
        button.addEventListener('click', handler);

        return button;
    }
}

const SVG_ICON = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" name="pencilLine" height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z"></path></svg>`;