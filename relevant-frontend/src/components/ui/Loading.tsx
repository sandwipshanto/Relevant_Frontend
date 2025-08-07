import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
    text?: string;
    fullScreen?: boolean;
    className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
    size = 'md',
    variant = 'spinner',
    text,
    fullScreen = false,
    className = '',
}) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
    };

    const textSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
    };

    const renderSpinner = () => (
        <Loader2 className={`${sizes[size]} animate-spin text-blue-600`} />
    );

    const renderDots = () => (
        <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={`${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : size === 'xl' ? 'w-5 h-5' : 'w-3 h-3'} 
                     bg-blue-600 rounded-full animate-bounce`}
                    style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.6s'
                    }}
                />
            ))}
        </div>
    );

    const renderPulse = () => (
        <div className={`${sizes[size]} bg-blue-600 rounded-full animate-pulse`} />
    );

    const renderSkeleton = () => (
        <div className="space-y-3 w-full max-w-md">
            <div className="h-4 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-full animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded-full animate-pulse w-4/6" />
        </div>
    );

    const renderLoader = () => {
        switch (variant) {
            case 'dots':
                return renderDots();
            case 'pulse':
                return renderPulse();
            case 'skeleton':
                return renderSkeleton();
            default:
                return renderSpinner();
        }
    };

    const content = (
        <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
            {variant !== 'skeleton' && renderLoader()}
            {variant === 'skeleton' && renderSkeleton()}
            {text && (
                <p className={`${textSizes[size]} text-gray-600 font-medium animate-pulse`}>
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return content;
};

// Legacy components for backward compatibility
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    return <Loading size={size} variant="spinner" />;
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
    );
};

export const PageLoading: React.FC = () => {
    return <Loading size="lg" text="Loading..." fullScreen />;
};
