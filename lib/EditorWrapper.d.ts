/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

declare class EditorWrapper {
    constructor(element: HTMLElement, props: EditorProps);

    update(newProps: Partial<EditorProps>): void;

    setValue(value: string): void;

    setIsDisabled(isDisabled: boolean): void;

    destroy(): void;
}

type Asset = {
    // The alternative text of the image.
    alt?: string;

    // The src to the asset.
    src: string;

    // The mime type.
    type: string;

    // The file name of the asset.
    fileName: string;
};

type Content = {
    // The link of the content item.
    href: string;

    // The title of the content item.
    title: string;
};

export type OnAnnotationCreate = (annotation: AnnotationSelection) => void;
export type OnAnnotationUpdate = (annotation: ReadonlyArray<Annotation>) => void;
export type OnAnnotationFocus = (annotation: ReadonlyArray<string>) => void;
export type OnAssetEdit = (id: string) => void;
export type OnAssetUpload = (images: UploadRequest[]) => DelayedPromiseCreator<Asset>[];
export type OnChange = (value: string | undefined) => void;
export type OnContentEdit = (schemaName: string, contentId: string) => void;
export type OnSelectAIText = () => Promise<string | undefined | null>;
export type OnSelectAssets = () => Promise<Asset[]>;
export type OnSelectContents = () => Promise<Content[]>;

type SquidexEditorMode = 'Html' | 'Markdown';

interface UploadRequest {
    // The file to upload.
    file: File;

    // The upload progress to update.
    progress: (progress: number) => void;
}

interface EditorProps {
    // The mode of the editor.
    mode: SquidexEditorMode;

    // The incoming value.
    value?: string;

    // The base url.
    baseUrl: string;

    // The name to the app.
    appName: string;

    // The class names.
    classNames?: ReadonlyArray<string>;

    // Called when the value has been changed.
    onChange?: OnChange;

    // Called when AI text selected.
    onSelectAIText?: OnSelectAIText;

    // Called when assets are selected.
    onSelectAssets?: OnSelectAssets;

    // Called when content items should be selected.
    onSelectContents?: OnSelectContents;

    // Called when an asset is to be edited.
    onEditAsset: OnAssetEdit;

    // Called when a content is to be edited.
    onEditContent: OnContentEdit;

    // Called when a file needs to be uploaded.
    onUpload?: OnAssetUpload;

    // Triggered, when an annotation is clicked.
    onAnnotationsFocus?: OnAnnotationFocus;

    // Triggered, when an annotation are updated.
    onAnnotationsUpdate?: OnAnnotationUpdate;

    // Triggered, when an annotation is created.
    onAnnotationCreate?: OnAnnotationCreate;

    // True, if disabled.
    isDisabled?: boolean;

    // Indicates whether AI text can be selected.
    canSelectAIText?: boolean;

    // Indicates whether assets can be selected.
    canSelectAssets?: boolean;

    // Indicates whether content items can be selected.
    canSelectContents?: boolean;

    // The annotations.
    annotations?: ReadonlyArray<Annotation>;
}

export interface AnnotationSelection {
    // The start of the annotation selection.
    from: number;

    // The end of the annotation selection.
    to: number;
}

export interface Annotation extends AnnotationSelection {
    // The ID of the annotation.
    id: string;
}

type DelayedPromiseCreator<T> = (context: unknown) => Promise<T>;