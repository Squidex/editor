/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { createRoot } from 'react-dom/client';
import { PreviewView } from './PreviewView';
import './preview.scss';

createRoot(document.getElementById('app')!).render(<PreviewView />);