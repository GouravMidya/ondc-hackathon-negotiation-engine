import React, { useState, useEffect } from 'react';
import { Grid, TextField, Container } from '@mui/material';
import ProductCardBuyer from './ProductCardBuyer';
import MakeOfferDialog from './MakeOfferDialog'; // Import the new dialog component
import { API_URL } from '../utils/apiConfig';

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openOfferDialog, setOpenOfferDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Fetch seller's catalogue from the backend
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/catalogue`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const filterProducts = () => {
      const filtered = products.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.productCategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [searchTerm, products]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMakeOffer = (product) => {
    setSelectedProduct(product);
    setOpenOfferDialog(true);
  };

  const handleCloseOfferDialog = () => {
    setOpenOfferDialog(false);
    setSelectedProduct(null);
  };

  return (
    <Container>
      <TextField
        label="Search Products"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
      <Grid container spacing={2} mt={2}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <ProductCardBuyer product={product} handleMakeOffer={handleMakeOffer} />
          </Grid>
        ))}
      </Grid>
      <MakeOfferDialog
        open={openOfferDialog}
        onClose={handleCloseOfferDialog}
        product={selectedProduct}
      />
    </Container>
  );
};

export default ProductsTab;
