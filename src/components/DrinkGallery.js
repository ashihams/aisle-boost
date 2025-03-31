import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

const DrinkGallery = () => {
  const drinks = [
    'celsius', 'redbull', 'c4', 'ghost', 'monster', 
    'rockstar', 'bang', 'reign', 'nos', '5hour', 
    'jocko', 'coke', 'zoa', 'raze', 'gfuel', 'alani'
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Available Drinks
      </Typography>
      <Grid container spacing={3}>
        {drinks.map((drink) => (
          <Grid item xs={6} sm={4} md={3} key={drink}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
                height: '250px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <img 
                src={require(`../assets/images/drinks/${drink}.svg`)} 
                alt={drink}
                style={{ height: '200px', width: '120px' }}
              />
              <Typography variant="subtitle1" sx={{ mt: 1, textTransform: 'capitalize' }}>
                {drink}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DrinkGallery; 