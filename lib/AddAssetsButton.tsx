import { CommandButton, useChainedCommands } from '@remirror/react';
import * as React from 'react';
import { Icon } from './Icon';
import { OnSelectAssets } from './props';

export const AddAssetsButton = ({ onSelectAssets }: { onSelectAssets: OnSelectAssets }) => {
    const chained = useChainedCommands();

    const doSelectAsset = React.useCallback(async () => {
        const assets = await onSelectAssets();

        for (const asset of assets) {
            if (asset.type.startsWith('image/')) {
                const image = { ...asset, title: asset.fileName };
                console.log(image);
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
        <CommandButton commandName='addImage' enabled={true} onSelect={doSelectAsset} label='Add Asset' icon={
            <Icon type='Assets' />
        } />
    );
};