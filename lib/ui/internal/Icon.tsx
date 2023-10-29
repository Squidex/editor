export interface IconProps {
    type: 'Assets' | 'Contents' | 'Check' | 'Cancel' | 'Edit';
}

export const Icon = (props: IconProps) => {
    const {
        type
    } = props;

    if (type === 'Assets') {
        return (
            <svg className='custom-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' width='1rem' height='1rem' viewBox='0 0 28 28'>
                <path d='M21.875 28h-15.75c-3.413 0-6.125-2.713-6.125-6.125v-15.75c0-3.413 2.712-6.125 6.125-6.125h15.75c3.412 0 6.125 2.712 6.125 6.125v15.75c0 3.412-2.713 6.125-6.125 6.125zM6.125 1.75c-2.45 0-4.375 1.925-4.375 4.375v15.75c0 2.45 1.925 4.375 4.375 4.375h15.75c2.45 0 4.375-1.925 4.375-4.375v-15.75c0-2.45-1.925-4.375-4.375-4.375h-15.75z'></path>
                <path d='M21.088 23.537h-11.988c-0.35 0-0.612-0.175-0.787-0.525s-0.088-0.7 0.088-0.962l8.225-9.713c0.175-0.175 0.438-0.35 0.7-0.35s0.525 0.175 0.7 0.35l5.25 7.525c0.088 0.087 0.088 0.175 0.088 0.262 0.438 1.225 0.087 2.012-0.175 2.45-0.613 0.875-1.925 0.963-2.1 0.963zM11.025 21.787h10.15c0.175 0 0.612-0.088 0.7-0.262 0.088-0.088 0.088-0.35 0-0.7l-4.55-6.475-6.3 7.438z'></path>
                <path d='M9.1 13.737c-2.1 0-3.85-1.75-3.85-3.85s1.75-3.85 3.85-3.85 3.85 1.75 3.85 3.85-1.663 3.85-3.85 3.85zM9.1 7.788c-1.138 0-2.1 0.875-2.1 2.1s0.962 2.1 2.1 2.1 2.1-0.962 2.1-2.1-0.875-2.1-2.1-2.1z'></path>
            </svg>
        );
    }
    
    if (type === 'Contents') {
        return (
            <svg className='custom-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' width='1rem' height='1rem' viewBox='0 0 28 28'>
                <path d='M21.875 28h-15.75c-3.413 0-6.125-2.713-6.125-6.125v-15.75c0-3.413 2.712-6.125 6.125-6.125h15.75c3.412 0 6.125 2.712 6.125 6.125v15.75c0 3.412-2.713 6.125-6.125 6.125zM6.125 1.75c-2.45 0-4.375 1.925-4.375 4.375v15.75c0 2.45 1.925 4.375 4.375 4.375h15.75c2.45 0 4.375-1.925 4.375-4.375v-15.75c0-2.45-1.925-4.375-4.375-4.375h-15.75z'></path>
                <path d='M13.125 12.25h-5.775c-1.575 0-2.888-1.313-2.888-2.888v-2.013c0-1.575 1.313-2.888 2.888-2.888h5.775c1.575 0 2.887 1.313 2.887 2.888v2.013c0 1.575-1.312 2.888-2.887 2.888zM7.35 6.212c-0.613 0-1.138 0.525-1.138 1.138v2.012c0 0.612 0.525 1.138 1.138 1.138h5.775c0.612 0 1.138-0.525 1.138-1.138v-2.013c0-0.612-0.525-1.138-1.138-1.138h-5.775z'></path>
                <path d='M22.662 16.713h-17.325c-0.525 0-0.875-0.35-0.875-0.875s0.35-0.875 0.875-0.875h17.237c0.525 0 0.875 0.35 0.875 0.875s-0.35 0.875-0.787 0.875z'></path>
                <path d='M15.138 21.262h-9.8c-0.525 0-0.875-0.35-0.875-0.875s0.35-0.875 0.875-0.875h9.713c0.525 0 0.875 0.35 0.875 0.875s-0.35 0.875-0.787 0.875z'></path>
            </svg>
        );
    }

    if (type === 'Check') {
        return (
            <svg className='custom-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960' width='1rem' height='1rem'>
                <path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/>
            </svg>
        );
    }

    if (type === 'Cancel') {
        return (
            <svg className='custom-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960' width='1rem' height='1rem'>
                <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/>
            </svg>
        );
    }

    if (type === 'Edit') {
        return (
            <svg className='custom-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='1rem' height='1rem'>
                <path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z"></path>
            </svg>
        );
    }

    return null;
};