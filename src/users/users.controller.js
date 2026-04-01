import * as usersService from "./users.service.js"

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
        const user = await usersService.updateMe(req.user._id, req.body, req.file);
        return res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
}