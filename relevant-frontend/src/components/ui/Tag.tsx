import React from 'react';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface TagProps {
    children: ReactNode;
    onRemove?: () => void;
    variant?: 'default' | 'primary' | 'secondary';
}

export const Tag: React.FC<TagProps> = ({
    children,
    onRemove,
    variant = 'default'
}) => {
    const variantClasses = {
        default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        primary: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
        secondary: 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200',
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${variantClasses[variant]}`}>
            {children}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                    aria-label="Remove tag"
                >
                    <X size={12} />
                </button>
            )}
        </span>
    );
};
