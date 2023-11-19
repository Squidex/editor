/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { CommandButton, useRemirrorContext } from '@remirror/react';
import * as React from 'react';
import { OnAnnotationCreate } from './../props';
import { Icon } from './internal';

export const AnnotateButton = (props: { onAnnotationCreate: OnAnnotationCreate }) => {
    const {
        onAnnotationCreate,
    } = props;

    const { selection } = useRemirrorContext({ autoUpdate: true }).getState();

    const doSelectContent = React.useCallback(async () => {
        const { from, to } = selection;

        onAnnotationCreate({ from, to });
    }, [onAnnotationCreate, selection]);

    return (
        <CommandButton commandName='addComment' enabled onSelect={doSelectContent} label='Create Comment' icon={
            <Icon type='Comment' />
        } />
    );
};