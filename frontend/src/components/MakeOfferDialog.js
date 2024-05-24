import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';

const MakeOfferDialog = ({ open, onClose, product }) => {
  const [offer, setOffer] = useState({
    price: product ? product.price : '',
    quantity: product ? product.quantity : '',
    warranty: product ? product.warranty : '',
    discount: product ? product.discount : '',
    financing: '',
    settlementCycle: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer((prevOffer) => ({ ...prevOffer, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Create negotiation with seller's initial values
      const negotiationBody = {
        buyer: {
          _id: '664a3c452fbec0db56b08beb' // Replace with actual buyer ID
        },
        seller: {
          _id: '65c4e9d4ce6db7b70738c228' // Replace with actual seller ID
        },
        productDetails: {
          productName: product.productName,
          productDescription: product.productDescription,
          productCategory: product.productCategory,
          quantity: [{ value: product.quantity, who: 'seller', timestamp: new Date() }],
          priceHistory: [{ value: product.price, who: 'seller', timestamp: new Date() }],
          warranty: [{ value: product.warranty, who: 'seller', timestamp: new Date() }],
          discount: [{ value: product.discount, who: 'seller', timestamp: new Date() }],
        },
        negotiationDetails: {
          sellerSatisfaction: 'Satisfied',
          buyerSatisfaction:'Unsatisfied',
          sellerScore: [0],
          buyerScore: [0],
          state: 'OPEN',
          turn: 'seller'
        }
      };
  
      const response = await fetch('http://localhost:4000/api/negotiation/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(negotiationBody)
      });
  
      if (!response.ok) {
        console.error('Failed to create negotiation');
        return;
      }
  
      const responseData = await response.json();
      const negotiationId = responseData._id; // Extract the negotiation ID from the response
  
      // Now patch the negotiation with the buyer's offer details
      const patchResponse = await fetch(`http://localhost:4000/api/negotiation/${negotiationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyer: {
            _id: '664a3c452fbec0db56b08beb' // Replace with actual buyer ID
          },
          seller: {
            _id: '65c4e9d4ce6db7b70738c228' // Replace with actual seller ID
          },
          productDetails: {
            productName: product.productName,
            productDescription: product.productDescription,
            productCategory: product.productCategory,
            priceHistory: [{ value: offer.price, who: 'buyer', timestamp: new Date() }], // Add timestamp here
            quantity: [{ value: offer.quantity, who: 'buyer', timestamp: new Date() }], // Add timestamp here
            warranty: [{ value: offer.warranty, who: 'buyer', timestamp: new Date() }], // Add timestamp here
            discount: [{ value: offer.discount, who: 'buyer', timestamp: new Date() }], // Add timestamp here
          },
          negotiationDetails: {
            buyerSatisfaction: 'Satisfied',
            buyerScore: [0],
            state: 'OPEN',
            turn: 'buyer'
          }
        }),
      });
  
      if (patchResponse.ok) {
        onClose();
      } else {
        console.log('Failed to update negotiation with offer details');
        console.error('Failed to update negotiation with offer details');
      }
    } catch (error) {
        console.log("DAMN");
      console.error('Error submitting offer:', error);
    }
  };
  
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Make an Offer</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{product && product.productName}</Typography>
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          name="price"
          value={offer.price}
          placeholder={product ? product.price : ''}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Quantity"
          type="number"
          fullWidth
          name="quantity"
          value={offer.quantity}
          placeholder={product ? product.quantity : ''}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Warranty"
          type="text"
          fullWidth
          name="warranty"
          value={offer.warranty}
          placeholder={product ? product.warranty : ''}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Discount"
          type="number"
          fullWidth
          name="discount"
          value={offer.discount}
          placeholder={product ? product.discount : ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Financing"
          type="text"
          fullWidth
          name="financing"
          value={offer.financing}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Settlement Cycle"
          type="number"
          fullWidth
          name="settlementCycle"
          value={offer.settlementCycle}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit Offer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MakeOfferDialog;
