import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { API_URL } from '../utils/apiConfig';

const EditProductDialog = ({ open, onClose, product }) => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [warranty, setWarranty] = useState('');
  const [settlementWindow, setsettlementWindow] = useState('');

  useEffect(() => {
    if (product) {
      setProductName(product.productName || '');
      setProductDescription(product.productDescription || '');
      setProductCategory(product.productCategory || '');
      setPrice(product.price || '');
      setQuantity(product.quantity || '');
      setWarranty(product.warranty || '');
      setsettlementWindow(product.settlementWindow || '');
    }
  }, [product]);

  const handleEditProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/api/catalogue/${product._id}`, {
        method: 'PUT',
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
          settlementWindow,
        }),
      });

      if (response.ok) {
        onClose(); // Close the dialog after successfully editing the product
        alert('Updated Product');
        window.location.reload();
      } else {
        console.error('Failed to edit product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        {product ? (
          <>
            <TextField
              autoFocus
              margin="dense"
              label="Product Name"
              type="text"
              fullWidth
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder={product.productName || ''}
              required
            />
            <TextField
              margin="dense"
              label="Product Description"
              type="text"
              fullWidth
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder={product.productDescription || ''}
              required
            />
            <TextField
              margin="dense"
              label="Product Category"
              type="text"
              fullWidth
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              placeholder={product.productCategory || ''}
              required
            />
            <TextField
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={product.price || ''}
              required
            />
            <TextField
              margin="dense"
              label="Quantity"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={product.quantity || ''}
              required
            />
            <TextField
              margin="dense"
              label="Warranty"
              type="text"
              fullWidth
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              placeholder={product.warranty || ''}
              required
            />
            <TextField
              margin="dense"
              label="settlementWindow"
              type="number"
              fullWidth
              value={settlementWindow}
              onChange={(e) => setsettlementWindow(e.target.value)}
              placeholder={product.settlementWindow || ''}
              required
            />
            {/* Other fields */}
          </>
        ) : (
          <p>No product data available</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleEditProduct}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
