export type Asset = {
    // The alternative text of the image.
    alt?: string;

    // The src to the asset.
    src: string;

    // The mime type.
    type: string;

    // The file name of the asset.
    fileName: string;
};

export type Content = {
    // The link of the content item. 
    href: string;

    // The title of the content item.
    title: string;
};

export type OnSelectAIText = () => Promise<string | undefined | null>;
export type OnSelectAssets = () => Promise<Asset[]>;
export type OnSelectContents = () => Promise<Content[]>;

export type OnChange = (value: string | undefined) => void;

export type EditorMode = 'Html' | 'Markdown';

export interface UploadRequest {
    // The file to upload.
    file: File;

    // The upload progress to update.
    progress: (progress: number) => void;
}

export interface EditorProps {
    // The mode of the editor.
    mode: EditorMode;

    // The incoming value.
    value?: string;

    // Called when the value has been changed.
    onChange?: OnChange;

    // Called when AI text selected.
    onSelectAIText?: OnSelectAIText;

    // Called when assets are selected.
    onSelectAssets?: OnSelectAssets;

    // Called when content items should be selected.
    onSelectContents?: OnSelectContents;

    // Called when a file needs to be uploaded.
    onUpload?: (images: UploadRequest[]) => DelayedPromiseCreator<Asset>[];

    // True, if disabled.
    isDisabled?: boolean;
    
    // Indicates whether AI text can be selected.
    canSelectAIText?: boolean;
    
    // Indicates whether assets can be selected.
    canSelectAssets?: boolean;

    // Indicates whether content items can be selected.
    canSelectContents?: boolean;
}

type DelayedPromiseCreator<T> = (context: unknown) => Promise<T>;