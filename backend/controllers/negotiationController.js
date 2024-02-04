const Negotiation = require('../model/negotiationModel')
const mongoose = require('mongoose')

const {Buyer,buyerSchema} = require('../model/buyerSchema');
const {Seller,sellerSchema} = require('../model/sellerSchema');

//create negotiation
const createNegotiation = async (req,res) =>{
    try{
        const { buyerId, sellerId } = req.body;

        // Fetch buyer and seller details
        const buyer = await Buyer.findById(buyerId);
        const seller = await Seller.findById(sellerId);

        if (!buyer || !seller) {
            return res.status(404).json({ error: "Buyer or Seller not found" });
        }

        // Create negotiation with fetched details
        const negotiation = new Negotiation({
            ...req.body,
            buyer: buyer,
            seller: seller
        });

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

            //check if the negotiation is going in stale condition or not
            if (negotiation.negotiationDetails.buyerScore.length % 10 === 0 && negotiation.negotiationDetails.sellerScore.length % 10 === 0) {
                await checkNegotiationStatus(negotiation);
            }

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

//fetch all negotiations
const getAllNegotiations = async (req, res) => {
    try {
        const negotiations = await Negotiation.find({});

        if (!negotiations) {
            return res.status(404).json({ error: "No negotiations found" });
        }

        res.status(200).json(negotiations);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const checkNegotiationStatus = async (negotiation) => {
    const buyerScore = negotiation.negotiationDetails.buyerScore;
    const sellerScore = negotiation.negotiationDetails.sellerScore;

    // Calculate the percent change over the last 10 updates
    const buyerPercentChange = (buyerScore[buyerScore.length - 1] - buyerScore[buyerScore.length - 11]) / buyerScore[buyerScore.length - 11] * 100;
    const sellerPercentChange = (sellerScore[sellerScore.length - 1] - sellerScore[sellerScore.length - 11]) / sellerScore[sellerScore.length - 11] * 100;

    // Check if scores are above 75 and percent change is close to 0
    if (buyerScore[buyerScore.length - 1] > 75 && sellerScore[sellerScore.length - 1] > 75 && Math.abs(buyerPercentChange) < 1 && Math.abs(sellerPercentChange) < 1) {
        // Send an alert to both buyer and seller to conclude negotiation soon
        console.log("Alert: Please conclude the negotiation soon, else it will be terminated.");
    } else if (buyerScore[buyerScore.length - 1] < 75 && sellerScore[sellerScore.length - 1] < 75) {
        // Check if scores have improved by 25% over the last 10 updates
        if (buyerPercentChange > 25 && sellerPercentChange > 25) {
            // Let the negotiation continue
            console.log("Negotiation can continue.");
        } else {
            // Change the state of negotiation to CLOSED
            negotiation.negotiationDetails.state = "CLOSED";
            await negotiation.save();
            console.log("Negotiation has been closed due to insufficient improvement in scores.");
        }
    }
};


module.exports = {
    createNegotiation,
    getNegotiation,
    updateNegotiation,
    deleteNegotiation,
    getAllNegotiations
}
