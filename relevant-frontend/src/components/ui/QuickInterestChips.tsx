import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './Button';
import { INTEREST_CATEGORIES } from '../../data/interests';

interface QuickInterestChipsProps {
    onAdd: (category: string, priority: number, keywords: string[]) => void;
    disabled?: boolean;
    existingInterests?: string[];
}

export const QuickInterestChips: React.FC<QuickInterestChipsProps> = ({
    onAdd,
    disabled = false,
    existingInterests = []
}) => {
    // Get popular categories that haven't been added yet
    const availableCategories = Object.entries(INTEREST_CATEGORIES)
        .filter(([category]) => !existingInterests.includes(category))
        .slice(0, 8); // Show top 8 categories

    const handleQuickAdd = (category: string) => {
        const categoryData = INTEREST_CATEGORIES[category as keyof typeof INTEREST_CATEGORIES];
        onAdd(category, categoryData.priority, categoryData.keywords);
    };

    if (availableCategories.length === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Quick Add Popular Categories
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableCategories.map(([category, data]) => (
                    <Button
                        key={category}
                        onClick={() => handleQuickAdd(category)}
                        variant="secondary"
                        size="sm"
                        className="text-xs justify-between group hover:bg-blue-100 hover:border-blue-300"
                        disabled={disabled}
                    >
                        <span className="truncate">{category}</span>
                        <div className="flex items-center gap-1 ml-2">
                            <span className="text-xs text-gray-500">★{data.priority}</span>
                            <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </Button>
                ))}
            </div>
            <p className="text-xs text-blue-700 mt-2">
                Click to add with default settings • {availableCategories.length} categories available
            </p>
        </div>
    );
};
