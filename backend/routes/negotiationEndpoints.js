const express = require('express')
const {createNegotiation} = require('../controllers/negotiationController')
const router = express.Router()

//create negotiation
router.post('/',createNegotiation)
//fetch negotiation

//update negotiation

//delete negotiation

module.exports = router