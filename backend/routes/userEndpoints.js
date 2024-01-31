const express = require('express');
const { createBuyer,
    getBuyer,
    updateBuyer,
    deleteBuyer,
    createSeller,
    getSeller,
    updateSeller,
    deleteSeller
} = require('../controllers/userController');


const router = express.Router();

// Buyer Endpoints

// Create a new buyer
router.post('/buyer', createBuyer);

// Get a buyer by id
router.get('/buyer/:id', getBuyer);

// Update a buyer by id
router.patch('/buyer/:id', updateBuyer);

//Delete a buyer by id
router.delete('/buyer/:id', deleteBuyer);

// Seller Endpoints
// Create a new seller
router.post('/seller', createSeller);

// Get a seller by id
router.get('/seller/:id', getSeller);

// Update a seller by id
router.patch('/seller/:id', updateSeller);

// Delete a seller by id
router.delete('/seller/:id', deleteSeller);

module.exports = router;


