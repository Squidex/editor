/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import classNames from 'classnames';
import * as React from 'react';
import { Annotation, AnnotationSelection, Asset, Content, EditorWrapper, SquidexEditorMode } from '../lib';

type State = { value?: string, annotations?: ReadonlyArray<Annotation>, selected?: ReadonlyArray<string> };

export const EditorTester = (props: { mode: SquidexEditorMode }) => {
    const {
        mode,
    } = props;

    const [state, setState] = React.useState<State>(() => loadState(mode));
    const [view, setView] = React.useState<EditorWrapper>();

    React.useEffect(() => {
        saveState(mode, state);
    }, [mode, state]);

    const doUnset = React.useCallback(() => {
        setState(state => ({ ...state, value: undefined }));
    }, []);

    const doUpdateValue = React.useCallback((value: string | undefined) => {
        console.log('Update: Value');

        setState(state => ({ ...state, value }));
    }, []);

    const doUpdateAnnotations = React.useCallback((annotations: ReadonlyArray<Annotation>) => {
        console.log(`Update Annotations: ${annotations.length}`);

        setState(state => ({
            ...state,
            annotations }));
    }, []);

    const doSelectAnnotations = React.useCallback((selected: ReadonlyArray<string>) => {
        console.log(`Select Annotations: ${selected.length}`);

        setState(state => ({
            ...state,
            selected
        }));
    }, []);

    const doCreateAnnotation = React.useCallback((annotation: AnnotationSelection) => {
        console.log('Create Annotation');

        setState(state => ({
            ...state,
            annotations: [...state.annotations || [], { ...annotation, id: new Date().getTime().toString() }] }));
    }, []);

    const doSetEditor = React.useCallback((editor: HTMLDivElement) => {
        if (!editor) {
            return;
        }

        const wrapper = new EditorWrapper(editor, {
            value: '',
            appName: 'my-app',
            baseUrl: 'https://cloud.squidex.io',
            canSelectAIText: true,
            canSelectContents: true,
            canSelectAssets: true,
            onSelectAIText: selectAIText,
            onSelectAssets: selectAsset,
            onSelectContents: selectContents,
            onEditAsset: () => console.log('Edit Asset'),
            onEditContent: () => console.log('Edit Asset'),
            onAnnotationCreate: doCreateAnnotation,
            onAnnotationsUpdate: doUpdateAnnotations,
            onAnnotationsFocus: doSelectAnnotations,
            onChange: doUpdateValue,
            classNames: ['text-left', 'price-alarm'],
            mode
        });

        setView(wrapper);
    }, [doCreateAnnotation, doSelectAnnotations, doUpdateAnnotations, doUpdateValue, mode]);

    React.useEffect(() => {
        view?.setValue(state.value || '');
    }, [state.value, view]);

    React.useEffect(() => {
        view?.setAnnotations(state.annotations);
    }, [state.annotations, view]);

    return (
        <div>
            <div className='editor-row'>
                <div className='editor-view'>
                    <div ref={doSetEditor}></div>
                </div>

                <div className='annotations'>
                    {(state.annotations || []).map(x =>
                        <div className={classNames('annotation', { selected: state.selected && state.selected?.indexOf(x.id) >= 0 })} key={x.id}>
                            <div>Id: {x.id}</div>
                            <div>From: {x.from}, To: {x.to}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className='preview'>
                <textarea value={state.value || ''} readOnly></textarea>

                <div className='preview-buttons'>
                    <button className='preview-button' onClick={doUnset}>Unset</button>
                </div>
            </div>
        </div>
    );
};

function loadState(mode: SquidexEditorMode): State {
    const json = localStorage.getItem(`state.${mode}`);

    if (json) {
        return JSON.parse(json);
    }

    return {};
}

function saveState(mode: SquidexEditorMode, state: State) {
    const json = JSON.stringify(state, undefined, 2);

    localStorage.setItem(`state.${mode}`, json);
}

const selectAsset = () => {
    return new Promise<Asset[]>(resolve => resolve([
        {
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Adams_The_Tetons_and_the_Snake_River.jpg/1280px-Adams_The_Tetons_and_the_Snake_River.jpg',
            mimeType: 'image/jpeg',
            fileName: 'My Image'
        },
        {
            src: 'https://squidex.io',
            mimeType: 'text/raw',
            fileName: 'My Text'
        }
    ]));
};

const selectContents = () => {
    return new Promise<Content[]>(resolve => resolve([
        {
            id: '123',
            schemaName: 'my-short-schema',
            title: 'Squidex'
        },
        {
            id: '456',
            schemaName: 'my-very-long-schema-name-that-does-not-fit',
            title: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua'
        }
    ]));
};

const selectAIText = () => {
    return new Promise<string>(resolve => resolve('Text from AI'));
};