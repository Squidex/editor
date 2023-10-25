import * as React from 'react';

export const DelayedAutoFocusInput = (props: React.HTMLProps<HTMLInputElement>) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            inputRef.current?.focus();
        });

        return () => {
            window.cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <input className='squidex-editor-input' ref={inputRef} {...props} />
    );
};