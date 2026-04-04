import User from "./entities/user.model.js";

export async function findById(userId) {
    return User.findById(userId);
}

export async function findByIdWithPassword(userId) {
    return User.findById(userId).select("+passwordHash");
}

export async function findByEmail(email) {
    return User.findOne({ email });
}

export async function updateById(userId, updateData) {
    return User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    });
}

export async function findManyForAdmin({
    search = "",
    role,
    isActive,
    emailVerified,
    page = 1,
    limit = 10,
}) {
    const query = {};

    if (search?.trim()) {
        query.$or = [
            { userName: { $regex: search, $options: "i" } },
            { userSurname: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phoneNumber: { $regex: search, $options: "i" } },
        ];
    }

    if (role) {
        query.role = role;
    }

    if (typeof isActive === "boolean") {
        query.isActive = isActive;
    }

    if (typeof emailVerified === "boolean") {
        query.emailVerified = emailVerified;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(query),
    ]);

    return { items, total };
}