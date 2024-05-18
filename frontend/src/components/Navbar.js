import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button component={Link} to="/" color="inherit">
          Home
        </Button>
        <Button component={Link} to="/buyer" color="inherit">
          Buyer
        </Button>
        <Button component={Link} to="/seller" color="inherit">
          Seller
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;