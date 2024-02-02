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
const getNegotiation = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID" });
    }

    try {
        const negotiation = await Negotiation.findById(id);

        if (!negotiation) {
            return res.status(404).json({ error: "No such negotiation" });
        }

        res.status(200).json(negotiation);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


//update negotiation

//delete negotiation
const deleteNegotiation = async (req,res) =>{
    const { id } = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid ID"})
    }

    const negotiation = await Negotiation.findOneAndDelete({_id: id})

    if(!negotiation){
        return res.status(404).json({error:"No such Negotiation"})
    }

    res.status(200).json(negotiation)
}


module.exports = {createNegotiation,
    getNegotiation,
    deleteNegotiation
}