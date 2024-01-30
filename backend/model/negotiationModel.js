const mongoose = require('mongoose')

const Schema = mongoose.Schema
const sellerSchema = require('./sellerSchema.js');
const buyerSchema = require('./buyerSchema.js');

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
            value: String,
            required : true            
        },
        productDescription: {
            value: String,
            required : true            
        },
        productCategory: {
            value: String,
            required : true            
        },
        priceHistory: [{
            price: Number,
            timestamp: Date,
            required : true
        }],
        warranty: [{
            value: String,
            timestamp: Date
        }],
        discount: [{
            value: Number,
            timestamp: Date
        }],
        financing: [{
            value: String,
            timestamp: Date
        }],
        buyerFinderFee: [{
            value: Number,
            timestamp: Date
        }],
        commission: [{
            value: Number,
            timestamp: Date
        }],
        //in days
        settlementWindow: [{
            value: Number,
            timestamp: Date
        }],
        //in days
        settlementCycle: [{
            value: Number,
            timestamp: Date
        }],
        performanceStandard: [{
            value: String,
            timestamp: Date
        }],
        jurisdiction: [{
            value: String,
            timestamp: Date
        }],
        disputes: [{
            value: String,
            timestamp: Date
        }],
        liability: [{
            value: String,
            timestamp: Date
        }]
        
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
            enum: ['OPEN', 'CLOSED'],
            default: 'OPEN'
        }
    }
    
});


module.exports = mongoose.model('Negotiation',negotiationSchema)