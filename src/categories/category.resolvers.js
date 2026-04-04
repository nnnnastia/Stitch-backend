import * as categoriesService from "./categories.service.js";

const categoryResolvers = {
    Query: {
        categories: async (_, { page, limit }, context) => {
            return categoriesService.listAllCategoriesForAdmin(page, limit);
        },

        rootCategories: async () => {
            return categoriesService.listRootCategoriesForAdmin();
        },

        category: async (_, { id }) => {
            return categoriesService.getCategoryByIdForAdmin(id);
        },

        categoryTree: async () => {
            return categoriesService.getCategoryTreeForAdmin();
        }
    },

    Mutation: {
        createCategory: async (_, { input }, context) => {
            return categoriesService.createCategoryForAdmin(input, context.user);
        },
        updateCategory: async (_, { id, input }, context) => {
            return categoriesService.updateCategoryForAdmin(id, input, context.user);
        },
        deleteCategory: async (_, { id }, context) => {
            return categoriesService.deleteCategoryForAdmin(id, context.user);
        },
    },

    Category: {
        children: async (parentCategory) => {
            return categoriesService.getChildrenForAdmin(parentCategory._id);
        },

        parentCategory: async (category) => {
            return categoriesService.getParentCategoryForAdmin(category.parent);
        }
    }
};

export default categoryResolvers;