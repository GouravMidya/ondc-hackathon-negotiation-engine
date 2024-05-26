import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { API_URL } from '../utils/apiConfig';

const MakeOfferDialog = ({ open, onClose, product }) => {
  const [offer, setOffer] = useState({
    price: '',
    quantity: '',
    warranty: '',
    settlementWindow: '',
    // Buyer's weightage and score impact
    buyerWeightage: {
      price: '',
      quantity: '',
      settlementWindow: '',
      warranty: ''
    },
    buyerScoreImpact: {
      price: '',
      quantity: '',
      settlementWindow: '',
      warranty: ''
    }
  });

  useEffect(() => {
    if (product) {
      setOffer({
        price: product.price || '',
        quantity: product.quantity || '',
        warranty: product.warranty || '',
        settlementWindow: product.settlementWindow || '',
        buyerWeightage: {
          price: '',
          quantity: '',
          settlementWindow: '',
          warranty: ''
        },
        buyerScoreImpact: {
          price: '',
          quantity: '',
          settlementWindow: '',
          warranty: ''
        }
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [fieldName, subFieldName] = name.split('.'); // Split the name to get nested field name
    if (subFieldName) {
      setOffer((prevOffer) => ({
        ...prevOffer,
        [fieldName]: {
          ...prevOffer[fieldName],
          [subFieldName]: value
        }
      }));
    } else {
      setOffer((prevOffer) => ({ ...prevOffer, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Calculate sum of buyerWeightage
      const { buyerWeightage } = offer;
      const sum = Object.values(buyerWeightage).reduce((acc, curr) => acc + Number(curr), 0);

      // Check if sum is not 100
      if (sum !== 100) {
        alert('Sum of all weightage must be 100');
        return;
      }

      if (product) {
        // Create negotiation if product exists (seller's side)
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
            settlementWindow: [{ value: product.settlementWindow, who: 'seller', timestamp: new Date() }], // Example for settlementWindow
            buyerWeightage: {
              price: offer.buyerWeightage.price,
              quantity: offer.buyerWeightage.quantity,
              settlementWindow: offer.buyerWeightage.settlementWindow,
              warranty: offer.buyerWeightage.warranty
            },
            buyerScoreImpact: {
              price: offer.buyerScoreImpact.price,
              quantity: offer.buyerScoreImpact.quantity,
              settlementWindow: offer.buyerScoreImpact.settlementWindow,
              warranty: offer.buyerScoreImpact.warranty
            },
            sellerWeightage: {
              price: product.weightage.price,
              quantity: product.weightage.quantity,
              settlementWindow: product.weightage.settlementWindow,
              warranty: product.weightage.warranty
            },
            sellerScoreImpact: {
              price: product.scoreImpact.price,
              quantity: product.scoreImpact.quantity,
              settlementWindow: product.scoreImpact.settlementWindow,
              warranty: product.scoreImpact.warranty
            }
          },
          negotiationDetails: {
            sellerSatisfaction: 'Satisfied',
            buyerSatisfaction: 'Unsatisfied',
            sellerScore: [0],
            buyerScore: [0],
            state: 'OPEN',
            turn: 'seller'
          }
        };

        // Create the negotiation
        const postResponse = await fetch(`${API_URL}/api/negotiation/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(negotiationBody)
        });

        if (!postResponse.ok) {
          console.error('Failed to create negotiation', postResponse);
          return;
        }

        const responseData = await postResponse.json();
        const negotiationId = responseData._id;

        // Update the negotiation with buyer's offer details
        const patchResponse = await fetch(`${API_URL}/api/negotiation/${negotiationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productDetails: {
              quantity: [{ value: offer.quantity, who: 'buyer', timestamp: new Date() }],
              priceHistory: [{ value: offer.price, who: 'buyer', timestamp: new Date() }],
              warranty: [{ value: offer.warranty, who: 'buyer', timestamp: new Date() }],
              settlementWindow: [{ value: offer.settlementWindow, who: 'buyer', timestamp: new Date() }], // Example for settlementWindow
              buyerWeightage: {
                price: offer.buyerWeightage.price,
                quantity: offer.buyerWeightage.quantity,
                settlementWindow: offer.buyerWeightage.settlementWindow,
                warranty: offer.buyerWeightage.warranty
              },
              buyerScoreImpact: {
                price: offer.buyerScoreImpact.price,
                quantity: offer.buyerScoreImpact.quantity,
                settlementWindow: offer.buyerScoreImpact.settlementWindow,
                warranty: offer.buyerScoreImpact.warranty
              }
            },
            negotiationDetails: {
              buyerSatisfaction: 'Satisfied',
              buyerScore: [100],
              sellerScore: [0],
              state: 'OPEN',
              turn: 'buyer'
            }
          }),
        });

        if (!patchResponse.ok) {
          console.error('Failed to update negotiation with buyer offer details', patchResponse);
          return;
        }

        // Alert and close the dialog after successful negotiation update
        alert('Offer successfully created');
        onClose();
      }
    } catch (error) {
      console.error('Error submitting offer:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Make an Offer</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{product && product.productName}</Typography>
        {/* Price */}
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          name="price"
          value={offer.price}
          placeholder={product ? String(product.price) : ''}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Price Weightage (Buyer)"
          type="number"
          fullWidth
          name="buyerWeightage.price"
          value={offer.buyerWeightage.price}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Price Score Impact (Buyer)"
          type="number"
          fullWidth
          name="buyerScoreImpact.price"
          value={offer.buyerScoreImpact.price}
          onChange={handleChange}
        />
        {/* Quantity */}
        <TextField
          margin="dense"
          label="Quantity"
          type="number"
          fullWidth
          name="quantity"
          value={offer.quantity}
          placeholder={product ? String(product.quantity) : ''}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Quantity Weightage (Buyer)"
          type="number"
          fullWidth
          name="buyerWeightage.quantity"
          value={offer.buyerWeightage.quantity}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Quantity Score Impact (Buyer)"
          type="number"
          fullWidth
          name="buyerScoreImpact.quantity"
          value={offer.buyerScoreImpact.quantity}
          onChange={handleChange}
        />
        {/* Warranty */}
        <TextField
          margin="dense"
          label="Warranty"
          type="text"
          fullWidth
          name="warranty"
          value={offer.warranty}
          placeholder={product ? String(product.warranty) : ''}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Warranty Weightage (Buyer)"
          type="number"
          fullWidth
          name="buyerWeightage.warranty"
          value={offer.buyerWeightage.warranty}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Warranty Score Impact (Buyer)"
          type="number"
          fullWidth
          name="buyerScoreImpact.warranty"
          value={offer.buyerScoreImpact.warranty}
          onChange={handleChange}
        />
        {/* settlementWindow */}
        <TextField
          margin="dense"
          label="Settlement Window (in Months)"
          type="number"
          fullWidth
          name="settlementWindow"
          value={offer.settlementWindow}
          placeholder={product ? String(product.settlementWindow) : ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Settlement Window Weightage (Buyer)"
          type="number"
          fullWidth
          name="buyerWeightage.settlementWindow"
          value={offer.buyerWeightage.settlementWindow}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Settlement Window Score Impact (Buyer)"
          type="number"
          fullWidth
          name="buyerScoreImpact.settlementWindow"
          value={offer.buyerScoreImpact.settlementWindow}
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
