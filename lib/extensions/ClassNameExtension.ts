/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { ApplySchemaAttributes, command, CommandFunction, extension, ExtensionTag, getTextSelection, isElementDomNode, Mark, MarkExtension, MarkExtensionSpec, MarkSpecOverride, omitExtraAttributes, PrimitiveSelection, Static } from "remirror";
import { addClassStyle } from './class-name-styles';

export interface ClassNameOptions {
    // The class names.
    classNames: Static<ReadonlyArray<string>>;
}

export interface ClassNameAttributes {
    className?: string;
}

const PREFIX = '__editor_';

@extension<ClassNameOptions>({
    defaultOptions: {},
    staticKeys: ['classNames'],
})
export class ClassNameExtension extends MarkExtension<ClassNameOptions> {
    public get name() {
        return 'className' as const;
    }

    constructor(options: ClassNameOptions) {
        super(options);

        for (const className of options.classNames || []) {
            addClassStyle(className, PREFIX);
        }

    }

    public createTags() {
        return [ExtensionTag.FontStyle, ExtensionTag.FormattingMark];
    }

    public createMarkSpec(extra: ApplySchemaAttributes, override: MarkSpecOverride): MarkExtensionSpec {
        return {
            ...override,
            attrs: {
                ...extra.defaults(),
                className: {},
            },
            excludes: '',
            parseDOM: [
                {
                    tag: '*',
                    getAttrs: (dom) => {
                        if (!isElementDomNode(dom)) {
                            return false;
                        }

                        for (let className of dom.classList) {
                            if (className.startsWith(PREFIX)) {
                                className = className.substring(PREFIX.length);
                            }

                            if (this.options.classNames?.indexOf(className) >= 0) {
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
        return ({ tr, dispatch }) => {
            const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);

            dispatch?.(tr.addMark(from, to, this.type.create({ className })));

            return true;
        };
    }

    @command({})
    public removeClassName(selection?: PrimitiveSelection): CommandFunction {
        return this.store.commands.removeMark.original({ type: this.type, selection, expand: true });
    }
}

function joinClasses(lhs: string | undefined | null, rhs: string | undefined | null) {
    if (lhs) {
        lhs = `${PREFIX}${lhs}`;
    }

    if (lhs && rhs) {
        return `${lhs} ${rhs}`;
    }

    return lhs || rhs;
}