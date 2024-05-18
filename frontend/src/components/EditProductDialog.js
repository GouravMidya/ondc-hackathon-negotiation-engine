import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const EditProductDialog = ({ open, onClose, product }) => {
  const [productName, setProductName] = useState(product?.productName || '');
  const [productDescription, setProductDescription] = useState(product?.productDescription || '');
  const [productCategory, setProductCategory] = useState(product?.productCategory || '');
  const [price, setPrice] = useState(product?.price || '');
  const [quantity, setQuantity] = useState(product?.quantity || '');
  const [warranty, setWarranty] = useState(product?.warranty || '');
  const [discount, setDiscount] = useState(product?.discount || '');

  const handleUpdateProduct = async () => {
    try {
      const updatedProduct = {
        productName,
        productDescription,
        productCategory,
        price,
        quantity,
        warranty,
        discount,
      };

      const response = await fetch(`http://localhost:4000/api/catalogue/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        // Product updated successfully
        onClose();
      } else {
        console.error('Failed to update product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Product</DialogTitle>
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
          <Button onClick={handleUpdateProduct}>Update</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default EditProductDialog;