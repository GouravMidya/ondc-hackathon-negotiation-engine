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
const updateNegotiation = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Invalid ID" });
        }

        const negotiation = await Negotiation.findById(id);

        if (!negotiation) {
            return res.status(404).json({ error: "No such negotiation" });
        }

        // Extract the allowed parameters from the request body
        const allowedUpdates = ['priceHistory', 'warranty', 'discount', 'financing', 'buyerFinderFee', 'commission'];
        const updates = Object.keys(req.body);

        // Check if all update parameters are allowed
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).json({ error: "Invalid updates!" });
        }

        // Extract the user from the 'who' field of the negotiation parameters
        const currentUser = req.body[allowedUpdates[0]] ? req.body[allowedUpdates[0]][0].who : null;

        // Check if the user making the request is allowed to update negotiations based on the turn
        if (currentUser && currentUser !== negotiation.negotiationDetails.turn) {
            // Update negotiation parameters
            allowedUpdates.forEach((update) => {
                if (Array.isArray(req.body[update])) {
                    negotiation.productDetails[update] = negotiation.productDetails[update].concat(req.body[update]);
                }
            });

            // Switch turn between seller and buyer
            negotiation.negotiationDetails.turn = currentUser;

            await negotiation.save();

            res.status(200).json(negotiation);
        } else {
            return res.status(403).json({ error: "User is not allowed to update negotiations at this turn." });
        }
    } catch (error) {
        res.status(400).json(error);
    }
};



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
    updateNegotiation,
    deleteNegotiation
}