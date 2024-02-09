//sensitive info hiding
require('dotenv').config()

const Negotiation = require('../model/negotiationModel')

const {
    sendSuccessEmail,
    checkNegotiationStatus
} = require('./embeddedIntelligenceController')


//import mongoose for id type validation purpose
const mongoose = require('mongoose')

// Import winston a logging library for error logging purposes
const winston = require('winston');

const {Buyer,buyerSchema} = require('../model/buyerSchema');
const {Seller,sellerSchema} = require('../model/sellerSchema');

//to validate incoming data and ensure no nosql injections are there
const negotiationValidationSchema = require('../model/negotiationValidationSchema');

//create negotiation
const createNegotiation = async (req,res) =>{
    
    //validate using joi that all data is correct
    const { error } = negotiationValidationSchema.validate(req.body);
    if (error) {
        winston.error(error); // Log the error details
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const { buyer, seller, ...negotiationData } = req.body;
    
        // Fetch buyer and seller details
        const buyerDetails = await Buyer.findById(buyer._id);
        const sellerDetails = await Seller.findById(seller._id);
    
        if (!buyerDetails || !sellerDetails) {
            return res.status(404).json({ error: "Buyer or Seller not found" });
        }
    
        // Create negotiation with fetched details
        const negotiation = new Negotiation({
            ...negotiationData,  // Spread the rest of the negotiation data
            buyer: buyerDetails,
            seller: sellerDetails,
        });
    
        await negotiation.save();
        res.status(201).json(negotiation);
    } catch (error) {
        winston.error(error); // Log the error details
        // Send a generic error message
        res.status(400).json({ error: "An error occurred while creating the negotiation." });
    }
}

var flag
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
        winston.error(error); // Log the error details
        // Send a generic error message
        res.status(500).json({ error: "An error occurred while fetching the negotiation." }) 
    }
};


//update negotiation
const updateNegotiation = async (req, res) => {
    //validate using joi that all data is correct
    const { error } = negotiationValidationSchema.validate(req.body);
    if (error) {
        winston.error(error); // Log the error details
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Invalid ID" });
        }

        const negotiation = await Negotiation.findById(id);

        if (!negotiation) {
            return res.status(404).json({ error: "No such negotiation" });
        }

        if (negotiation.negotiationDetails.state === "CLOSED" || negotiation.negotiationDetails.state === "SUCCESSFUL" ) {
            return res.status(400).json({ error: "Negotiation is already closed and cannot be updated." });
        }

        // Extract the allowed parameters from the request body
        const allowedUpdates = req.body.productDetails ? Object.keys(req.body.productDetails) : [];
        // Check if all update parameters are allowed
        const isValidOperation = allowedUpdates.every((update) => Object.keys(negotiation.productDetails).includes(update));
        if (!isValidOperation) {
            return res.status(400).json({ error: "Invalid updates!" });
        }

        // Extract the user from the 'who' field of the negotiation parameters
        const currentUser = req.body.negotiationDetails.turn;

        // Check if the user making the request is allowed to update negotiations based on the turn
        if (currentUser && currentUser !== negotiation.negotiationDetails.turn) {
            // Update negotiation parameters
            allowedUpdates.forEach((update) => {
                if (Array.isArray(req.body.productDetails[update])) {
                    negotiation.productDetails[update].push(...req.body.productDetails[update]);
                }
            });

            // Update buyer and seller scores
            if(req.body.negotiationDetails.buyerScore)
                negotiation.negotiationDetails.buyerScore.push(...req.body.negotiationDetails.buyerScore);
            if(req.body.negotiationDetails.sellerScore)
                negotiation.negotiationDetails.sellerScore.push(...req.body.negotiationDetails.sellerScore);

            if(req.body.negotiationDetails.sellerSatisfaction=="Satisfied"){
                negotiation.negotiationDetails.sellerSatisfaction = "Satisfied";
                await negotiation.save();
            }
            
            if(req.body.negotiationDetails.buyerSatisfaction=="Satisfied"){
                negotiation.negotiationDetails.buyerSatisfaction = "Satisfied";
                await negotiation.save();
            }
            // Switch turn between seller and buyer
            negotiation.negotiationDetails.turn = currentUser;
            //if both satisfied , change the state to closed and send all negotiation details to both the parties to their email
            if(negotiation.negotiationDetails.buyerSatisfaction=="Satisfied" && negotiation.negotiationDetails.sellerSatisfaction=="Satisfied" && allowedUpdates.length == 0){
                negotiation.negotiationDetails.state="SUCCESSFUL";
                await negotiation.save();
                await sendSuccessEmail(negotiation);
                flag=0
            }
            else if(negotiation.negotiationDetails.buyerSatisfaction=="Satisfied" && allowedUpdates.length >0 && flag==1){
                console.log("1")
                negotiation.negotiationDetails.sellerSatisfaction="Unsatisfied";
                flag=0;
                await negotiation.save();
            }
            else if(negotiation.negotiationDetails.sellerSatisfaction=="Satisfied" && allowedUpdates.length >0 &&flag==1){
                console.log("2")
                negotiation.negotiationDetails.buyerSatisfaction="Unsatisfied";
                flag=0;
                await negotiation.save();
            }
            else if(negotiation.negotiationDetails.sellerSatisfaction=="Satisfied" && flag==0){
                console.log("3")
                flag=1;
                negotiation.negotiationDetails.buyerSatisfaction="Unsatisfied";
                await negotiation.save();
            }
            else if(negotiation.negotiationDetails.buyerSatisfaction=="Satisfied" && flag==0){
                console.log("4")
                flag=1;
                negotiation.negotiationDetails.sellerSatisfaction="Unsatisfied";
                await negotiation.save();
            }
            else{
                flag=0;
            }

            // Check if the negotiation is going in a stale condition or not
            if (negotiation.negotiationDetails.buyerScore.length % 5 === 0 && negotiation.negotiationDetails.sellerScore.length % 5 === 0) {
                await checkNegotiationStatus(negotiation);
            }

            await negotiation.save();

            res.status(200).json(negotiation);
        } else {
            return res.status(403).json({ error: "User is not allowed to update negotiations at this turn." });
        }
    } catch (error) {
        winston.error(error); // Log the error details
        // Send a generic error message
        res.status(400).json({ error: "An error occurred while updating the negotiation." });
    }
};


//delete negotiation
const deleteNegotiation = async (req,res) =>{
    try{
        const { id } = req.params
    
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error:"Invalid ID"})
        }

        const negotiation = await Negotiation.findOneAndDelete({_id: id})

        if(!negotiation){
            return res.status(404).json({error:"No such Negotiation"})
        }

        res.status(200).json(negotiation)
    }catch (error) {
        winston.error(error); // Log the error details
        // Send a generic error message
        res.status(400).json({ error: "An error occurred while deleting the negotiation." }) 
    }
}

//fetch all negotiations
//ONLY FOR DEV PURPOSE , TO BE REMOVED AFTER PRODUCTION
const getAllNegotiations = async (req, res) => {
    try {
        const negotiations = await Negotiation.find({});

        if (!negotiations) {
            return res.status(404).json({ error: "No negotiations found" });
        }

        res.status(200).json(negotiations);
    } catch (error) {
        winston.error(error); // Log the error details
        // Send a generic error message
        res.status(500).json({ error: "An error occurred while fetching the negotiations." }) 
    }
};







module.exports = {
    createNegotiation,
    getNegotiation,
    updateNegotiation,
    deleteNegotiation,
    getAllNegotiations
}