import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import ProductsTab from './ProductsTabBuyer';
import CurrentNegotiationsTab from './CurrentNegotiationsTabBuyer';
import NegotiationHistoryTab from './NegotiationHistoryTab';
import { useLocation } from 'react-router-dom';

const Buyer = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/buyer/products') {
      setSelectedTab(0);
    } else if (path === '/buyer/current-negotiations') {
      setSelectedTab(1);
    } else if (path === '/buyer/negotiation-history') {
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
          Buyer
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

export default Buyer;
