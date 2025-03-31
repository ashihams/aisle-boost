import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import VendingMachine from './components/VendingMachine';
import Gallery from './components/Gallery';
import Manual from './components/Manual';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#1a1a1a' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<VendingMachine />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/manual" element={<Manual />} />
      </Routes>
    </Box>
  );
};

export default App; 