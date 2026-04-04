import * as usersService from "./users.service.js";

export async function getMe(req, res, next) {
    try {
        const user = await usersService.getMe(req.user._id);
        return res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
}

export async function updateMe(req, res, next) {
    try {
        const user = await usersService.updateMe(req.user._id, req.body);
        return res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
}

export async function updateMyPassword(req, res, next) {
    try {
        const user = await usersService.updateMyPassword(req.user._id, req.body);
        return res.status(200).json({
            message: "Пароль успішно оновлено!",
            user,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateMyAvatar(req, res, next) {
    try {
        const user = await usersService.updateMyAvatar(req.user._id, req.file);
        return res.status(200).json({
            message: "Фото профілю успішно оновлено!",
            user,
        });
    } catch (error) {
        next(error);
    }
}