import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box, Collapse, Button, CardActions } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Link } from 'react-router-dom';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';

const NegotiationCardBuyer = ({ negotiation, handleAcceptDeal }) => {
  const [expanded, setExpanded] = useState(false);

  const lastValue = (field) => field[field.length - 1]?.value;
  const handleCopy = () => {
    // Logic to copy the negotiation ID to clipboard
    navigator.clipboard.writeText(negotiation._id);
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
         <Box display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h6" component="div" sx={{ fontSize: '15px', fontWeight: 'bold' }}>
            {negotiation._id}
          </Typography>
          <IconButton aria-label="copy" onClick={handleCopy} size="small">
            <FileCopyOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
          <Typography variant="body2" color="textSecondary">
            Seller: {negotiation.seller.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Product: {negotiation.productDetails.productName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Category: {negotiation.productDetails.productCategory}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Last Price: {lastValue(negotiation.productDetails.priceHistory)}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
              Turn: {negotiation.negotiationDetails.turn}
            </Typography>
            
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Typography variant="body2" color="textSecondary" component="p">
              Description: {negotiation.productDetails.productDescription}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Last Quantity: {lastValue(negotiation.productDetails.quantity)}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Last Warranty: {lastValue(negotiation.productDetails.warranty)}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Last settlementWindow: {lastValue(negotiation.productDetails.settlementWindow)}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              State: {negotiation.negotiationDetails.state}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Seller Score: {negotiation.negotiationDetails.sellerScore[negotiation.negotiationDetails.sellerScore.length - 1]}
            </Typography>
          </Collapse>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          component={Link}
          to={`/buyer/negotiation-details`}  // Make sure this path is correct based on your routing
          state={{ negotiation }}
        >
          View Details
        </Button>
        <IconButton
          size="small"
          onClick={handleExpandClick}
          aria-label={expanded ? 'show less' : 'show more'}
          sx={{ color: expanded ? 'primary.main' : 'inherit' }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default NegotiationCardBuyer;
