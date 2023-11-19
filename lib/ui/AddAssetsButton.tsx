/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { CommandButton, useChainedCommands } from '@remirror/react';
import * as React from 'react';
import { OnSelectAssets } from './../props';
import { Icon } from './internal';

export const AddAssetsButton = (props: { onSelectAssets: OnSelectAssets }) => {
    const {
        onSelectAssets,
    } = props;

    const chained = useChainedCommands();

    const doSelectAsset = React.useCallback(async () => {
        const assets = await onSelectAssets();

        for (const asset of assets) {
            if (asset.mimeType.startsWith('image/')) {
                const image = { src: asset.src, alt: asset.alt, title: asset.fileName };

                chained.insertImage(image);
            } else {
                chained.insertText(asset.fileName, {
                    marks: {
                        link: {
                            href: asset.src
                        }
                    }
                });
            }
            
            chained.insertText(' ');
        }

        chained.run();
    }, [chained, onSelectAssets]);

    return (
        <CommandButton commandName='addImage' enabled onSelect={doSelectAsset} label='Add Asset' icon={
            <Icon type='Assets' />
        } />
    );
};