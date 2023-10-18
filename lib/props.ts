export type Asset = {
    // The alternative text of the image.
    alt?: string;

    // The src to the asset.
    src: string;

    // The title of the asset link.
    title?: string;

    // The file name of the content item.
    fileName?: string;
};

export type Content = {
    // The link of the content item. 
    href: string;

    // The title of the content item.
    title: string;
};

export type OnSelectAssets = () => Promise<Asset[]>;
export type OnSelectContents = () => Promise<Content[]>;

export type OnChange = (value: string) => void;

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

    // Called when assets are selected.
    onSelectAssets: OnSelectAssets;

    // Called when content items should be selected.
    onSelectContents: OnSelectContents;

    onUpload?: (images: UploadRequest[]) => DelayedPromiseCreator<Asset>[];

    // True, if disabled.
    isDisabled?: boolean;
    
    // Indicates whether assets can be selected.
    canSelectAssets?: boolean;

    // Indicates whether content items can be selected.
    canSelectContents?: boolean;
}

type DelayedPromiseCreator<T> = (context: unknown) => Promise<T>;