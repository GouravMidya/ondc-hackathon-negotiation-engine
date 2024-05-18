import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const AddProductDialog = ({ open, onClose }) => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [warranty, setWarranty] = useState('');
  const [discount, setDiscount] = useState('');

  const handleAddProduct = async () => {
    try {
      const response = await fetch('/api/catalogue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          productDescription,
          productCategory,
          price,
          quantity,
          warranty,
          discount,
        }),
      });

      if (response.ok) {
        // Clear form fields
        setProductName('');
        setProductDescription('');
        setProductCategory('');
        setPrice('');
        setQuantity('');
        setWarranty('');
        setDiscount('');

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
          label="Product Name"
          type="text"
          fullWidth
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Product Description"
          type="text"
          fullWidth
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Product Category"
          type="text"
          fullWidth
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Warranty"
          type="text"
          fullWidth
          value={warranty}
          onChange={(e) => setWarranty(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Discount"
          type="number"
          fullWidth
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
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