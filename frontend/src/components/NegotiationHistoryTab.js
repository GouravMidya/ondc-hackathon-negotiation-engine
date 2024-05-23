// NegotiationHistoryTab.js
import React, { useState, useEffect } from 'react';
import { Grid, TextField } from '@mui/material';
import NegotiationCardSeller from './NegotiationCardSeller';

const NegotiationHistoryTab = () => {
  const [negotiationHistory, setNegotiationHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all negotiations from the backend
    const fetchNegotiations = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/negotiation');
        const data = await response.json();

        // Filter negotiations based on state
        const history = data.filter(negotiation =>
          negotiation.negotiationDetails.state === 'CLOSED' || negotiation.negotiationDetails.state === 'SUCCESSFUL'
        );

        setNegotiationHistory(history);
        setFilteredHistory(history);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNegotiations();
  }, []);

  useEffect(() => {
    const filterHistory = () => {
      const filtered = negotiationHistory.filter(
        (negotiation) =>
          negotiation.productDetails.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHistory(filtered);
    };

    filterHistory();
  }, [searchTerm, negotiationHistory]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <TextField
        label="Search Negotiation History"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
      <Grid container spacing={2}>
        {filteredHistory.map((negotiation) => (
          <Grid item xs={12} sm={6} md={4} key={negotiation._id}>
            <NegotiationCardSeller negotiation={negotiation} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default NegotiationHistoryTab;