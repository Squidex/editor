import * as React from 'react';
import { useChainedCommands, CommandButton } from '@remirror/react';
import { OnSelectAssets } from './props';
import { Icon } from './Icon';

export const AddAssetsButton = ({ onSelectAssets }: { onSelectAssets: OnSelectAssets }) => {
    const chained = useChainedCommands();

    const doSelectAsset = React.useCallback(async () => {
        const assets = await onSelectAssets();

        for (const asset of assets) {
            chained.insertImage(asset);
            chained.insertText(' ');
        }

        chained.run();
    }, [chained, onSelectAssets]);

    return (
        <CommandButton commandName='addImage' enabled={true} onSelect={doSelectAsset} label='Select Asset' icon={
            <Icon type='Assets' />
        } />
    );
};