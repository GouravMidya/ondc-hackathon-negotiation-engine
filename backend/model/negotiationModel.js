const mongoose = require('mongoose')

const Schema = mongoose.Schema

const negotiationSchema = new Schema({
    seller:{
        type:Number,
        required: true
    },
    buyer:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('Negotiation',negotiationSchema)