import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error boundary caught an error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h3 className="text-red-800 font-medium mb-2">Something went wrong</h3>
                    <p className="text-red-600 text-sm">
                        There was an error rendering this content. Please try refreshing the page.
                    </p>
                    {this.state.error && (
                        <details className="mt-2">
                            <summary className="text-red-700 text-xs cursor-pointer">Technical details</summary>
                            <pre className="text-red-600 text-xs mt-1 overflow-auto">
                                {this.state.error.message}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
