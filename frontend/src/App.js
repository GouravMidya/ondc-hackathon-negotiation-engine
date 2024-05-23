import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Buyer from './components/Buyer';
import Seller from './components/Seller';
import NegotiationDetailsPage from './components/NegotiationDetailsPage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buyer" element={<Buyer />} />
        <Route path="/seller/products" element={<Seller />} />
        <Route path="/seller/current-negotiations" element={<Seller />} />
        <Route path="/seller/negotiation-history" element={<Seller />} />
        <Route path="/seller/negotiation-details" element={<NegotiationDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;