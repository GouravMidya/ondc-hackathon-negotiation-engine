import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { API_URL } from '../utils/apiConfig';

const AddProductDialog = ({ open, onClose }) => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [settlementWindow, setsettlementWindow] = useState('');
  const [warranty, setWarranty] = useState('');

  // States for weightage and score impact
  const [priceWeightage, setPriceWeightage] = useState('');
  const [quantityWeightage, setQuantityWeightage] = useState('');
  const [settlementWindowWeightage, setsettlementWindowWeightage] = useState('');
  const [warrantyWeightage, setWarrantyWeightage] = useState('');
  const [priceScoreImpact, setPriceScoreImpact] = useState('');
  const [quantityScoreImpact, setQuantityScoreImpact] = useState('');
  const [settlementWindowScoreImpact, setsettlementWindowScoreImpact] = useState('');
  const [warrantyScoreImpact, setWarrantyScoreImpact] = useState('');

  const handleAddProduct = async () => {
    try {
      // Calculate sum of weightages
      const sumWeightage =
        Number(priceWeightage) +
        Number(quantityWeightage) +
        Number(settlementWindowWeightage) +
        Number(warrantyWeightage);
  
      // Check if sum of weightages is not 100
      if (sumWeightage !== 100) {
        alert('Sum of all weightage must be 100');
        return;
      }
  } catch (error) {
    console.error(error);
  };

    try {
      
      const response = await fetch(`${API_URL}/api/catalogue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId: "65c4e9d4ce6db7b70738c228",
          productName,
          productDescription,
          productCategory,
          price,
          quantity,
          settlementWindow,
          warranty,
          // Include weightage and score impact in the request body
          weightage: {
            price: priceWeightage,
            quantity: quantityWeightage,
            settlementWindow: settlementWindowWeightage,
            warranty: warrantyWeightage,
          },
          scoreImpact: {
            price: priceScoreImpact,
            quantity: quantityScoreImpact,
            settlementWindow: settlementWindowScoreImpact,
            warranty: warrantyScoreImpact,
          },
        }),
      });
  
      if (response.ok) {
        // Clear form fields and weightage/score impact fields
        setProductName('');
        setProductDescription('');
        setProductCategory('');
        setPrice('');
        setQuantity('');
        setsettlementWindow('');
        setWarranty('');
        setPriceWeightage('');
        setQuantityWeightage('');
        setsettlementWindowWeightage('');
        setWarrantyWeightage('');
        setPriceScoreImpact('');
        setQuantityScoreImpact('');
        setsettlementWindowScoreImpact('');
        setWarrantyScoreImpact('');
  
        // Close dialog
        onClose();
      } else {
        console.error('Failed to add product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="*Product Name"
          type="text"
          fullWidth
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="*Product Category"
          type="text"
          fullWidth
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
        />
        <TextField
          margin="dense"
          label="*Product Description"
          type="text"
          fullWidth
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="*Price"
          type="number"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Price Weightage"
          type="number"
          fullWidth
          value={priceWeightage}
          onChange={(e) => setPriceWeightage(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Price Score Impact"
          type="number"
          fullWidth
          value={priceScoreImpact}
          onChange={(e) => setPriceScoreImpact(e.target.value)}
        />
        <TextField
          margin="dense"
          label="*Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Quantity Weightage"
          type="number"
          fullWidth
          value={quantityWeightage}
          onChange={(e) => setQuantityWeightage(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Quantity Score Impact"
          type="number"
          fullWidth
          value={quantityScoreImpact}
          onChange={(e) => setQuantityScoreImpact(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Settlement Window (in Months)"
          type="number"
          fullWidth
          value={settlementWindow}
          onChange={(e) => setsettlementWindow(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Settlement Window Weightage"
          type="number"
          fullWidth
          value={settlementWindowWeightage}
          onChange={(e) => setsettlementWindowWeightage(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Settlement Window Score Impact"
          type="number"
          fullWidth
          value={settlementWindowScoreImpact}
          onChange={(e) => setsettlementWindowScoreImpact(e.target.value)}
        />
        <TextField
          margin="dense"
          label="*Warranty"
          type="number"
          fullWidth
          value={warranty}
          onChange={(e) => setWarranty(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Warranty Weightage"
          type="number"
          fullWidth
          value={warrantyWeightage}
          onChange={(e) => setWarrantyWeightage(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Warranty Score Impact"
          type="number"
          fullWidth
          value={warrantyScoreImpact}
          onChange={(e) => setWarrantyScoreImpact(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddProduct}>Add</Button>
</DialogActions>
</Dialog>
);
};

export default AddProductDialog;


