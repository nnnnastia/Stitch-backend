export function toSellerProfileResponseDto(profile) {
    return {
        id: profile._id,
        user: profile.user,
        displayName: profile.displayName,
        about: profile.about,
        contacts: profile.contacts,
        delivery: profile.delivery,
        payment: profile.payment,
        payout: profile.payout,
        status: profile.status,
        rating: profile.rating,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
    };
}