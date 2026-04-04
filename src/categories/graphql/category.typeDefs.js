const categoryTypeDefs = `#graphql
    type Category {
        _id: ID!
        name: String!
        slug: String!
        icon: String
        description: String
        isActive: Boolean!
        parent: ID
        order: Int
        createdAt: String
        updatedAt: String
        children: [Category!]!
        parentCategory: Category
    }

    type PaginationInfo {
        page: Int!
        limit: Int!
        totalItems: Int!
        totalPages: Int!
        hasNextPage: Boolean!
        hasPrevPage: Boolean!
    }

    type PaginatedCategories {
        items: [Category!]!
        pagination: PaginationInfo!
    }

    input CreateCategoryInput {
        name: String!
        slug: String!
        icon: String
        description: String
        isActive: Boolean
        parent: ID
        order: Int
    }

    input UpdateCategoryInput {
        name: String
        slug: String
        icon: String
        description: String
        isActive: Boolean
        parent: ID
        order: Int
    }

    type Query {
        categories(page: Int = 1, limit: Int = 10): PaginatedCategories!
        rootCategories: [Category!]!
        category(id: ID!): Category
        categoryTree: [Category!]!
    }

    type Mutation {
        createCategory(input: CreateCategoryInput!): Category!
        updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
        deleteCategory(id: ID!): Boolean!
    }
`;

export default categoryTypeDefs;