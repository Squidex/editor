/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { EditorTester } from './EditorTester';

export const PreviewView = () => {
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

            </div>
        </div>
    );
};