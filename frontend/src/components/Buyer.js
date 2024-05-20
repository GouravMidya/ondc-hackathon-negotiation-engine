import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import ProductCard from './ProductCardBuyer';
import MakeOfferDialog from './MakeOfferDialog'; // Import the new dialog component
import NegotiationCard from './NegotiationCardBuyer'; // Import the negotiation card component

const Buyer = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openOfferDialog, setOpenOfferDialog] = useState(false);
  const [currentNegotiations, setCurrentNegotiations] = useState([]);
  const [negotiationHistory, setNegotiationHistory] = useState([]);

  useEffect(() => {
    // Fetch products for buyers from the backend
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/catalogue');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();

    // Fetch all negotiations from the backend
    const fetchNegotiations = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/negotiation');
        const data = await response.json();

        // Filter negotiations based on state
        const current = data.filter(negotiation => negotiation.negotiationDetails.state === 'OPEN');
        const history = data.filter(negotiation => 
          negotiation.negotiationDetails.state === 'CLOSED' || negotiation.negotiationDetails.state === 'SUCCESSFUL'
        );

        setCurrentNegotiations(current);
        setNegotiationHistory(history);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNegotiations();
  }, []);

  const handleMakeOffer = (product) => {
    setSelectedProduct(product);
    setOpenOfferDialog(true);
  };

  const handleCloseOfferDialog = () => {
    setOpenOfferDialog(false);
    setSelectedProduct(null);
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Buyer
        </Typography>
        <Typography variant="body1" gutterBottom>
          Here you can browse and buy products, negotiate prices, and more.
        </Typography>
        <Grid container spacing={2} mt={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <ProductCard product={product} isSeller={false} handleMakeOffer={handleMakeOffer} />
            </Grid>
          ))}
        </Grid>
        <Typography variant="h5" component="h2" gutterBottom mt={4}>
          Current Negotiations
        </Typography>
        <Grid container spacing={2}>
          {currentNegotiations.map((negotiation) => (
            <Grid item xs={12} sm={6} md={4} key={negotiation._id}>
              <NegotiationCard negotiation={negotiation} />
            </Grid>
          ))}
        </Grid>
        <Typography variant="h5" component="h2" gutterBottom mt={4}>
          Negotiation History
        </Typography>
        <Grid container spacing={2}>
          {negotiationHistory.map((negotiation) => (
            <Grid item xs={12} sm={6} md={4} key={negotiation._id}>
              <NegotiationCard negotiation={negotiation} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <MakeOfferDialog
        open={openOfferDialog}
        onClose={handleCloseOfferDialog}
        product={selectedProduct}
      />
    </Container>
  );
};

export default Buyer;
