import React from 'react';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';

const ProductCard = ({ product }) => {
  const handleEditProduct = () => {
    // Implement edit product functionality
  };

  const handleDeleteProduct = () => {
    // Implement delete product functionality
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {product.productName}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {product.productDescription}
        </Typography>
        <Typography variant="body1" component="p">
          Category: {product.productCategory}
        </Typography>
        <Typography variant="body1" component="p">
          Price: ${product.price}
        </Typography>
        <Typography variant="body1" component="p">
          Quantity: {product.quantity}
        </Typography>
        {product.warranty && (
          <Typography variant="body1" component="p">
            Warranty: {product.warranty}
          </Typography>
        )}
        {product.discount && (
          <Typography variant="body1" component="p">
            Discount: {product.discount}%
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleEditProduct}>
          Edit
        </Button>
        <Button size="small" color="secondary" onClick={handleDeleteProduct}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;