import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/api/endpoints';
import type { Category } from '@/types';

interface CategoryFilterProps {
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
    const { data: categoriesResponse, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoriesApi.getAll(),
    });

    const categories = Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : [];

    if (isLoading) return null;

    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onSelectCategory(null)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${selectedCategory === null
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
            >
                Sve
            </button>

            {categories.map((category: Category) => (
                <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.id)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${selectedCategory === category.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}