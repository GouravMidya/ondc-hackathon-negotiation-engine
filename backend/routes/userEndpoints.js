const express = require('express');
const { createBuyer,
    getBuyer,
    updateBuyer,
    deleteBuyer
} = require('../controllers/userController');


const router = express.Router();

// Buyer Endpoints

// Create a new buyer
router.post('/buyer', createBuyer);

// Get a buyer by id
router.get('/buyer/:id', getBuyer);

// Update a buyer by id
router.put('/buyer/:id', updateBuyer);

//Delete a buyer by id
router.delete('/buyer/:id', deleteBuyer);

// Seller Endpoints
router.post('/seller', async (req, res) => {
    // Create a new seller
});

router.get('/seller/:id', async (req, res) => {
    // Get a seller by id
});

router.put('/seller/:id', async (req, res) => {
    // Update a seller by id
});

router.delete('/seller/:id', async (req, res) => {
    // Delete a seller by id
});

module.exports = router;


