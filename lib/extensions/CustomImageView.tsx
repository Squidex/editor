/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { NodeViewComponentProps } from '@remirror/react';
import { Icon } from './../ui/internal/Icon';
import { EditableNode, getAssetId } from './../utils';

export interface CustomImageViewProps {
    // The base url.
    baseUrl: string;

    // The name to the app.
    appName: string;

    // Called when the image is edited.
    onEditNode: (node: EditableNode) => void;

    // Called when the asset is edited.
    onEditAsset: (assetId: string) => void;
}

export const CustomImageView = (props: NodeViewComponentProps & CustomImageViewProps) => {
    const {
        appName,
        baseUrl,
        onEditNode,
        onEditAsset,
        node,
        getPosition: getPos
    } = props;

    const asset = getAssetId(node.attrs.src, baseUrl, appName);

    return (
        <div style={{ position: 'relative' }} className='squidex-editor-image-view'>
            <img className='squidex-editor-image-element' src={node.attrs.src} />

            <div className='squidex-editor-image-buttons'>
                <button type='button' className='squidex-editor-button' onClick={() => onEditNode({ node, getPos })}>
                    <Icon type='Edit' />
                </button>
                
                {asset &&
                    <button type='button' className='squidex-editor-button' onClick={() => onEditAsset(asset.id)}>
                        <Icon type='Assets' />
                    </button>
                }
            </div>


            {asset &&
                <div className='squidex-editor-image-info'>
                    Asset
                </div>
            }
        </div>
    );
};