import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { CreditCard, TouchApp, ShoppingCart, Payment } from '@mui/icons-material';

const Manual = () => {
  const steps = [
    {
      icon: <TouchApp sx={{ fontSize: 40, color: '#00ffff' }} />,
      title: "Select Your Drink",
      description: "Click on any drink in the display or use the keypad numbers (1-16) to select your desired beverage."
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 40, color: '#00ffff' }} />,
      title: "Adjust Quantity",
      description: "Use the + and - buttons on the control panel to adjust the quantity of your selected drink."
    },
    {
      icon: <Payment sx={{ fontSize: 40, color: '#00ffff' }} />,
      title: "Buy Now",
      description: "Click the 'BUY NOW' button at the bottom of the machine to proceed to checkout."
    },
    {
      icon: <CreditCard sx={{ fontSize: 40, color: '#00ffff' }} />,
      title: "Payment",
      description: "Choose your preferred payment method (Card, Bank, or Mobile) and complete the checkout process."
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#1a1a1a',
        pt: '80px',
        px: 4,
        pb: 4
      }}
    >
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
          textShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
        }}
      >
        How to Use
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 4,
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        {steps.map((step, index) => (
          <Paper
            key={index}
            elevation={8}
            sx={{
              p: 4,
              bgcolor: 'rgba(20, 20, 20, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Box sx={{ mb: 2 }}>{step.icon}</Box>
            <Typography
              variant="h5"
              sx={{
                color: '#00ffff',
                textAlign: 'center',
                fontWeight: 'bold',
                mb: 1
              }}
            >
              {step.title}
            </Typography>
            <Typography
              sx={{
                color: '#fff',
                textAlign: 'center',
                opacity: 0.8
              }}
            >
              {step.description}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Additional Tips */}
      <Paper
        elevation={8}
        sx={{
          mt: 6,
          p: 4,
          bgcolor: 'rgba(20, 20, 20, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          maxWidth: '800px',
          mx: 'auto'
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: '#00ffff',
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 3
          }}
        >
          Additional Tips
        </Typography>
        <Box
          sx={{
            color: '#fff',
            opacity: 0.8,
            '& > *': { mb: 2 }
          }}
        >
          <Typography>
            • You can rotate the vending machine view by clicking and dragging with your mouse
          </Typography>
          <Typography>
            • The digital display shows your current total
          </Typography>
          <Typography>
            • Selected items and their quantities are shown in the control panel display
          </Typography>
          <Typography>
            • You can close the cart popup by clicking outside the cart window
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Manual; 