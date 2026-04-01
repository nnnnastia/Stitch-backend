import * as usersRepository from "./users.repository.js";
import { toUserResponseDto } from "./dto/users.dto.js";

export async function getMe(userId) {
    const user = await usersRepository.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }

    return toUserResponseDto(user);
}

export async function updateMe(userId, body, file) {
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

    if (file) {
        updateData.avatarUrl = `/uploads/${file.filename}`;
    }

    const updatedUser = await usersRepository.updateById(userId, updateData);

    if (!updatedUser) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }

    return toUserResponseDto(updatedUser);

}