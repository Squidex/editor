import { DOMSerializer } from "@remirror/pm/model";
import { CreateExtensionPlugin, PlainExtension, Slice } from "remirror";

export interface HtmlCopyOptions {
    copyAsHtml: boolean
}

export class HtmlCopyExtension extends PlainExtension<HtmlCopyOptions> {
    get name() {
        return 'html-copy' as const;
    }

    public createPlugin(): CreateExtensionPlugin {
        const clipboardTextSerializer = this.options.copyAsHtml
            ? (slice: Slice) => {
                const wrapper = document.createElement('div');

                wrapper.append(DOMSerializer.fromSchema(this.store.schema).serializeFragment(slice.content));

                return wrapper.innerHTML;
            }
            : undefined;

        return {
            props: {
                clipboardTextSerializer,
            },
        };
    }
}