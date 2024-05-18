import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const NegotiationCard = ({ negotiation }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h3">
          Negotiation ID: {negotiation._id}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Buyer: {negotiation.buyer.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Product: {negotiation.productDetails.productName}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          State: {negotiation.negotiationDetails.state}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NegotiationCard;