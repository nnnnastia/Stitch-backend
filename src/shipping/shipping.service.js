import { novaPoshtaService } from "./providers/novaPoshta.service.js";

export const shippingService = {
    async searchCities(query) {
        return novaPoshtaService.searchCities(query);
    },

    async getWarehouses(cityId) {
        return novaPoshtaService.getWarehouses(cityId);
    },
};