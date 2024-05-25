import React from 'react';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';

const ProductCard = ({ product, isSeller, handleEditProduct, handleDeleteProduct, handleMakeOffer }) => {
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
        {product.settlementWindow && (
          <Typography variant="body1" component="p">
            settlementWindow: {product.settlementWindow}%
          </Typography>
        )}
      </CardContent>
      <CardActions>
        {isSeller ? (
          <>
            <Button size="small" color="primary" onClick={() => handleEditProduct(product)}>
              Edit
            </Button>
            <Button size="small" color="secondary" onClick={() => handleDeleteProduct(product._id)}>
              Delete
            </Button>
          </>
        ) : (
          <Button size="small" color="primary" onClick={() => handleMakeOffer(product)}>
            Make an Offer
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;
