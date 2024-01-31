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


//Update a buyer by id
const updateBuyer = async (req,res) =>{
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid ID"})
    }

    const buyer = await Buyer.findOneAndUpdate({_id: id},
        {...req.body},
        { new: true }  // This option returns the updated document
    )

    if(!buyer){
        return res.status(404).json({error:"No such buyer"})
    }

    res.status(200).json(buyer)

}

// Delete a buyer by id
const deleteBuyer = async (req,res) =>{
    const { id } = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid ID"})
    }

    const buyer = await Buyer.findOneAndDelete({_id: id})

    if(!buyer){
        return res.status(404).json({error:"No such buyer"})
    }

    res.status(200).json(buyer)
}


//Seller Methods

// Create a new seller
const createSeller = async (req,res) =>{
    try{
        const seller = new Seller(req.body)
        await seller.save()
        res.status(201).json(seller)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

// Get a seller by id
const getSeller = async (req,res) =>{
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid ID"})
    }

    const seller = await Seller.findById(id)

    if(!seller){
        return res.status(404).json({error:"No such seller"})
    }

    res.status(200).json(seller)
}


// Update a seller by id
const updateSeller = async (req,res) =>{
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid ID"})
    }

    const seller = await Seller.findOneAndUpdate({_id: id},
        {...req.body},
        { new: true }  // This option returns the updated document
    )

    if(!seller){
        return res.status(404).json({error:"No such seller"})
    }

    res.status(200).json(seller)

}

// Delete a seller by id
const deleteSeller = async (req,res) =>{
    const { id } = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid ID"})
    }

    const seller = await Seller.findOneAndDelete({_id: id})

    if(!seller){
        return res.status(404).json({error:"No such seller"})
    }

    res.status(200).json(seller)
}

module.exports = {
    createBuyer,
    getBuyer,
    updateBuyer,
    deleteBuyer,
    createSeller,
    getSeller,
    updateSeller,
    deleteSeller
}