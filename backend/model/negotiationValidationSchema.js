const Joi = require('joi');

const negotiationValidationSchema = Joi.object({
    seller: Joi.object({
        _id: Joi.string().required()/*,
        name: Joi.string().required(),
        location: Joi.object({
            city: Joi.string().required(),
            country: Joi.string().required()
        }),
        rating: Joi.number().min(0).max(5).required(),
        productsSold: Joi.number().required(),
        activeSince: Joi.date().required(),
        email: Joi.string().email().required(),
        contactNumber: Joi.string().required(),
        reviews: Joi.array().items(Joi.object({
            buyerId: Joi.string().required(),
            review: Joi.string().required(),
            rating: Joi.number().min(0).max(5).required(),
            date: Joi.date().required()
        }))*/
    }),
    buyer: Joi.object({
        _id: Joi.string().required()/*,
        name: Joi.string().required(),
        location: Joi.object({
            city: Joi.string().required(),
            country: Joi.string().required()
        }),
        totalPurchases: Joi.number().required(),
        preferredCategories: Joi.array().items(Joi.string().required()),
        joinedOn: Joi.date().required(),
        email: Joi.string().email().required(),
        contactNumber: Joi.string().required(),
        reviews: Joi.array().items(Joi.object({
            sellerId: Joi.string().required(),
            review: Joi.string().required(),
            rating: Joi.number().min(0).max(5).required(),
            date: Joi.date().required()
        }))*/
    }),
    productDetails: Joi.object({
        productName: Joi.string().required(),
        productDescription: Joi.string(),
        productCategory: Joi.string(),
        priceHistory: Joi.array().items(Joi.object({
            value: Joi.number().required(),
            who: Joi.string().valid('seller', 'buyer').required(),
            timestamp: Joi.date().required()
        })).required(),
        quantity: Joi.array().items(Joi.object({
            value: Joi.number().required(),
            who: Joi.string().valid('seller', 'buyer').required(),
            timestamp: Joi.date().required()
        })).required(),
        warranty: Joi.array().items(Joi.object({
            value: Joi.string().required(),
            who: Joi.string().valid('seller', 'buyer').required(),
            timestamp: Joi.date().required()
        })),
        discount: Joi.array().items(Joi.object({
            value: Joi.number().required(),
            who: Joi.string().valid('seller', 'buyer').required(),
            timestamp: Joi.date().required()
        })),
        financing: Joi.array().items(Joi.object({
            value: Joi.string().required(),
            who: Joi.string().valid('seller', 'buyer').required(),
            timestamp: Joi.date().required()
        })),
        buyerFinderFee: Joi.array().items(Joi.object({
            value: Joi.number().required(),
            who: Joi.string().valid('seller', 'buyer').required(),
            timestamp: Joi.date().required()
        })),
        commission: Joi.array().items(Joi.object({
            value: Joi.number().required(),
            who: Joi.string().valid('seller', 'buyer').required(),
            timestamp: Joi.date().required()
        })),
        settlementWindow: Joi.array().items(Joi.object({
            value: Joi.number().required(),
            who: Joi.string().valid('seller', 'buyer').required(),
            timestamp: Joi.date().required()
        })),
        settlementCycle: Joi.array().items(Joi.object({
            value: Joi.number().required(),
            who: Joi.string().valid('seller', 'buyer').required(),
            timestamp: Joi.date().required()
        })),
        performanceStandard: Joi.array().items(Joi.object({
            value: Joi.string().required(),
            who: Joi.string().valid('seller', 'buyer').required(),
            timestamp: Joi.date().required()
        })),
        jurisdiction: Joi.array().items(Joi.object({
            value: Joi.string().required(),
            who: Joi.string().valid('seller', 'buyer').required(),
            timestamp: Joi.date().required()
        })),
        disputes: Joi.array().items(Joi.object({
            value: Joi.string().required(),
            who: Joi.string().valid('seller', 'buyer').required(),
            timestamp: Joi.date().required()
        })),
        liability: Joi.array().items(Joi.object({
            value: Joi.string().required(),
            who: Joi.string().valid('seller', 'buyer').required(),
            timestamp: Joi.date().required()
        }))
    }).required(),
    negotiationDetails: Joi.object({
        sellerSatisfaction: Joi.string().valid('Satisfied', 'Unsatisfied'),
        buyerSatisfaction: Joi.string().valid('Satisfied', 'Unsatisfied'),
        sellerScore: Joi.array().items(Joi.number().min(0).max(100)),
        buyerScore: Joi.array().items(Joi.number().min(0).max(100)),
        state: Joi.string().valid('OPEN', 'CLOSED'),
        turn: Joi.string().valid('seller', 'buyer').required()
    }).required()
});

module.exports = negotiationValidationSchema;
