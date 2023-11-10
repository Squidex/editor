/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { CommandMenuItem, CommandMenuItemProps, useActive } from '@remirror/react';
import { useCommands } from '@remirror/react-core';
import * as React from 'react';
import { ClassNameExtension } from './../extensions';

export interface ToggleNoClassMenuItemProps extends Omit<CommandMenuItemProps, 'commandName' | 'active' | 'enabled' | 'attrs' | 'onSelect'> {}

export const ToggleNoClassMenuItem = ({ ...rest }: ToggleNoClassMenuItemProps) => {
    const { removeClassName } = useCommands<ClassNameExtension>();

    const handleSelect = React.useCallback(() => {
        removeClassName();
    }, [removeClassName]);

    const active = !useActive<ClassNameExtension>().className();

    return (
        <CommandMenuItem {...rest}
            commandName='removeClass'
            active={active}
            attrs={{}}
            enabled
            onSelect={handleSelect}
            label={'No Class'}
        />
    );
};