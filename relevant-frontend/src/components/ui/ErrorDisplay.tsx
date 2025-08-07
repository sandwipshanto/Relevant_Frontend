import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorDisplayProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    retryText?: string;
    variant?: 'error' | 'warning' | 'info';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    title,
    message,
    onRetry,
    retryText = 'Try Again',
    variant = 'error'
}) => {
    const variantStyles = {
        error: {
            container: 'border-red-200 bg-red-50',
            icon: 'text-red-500',
            title: 'text-red-800',
            message: 'text-red-600'
        },
        warning: {
            container: 'border-yellow-200 bg-yellow-50',
            icon: 'text-yellow-500',
            title: 'text-yellow-800',
            message: 'text-yellow-600'
        },
        info: {
            container: 'border-blue-200 bg-blue-50',
            icon: 'text-blue-500',
            title: 'text-blue-800',
            message: 'text-blue-600'
        }
    };

    const styles = variantStyles[variant];

    return (
        <div className={`p-4 border rounded-lg ${styles.container}`}>
            <div className="flex items-start gap-3">
                <AlertCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${styles.icon}`} />
                <div className="flex-1">
                    {title && (
                        <h3 className={`font-medium mb-1 ${styles.title}`}>
                            {title}
                        </h3>
                    )}
                    <p className={`text-sm ${styles.message}`}>
                        {message}
                    </p>
                    {onRetry && (
                        <div className="mt-3">
                            <Button
                                onClick={onRetry}
                                variant="secondary"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                {retryText}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
