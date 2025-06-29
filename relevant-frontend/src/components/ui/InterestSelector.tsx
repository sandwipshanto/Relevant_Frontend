import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Sparkles, Zap } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { INTEREST_CATEGORIES, getSuggestions, getKeywords } from '../../data/interests';

interface InterestSelectorProps {
    onAdd: (category: string, priority: number, keywords: string[]) => void;
    onCancel: () => void;
    disabled?: boolean;
}

export const InterestSelector: React.FC<InterestSelectorProps> = ({
    onAdd,
    onCancel,
    disabled = false
}) => {
    const [mode, setMode] = useState<'browse' | 'search' | 'custom'>('browse');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priority, setPriority] = useState(5);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [keywordInput, setKeywordInput] = useState('');
    const [filteredCategories, setFilteredCategories] = useState<string[]>([]);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const keywordInputRef = useRef<HTMLInputElement>(null);

    // Filter categories based on search
    useEffect(() => {
        if (searchQuery.trim()) {
            const suggestions = getSuggestions(searchQuery, 'category');
            setFilteredCategories(suggestions.length > 0 ? suggestions : []);
        } else {
            setFilteredCategories(Object.keys(INTEREST_CATEGORIES));
        }
    }, [searchQuery]);

    // Quick add with predefined data
    const handleQuickAdd = (category: string) => {
        const categoryData = INTEREST_CATEGORIES[category as keyof typeof INTEREST_CATEGORIES];
        onAdd(category, categoryData.priority, categoryData.keywords.slice(0, 5));
    };

    // Select category and auto-populate
    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        const categoryData = INTEREST_CATEGORIES[category as keyof typeof INTEREST_CATEGORIES];
        if (categoryData) {
            setPriority(categoryData.priority);
            setKeywords(categoryData.keywords.slice(0, 5));
        }
    };

    // Add custom keyword
    const addCustomKeyword = (keyword: string) => {
        if (keyword.trim() && !keywords.includes(keyword.trim())) {
            setKeywords(prev => [...prev, keyword.trim()]);
        }
    };

    // Remove keyword
    const removeKeyword = (index: number) => {
        setKeywords(prev => prev.filter((_, i) => i !== index));
    };

    // Submit interest
    const handleSubmit = () => {
        if (selectedCategory && keywords.length > 0) {
            onAdd(selectedCategory, priority, keywords);
        }
    };

    // Category icons for better visual appeal
    const getCategoryIcon = (category: string) => {
        const iconMap: Record<string, string> = {
            'Technology': '💻',
            'Science': '🔬',
            'Business': '💼',
            'Entertainment': '🎬',
            'Sports': '⚽',
            'Health & Fitness': '💪',
            'Travel': '✈️',
            'Food & Cooking': '🍳',
            'Art & Design': '🎨',
            'Education': '📚',
            'Politics': '🏛️',
            'Environment': '🌱'
        };
        return iconMap[category] || '📌';
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
                    Add Interest Category
                </h3>

                {/* Mode selector */}
                <div className="flex space-x-1 bg-white rounded-lg p-1">
                    <button
                        onClick={() => setMode('browse')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'browse'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Browse Popular
                    </button>
                    <button
                        onClick={() => setMode('search')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'search'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Search & Filter
                    </button>
                    <button
                        onClick={() => setMode('custom')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'custom'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Create Custom
                    </button>
                </div>
            </div>

            <div className="p-6">
                {/* Browse Mode - Visual category grid */}
                {mode === 'browse' && (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                                <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                                Quick Add - One Click!
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {Object.keys(INTEREST_CATEGORIES).slice(0, 12).map(category => {
                                    const categoryData = INTEREST_CATEGORIES[category as keyof typeof INTEREST_CATEGORIES];
                                    return (
                                        <button
                                            key={category}
                                            onClick={() => handleQuickAdd(category)}
                                            disabled={disabled}
                                            className="group p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50"
                                        >
                                            <div className="text-2xl mb-2">{getCategoryIcon(category)}</div>
                                            <div className="text-sm font-medium text-gray-900 mb-1">{category}</div>
                                            <div className="text-xs text-gray-500 line-clamp-2">
                                                {categoryData.keywords.slice(0, 3).join(', ')}...
                                            </div>
                                            <div className="mt-2 text-xs text-blue-600 group-hover:text-blue-700 font-medium">
                                                Click to add instantly
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-4">
                                Or choose a category to customize first
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {Object.keys(INTEREST_CATEGORIES).map(category => (
                                    <button
                                        key={category}
                                        onClick={() => handleCategorySelect(category)}
                                        className="p-3 text-left bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <span className="text-lg mr-3">{getCategoryIcon(category)}</span>
                                            <div>
                                                <div className="font-medium text-gray-900">{category}</div>
                                                <div className="text-xs text-gray-500">
                                                    Priority: {INTEREST_CATEGORIES[category as keyof typeof INTEREST_CATEGORIES].priority}/10
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Mode */}
                {mode === 'search' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Categories
                            </label>
                            <Input
                                ref={searchInputRef}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Type to search categories..."
                                className="w-full"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                            {filteredCategories.map(category => {
                                const categoryData = INTEREST_CATEGORIES[category as keyof typeof INTEREST_CATEGORIES];
                                return (
                                    <div key={category} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-lg mr-2">{getCategoryIcon(category)}</span>
                                                    <h5 className="font-medium text-gray-900">{category}</h5>
                                                </div>
                                                <p className="text-xs text-gray-600 mb-2">
                                                    {categoryData?.keywords.slice(0, 4).join(', ')}...
                                                </p>
                                                <div className="text-xs text-gray-500">
                                                    Priority: {categoryData?.priority}/10
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Button
                                                    onClick={() => handleQuickAdd(category)}
                                                    size="sm"
                                                    className="text-xs px-2 py-1"
                                                    disabled={disabled}
                                                >
                                                    Quick Add
                                                </Button>
                                                <Button
                                                    onClick={() => handleCategorySelect(category)}
                                                    variant="secondary"
                                                    size="sm"
                                                    className="text-xs px-2 py-1"
                                                >
                                                    Customize
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}                {/* Custom Mode */}
                {mode === 'custom' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Category Name
                            </label>
                            <Input
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                placeholder="Enter your custom category..."
                                className="w-full"
                            />
                        </div>

                        {selectedCategory && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority Level: {priority}/10
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={priority}
                                    onChange={(e) => setPriority(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Low Priority</span>
                                    <span>High Priority</span>
                                </div>
                            </div>
                        )}

                        {selectedCategory && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Keywords ({keywords.length} selected)
                                </label>

                                {/* Selected keywords */}
                                {keywords.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {keywords.map((keyword, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {keyword}
                                                <button
                                                    onClick={() => removeKeyword(index)}
                                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                                    disabled={disabled}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Keyword input */}
                                <div className="mb-3">
                                    <div className="text-xs text-gray-600 mb-2">Add keywords for this category:</div>
                                    <div className="flex gap-2">
                                        <Input
                                            value={keywordInput}
                                            onChange={(e) => setKeywordInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (keywordInput.trim()) {
                                                        addCustomKeyword(keywordInput);
                                                        setKeywordInput('');
                                                    }
                                                }
                                            }}
                                            placeholder="Type a keyword and press Enter..."
                                            className="flex-1"
                                            disabled={disabled}
                                        />
                                        <Button
                                            onClick={() => {
                                                if (keywordInput.trim()) {
                                                    addCustomKeyword(keywordInput);
                                                    setKeywordInput('');
                                                }
                                            }}
                                            disabled={!keywordInput.trim() || disabled}
                                            size="sm"
                                            className="px-3"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Submit button for custom category */}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!selectedCategory || keywords.length === 0 || disabled}
                                        className="flex-1"
                                    >
                                        Add Custom Interest
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setSelectedCategory('');
                                            setKeywords([]);
                                            setKeywordInput('');
                                            setPriority(5);
                                        }}
                                        variant="secondary"
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Category customization panel */}
                {selectedCategory && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                            <span className="text-lg mr-2">{getCategoryIcon(selectedCategory)}</span>
                            Customizing: {selectedCategory}
                        </h4>

                        {/* Priority */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority Level: {priority}/10
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={priority}
                                onChange={(e) => setPriority(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Low Priority</span>
                                <span>High Priority</span>
                            </div>
                        </div>

                        {/* Keywords */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Keywords ({keywords.length} selected)
                            </label>

                            {/* Selected keywords */}
                            {keywords.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {keywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            {keyword}
                                            <button
                                                onClick={() => removeKeyword(index)}
                                                className="ml-1 text-blue-600 hover:text-blue-800"
                                                disabled={disabled}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}                            {/* Add more keywords from suggestions */}
                            {INTEREST_CATEGORIES[selectedCategory as keyof typeof INTEREST_CATEGORIES] && (
                                <div className="mb-3">
                                    <div className="text-xs text-gray-600 mb-2">Popular keywords for {selectedCategory}:</div>
                                    <div className="flex flex-wrap gap-1">
                                        {getKeywords(selectedCategory).filter(kw => !keywords.includes(kw)).slice(0, 10).map(keyword => (
                                            <button
                                                key={keyword}
                                                onClick={() => addCustomKeyword(keyword)}
                                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                                disabled={disabled}
                                            >
                                                <Plus className="h-3 w-3 mr-1" />
                                                {keyword}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Custom keyword input */}
                            <div className="mb-3">
                                <div className="text-xs text-gray-600 mb-2">Add custom keyword:</div>
                                <div className="flex gap-2">
                                    <Input
                                        ref={keywordInputRef}
                                        value={keywordInput}
                                        onChange={(e) => setKeywordInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (keywordInput.trim()) {
                                                    addCustomKeyword(keywordInput);
                                                    setKeywordInput('');
                                                }
                                            }
                                        }}
                                        placeholder="Type a keyword and press Enter..."
                                        className="flex-1"
                                        disabled={disabled}
                                    />
                                    <Button
                                        onClick={() => {
                                            if (keywordInput.trim()) {
                                                addCustomKeyword(keywordInput);
                                                setKeywordInput('');
                                            }
                                        }}
                                        disabled={!keywordInput.trim() || disabled}
                                        size="sm"
                                        className="px-3"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                            <Button
                                onClick={handleSubmit}
                                disabled={!selectedCategory || keywords.length === 0 || disabled}
                                className="flex-1"
                            >
                                Add Custom Interest
                            </Button>
                            <Button
                                onClick={() => setSelectedCategory('')}
                                variant="secondary"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Main action buttons */}
                {!selectedCategory && (
                    <div className="mt-6 flex gap-2">
                        <Button
                            onClick={onCancel}
                            variant="secondary"
                            className="flex-1"
                        >
                            Close
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
