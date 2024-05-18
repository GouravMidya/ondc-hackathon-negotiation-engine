const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  discount: {
    type: Number
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