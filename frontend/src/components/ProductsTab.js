import React, { useState, useEffect } from 'react';
import { Grid, Button, TextField } from '@mui/material';
import ProductCardSeller from './ProductCardSeller';
import AddProductDialog from './AddProductDialog';
import EditProductDialog from './EditProductDialog';

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Fetch seller's catalogue from the backend
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/catalogue');
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
        setFilteredProducts((prevFilteredProducts) =>
          prevFilteredProducts.filter((product) => product._id !== productId)
        );
      } else {
        console.error('Failed to delete product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <TextField
        label="Search Products"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAddProduct}>
        Add Product
      </Button>
      <Grid container spacing={2} mt={2}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <ProductCardSeller
              product={product}
              handleEditProduct={handleEditProduct}
              handleDeleteProduct={handleDeleteProduct}
            />
          </Grid>
        ))}
      </Grid>
      <AddProductDialog open={openAddDialog} onClose={handleCloseAddDialog} />
      <EditProductDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        product={selectedProduct}
      />
    </>
  );
};

export default ProductsTab;