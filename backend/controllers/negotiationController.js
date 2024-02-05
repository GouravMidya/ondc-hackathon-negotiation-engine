//sensitive info hiding
require('dotenv').config()

const Negotiation = require('../model/negotiationModel')

//mail service for sending mails after negotiation termination , success and failure
const nodemailer = require('nodemailer');

// Create a mail transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.mail,
        pass: process.env.pass
    }
});


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

        // Extract the allowed parameters from the request body
        const allowedUpdates = Object.keys(req.body.productDetails);

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
            if(req.body.negotiationDetails.sellerSatisfaction){
                negotiation.negotiationDetails.sellerSatisfaction = "Satisfied";
                await negotiation.save();
            }
            if(req.body.negotiationDetails.buyerSatisfaction){
                negotiation.negotiationDetails.buyerSatisfaction = "Satisfied";
                await negotiation.save();
            }
            // Switch turn between seller and buyer
            negotiation.negotiationDetails.turn = currentUser;

            //if both satisfied , change the state to closed and send all negotiation details to both the parties
            //add mail here
            if(negotiation.negotiationDetails.buyerSatisfaction=="Satisfied" && negotiation.negotiationDetails.sellerSatisfaction=="Satisfied"){
                negotiation.negotiationDetails.state="SUCCESSFUL";
                await negotiation.save();
                await sendSuccessEmail(negotiation);
                console.log("Negotiation has been closed since Both parties are satisfied.");
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

//Fetching last item:
const getLastItem = (list) => list?.slice(-1)[0] || 'N/A';

// Sending mail when Negotiation is successful
const sendSuccessEmail = async (negotiation) => {
    try {
        // Extract the last elements of the specified lists using the getLastItem function
        const lastPriceHistory = getLastItem(negotiation.productDetails?.priceHistory);
        const lastQuantity = getLastItem(negotiation.productDetails?.quantity);
        const lastWarranty = getLastItem(negotiation.productDetails?.warranty);
        const lastDiscount = getLastItem(negotiation.productDetails?.discount);
        const lastFinancing = getLastItem(negotiation.productDetails?.financing);
        const lastBuyerFinderFee = getLastItem(negotiation.productDetails?.buyerFinderFee);
        const lastCommission = getLastItem(negotiation.productDetails?.commission);
        const lastSettlementWindow = getLastItem(negotiation.productDetails?.settlementWindow);
        const lastSettlementCycle = getLastItem(negotiation.productDetails?.settlementCycle);
        const lastPerformanceStandard = getLastItem(negotiation.productDetails?.performanceStandard);
        const lastJurisdiction = getLastItem(negotiation.productDetails?.jurisdiction);
        const lastDisputes = getLastItem(negotiation.productDetails?.disputes);
        const lastLiability = getLastItem(negotiation.productDetails?.liability);

        // Include these values in the filteredProperties object
        const filteredProperties = {
            NegotiationID: negotiation._id || 'N/A',
            Buyer_Name: negotiation.buyer?.name || 'N/A',
            Buyer_Email: negotiation.buyer?.email || 'N/A',
            Seller_Name: negotiation.seller?.name || 'N/A',
            Seller_Email: negotiation.seller?.email || 'N/A',
            Product_Name: negotiation.productDetails?.productName || 'N/A',
            Product_Description: negotiation.productDetails?.productDescription || 'N/A',
            Product_Category: negotiation.productDetails?.productCategory || 'N/A',
            Price_History: lastPriceHistory.value,
            Quantity: lastQuantity.value,
            Warranty: lastWarranty.value,
            Discount: lastDiscount.value,
            Financing: lastFinancing,
            BuyerFinderFee: lastBuyerFinderFee,
            Commission: lastCommission,
            SettlementWindow: lastSettlementWindow,
            SettlementCycle: lastSettlementCycle,
            PerformanceStandard: lastPerformanceStandard,
            Jurisdiction: lastJurisdiction,
            Disputes: lastDisputes,
            Liability: lastLiability
        };

        // Include these values in the mailOptions
        const mailOptions = {
            from: process.env.mail,
            to: `${negotiation.buyer?.email}, ${negotiation.seller?.email}`,
            subject: `Negotiation Successful for Negotiation ID: ${negotiation._id}`,
            text: `Negotiation was Successful:\nNegotiation Details:\n` +
                `NegotiationID: ${filteredProperties.NegotiationID}\n` +
                `Buyer_Name: ${filteredProperties.Buyer_Name}\n` +
                `Buyer_Email: ${filteredProperties.Buyer_Email}\n` +
                `Seller_Name: ${filteredProperties.Seller_Name}\n` +
                `Seller_Email: ${filteredProperties.Seller_Email}\n` +
                `Product_Name: ${filteredProperties.Product_Name}\n` +
                `Product_Description: ${filteredProperties.Product_Description}\n` +
                `Product_Category: ${filteredProperties.Product_Category}\n` +
                `Price_History: ${filteredProperties.Price_History}\n` +
                `Quantity:${filteredProperties.Quantity}\n`+
                `Warranty: ${filteredProperties.Warranty}\n` +
                `Discount: ${filteredProperties.Discount}\n` +
                `Financing: ${filteredProperties.Financing}\n` +
                `BuyerFinderFee: ${filteredProperties.BuyerFinderFee}\n` +
                `Commission: ${filteredProperties.Commission}\n` +
                `SettlementWindow: ${filteredProperties.SettlementWindow}\n` +
                `SettlementCycle: ${filteredProperties.SettlementCycle}\n` +
                `PerformanceStandard: ${filteredProperties.PerformanceStandard}\n` +
                `Jurisdiction: ${filteredProperties.Jurisdiction}\n` +
                `Disputes: ${filteredProperties.Disputes}\n` +
                `Liability: ${filteredProperties.Liability}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Success Email sent:', info.response);
    } catch (error) {
        console.error('Error sending success email:', error);
        // Handle the error, you might want to send a response back to the client
    }
};


const checkNegotiationStatus = async (negotiation) => {
    const buyerScore = negotiation.negotiationDetails.buyerScore;
    const sellerScore = negotiation.negotiationDetails.sellerScore;

    // Ensure that there are at least 5 updates
    if (buyerScore.length < 5 || sellerScore.length < 5) {
        return;
    }

    // Calculate the percent change over the last 5 updates
    const buyerPercentChange = (buyerScore[buyerScore.length - 1] - buyerScore[buyerScore.length - 5]) / buyerScore[buyerScore.length - 5] * 100;
    
    const sellerPercentChange = (sellerScore[sellerScore.length - 1] - sellerScore[sellerScore.length - 5]) / sellerScore[sellerScore.length - 5] * 100;
    console.log(sellerPercentChange)
    // Check if scores are above 75 and percent change is close to 0
    if (buyerScore[buyerScore.length - 1] > 75 && sellerScore[sellerScore.length - 1] > 75 && Math.abs(buyerPercentChange) < 10 && Math.abs(sellerPercentChange) < 10) {
        // If the alert has not been sent yet, send it
        if (!negotiation.negotiationDetails.alertSent) {
            // Send an alert to both buyer and seller to conclude negotiation soon
            let mailOptions = {
                from: process.env.mail,
                to: `${negotiation.buyer.email}, ${negotiation.seller.email}`,
                subject: `Negotiation Alert for Negotiation ID: ${negotiation._id}`,
                text: 'Please conclude the negotiation soon, else it will be terminated.'
                // Quantity : ${negotiation.quantity}
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            // Mark the alert as sent
            negotiation.negotiationDetails.alertSent = true;
            await negotiation.save();
        } 
        else {
            // If the alert has been sent and there is still no change in score percentage, close the negotiation
            negotiation.negotiationDetails.state = "CLOSED";
            await negotiation.save();
            let mailOptions = {
                from: process.env.mail,
                to: `${negotiation.buyer.email}, ${negotiation.seller.email}`,
                subject: `Negotiation Alert for Negotiation ID: ${negotiation._id}`,
                text: 'Negotiation has been closed due to no change in score percentage.'
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            //mail
        }

    } else if (buyerScore[buyerScore.length - 1] < 75 && sellerScore[sellerScore.length - 1] < 75) {
        // Check if scores have improved by 25% over the last 10 updates
        if (buyerPercentChange > 25 && sellerPercentChange > 25) {
            // Let the negotiation continue
            console.log("Negotiation can continue.");
        } else {
            // Change the state of negotiation to CLOSED
            negotiation.negotiationDetails.state = "CLOSED";
            await negotiation.save();
            //mail
            let mailOptions = {
                from: process.env.mail,
                to: `${negotiation.buyer.email}, ${negotiation.seller.email}`,
                subject: `Negotiation Alert for Negotiation ID: ${negotiation._id}`,
                text: 'Negotiation has been closed due to no change in score percentage.'
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
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
