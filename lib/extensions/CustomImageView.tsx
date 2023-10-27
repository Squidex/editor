import { NodeViewComponentProps } from '@remirror/react';
import { Icon } from './../ui/internal/Icon';
import { EditableNode, getAssetId } from './../utils';

export const CustomImageView = ({ appName, baseUrl, node, onEdit, getPosition }: NodeViewComponentProps & { onEdit: (node: EditableNode) => void, baseUrl: string, appName: string }) => {
    const asset = getAssetId(node.attrs.src, baseUrl, appName);

    return (
        <div style={{ position: 'relative' }} className='squidex-editor-image-view'>
            <img className='squidex-editor-image-element' src={node.attrs.src} />

            <button style={{ position: 'absolute' }} className='squidex-editor-button' onClick={() => onEdit({ node, getPos: getPosition })}>
                <Icon type='Edit' />
            </button>

            {asset &&
                <div style={{ position: 'absolute' }} className='squidex-editor-image-info'>
                    Asset
                </div>
            }
        </div>
    );
};