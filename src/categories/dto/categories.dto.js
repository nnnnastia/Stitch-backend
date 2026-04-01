export function toCategoryResponseDto(category) {
    return {
        id: category._id,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
    };
}

export function toCategoriesListDto(categories) {
    return categories.map(toCategoryResponseDto);
}