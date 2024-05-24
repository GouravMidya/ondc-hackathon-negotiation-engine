import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [buyerAnchorEl, setBuyerAnchorEl] = useState(null);
  const [sellerAnchorEl, setSellerAnchorEl] = useState(null);

  const handleOpenBuyerMenu = (event) => {
    setBuyerAnchorEl(event.currentTarget);
  };

  const handleCloseBuyerMenu = () => {
    setBuyerAnchorEl(null);
  };

  const handleOpenSellerMenu = (event) => {
    setSellerAnchorEl(event.currentTarget);
  };

  const handleCloseSellerMenu = () => {
    setSellerAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button component={Link} to="/" color="inherit">
          Home
        </Button>
      
        <Button
          color="inherit"
          aria-controls="buyer-menu"
          aria-haspopup="true"
          onClick={handleOpenBuyerMenu}
        >
          Buyer
        </Button>
        <Menu
          id="buyer-menu"
          anchorEl={buyerAnchorEl}
          open={Boolean(buyerAnchorEl)}
          onClose={handleCloseBuyerMenu}
        >
          <MenuItem component={Link} to="/buyer/products" onClick={handleCloseBuyerMenu}>
            Products
          </MenuItem>
          <MenuItem component={Link} to="/buyer/current-negotiations" onClick={handleCloseBuyerMenu}>
            Current Negotiations
          </MenuItem>
          <MenuItem component={Link} to="/buyer/negotiation-history" onClick={handleCloseBuyerMenu}>
            Negotiation History
          </MenuItem>
        </Menu>

        <Button
          color="inherit"
          aria-controls="seller-menu"
          aria-haspopup="true"
          onClick={handleOpenSellerMenu}
        >
          Seller
        </Button>
        <Menu
          id="seller-menu"
          anchorEl={sellerAnchorEl}
          open={Boolean(sellerAnchorEl)}
          onClose={handleCloseSellerMenu}
        >
          <MenuItem component={Link} to="/seller/products" onClick={handleCloseSellerMenu}>
            Products
          </MenuItem>
          <MenuItem component={Link} to="/seller/current-negotiations" onClick={handleCloseSellerMenu}>
            Current Negotiations
          </MenuItem>
          <MenuItem component={Link} to="/seller/negotiation-history" onClick={handleCloseSellerMenu}>
            Negotiation History
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;