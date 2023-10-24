declare class SquidexEditorWrapper {
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

type OnSelectAssets = () => Promise<Asset[]>;
type OnSelectContents = () => Promise<Content[]>;

type OnChange = (value: string | undefined) => void;

type EditorMode = 'Html' | 'Markdown';

interface UploadRequest {
    // The file to upload.
    file: File;

    // The upload progress to update.
    progress: (progress: number) => void;
}

interface EditorProps {
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

    // Called when a file needs to be uploaded.
    onUpload?: (images: UploadRequest[]) => DelayedPromiseCreator<Asset>[];

    // True, if disabled.
    isDisabled?: boolean;
    
    // Indicates whether assets can be selected.
    canSelectAssets?: boolean;

    // Indicates whether content items can be selected.
    canSelectContents?: boolean;
}

type DelayedPromiseCreator<T> = (context: unknown) => Promise<T>;