import React from 'react';
import { Box, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        bgcolor: 'rgba(20, 20, 20, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        zIndex: 1000,
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.3)'
      }}
    >
      <MuiLink
        component={RouterLink}
        to="/"
        sx={{
          color: location.pathname === '/' ? '#0088ff' : '#00ffff',
          textDecoration: 'none',
          fontSize: '18px',
          fontWeight: 'bold',
          letterSpacing: '1px',
          transition: 'all 0.3s ease',
          textShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
          '&:hover': {
            color: '#0088ff',
            textShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
            textDecoration: 'none'
          }
        }}
      >
        HOME
      </MuiLink>
      <MuiLink
        component={RouterLink}
        to="/gallery"
        sx={{
          color: location.pathname === '/gallery' ? '#0088ff' : '#00ffff',
          textDecoration: 'none',
          fontSize: '18px',
          fontWeight: 'bold',
          letterSpacing: '1px',
          transition: 'all 0.3s ease',
          textShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
          '&:hover': {
            color: '#0088ff',
            textShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
            textDecoration: 'none'
          }
        }}
      >
        GALLERY
      </MuiLink>
      <MuiLink
        component={RouterLink}
        to="/manual"
        sx={{
          color: location.pathname === '/manual' ? '#0088ff' : '#00ffff',
          textDecoration: 'none',
          fontSize: '18px',
          fontWeight: 'bold',
          letterSpacing: '1px',
          transition: 'all 0.3s ease',
          textShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
          '&:hover': {
            color: '#0088ff',
            textShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
            textDecoration: 'none'
          }
        }}
      >
        HOW TO USE
      </MuiLink>
    </Box>
  );
};

export default Navbar; 