const express = require('express')
const {createNegotiation, 
getNegotiation} = require('../controllers/negotiationController')


const router = express.Router()

//create negotiation
router.post('/',createNegotiation);

//fetch negotiation
router.get('/:id', getNegotiation);

//update negotiation
router.patch('/:id', getNegotiation);

//delete negotiation
router.delete('/:id', getNegotiation);


module.exports = router