// Import winston a logging library for error logging purposes
const winston = require('winston');

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
        winston.error(error);
        // Handle the error, you might want to send a response back to the client
    }
};


// Function to send alert to user when negotiation not progressing properly
const sendAlert = async(negotiation) =>{
    let mailOptions = {
        from: process.env.mail,
        to: `${negotiation.buyer.email}, ${negotiation.seller.email}`,
        subject: `Negotiation Alert for Negotiation ID: ${negotiation._id}`,
        text: 'Please conclude the negotiation soon, else it will be terminated.'
        // Quantity : ${negotiation.quantity}
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            winston.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    // Mark the alert as sent
    negotiation.negotiationDetails.alertSent = true;
    await negotiation.save();
}


//Function to terminate negotiation after alert is sent and no changes
const terminateNegotiation = async(negotiation) =>{
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
            winston.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    //mail
}


//Fetching last item:
const getLastItem = (list) => list?.slice(-1)[0] || 'N/A';


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
            sendAlert(negotiation)
        } 
        else {
            terminateNegotiation(negotiation)
        }

    } else if (buyerScore[buyerScore.length - 1] < 75 && sellerScore[sellerScore.length - 1] < 75) {
        // Check if scores have improved by 25% over the last 10 updates
        if (buyerPercentChange > 25 && sellerPercentChange > 25) {
            // Let the negotiation continue
            console.log("Negotiation can continue.");
        } else {
            if (!negotiation.negotiationDetails.alertSent) {
                // Send an alert to both buyer and seller to conclude negotiation soon
                sendAlert(negotiation)
            } 
            else {
                terminateNegotiation(negotiation)
            }
        }
    }
};




module.exports = {
    sendSuccessEmail,
    checkNegotiationStatus
}