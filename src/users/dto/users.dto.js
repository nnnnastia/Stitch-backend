export function toUserResponseDto(user) {
    return {
        id: user._id,
        userName: user.userName,
        userSurname: user.userSurname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isActive: user.isActive,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}