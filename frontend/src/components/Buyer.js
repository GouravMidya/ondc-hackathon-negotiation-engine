import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Buyer = () => {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Buyer
        </Typography>
        <Typography variant="body1">
          Here you can browse and buy products, negotiate prices, and more.
        </Typography>
        {/* Add your buyer-specific functionalities here */}
      </Box>
    </Container>
  );
};

export default Buyer;