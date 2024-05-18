import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import ProductCard from './ProductCard';
import AddProductDialog from './AddProductDialog';

const Seller = () => {
  const [products, setProducts] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    // Fetch seller's catalogue from the backend
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/catalogue');
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Seller
        </Typography>
        <Typography variant="body1" gutterBottom>
          Here you can manage your product catalogue.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Add Product
        </Button>
        <Grid container spacing={2} mt={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <AddProductDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
      />
    </Container>
  );
};

export default Seller;