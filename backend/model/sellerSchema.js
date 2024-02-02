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
const Seller = mongoose.model('Seller',sellerSchema)
module.exports = {Seller,sellerSchema};
/* Seller Package should look like:
{
    "name": "ABC",
    "location" : {
        "city":"Mumbai",
        "country":"India"
    },
    "rating":5,
    "productsSold" : 5,
    activeSince: "2024-01-31",
    email: "abc@gmail.com",
    contactNumber: "9342112345",
}
*/