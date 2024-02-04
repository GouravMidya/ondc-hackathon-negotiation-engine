const mongoose = require('mongoose')

const Schema = mongoose.Schema
const {Seller,sellerSchema} = require('./sellerSchema.js');
const {Buyer,buyerSchema} = require('./buyerSchema.js');

const numberSchema = new Schema({
    value: Number,
    who: { type: String, enum: ['seller', 'buyer'] },
    timestamp: { type: Date, default: Date.now }
  }, { _id: false });
  
const stringSchema = new Schema({
    value: String,
    who: { type: String, enum: ['seller', 'buyer'] },
    timestamp: { type: Date, default: Date.now }
  }, { _id: false });

const negotiationSchema = new Schema({
    seller: {
        type: sellerSchema,
        required: true
    },
    buyer: {
        type: buyerSchema,
        required: true
    },
    productDetails: {
        productName: {
            type: String,
            required : true            
        },
        productDescription: {
            type: String,
            required : true            
        },
        productCategory: {
            type: String,
            required : true            
        },
        priceHistory: {
            type: [numberSchema],
            required : true
        },
        warranty: [stringSchema],
        discount: [numberSchema],
        financing: [stringSchema],
        buyerFinderFee: [numberSchema],
        commission: [numberSchema],
        //in days
        settlementWindow: [numberSchema],
        //in days
        settlementCycle: [numberSchema],
        performanceStandard: [stringSchema],
        jurisdiction: [stringSchema],
        disputes: [stringSchema],
        liability: [stringSchema]
    },
    negotiationDetails: {
        sellerSatisfaction: {
            type : String,
            enum: ['Satisfied','Unsatisfied']
        },
        buyerSatisfaction: {
            type : String,
            enum: ['Satisfied','Unsatisfied']
        },
        sellerScore: [{
            type:Number,
            min:0,
            max:100,
            required:true
        }],
        buyerScore: [{
            type:Number,
            min:0,
            max:100,
            required:true
        }],
        state: {
            type: String,
            enum: ['OPEN', 'CLOSED','SUCCESSFUL'],
            default: 'OPEN'
        },
        turn: {
            type: String,
            enum: ['seller', 'buyer']
        },
        alertSent: { 
            type: Boolean, default: false 
        }
    }
    
});

module.exports = mongoose.model('Negotiation',negotiationSchema)
