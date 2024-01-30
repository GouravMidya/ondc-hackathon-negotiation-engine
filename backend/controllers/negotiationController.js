const Negotiation = require('../model/negotiationModel')
const mongoose = require('mongoose')

//create negotiation
const createNegotiation = async (req,res) =>{
    try{
        const negotiation = new Negotiation(req.body);
        await negotiation.save();
        res.status(201).json(negotiation)
    }catch(error){
        res.status(400).json(error)
    }
}

//fetch negotiation

//update negotiation

//delete negotiation


module.exports = {createNegotiation
}