import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import ProductsTab from './ProductsTab';
import CurrentNegotiationsTab from './CurrentNegotiationsTab';
import NegotiationHistoryTab from './NegotiationHistoryTab';
import { useLocation } from 'react-router-dom';

const Seller = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/seller/products') {
      setSelectedTab(0);
    } else if (path === '/seller/current-negotiations') {
      setSelectedTab(1);
    } else if (path === '/seller/negotiation-history') {
      setSelectedTab(2);
    }
  }, [location.pathname]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Seller
        </Typography>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Products" />
          <Tab label="Current Negotiations" />
          <Tab label="Negotiation History" />
        </Tabs>
        {selectedTab === 0 && <ProductsTab />}
        {selectedTab === 1 && <CurrentNegotiationsTab />}
        {selectedTab === 2 && <NegotiationHistoryTab />}
      </Box>
    </Container>
  );
};

export default Seller;