import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to the Negotiation Engine
        </Typography>
        <Typography variant="body1">
          Here you can buy and sell products, negotiate prices, and reach
          successful deals.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;