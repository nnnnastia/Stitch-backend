import {
    getUsersForAdmin,
    getUserByIdForAdmin,
    updateUserByAdmin,
    updateUserRoleByAdmin,
    toggleUserStatusByAdmin,
} from "./users.service.js";

const userResolvers = {
    Query: {
        adminUsers: async (_, { filter }, context) => {
            if (!context?.user || context.user.role !== "admin") {
                throw new Error("Unauthorized");
            }

            return getUsersForAdmin(filter || {});
        },

        adminUser: async (_, { id }, context) => {
            if (!context?.user || context.user.role !== "admin") {
                throw new Error("Unauthorized");
            }

            return getUserByIdForAdmin(id);
        },
    },

    Mutation: {
        adminUpdateUser: async (_, { id, input }, context) => {
            if (!context?.user || context.user.role !== "admin") {
                throw new Error("Unauthorized");
            }

            return updateUserByAdmin(id, input);
        },

        adminUpdateUserRole: async (_, { id, role }, context) => {
            if (!context?.user || context.user.role !== "admin") {
                throw new Error("Unauthorized");
            }

            return updateUserRoleByAdmin(id, role);
        },

        adminToggleUserStatus: async (_, { id, isActive }, context) => {
            if (!context?.user || context.user.role !== "admin") {
                throw new Error("Unauthorized");
            }

            return toggleUserStatusByAdmin(id, isActive);
        },
    },
};

export default userResolvers;