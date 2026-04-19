export function toSellerProfileResponseDto(profile) {
    if (!profile) return null;

    return {
        id: String(profile._id),
        user: profile.user?._id ? String(profile.user._id) : String(profile.user),
        displayName: profile.displayName || "",
        storeSlug: profile.storeSlug || "",
        avatarUrl: profile.avatarUrl || "",
        bannerUrl: profile.bannerUrl || "",
        about: profile.about || "",

        contacts: {
            phone: profile.contacts?.phone || "",
            email: profile.contacts?.email || "",
            city: profile.contacts?.city || "",
        },

        socials: {
            instagram: profile.socials?.instagram || "",
            facebook: profile.socials?.facebook || "",
            telegram: profile.socials?.telegram || "",
            website: profile.socials?.website || "",
        },

        delivery: {
            ukrposhta: Boolean(profile.delivery?.ukrposhta),
            novaPoshta: Boolean(profile.delivery?.novaPoshta),
            meest: Boolean(profile.delivery?.meest),
        },

        payment: {
            cardOnline: Boolean(profile.payment?.cardOnline),
            cashOnDelivery: Boolean(profile.payment?.cashOnDelivery),
        },

        payout: {
            provider: profile.payout?.provider || "",
            cardLast4: profile.payout?.cardLast4 || "",
            externalAccountId: profile.payout?.externalAccountId || "",
        },

        status: profile.status,
        isPublic: Boolean(profile.isPublic),

        rating: {
            avg: Number(profile.rating?.avg || 0),
            count: Number(profile.rating?.count || 0),
        },

        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
    };
}

export function toPublicSellerProfileDto(profile, options = {}) {
    if (!profile) return null;

    return {
        id: String(profile._id),
        sellerId: profile.user?._id ? String(profile.user._id) : String(profile.user),
        displayName: profile.displayName || "",
        storeSlug: profile.storeSlug || "",
        avatarUrl: profile.avatarUrl || "",
        bannerUrl: profile.bannerUrl || "",
        about: profile.about || "",

        contacts: {
            phone: profile.contacts?.phone || "",
            email: profile.contacts?.email || "",
            city: profile.contacts?.city || "",
        },

        socials: {
            instagram: profile.socials?.instagram || "",
            facebook: profile.socials?.facebook || "",
            telegram: profile.socials?.telegram || "",
            website: profile.socials?.website || "",
        },

        delivery: {
            ukrposhta: Boolean(profile.delivery?.ukrposhta),
            novaPoshta: Boolean(profile.delivery?.novaPoshta),
            meest: Boolean(profile.delivery?.meest),
        },

        payment: {
            cardOnline: Boolean(profile.payment?.cardOnline),
            cashOnDelivery: Boolean(profile.payment?.cashOnDelivery),
        },

        rating: {
            avg: Number(profile.rating?.avg || 0),
            count: Number(profile.rating?.count || 0),
        },

        productsCount: Number(options.productsCount || 0),
        createdAt: profile.createdAt,
    };
}