import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const CounterOfferDialog = ({ open, onClose, negotiation }) => {
  const [counterOffer, setCounterOffer] = useState({
    price: '',
    quantity: '',
    warranty: '',
    settlementWindow: '',
  });

  useEffect(() => {
    if (negotiation) {
      setCounterOffer({
        price: negotiation?.productDetails?.priceHistory?.slice(-1)[0]?.value || '',
        quantity: negotiation?.productDetails?.quantity?.slice(-1)[0]?.value || '',
        warranty: negotiation?.productDetails?.warranty?.slice(-1)[0]?.value || '',
        settlementWindow: negotiation?.productDetails?.settlementWindow?.slice(-1)[0]?.value || '',
      });
    }
  }, [negotiation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCounterOffer((prevCounterOffer) => ({ ...prevCounterOffer, [name]: value }));
  };

  const handleSubmit = async () => {
    const negotiationId = negotiation._id;
    const product = negotiation.productDetails;
    const offer = counterOffer;

    try {
      const response = await fetch(`http://localhost:4000/api/negotiation/${negotiationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productDetails: {
            productName: product.productName,
            productDescription: product.productDescription,
            productCategory: product.productCategory,
            priceHistory: [{ value: offer.price, who: 'seller', timestamp: new Date() }],
            quantity: [{ value: offer.quantity, who: 'seller', timestamp: new Date() }],
            warranty: [ { value: offer.warranty, who: 'seller', timestamp: new Date() }],
            settlementWindow: [{ value: offer.settlementWindow, who: 'seller', timestamp: new Date() }],
          },
          negotiationDetails: {
            sellerSatisfaction: 'Satisfied',
            sellerScore: [0],
            state: 'OPEN',
            turn: 'seller'
          }
        }),
      });

      if(response.status===403){
        alert("You have already made the latest offer");
      }

      if (response.ok) {
        console.log('Negotiation updated successfully');
        // Optionally update UI or perform any other action upon successful update
        onClose();
      } else {
        console.error('Failed to update negotiation');
      }
    } catch (error) {
      console.error('Failed to update negotiation', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Make a Counter Offer</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          name="price"
          value={counterOffer.price}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Quantity"
          type="number"
          fullWidth
          name="quantity"
          value={counterOffer.quantity}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Warranty"
          type="text"
          fullWidth
          name="warranty"
          value={counterOffer.warranty}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="settlementWindow"
          type="number"
          fullWidth
          name="settlementWindow"
          value={counterOffer.settlementWindow}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CounterOfferDialog;
