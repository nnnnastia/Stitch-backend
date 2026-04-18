import { shippingService } from "./shipping.service.js";

export async function searchCities(req, res, next) {
    try {
        const { q } = req.query;

        const items = await shippingService.searchCities(q);
        res.json({ items });
    } catch (error) {
        next(error);
    }
}

export async function getWarehouses(req, res, next) {
    try {
        const { cityId } = req.query;

        const items = await shippingService.getWarehouses(cityId);
        res.json({ items });
    } catch (error) {
        next(error);
    }
}