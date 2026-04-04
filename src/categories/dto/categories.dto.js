export function toCategoryResponseDto(category) {
    return {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        description: category.description,
        isActive: category.isActive,
        parent: category.parent,
        order: category.order,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
    };
}

export function toCategoriesListDto(categories) {
    return categories.map(toCategoryResponseDto);
}