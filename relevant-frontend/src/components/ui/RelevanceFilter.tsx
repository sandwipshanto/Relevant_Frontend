import React, { useState } from 'react';
import { Sliders, Filter, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from './Button';
import type { RelevanceFilter as RelevanceFilterType, RelevanceStats } from '../../types';

interface RelevanceFilterProps {
    onFilterChange: (filters: RelevanceFilterType) => void;
    stats?: RelevanceStats;
    isLoading?: boolean;
}

export const RelevanceFilter: React.FC<RelevanceFilterProps> = ({
    onFilterChange,
    stats,
    isLoading = false
}) => {
    const [minRelevance, setMinRelevance] = useState(0.0);
    const [maxRelevance, setMaxRelevance] = useState(1.0);
    const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'popularity'>('relevance');
    const [isOpen, setIsOpen] = useState(false);

    const handleApplyFilter = () => {
        onFilterChange({
            minRelevance,
            maxRelevance,
            sortBy
        });
    };

    const handleReset = () => {
        setMinRelevance(0.0);
        setMaxRelevance(1.0);
        setSortBy('relevance');
        onFilterChange({
            minRelevance: 0.0,
            maxRelevance: 1.0,
            sortBy: 'relevance'
        });
    };

    const getRelevanceLabel = (value: number) => {
        if (value >= 0.8) return 'Excellent';
        if (value >= 0.6) return 'Good';
        if (value >= 0.4) return 'Fair';
        return 'Low';
    };

    const getRelevanceColor = (value: number) => {
        if (value >= 0.8) return 'text-green-600';
        if (value >= 0.6) return 'text-blue-600';
        if (value >= 0.4) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Relevance Filter</h3>
                </div>
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600"
                >
                    <Sliders className="h-4 w-4" />
                </Button>
            </div>

            {/* Stats Display */}
            {stats && (
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">
                                {Math.round(stats.avgRelevance * 100)}%
                            </div>
                            <div className="text-xs text-gray-600">Avg Relevance</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-green-600">
                                {stats.highRelevanceCount}
                            </div>
                            <div className="text-xs text-gray-600">High Quality</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-blue-600">
                                {stats.totalCount}
                            </div>
                            <div className="text-xs text-gray-600">Total Items</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-purple-600">
                                {stats.totalCount > 0 ? Math.round((stats.highRelevanceCount / stats.totalCount) * 100) : 0}%
                            </div>
                            <div className="text-xs text-gray-600">Quality Rate</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Controls */}
            {isOpen && (
                <div className="p-4 space-y-4">
                    {/* Relevance Range */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Relevance Range
                        </label>

                        {/* Min Relevance */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Minimum:</span>
                                <span className={`text-sm font-medium ${getRelevanceColor(minRelevance)}`}>
                                    {Math.round(minRelevance * 100)}% ({getRelevanceLabel(minRelevance)})
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={minRelevance}
                                onChange={(e) => setMinRelevance(Math.min(parseFloat(e.target.value), maxRelevance))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        {/* Max Relevance */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Maximum:</span>
                                <span className={`text-sm font-medium ${getRelevanceColor(maxRelevance)}`}>
                                    {Math.round(maxRelevance * 100)}% ({getRelevanceLabel(maxRelevance)})
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={maxRelevance}
                                onChange={(e) => setMaxRelevance(Math.max(parseFloat(e.target.value), minRelevance))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Sort By
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setSortBy('relevance')}
                                className={`p-2 text-sm rounded-md border transition-colors ${sortBy === 'relevance'
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <TrendingUp className="h-4 w-4 mx-auto mb-1" />
                                Relevance
                            </button>
                            <button
                                onClick={() => setSortBy('date')}
                                className={`p-2 text-sm rounded-md border transition-colors ${sortBy === 'date'
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                📅
                                <div>Date</div>
                            </button>
                            <button
                                onClick={() => setSortBy('popularity')}
                                className={`p-2 text-sm rounded-md border transition-colors ${sortBy === 'popularity'
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <BarChart3 className="h-4 w-4 mx-auto mb-1" />
                                Popular
                            </button>
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Quick Filters
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setMinRelevance(0.8);
                                    setMaxRelevance(1.0);
                                }}
                                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                            >
                                Excellent (80%+)
                            </button>
                            <button
                                onClick={() => {
                                    setMinRelevance(0.6);
                                    setMaxRelevance(1.0);
                                }}
                                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                            >
                                Good (60%+)
                            </button>
                            <button
                                onClick={() => {
                                    setMinRelevance(0.0);
                                    setMaxRelevance(0.4);
                                }}
                                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Low Quality
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={handleApplyFilter}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? 'Filtering...' : 'Apply Filter'}
                        </Button>
                        <Button
                            onClick={handleReset}
                            variant="secondary"
                            disabled={isLoading}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
