const express = require('express')

const rateLimit = require("express-rate-limit");

// Create a rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const {createNegotiation, 
getNegotiation,
updateNegotiation,
deleteNegotiation,
getAllNegotiations
} = require('../controllers/negotiationController')


const router = express.Router()

//create negotiation
router.post('/', limiter, createNegotiation);

//fetch negotiation
router.get('/:id', limiter , getNegotiation);

//fetch all negotiations
router.get('/', limiter , getAllNegotiations);

//update negotiation
router.patch('/:id', limiter , updateNegotiation);

//delete negotiation
router.delete('/:id', limiter , deleteNegotiation);


module.exports = router