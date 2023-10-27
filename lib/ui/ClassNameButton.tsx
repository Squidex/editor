import { DropdownButton, useExtension } from "@remirror/react";
import { ClassNameExtension } from "./../extensions";
import { ToggleClassMenuItem } from "./ToggleClassMenuItem";
import { ToggleNoClassMenuItem } from "./ToggleNoClassMenuItem";

export const ClassNameButton = () => {
    const extension = useExtension(ClassNameExtension);

    if (!extension.options.classNames || extension.options.classNames.length === 0) {
        return null;
    }
    
    return (
        <DropdownButton aria-label='Class Name'icon={
            <span style={{ height: '14px', lineHeight: '14px', fontSize: '14px' }}>Class</span>
        }>
            <ToggleNoClassMenuItem />

            {extension.options.classNames.map(c => 
                <ToggleClassMenuItem key={c} attrs={{ className: c }} />
            )}
        </DropdownButton>
    );
};
