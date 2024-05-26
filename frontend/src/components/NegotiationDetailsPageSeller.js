import React, { useState } from 'react';
import { Typography, Button, Box, Grid, Paper, Divider, List, ListItem, ListItemText, Chip, Collapse, IconButton } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CounterOfferDialog from './CounterOfferDialogSeller';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../utils/apiConfig';

const NegotiationDetailsPageSeller = () => {
  const location = useLocation();
  const negotiation = location.state?.negotiation;

  const [isCounterOfferDialogOpen, setCounterOfferDialogOpen] = useState(false);
  const [priceHistoryExpanded, setPriceHistoryExpanded] = useState(false);
  const [quantityExpanded, setQuantityExpanded] = useState(false);

  const togglePriceHistoryExpanded = () => {
    setPriceHistoryExpanded(!priceHistoryExpanded);
  };

  const toggleQuantityExpanded = () => {
    setQuantityExpanded(!quantityExpanded);
  };

  const isActionAllowed = () => {
    return (
      negotiation.negotiationDetails.state === 'OPEN' ||
      negotiation.negotiationDetails.state === 'PENDING'
    );
  };


  const handleAcceptDeal = async () => {
    if (isActionAllowed()) {
      const negotiationId = negotiation._id;

      try {
        const response = await fetch(`${API_URL}/api/negotiation/${negotiationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            negotiationDetails: {
              buyerSatisfaction: 'Satisfied',
              turn: 'seller',
            },
          }),
        });

        if (response.ok) {
          console.log('Negotiation updated successfully');
          alert('Negotiation Successful');
        } else {
          console.error('Failed to update negotiation');
        }
        if(response.status===403){
          alert("You have already made the latest offer");
        }
      } catch (error) {
        console.error('Failed to update negotiation', error);
      }
      
    } else {
      console.log('Accepting deal not allowed for this negotiation status.');
    }
    
  };

  const handleCloseCounterOfferDialog = () => {
    setCounterOfferDialogOpen(false);
  };

  const handleCounterOffer = () => {
    if (isActionAllowed()) {
      setCounterOfferDialogOpen(true);
    } else {
      console.log('Counter offer not allowed for this negotiation status.');
    }
  };

  const getLastEntry = (array) => array[array.length - 1];
  const getPreviousEntry = (array, index) => (index > 0 ? array[index - 1] : null);
  const getChangePercentage = (current, previous) =>
    previous ? ((current - previous) / previous) * 100 : 0;

  return negotiation ? (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Negotiation Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Information
            </Typography>
            <Typography gutterBottom>
              <strong>Name:</strong> {negotiation.productDetails.productName}
            </Typography>
            <Typography gutterBottom>
              <strong>Description:</strong> {negotiation.productDetails.productDescription}
            </Typography>
            <Typography gutterBottom>
              <strong>Category:</strong> {negotiation.productDetails.productCategory}
            </Typography>
            <Typography gutterBottom>
              <strong>Warranty:</strong> {getLastEntry(negotiation.productDetails.warranty)?.value}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Negotiation Status
            </Typography>
            <Typography gutterBottom>
              <strong>Seller Satisfaction:</strong> {negotiation.negotiationDetails.sellerSatisfaction}
            </Typography>
            <Typography gutterBottom>
              <strong>Buyer Satisfaction:</strong> {negotiation.negotiationDetails.buyerSatisfaction}
            </Typography>
            <Typography gutterBottom>
              <strong>State:</strong> {negotiation.negotiationDetails.state}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography gutterBottom>
                <strong>Turn:</strong>{' '}
              </Typography>
              <Chip
                label={negotiation.negotiationDetails.turn === 'seller' ? 'Buyer' : 'Seller'}
                color={negotiation.negotiationDetails.turn === 'seller' ? 'primary' : 'secondary'}
                size="small"
                sx={{ ml: 1 }}
              />
              <Typography gutterBottom sx={{ ml: 2 }}>
                <strong>Alert Sent:</strong> {negotiation.negotiationDetails.alertSent ? 'Yes' : 'No'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Price History
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary={`${getLastEntry(negotiation.productDetails.priceHistory)?.value} (Latest)`}
                  secondary={`By ${getLastEntry(negotiation.productDetails.priceHistory)?.who} at ${new Date(
                    getLastEntry(negotiation.productDetails.priceHistory)?.timestamp
                  ).toLocaleString()}`}
                />
                <IconButton onClick={togglePriceHistoryExpanded}>
                  {priceHistoryExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </ListItem>
              <Collapse in={priceHistoryExpanded} unmountOnExit>
                <List>
                  {negotiation.productDetails.priceHistory.map((entry, index) => {
                    const previousEntry = getPreviousEntry(negotiation.productDetails.priceHistory, index);
                    const changePercentage = getChangePercentage(entry.value, previousEntry?.value);
                    return (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${entry.value} (${changePercentage.toFixed(2)}%)`}
                          secondary={`By ${entry.who} at ${new Date(entry.timestamp).toLocaleString()}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quantity
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary={`${getLastEntry(negotiation.productDetails.quantity)?.value} (Latest)`}
                  secondary={`By ${getLastEntry(negotiation.productDetails.quantity)?.who} at ${new Date(
                    getLastEntry(negotiation.productDetails.quantity)?.timestamp
                  ).toLocaleString()}`}
                />
                <IconButton onClick={toggleQuantityExpanded}>
                  {quantityExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </ListItem>
              <Collapse in={quantityExpanded} unmountOnExit>
                <List>
                  {negotiation.productDetails.quantity.map((entry, index) => {
                    const previousEntry = getPreviousEntry(negotiation.productDetails.quantity, index);
                    const changePercentage = getChangePercentage(entry.value, previousEntry?.value);
                    return (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${entry.value} (${changePercentage.toFixed(2)}%)`}
                          secondary={`By ${entry.who} at ${new Date(entry.timestamp).toLocaleString()}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            </List>
          </Paper>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Seller Score
            </Typography>
            <List>
              {negotiation.negotiationDetails.sellerScore.map((score, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${score}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Buyer Score
            </Typography>
            <List>
              {negotiation.negotiationDetails.buyerScore.map((score, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${score}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCounterOffer}
          disabled={!isActionAllowed()} // Disable the button based on negotiation status
        >
          Counter Offer
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAcceptDeal}
          disabled={!isActionAllowed()} // Disable the button based on negotiation status
          style={{ marginLeft: '1rem', backgroundColor: !isActionAllowed() ? '#e0e0e0' : '' }} // Change background color to grey when disabled
        >
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

export default NegotiationDetailsPageSeller;
