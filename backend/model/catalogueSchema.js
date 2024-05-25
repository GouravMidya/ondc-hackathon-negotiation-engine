const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const catalogueSchema = new Schema({
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    productCategory: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    warranty: {
        type: String
    },
    settlementWindow: {
        type: Number
    },
    weightage: {
        type: weightageSchema,
        required: true
    },
    scoreImpact: {
        type: scoreImpactSchema,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Catalogue = mongoose.model('Catalogue', catalogueSchema);
module.exports = Catalogue;
