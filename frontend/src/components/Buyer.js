import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import ProductCard from './ProductCardBuyer';
import MakeOfferDialog from './MakeOfferDialog'; // Import the new dialog component

const Buyer = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openOfferDialog, setOpenOfferDialog] = useState(false);

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
