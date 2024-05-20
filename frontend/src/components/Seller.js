import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import ProductCard from './ProductCardSeller';
import AddProductDialog from './AddProductDialog';
import EditProductDialog from './EditProductDialog';
import NegotiationCard from './NegotiationCardSeller';

const Seller = () => {
  const [products, setProducts] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentNegotiations, setCurrentNegotiations] = useState([]);
  const [negotiationHistory, setNegotiationHistory] = useState([]);

  useEffect(() => {
    // Fetch seller's catalogue from the backend
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

  const handleAddProduct = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/catalogue/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted product from the state
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      } else {
        console.error('Failed to delete product');
      }
    } catch (err) {
      console.error(err);
    }
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
              <ProductCard
                product={product}
                handleEditProduct={handleEditProduct}
                handleDeleteProduct={handleDeleteProduct}
              />
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
      <AddProductDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
      />
      <EditProductDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        product={selectedProduct}
      />
    </Container>
  );
};

export default Seller;
