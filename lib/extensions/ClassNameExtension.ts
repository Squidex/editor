import { ApplySchemaAttributes, command, CommandFunction, extension, ExtensionTag, isElementDomNode, Mark, MarkExtension, MarkExtensionSpec, MarkSpecOverride, omitExtraAttributes, PrimitiveSelection } from "remirror";
import { addClassStyle } from './class-name-styles';

export interface ClassNameOptions {
    // The class names.
    classNames?: string[];
}

export interface ClassNameAttributes {
    className?: string;
}

@extension<ClassNameOptions>({ 
    defaultOptions: { classNames: [] }
})
export class ClassNameExtension extends MarkExtension<ClassNameOptions> {
    public get name() {
        return 'className' as const;
    }

    constructor(options: ClassNameOptions) {
        super(options);

        for (const className of options.classNames || []) {
            addClassStyle(className);
        }

    }

    public createTags() {
        return [ExtensionTag.FormattingMark];
    }

    public createMarkSpec(extra: ApplySchemaAttributes, override: MarkSpecOverride): MarkExtensionSpec {
        return {
            ...override,
            attrs: {
                ...extra.defaults(),
                className: {},
            },
            parseDOM: [
                {
                    tag: '*',
                    getAttrs: (dom) => {
                        if (!isElementDomNode(dom)) {
                            return false;
                        }

                        for (const className of dom.classList) {
                            if (this.options.classNames.indexOf(className) >= 0) {
                                return { ...extra.parse(dom), className };
                            }
                        }

                        return false;
                    },
                },
                ...(override.parseDOM ?? []),
            ],
            toDOM: (mark: Mark) => {
                const { className, ...other } = omitExtraAttributes<ClassNameAttributes>(mark.attrs, extra);
                const extraAttrs = extra.dom(mark);
                const extraClass = extraAttrs.className;
                const mergedClass = joinClasses(className, extraClass)!;

                return ['span', { ...other, ...extraAttrs, class: mergedClass }, 0];
            },
        };
    }
    
    @command({})
    public setClassName(className: string, selection?: PrimitiveSelection): CommandFunction {
        return this.store.commands.applyMark.original(this.type, { className }, selection);
    }
    
    @command({})
    public removeClassName(selection?: PrimitiveSelection): CommandFunction {
        return this.store.commands.removeMark.original({ type: this.type, selection, expand: true });
    }
}

function joinClasses(lhs: string | undefined | null, rhs: string | undefined | null) {
    if (lhs) {
        lhs = `__editor_${lhs}`;
    }
    
    if (lhs && rhs) {
        return `${lhs} ${rhs}`;
    }

    return lhs || rhs;
}