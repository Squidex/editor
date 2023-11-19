/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { EditorWrapper } from ".";
export { EditorWrapper as SquidexEditorWrapper };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).SquidexEditorWrapper = EditorWrapper;