import React, { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import NegotiationDetailsChart from './NegotiationDetailsChart';
import CounterOfferDialog from './CounterOfferDialogSeller';
import { useLocation } from 'react-router-dom';

const NegotiationDetailsPage = () => {
  const location = useLocation();
  const negotiation = location.state?.negotiation;

  const [isCounterOfferDialogOpen, setCounterOfferDialogOpen] = useState(false);

  const handleCounterOffer = () => {
    setCounterOfferDialogOpen(true);
  };

  const handleCloseCounterOfferDialog = () => {
    setCounterOfferDialogOpen(false);
  };

  const handleAcceptDeal = () => {
    // Logic for accepting the deal goes here
    console.log('Deal acceptance functionality will be implemented here.');
  };

  return negotiation ? (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Negotiation Details
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Product: {negotiation.productDetails.productName}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Description: {negotiation.productDetails.productDescription}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Category: {negotiation.productDetails.productCategory}
      </Typography>
      {/* Add more fields from negotiation.productDetails */}
      <NegotiationDetailsChart negotiation={negotiation} />
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleCounterOffer}>
          Counter Offer
        </Button>
        <Button variant="contained" color="secondary" onClick={handleAcceptDeal} style={{ marginLeft: '1rem' }}>
          Accept Deal
        </Button>
      </Box>

      <CounterOfferDialog
        open={isCounterOfferDialogOpen}
        onClose={handleCloseCounterOfferDialog}
        negotiation={negotiation}
      />
    </Box>
  ) : (
    <div>Loading...</div>
  );
};

export default NegotiationDetailsPage;
