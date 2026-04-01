import User from './entities/user.model.js'

export async function findById(userId) {
    return User.findById(userId);
}

export async function updateById(userId, updateData) {
    return User.finfByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    });
}

export async function findByEmail(email) {
    return User.findOne({ email });
}