/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { EditorTester } from './EditorTester';
import * as React from 'react';

export const PreviewView = () => {
    const [isDisabled, setIsDisabled] = React.useState(false);

    return (
        <div>
            <div>
                <h2>State</h2>

            </div>

            <div>
                <h1>Markdown</h1>

                <EditorTester mode='Markdown' />
            </div>

            <div>
                <h2>HTML</h2>

                <EditorTester mode='Html' />
            </div>

            <div>
                <h2>Disabled</h2>

                <label style={{ marginBottom: 10 }}>
                    <input type="checkbox" checked={isDisabled} onChange={ev => setIsDisabled(ev.target.checked)}></input>
                    
                    <span>Disabled</span>
                </label>

                <EditorTester isDisabled={isDisabled} mode='State' />
            </div>
        </div>
    );
};