const Joi = require('joi');

const sellerSchema = Joi.object({
  _id: Joi.string(),
  name: Joi.string(),
  location: Joi.object({
    city: Joi.string().required(),
    country: Joi.string().required()
  }),
  rating: Joi.number().min(0).max(5),
  productsSold: Joi.number(),
  activeSince: Joi.date(),
  email: Joi.string().email(),
  contactNumber: Joi.string(),
  reviews: Joi.array().items(Joi.object({
    buyerId: Joi.string().required(),
    review: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(),
    date: Joi.date().required()
  }))
}).unknown(true); // Adding unknown(true) to allow other fields to be present

const buyerSchema = Joi.object({
    _id: Joi.string(),
    name: Joi.string(),
    location: Joi.object({
      city: Joi.string().required(),
      country: Joi.string().required()
    }),
    totalPurchases: Joi.number(),
    preferredCategories: Joi.array().items(Joi.string()),
    joinedOn: Joi.date(),
    email: Joi.string().email(),
    contactNumber: Joi.string(),
    reviews: Joi.array().items(Joi.object({
      sellerId: Joi.string().required(),
      review: Joi.string().required(),
      rating: Joi.number().min(0).max(5).required(),
      date: Joi.date().required()
    }))
  }).unknown(true); // Adding unknown(true) to allow other fields to be present

const weightageSchema = Joi.object({
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  warranty: Joi.number().required(),
  settlementWindow: Joi.number().required()
});

const scoreImpactSchema = Joi.object({
  price: Joi.number(),
  quantity: Joi.number(),
  warranty: Joi.number(),
  settlementWindow: Joi.number(),
});

// Custom validation function to ensure the sum of weightages is 100
const validateWeightagesSum = (value, helpers) => {
  const sum = value.price + value.quantity + value.warranty + value.settlementWindow;
  if (sum !== 100) {
    return helpers.message('Sum of weightages must be equal to 100');
  }
  return value;
};

const negotiationValidationSchema = Joi.object({
  seller: sellerSchema, // Making the entire seller object required
  buyer: buyerSchema, // Making the entire buyer object required
  productDetails: Joi.object({
    productName: Joi.string(),
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
      value: Joi.number().required(),
      who: Joi.string().valid('seller', 'buyer').required(),
      timestamp: Joi.date().required()
    })).required(),
    settlementWindow: Joi.array().items(Joi.object({
      value: Joi.number().required(),
      who: Joi.string().valid('seller', 'buyer').required(),
      timestamp: Joi.date().required()
    })),
    buyerWeightage: weightageSchema.custom(validateWeightagesSum),
    sellerWeightage: weightageSchema.custom(validateWeightagesSum),
    buyerScoreImpact: scoreImpactSchema,
    sellerScoreImpact: scoreImpactSchema
  }),
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
