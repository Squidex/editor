/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

export type Asset = {
    // The alternative text of the image.
    alt?: string;

    // The src to the asset.
    src: string;

    // The mime type.
    mimeType: string;

    // The file name of the asset.
    fileName: string;
};

export type Content = {
    // The title of the content.
    id: string;

    // The name of the schema.
    schemaName: string;

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

export type SquidexEditorMode = 'Html' | 'Markdown';

export interface UploadRequest {
    // The file to upload.
    file: File;

    // The upload progress to update.
    progress: (progress: number) => void;
}

export interface EditorProps {
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

    // Annotation
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