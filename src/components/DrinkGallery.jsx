import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';

const drinks = [
  { name: 'Celsius', price: 3.99, color: '#FF6B6B', subtitle: 'ESSENTIAL ENERGY' },
  { name: 'Red Bull', price: 4.49, color: '#1E3799', subtitle: 'ENERGY DRINK' },
  { name: 'C4', price: 3.99, color: '#FF4757', subtitle: 'SPORT SERIES' },
  { name: 'Ghost', price: 4.29, color: '#00D2D3', subtitle: 'SOUR PATCH BLUE RASP' },
  { name: 'Monster', price: 3.49, color: '#2D3436', subtitle: 'ENERGY' },
  { name: 'Rockstar', price: 3.29, color: '#FFC312', subtitle: 'ENERGY' },
  { name: 'Bang', price: 3.99, color: '#FF0099', subtitle: 'ENERGY DRINK' },
  { name: 'Reign', price: 3.99, color: '#6C5CE7', subtitle: 'TOTAL BODY FUEL' },
  { name: 'NOS', price: 3.49, color: '#0984E3', subtitle: 'HIGH PERFORMANCE' },
  { name: '5hour', price: 3.99, color: '#E84118', subtitle: 'ENERGY SHOT' },
  { name: 'Jocko', price: 4.99, color: '#2D3436', subtitle: 'DISCIPLINE EQUALS FREEDOM' },
  { name: 'Coke', price: 2.99, color: '#E84118', subtitle: 'CLASSIC' },
  { name: 'ZOA', price: 3.99, color: '#00B894', subtitle: 'ENERGY DRINK' },
  { name: 'Raze', price: 3.99, color: '#6C5CE7', subtitle: 'ENERGY' },
  { name: 'Gfuel', price: 4.49, color: '#00B894', subtitle: 'GAMING ENERGY' },
  { name: 'Alani', price: 3.99, color: '#FF69B4', subtitle: 'FITNESS ENERGY' }
];

const DrinkGallery = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
        Available Drinks
      </Typography>
      <Grid container spacing={3}>
        {drinks.map((drink) => (
          <Grid item xs={6} sm={4} md={3} key={drink.name}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                  cursor: 'pointer'
                }
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <img
                  src={require(`../assets/images/drinks/${drink.name.toLowerCase()}.svg`)}
                  alt={drink.name}
                  style={{
                    height: '180px',
                    width: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {drink.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                {drink.subtitle}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: drink.color,
                  fontWeight: 'bold'
                }}
              >
                ${drink.price.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DrinkGallery; 