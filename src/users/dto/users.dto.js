export function toUserResponseDto(user) {
    return {
        _id: user._id.toString(),
        userName: user.userName,
        userSurname: user.userSurname,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        role: user.role,
        isActive: user.isActive,
        avatarUrl: user.avatarUrl || "",
        emailVerified: user.emailVerified,
        verificationAttempts: user.verificationAttempts || 0,
        createdAt: user.createdAt ? user.createdAt.toISOString() : null,
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
    };
}