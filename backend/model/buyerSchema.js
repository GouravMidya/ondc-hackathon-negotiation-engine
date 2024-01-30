const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buyerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        city: String,
        country: String
    },
    totalPurchases: Number,
    preferredCategories: [String],
    joinedOn: Date,
    email: String,
    contactNumber: String,
    reviews: [{
        sellerId: Schema.Types.ObjectId,
        review: String,
        rating: Number,
        date: Date
    }]
});

buyerSchema.virtual('buyerId').get(function() {
    return this._id;
});

const Buyer = mongoose.model('Buyer',buyerSchema)

module.exports = {Buyer,buyerSchema};
