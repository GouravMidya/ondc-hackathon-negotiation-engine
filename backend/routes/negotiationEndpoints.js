const express = require('express')
const {createNegotiation, 
getNegotiation,
updateNegotiation,
deleteNegotiation,
getAllNegotiations
} = require('../controllers/negotiationController')


const router = express.Router()

//create negotiation
router.post('/',createNegotiation);

//fetch negotiation
router.get('/:id', getNegotiation);

//fetch all negotiations
router.get('/', getAllNegotiations);

//update negotiation
router.patch('/:id', updateNegotiation);

//delete negotiation
router.delete('/:id', deleteNegotiation);


module.exports = router