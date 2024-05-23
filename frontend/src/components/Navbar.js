import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button component={Link} to="/" color="inherit">
          Home
        </Button>
        <Button component={Link} to="/buyer" color="inherit">
          Buyer
        </Button>
        <Button
          color="inherit"
          aria-controls="seller-menu"
          aria-haspopup="true"
          onClick={handleOpenMenu}
        >
          Seller
        </Button>
        <Menu
          id="seller-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem component={Link} to="/seller/products" onClick={handleCloseMenu}>
            Products
          </MenuItem>
          <MenuItem component={Link} to="/seller/current-negotiations" onClick={handleCloseMenu}>
            Current Negotiations
          </MenuItem>
          <MenuItem component={Link} to="/seller/negotiation-history" onClick={handleCloseMenu}>
            Negotiation History
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;