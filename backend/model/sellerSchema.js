const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        city: String,
        country: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    productsSold: Number,
    activeSince: Date,
    email: String,
    contactNumber: String,
    reviews: [{
        buyerId: Schema.Types.ObjectId,
        review: String,
        rating: Number,
        date: Date
    }]
});

sellerSchema.virtual('sellerId').get(function() {
    return this._id;
});

module.exports = sellerSchema;
