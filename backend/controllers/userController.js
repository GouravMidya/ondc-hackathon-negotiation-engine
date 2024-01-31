const {Buyer,buyerSchema} = require('../model/buyerSchema')
const {Seller,sellerSchema} = require('../model/sellerSchema')

const mongoose = require('mongoose')

//Buyer methods

// Create a new buyer
const createBuyer = async (req,res) =>{
    try{
        const buyer = new Buyer(req.body)
        await buyer.save()
        res.status(201).json(buyer)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

// Get a buyer by id
const getBuyer = async (req,res) =>{
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid ID"})
    }

    const buyer = await Buyer.findById(id)

    if(!buyer){
        return res.status(404).json({error:"No such buyer"})
    }

    res.status(200).json(buyer)
}



module.exports = {
    createBuyer,
    getBuyer
}