import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    rounded?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    rounded = false,
    disabled,
    className = '',
    ...props
}) => {
    const baseClasses = `
    inline-flex items-center justify-center font-semibold
    transform transition-all duration-200 
    focus:outline-none focus:ring-4 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
    ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
  `;

    const variants = {
        primary: `
      bg-gradient-to-r from-blue-500 to-purple-600 text-white
      hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg
      focus:ring-blue-500/25 active:scale-95
    `,
        secondary: `
      bg-white text-gray-700 border-2 border-gray-200
      hover:border-gray-300 hover:scale-105 hover:shadow-md hover:bg-gray-50
      focus:ring-gray-500/25 active:scale-95
    `,
        ghost: `
      text-gray-600 hover:text-gray-900 hover:bg-gray-100
      focus:ring-gray-500/25 active:scale-95
    `,
        danger: `
      bg-gradient-to-r from-red-500 to-red-600 text-white
      hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-lg
      focus:ring-red-500/25 active:scale-95
    `,
        success: `
      bg-gradient-to-r from-green-500 to-green-600 text-white
      hover:from-green-600 hover:to-green-700 hover:scale-105 hover:shadow-lg
      focus:ring-green-500/25 active:scale-95
    `,
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm rounded-lg',
        md: 'px-6 py-3 text-base rounded-xl',
        lg: 'px-8 py-4 text-lg rounded-xl',
        xl: 'px-10 py-5 text-xl rounded-2xl',
    };

    const roundedClasses = rounded ? 'rounded-full' : '';

    const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${roundedClasses}
    ${className}
  `.replace(/\s+/g, ' ').trim();

    return (
        <button
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}

            {!isLoading && leftIcon && (
                <span className="mr-2">{leftIcon}</span>
            )}

            <span className={isLoading ? 'opacity-70' : ''}>
                {children}
            </span>

            {!isLoading && rightIcon && (
                <span className="ml-2">{rightIcon}</span>
            )}
        </button>
    );
};
