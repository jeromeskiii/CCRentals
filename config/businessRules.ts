export const BUSINESS_RULES = {
    rateLimiting: {
        maxSubmissions: 3,
        windowMs: 60 * 60 * 1000,
    },
    unitCalculation: {
        guestsPerUnit: 50,
        workersPerUnit: 10,
        baseEventHours: 4,
        hoursPerDay: 8,
        attendantShiftHours: 4,
    },
    pricing: {
        freeDeliveryThreshold: 5,
        deliveryFee: 75,
        includedUnits: 1,
        includedDays: 1,
    },
} as const;
