const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Seller, sellerSchema } = require('./sellerSchema.js');
const { Buyer, buyerSchema } = require('./buyerSchema.js');

const numberSchema = new Schema({
  value: Number,
  who: { type: String, enum: ['seller', 'buyer'] },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const weightageSchema = new Schema({
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    warranty: { type: Number, required: true },
    settlementWindow: { type: Number, required: true }
}, { _id: false });

const scoreImpactSchema = new Schema({
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    warranty: { type: Number, default: 0 },
    settlementWindow: { type: Number, default: 0 }
}, { _id: false });


const negotiationSchema = new Schema({
  seller: { type: sellerSchema },
  buyer: { type: buyerSchema },
  productDetails: {
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    productCategory: { type: String, required: true },
    priceHistory: { type: [numberSchema], required: true },
    quantity: { type: [numberSchema], required: true },
    warranty: [numberSchema],
    settlementWindow: [numberSchema],
    buyerWeightage: { type: weightageSchema},
    sellerWeightage: { type: weightageSchema },
    buyerScoreImpact: { type: scoreImpactSchema},
    sellerScoreImpact: { type: scoreImpactSchema }
  },
  negotiationDetails: {
    sellerSatisfaction: { type: String, enum: ['Satisfied', 'Unsatisfied'] },
    buyerSatisfaction: { type: String, enum: ['Satisfied', 'Unsatisfied'] },
    sellerScore: [{ type: Number, min: 0, max: 100, required: true }],
    buyerScore: [{ type: Number, min: 0, max: 100, required: true }],
    state: { type: String, enum: ['OPEN', 'CLOSED', 'SUCCESSFUL'], default: 'OPEN' },
    turn: { type: String, enum: ['seller', 'buyer'] },
    alertSent: { type: Boolean, default: false }
  }
});

module.exports = mongoose.model('Negotiation', negotiationSchema);