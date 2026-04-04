const userTypeDefs = `#graphql
    type User {
        _id: ID!
        userName: String!
        userSurname: String!
        email: String!
        phoneNumber: String
        role: String!
        isActive: Boolean!
        avatarUrl: String
        emailVerified: Boolean!
        verificationAttempts: Int
        createdAt: String
        updatedAt: String
    }

    type UsersPaginationInfo {
        total: Int!
        page: Int!
        limit: Int!
        totalPages: Int!
        hasNextPage: Boolean!
        hasPrevPage: Boolean!
    }

    type UsersListResponse {
        items: [User!]!
        pagination: UsersPaginationInfo!
    }

    input AdminUsersFilterInput {
        search: String
        role: String
        isActive: Boolean
        emailVerified: Boolean
        page: Int = 1
        limit: Int = 10
    }

    input UpdateUserInput {
        userName: String
        userSurname: String
        email: String
        phoneNumber: String
        role: String
        isActive: Boolean
        emailVerified: Boolean
    }

    type Query {
        adminUsers(filter: AdminUsersFilterInput): UsersListResponse!
        adminUser(id: ID!): User
    }

    type Mutation {
        adminUpdateUser(id: ID!, input: UpdateUserInput!): User!
        adminUpdateUserRole(id: ID!, role: String!): User!
        adminToggleUserStatus(id: ID!, isActive: Boolean!): User!
    }
`;

export default userTypeDefs;