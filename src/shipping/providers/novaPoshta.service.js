const NOVA_POSHTA_API = "https://api.novaposhta.ua/v2.0/json/";

async function npRequest(modelName, calledMethod, methodProperties = {}) {
    const apiKey = process.env.NOVA_POSHTA_API_KEY;

    if (!apiKey) {
        throw new Error("NOVA_POSHTA_API_KEY is not defined");
    }

    const res = await fetch(NOVA_POSHTA_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            apiKey,
            modelName,
            calledMethod,
            methodProperties,
        }),
    });

    if (!res.ok) {
        throw new Error(`Nova Poshta HTTP ${res.status}`);
    }

    const data = await res.json();

    if (!data.success) {
        throw new Error(data.errors?.[0] || "Nova Poshta API error");
    }

    return data.data || [];
}

export const novaPoshtaService = {
    async searchCities(query) {
        if (!query?.trim()) return [];

        const data = await npRequest("Address", "searchSettlements", {
            CityName: query.trim(),
            Limit: 20,
            Page: 1,
        });

        const firstResult = data[0];
        const addresses = firstResult?.Addresses || [];

        return addresses.map((item) => ({
            id: item.DeliveryCity,
            name: item.Present,
        }));
    },

    async getWarehouses(cityId) {
        if (!cityId) return [];

        const data = await npRequest("AddressGeneral", "getWarehouses", {
            CityRef: cityId,
            Limit: 200,
            Page: 1,
            Language: "UA",
        });

        return data.map((item) => ({
            id: item.Ref,
            name: item.Description,
        }));
    },
};