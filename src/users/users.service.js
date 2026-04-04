import bcrypt from "bcrypt";
import * as usersRepository from "./users.repository.js";
import { toUserResponseDto } from "./dto/users.dto.js";
import * as tokenRepository from "../auth/tokens/token.repository.js";

export async function getMe(userId) {
    const user = await usersRepository.findById(userId);

    if (!user) {
        const error = new Error("Користувача не знайдено");
        error.status = 404;
        throw error;
    }

    return toUserResponseDto(user);
}

export async function updateMe(userId, body) {
    const { userName, userSurname, phoneNumber } = body;

    const updateData = {};

    if (userName !== undefined) {
        updateData.userName = userName.trim();
    }

    if (userSurname !== undefined) {
        updateData.userSurname = userSurname.trim();
    }

    if (phoneNumber !== undefined) {
        updateData.phoneNumber = phoneNumber.trim();
    }

    const updatedUser = await usersRepository.updateById(userId, updateData);

    if (!updatedUser) {
        const error = new Error("Користувача не знайдено");
        error.status = 404;
        throw error;
    }

    return toUserResponseDto(updatedUser);
}

export async function updateMyPassword(userId, body) {
    const { oldPassword, newPassword, repeatPassword } = body;

    if (!oldPassword || !newPassword || !repeatPassword) {
        const error = new Error("Всі поля з паролем є обов'язковими");
        error.status = 400;
        throw error;
    }

    if (newPassword !== repeatPassword) {
        const error = new Error("Паролі не співпадають");
        error.status = 400;
        throw error;
    }

    if (newPassword.length < 6) {
        const error = new Error("Новий пароль має містити мінімум 6 символів");
        error.status = 400;
        throw error;
    }

    const user = await usersRepository.findByIdWithPassword(userId);

    if (!user) {
        const error = new Error("Користувача не знайдено");
        error.status = 404;
        throw error;
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);

    if (!isOldPasswordValid) {
        const error = new Error("Старий пароль не вірний");
        error.status = 400;
        throw error;
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);

    if (isSamePassword) {
        const error = new Error("Новий пароль має відрізнятися від старого");
        error.status = 400;
        throw error;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    const updatedUser = await usersRepository.updateById(userId, {
        passwordHash,
    });

    await tokenRepository.revokeAllUserSessions(userId);

    return toUserResponseDto(updatedUser);
}

export async function updateMyAvatar(userId, file) {
    if (!file) {
        const error = new Error("Файл фото профілю є обов'язковим");
        error.status = 400;
        throw error;
    }

    const avatarUrl = `/uploads/${file.filename}`;

    const updatedUser = await usersRepository.updateById(userId, {
        avatarUrl,
    });

    if (!updatedUser) {
        const error = new Error("Користувача не знайдено");
        error.status = 404;
        throw error;
    }

    return toUserResponseDto(updatedUser);
}

// =========================
// ADMIN METHODS
// =========================

function buildPagination(total, page, limit) {
    const totalPages = Math.ceil(total / limit) || 1;

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
}

export async function getUsersForAdmin(filter = {}) {
    const page = Number(filter.page) || 1;
    const limit = Number(filter.limit) || 10;

    const { items, total } = await usersRepository.findManyForAdmin({
        search: filter.search || "",
        role: filter.role,
        isActive: filter.isActive,
        emailVerified: filter.emailVerified,
        page,
        limit,
    });

    return {
        items: items.map(toUserResponseDto),
        pagination: buildPagination(total, page, limit),
    };
}

export async function getUserByIdForAdmin(userId) {
    const user = await usersRepository.findById(userId);

    if (!user) {
        const error = new Error("Користувача не знайдено");
        error.status = 404;
        throw error;
    }

    return toUserResponseDto(user);
}

export async function updateUserByAdmin(userId, input) {
    const user = await usersRepository.findById(userId);

    if (!user) {
        const error = new Error("Користувача не знайдено");
        error.status = 404;
        throw error;
    }

    const updateData = {};

    if (input.userName !== undefined) {
        updateData.userName = input.userName.trim();
    }

    if (input.userSurname !== undefined) {
        updateData.userSurname = input.userSurname.trim();
    }

    if (input.email !== undefined) {
        updateData.email = input.email.trim().toLowerCase();
    }

    if (input.phoneNumber !== undefined) {
        updateData.phoneNumber = input.phoneNumber.trim();
    }

    if (input.role !== undefined) {
        if (!["user", "seller", "admin"].includes(input.role)) {
            const error = new Error("Некоректна роль");
            error.status = 400;
            throw error;
        }

        updateData.role = input.role;
    }

    if (input.isActive !== undefined) {
        updateData.isActive = input.isActive;
    }

    if (input.emailVerified !== undefined) {
        updateData.emailVerified = input.emailVerified;
    }

    const updatedUser = await usersRepository.updateById(userId, updateData);

    return toUserResponseDto(updatedUser);
}

export async function updateUserRoleByAdmin(userId, role) {
    if (!["user", "seller", "admin"].includes(role)) {
        const error = new Error("Некоректна роль");
        error.status = 400;
        throw error;
    }

    const user = await usersRepository.findById(userId);

    if (!user) {
        const error = new Error("Користувача не знайдено");
        error.status = 404;
        throw error;
    }

    const updatedUser = await usersRepository.updateById(userId, { role });

    return toUserResponseDto(updatedUser);
}

export async function toggleUserStatusByAdmin(userId, isActive) {
    const user = await usersRepository.findById(userId);

    if (!user) {
        const error = new Error("Користувача не знайдено");
        error.status = 404;
        throw error;
    }

    const updatedUser = await usersRepository.updateById(userId, { isActive });

    return toUserResponseDto(updatedUser);
}