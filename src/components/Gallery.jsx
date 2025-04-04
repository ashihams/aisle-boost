import React from 'react';
import { Box, Paper, Typography, Container } from '@mui/material';
import { drinks } from '../data/drinks';

const Gallery = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#1a1a1a', pt: '80px', pb: 4 }}>
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 1px 1px, #333 2px, transparent 0)',
          backgroundSize: '30px 30px',
          opacity: 0.3,
          zIndex: 0
        }}
      />

      <Container maxWidth="xl">
        {/* Title */}
        <Typography
          variant="h2"
          sx={{
            color: 'transparent',
            background: 'linear-gradient(45deg, #00ffff, #0088ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 6,
            textShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
            position: 'relative',
            zIndex: 1
          }}
        >
          Drinks Gallery
        </Typography>

        {/* Drinks Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
              xl: 'repeat(5, 1fr)'
            },
            gap: 3,
            position: 'relative',
            zIndex: 1
          }}
        >
          {drinks.map((drink) => (
            <Paper
              key={drink.id}
              elevation={8}
              sx={{
                p: 3,
                bgcolor: 'rgba(20, 20, 20, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0, 255, 255, 0.2)',
                  '& img': {
                    transform: 'scale(1.1) translateY(-5px)'
                  }
                }
              }}
            >
              {/* Drink Image */}
              <Box
                component="img"
                src={`/images/drinks/${drink.id}.svg`}
                alt={drink.name}
                sx={{
                  width: '140px',
                  height: '140px',
                  objectFit: 'contain',
                  mb: 2,
                  filter: 'drop-shadow(0 4px 8px rgba(0, 255, 255, 0.3))',
                  transition: 'transform 0.3s ease'
                }}
              />

              {/* Drink Name */}
              <Typography
                variant="h5"
                sx={{
                  color: '#00ffff',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  mb: 1,
                  textShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
                }}
              >
                {drink.name}
              </Typography>

              {/* Drink Price */}
              <Typography
                sx={{
                  color: '#fff',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  mb: 1,
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                }}
              >
                ${drink.price.toFixed(2)}
              </Typography>

              {/* Drink Description */}
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textAlign: 'center',
                  fontSize: '14px',
                  lineHeight: 1.4
                }}
              >
                {drink.description || 'A refreshing energy drink to boost your day!'}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Gallery;
