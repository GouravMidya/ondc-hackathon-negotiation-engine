// CurrentNegotiationsTab.js
import React, { useState, useEffect } from 'react';
import { Grid, TextField } from '@mui/material';
import NegotiationCardSeller from './NegotiationCardSeller';
import { API_URL } from '../utils/apiConfig';

const CurrentNegotiationsTab = () => {
  const [currentNegotiations, setCurrentNegotiations] = useState([]);
  const [filteredNegotiations, setFilteredNegotiations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all negotiations from the backend
    const fetchNegotiations = async () => {
      try {
        const response = await fetch(`${API_URL}/api/negotiation`);
        const data = await response.json();

        // Filter negotiations based on state
        const current = data.filter(negotiation => negotiation.negotiationDetails.state === 'OPEN');

        setCurrentNegotiations(current);
        setFilteredNegotiations(current);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNegotiations();
  }, []);

  useEffect(() => {
    const filterNegotiations = () => {
      const filtered = currentNegotiations.filter(
        (negotiation) =>
          negotiation.productDetails.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNegotiations(filtered);
    };

    filterNegotiations();
  }, [searchTerm, currentNegotiations]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  
  const handleAcceptDeal = async (negotiationId) => {
    try {
      const response = await fetch(`${API_URL}/api/negotiation/${negotiationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          negotiationDetails: {
            sellerSatisfaction: 'Satisfied',
            turn: 'seller',
          },
        }),
      });

      if (response.ok) {
        // Handle success (optional)
        console.log('Negotiation updated successfully');
        // Optionally update UI or perform any other action upon successful update
      } else {
        // Handle error
        console.error('Failed to update negotiation');
      }
    } catch (error) {
      // Handle error
      console.error('Failed to update negotiation', error);
    }
  };

  return (
    <>
      <TextField
        label="Search Negotiations"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
      <Grid container spacing={2}>
        {filteredNegotiations.map((negotiation) => (
          <Grid item xs={12} sm={6} md={4} key={negotiation._id}>
            <NegotiationCardSeller negotiation={negotiation} handleAcceptDeal={handleAcceptDeal} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default CurrentNegotiationsTab;