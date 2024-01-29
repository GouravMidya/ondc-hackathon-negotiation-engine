const express = require('express')
const Negotiation = require('../model/negotiationModel')

const router = express.Router()

//create negotiation
router.post('/', () =>{
    console.log("create a negotiation")
})
//fetch negotiation

//update negotiation

//delete negotiation

module.exports = router