import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, keyframes, Link as MuiLink, Button, Typography, IconButton, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Remove, Add } from '@mui/icons-material';
import { drinks } from '../data/drinks';
import { CreditCard, AccountBalance, PhoneAndroid } from '@mui/icons-material';

// Define keyframes for background animation
const gradientAnimation = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
`;

const shimmerAnimation = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const diagonalAnimation = keyframes`
  0% {
    transform: translate(-100%, 100%) rotate(45deg);
  }
  100% {
    transform: translate(100%, -100%) rotate(45deg);
  }
`;

const glowAnimation = keyframes`
  0%, 100% {
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.5),
                 0 0 40px rgba(0, 255, 255, 0.3);
  }
  50% {
    text-shadow: 0 0 30px rgba(0, 255, 255, 0.7),
                 0 0 60px rgba(0, 255, 255, 0.5);
  }
`;

const VendingMachine = () => {
  const [rotation, setRotation] = useState({ x: 20, y: -20 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [isSwinging, setIsSwinging] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [cart, setCart] = useState({});
  const [total, setTotal] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const drinksPerPage = 8;
  const totalPages = Math.ceil(drinks.length / drinksPerPage);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    card: {
      number: '',
      expiry: '',
      cvv: '',
      name: ''
    },
    bank: {
      accountNumber: '',
      ifsc: '',
      name: ''
    },
    upi: {
      id: ''
    }
  });
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastPosition.x;
    const deltaY = e.clientY - lastPosition.y;
    
    // Reduce rotation speed and add damping
    const dampingFactor = 0.1;
    setRotation(prev => ({
      x: Math.max(-45, Math.min(45, prev.x - deltaY * dampingFactor)),
      y: prev.y + deltaX * dampingFactor
    }));
    
    setLastPosition({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastPosition]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePushClick = () => {
    setIsSwinging(true);
    setTimeout(() => setIsSwinging(false), 1000); // Reset after animation
  };

  // Function to handle drink selection
  const handleDrinkSelection = (number) => {
    const drinkIndex = number - 1;
    if (drinkIndex >= 0 && drinkIndex < drinks.length) {
      setSelectedDrink(drinks[drinkIndex]);
    }
  };

  // Function to handle quantity changes
  const handleQuantityChange = (operation) => {
    if (!selectedDrink) return;

    setCart(prevCart => {
      const currentQty = prevCart[selectedDrink.id]?.quantity || 0;
      const newQty = operation === '+' ? currentQty + 1 : Math.max(0, currentQty - 1);
      
      const newCart = {
        ...prevCart,
        [selectedDrink.id]: {
          drink: selectedDrink,
          quantity: newQty
        }
      };

      // Calculate new total
      const newTotal = Object.values(newCart).reduce((sum, item) => {
        return sum + (item.drink.price * item.quantity);
      }, 0);
      setTotal(newTotal);

      return newCart;
    });
  };

  const handleBuyClick = () => {
    if (Object.keys(cart).length > 0) {
      setShowCart(true);
    }
  };

  const handleCloseCart = () => {
    setShowCart(false);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setShowPaymentForm(true);
    setPaymentError('');
  };

  const handlePaymentDetailsChange = (method, field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value
      }
    }));
  };

  const validatePaymentDetails = () => {
    if (selectedPaymentMethod === 'card') {
      const { number, expiry, cvv, name } = paymentDetails.card;
      if (!number || !expiry || !cvv || !name) {
        setPaymentError('Please fill in all card details');
        return false;
      }
      if (number.length < 16) {
        setPaymentError('Invalid card number');
        return false;
      }
    } else if (selectedPaymentMethod === 'bank') {
      const { accountNumber, ifsc, name } = paymentDetails.bank;
      if (!accountNumber || !ifsc || !name) {
        setPaymentError('Please fill in all bank details');
        return false;
      }
    } else if (selectedPaymentMethod === 'upi') {
      const { id } = paymentDetails.upi;
      if (!id) {
        setPaymentError('Please enter UPI ID');
        return false;
      }
      if (!id.includes('@')) {
        setPaymentError('Invalid UPI ID format');
        return false;
      }
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      setPaymentError('Please select a payment method');
      return;
    }

    if (!validatePaymentDetails()) {
      return;
    }

    try {
      setProcessing(true);
      setPaymentError('');
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentSuccess(true);
      // Clear cart and payment details
      setCart({});
      setTotal(0);
      setSelectedDrink(null);
      setPaymentDetails({
        card: { number: '', expiry: '', cvv: '', name: '' },
        bank: { accountNumber: '', ifsc: '', name: '' },
        upi: { id: '' }
      });
      
      // Show success for 2 seconds then close
      setTimeout(() => {
        setShowCart(false);
        setSelectedPaymentMethod(null);
        setShowPaymentForm(false);
        setPaymentSuccess(false);
      }, 2000);
    } catch (error) {
      setPaymentError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#1a1a1a' }}>
      {/* Top Section */}
      <Box sx={{ 
        pt: '40px',
        px: { xs: 4, md: 8 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 6, md: 4 },
        mb: 12
      }}>
        {/* Left Side - AISLE BOOST */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <Typography
            sx={{
              fontSize: { xs: '64px', md: '96px' },
              fontWeight: 900,
              color: 'transparent',
              background: 'linear-gradient(45deg, #00ffff, #0088ff)',
              WebkitBackgroundClip: 'text',
              letterSpacing: '4px',
              mb: 4,
              animation: `${glowAnimation} 3s ease-in-out infinite`,
              textShadow: '0 0 30px rgba(0, 255, 255, 0.3)'
            }}
          >
            AISLE BOOST
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '18px', md: '24px' },
              color: '#fff',
              opacity: 0.9,
              maxWidth: '600px',
              lineHeight: 1.6,
              mb: 6,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              textAlign: 'justify'
            }}
          >
            Experience the future of refreshment with our state-of-the-art vending machine. Simply use the vending machine to browse and order from our premium selection of energy drinks designed to boost your day!
          </Typography>

          <Button
            onClick={() => setShowCart(true)}
            sx={{
              bgcolor: '#00ffff',
              color: '#000',
              fontSize: '18px',
              fontWeight: 'bold',
              py: 2,
              px: 6,
              borderRadius: '30px',
              textTransform: 'none',
              position: 'relative',
              overflow: 'hidden',
              width: 'fit-content',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#0088ff',
                transform: 'scale(1.05)',
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: `${shimmerAnimation} 2s infinite`
              }
            }}
          >
            Buy Now
          </Button>
        </Box>

        {/* Right Side - Vending Machine */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          <Box
            onMouseDown={handleMouseDown}
            sx={{
              width: '400px',
              height: '600px',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transition: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
              zIndex: 2
            }}
          >
            {/* Front panel */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#8B0000',
                transform: 'translateZ(200px)',
                border: '2px solid #600000',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Main Display Area */}
              <Box
                sx={{
                  flex: 1,
                  m: 1.5,
                  mt: 2,
                  position: 'relative',
                  bgcolor: '#000',
                  border: '2px solid #600000',
                  borderRadius: '4px',
                  display: 'flex'
                }}
              >
                {/* Product Display Area */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 2,
                    bgcolor: '#000',
                    position: 'relative'
                  }}
                >
                  {/* Products Grid */}
                  {[...Array(4)].map((_, row) => (
                    <Box
                      key={row}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        height: '25%',
                        position: 'relative',
                        mb: row === 3 ? 0 : 2
                      }}
                    >
                      {/* Tray */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: '3px',
                          left: '-5%',
                          right: '-5%',
                          height: '3px',
                          background: 'linear-gradient(to bottom, #D3D3D3, #A9A9A9)',
                          zIndex: 1
                        }}
                      />
                      
                      {/* Drinks in the row */}
                      {[...Array(4)].map((_, col) => {
                        const drinkIndex = row * 4 + col;
                        const drink = drinks[drinkIndex];
                        return (
                          <Box
                            key={col}
                            onClick={() => {
                              if (drink) {
                                setSelectedDrink(drink);
                              }
                            }}
                            sx={{
                              width: '22%',
                              height: '90%',
                              display: 'flex',
                              alignItems: 'flex-end',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              zIndex: 2,
                              position: 'relative',
                              '&:hover': {
                                transform: 'scale(0.95)'
                              }
                            }}
                          >
                            {drink && (
                              <Box
                                component="img"
                                src={`/images/drinks/${drink.id}.svg`}
                                alt={drink.name}
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  transform: 'scale(1.2)',
                                  transition: 'transform 0.2s',
                                  position: 'relative',
                                  bottom: '-8px'
                                }}
                              />
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  ))}

                  {/* Silver Frame */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      border: '8px solid #C0C0C0',
                      borderRadius: '4px',
                      zIndex: 10,
                      pointerEvents: 'none'
                    }}
                  />
                </Box>

                {/* Control Panel */}
                <Box
                  sx={{
                    width: '120px',
                    bgcolor: '#8B0000',
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  {/* Digital Display */}
                  <Box
                    sx={{
                      height: '40px',
                      bgcolor: '#000',
                      border: '1px solid #333',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00ff00',
                      fontSize: '18px',
                      fontFamily: 'digital-7, monospace',
                      mb: 1
                    }}
                  >
                    ${total.toFixed(2)}
                  </Box>

                  {/* Keypad */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 0.5
                    }}
                  >
                    {[...Array(16)].map((_, i) => (
                      <Box
                        key={i}
                        onClick={() => handleDrinkSelection(i + 1)}
                        sx={{
                          bgcolor: selectedDrink?.id === drinks[i]?.id ? '#444' : '#222',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          border: '1px solid #333',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          '&:hover': { bgcolor: '#2a2a2a' }
                        }}
                      >
                        {i + 1}
                      </Box>
                    ))}
                  </Box>

                  {/* Plus/Minus Buttons */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 0.5,
                      mt: 1
                    }}
                  >
                    <Box
                      onClick={() => handleQuantityChange('+')}
                      sx={{
                        bgcolor: '#222',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00ff00',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        border: '1px solid #333',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#2a2a2a' }
                      }}
                    >
                      +
                    </Box>
                    <Box
                      onClick={() => handleQuantityChange('-')}
                      sx={{
                        bgcolor: '#222',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ff0000',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        border: '1px solid #333',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#2a2a2a' }
                      }}
                    >
                      -
                    </Box>
                  </Box>

                  {/* Selected Item Display */}
                  <Box
                    sx={{
                      height: '40px',
                      bgcolor: '#000',
                      border: '1px solid #333',
                      borderRadius: '2px',
                      mt: 1,
                      p: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontSize: '10px',
                      textAlign: 'center'
                    }}
                  >
                    {selectedDrink ? (
                      <>
                        {selectedDrink.name}
                        <br />
                        Qty: {cart[selectedDrink.id]?.quantity || 0}
                      </>
                    ) : (
                      'Select a drink'
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Collection Tray */}
              <Box
                sx={{
                  height: '70px',
                  mx: 1.5,
                  mb: 2,
                  bgcolor: '#111',
                  borderRadius: '4px',
                  border: '2px solid #600000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Box
                  onClick={() => {
                    handlePushClick();
                    handleBuyClick();
                  }}
                  sx={{
                    width: '80%',
                    height: '40px',
                    bgcolor: '#600000',
                    borderRadius: '0 0 8px 8px',
                    position: 'relative',
                    boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.8)',
                    cursor: 'pointer',
                    transform: isSwinging ? 'rotateX(40deg)' : 'rotateX(0deg)',
                    transition: 'transform 0.2s ease-in-out',
                    transformOrigin: 'top',
                    '&:hover': {
                      bgcolor: '#8B0000'
                    },
                    '&::after': {
                      content: '"BUY NOW"',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      letterSpacing: '2px'
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Back panel */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#8B0000',
                transform: 'translateZ(-200px) rotateY(180deg)',
                border: '2px solid #600000',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
              }}
            />

            {/* Right panel */}
            <Box
              sx={{
                position: 'absolute',
                width: '400px',
                height: '100%',
                backgroundColor: '#A00000',
                transform: 'rotateY(90deg) translateZ(200px)',
                border: '2px solid #600000',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
              }}
            />

            {/* Left panel */}
            <Box
              sx={{
                position: 'absolute',
                width: '400px',
                height: '100%',
                backgroundColor: '#A00000',
                transform: 'rotateY(-90deg) translateZ(200px)',
                border: '2px solid #600000',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
              }}
            />

            {/* Top panel */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '400px',
                backgroundColor: '#A00000',
                transform: 'rotateX(90deg) translateZ(200px)',
                border: '2px solid #600000',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
              }}
            />

            {/* Bottom panel */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '400px',
                backgroundColor: '#A00000',
                transform: 'rotateX(-90deg) translateZ(400px)',
                border: '2px solid #600000',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
              }}
            />

            {/* Inner box for depth effect */}
            <Box
              sx={{
                position: 'absolute',
                width: '90%',
                height: '90%',
                top: '5%',
                left: '5%',
                backgroundColor: '#600000',
                transform: 'translateZ(190px)',
                border: '1px solid #500000',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)'
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ px: { xs: 4, md: 8 }, pb: 12 }}>
        {/* Drinks Catalog */}
        <Box sx={{ mb: 12, position: 'relative', px: { xs: 6, md: 8 } }}>
          <Typography
            sx={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#00ffff',
              textAlign: 'center',
              mb: 6,
              textShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
            }}
          >
            Our Premium Selection
          </Typography>

          {/* Navigation Buttons */}
          <IconButton
            onClick={handlePrevPage}
            sx={{
              position: 'absolute',
              left: { xs: 0, md: 0 },
              top: '50%',
              transform: 'translateY(-50%)',
              width: '50px',
              height: '50px',
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              color: '#00ffff',
              zIndex: 2,
              border: '1px solid rgba(0, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)',
                transform: 'translateY(-50%) scale(1.1)',
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
              },
              '&:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed'
              }
            }}
            disabled={currentPage === 0}
          >
            <ChevronLeft sx={{ fontSize: 40 }} />
          </IconButton>

          <IconButton
            onClick={handleNextPage}
            sx={{
              position: 'absolute',
              right: { xs: 0, md: 0 },
              top: '50%',
              transform: 'translateY(-50%)',
              width: '50px',
              height: '50px',
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              color: '#00ffff',
              zIndex: 2,
              border: '1px solid rgba(0, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)',
                transform: 'translateY(-50%) scale(1.1)',
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
              },
              '&:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed'
              }
            }}
            disabled={currentPage >= Math.ceil(drinks.length / 8) - 1}
          >
            <ChevronRight sx={{ fontSize: 40 }} />
          </IconButton>

          {/* Drinks Grid Container */}
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              mx: 'auto',
              borderRadius: '20px',
              background: 'linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))',
              p: 4,
              width: '100%'
            }}
          >
            {/* Drinks Grid with Smooth Transition */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateRows: 'repeat(2, 1fr)',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 4,
                width: '100%',
                height: 'auto',
                minHeight: '400px'
              }}
            >
              {drinks.slice(currentPage * 8, (currentPage + 1) * 8).map((drink, index) => (
                <Box
                  key={drink.id}
                  onClick={() => setSelectedDrink(drink)}
                  sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '12px',
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0, 255, 255, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(0,255,255,0.1), transparent)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    },
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 10px 20px rgba(0, 255, 255, 0.2)',
                      '&::before': {
                        opacity: 1
                      }
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={`/images/drinks/${drink.id}.svg`}
                    alt={drink.name}
                    sx={{
                      width: '100%',
                      height: '160px',
                      objectFit: 'contain',
                      mb: 2,
                      transition: 'transform 0.3s ease',
                      filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.3))',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  />
                  <Typography
                    sx={{
                      color: '#00ffff',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      mb: 1,
                      textShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
                    }}
                  >
                    {drink.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#fff',
                      fontSize: '16px',
                      textAlign: 'center',
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    ${drink.price.toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Page Indicators */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              mt: 4
            }}
          >
            {[...Array(Math.ceil(drinks.length / 8))].map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentPage(index)}
                sx={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  bgcolor: currentPage === index ? '#00ffff' : 'rgba(0, 255, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    bgcolor: 'rgba(0, 255, 255, 0.8)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* About Us Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#00ffff',
              mb: 4,
              textShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
            }}
          >
            About Us
          </Typography>
          
          <Typography
            sx={{
              fontSize: '18px',
              color: '#fff',
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            At Aisle Boost, we're revolutionizing the way you experience energy drinks. 
            Our state-of-the-art vending machines combine cutting-edge technology with 
            premium beverages to deliver an unmatched refreshment experience. Each drink 
            is carefully crafted to provide the perfect balance of energy, taste, and 
            refreshment, ensuring you stay energized throughout your day.
          </Typography>
        </Box>
      </Box>

      {/* Cart Popup */}
      {showCart && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.9)',
              borderRadius: '20px',
              p: 4,
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)'
            }}
          >
            {paymentSuccess ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  py: 4
                }}
              >
                <Typography
                  sx={{
                    color: '#00ff00',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textShadow: '0 0 20px rgba(0, 255, 0, 0.3)'
                  }}
                >
                  Payment Successful!
                </Typography>
                <Typography
                  sx={{
                    color: '#fff',
                    fontSize: '18px',
                    textAlign: 'center',
                    opacity: 0.9
                  }}
                >
                  Thank you for your purchase. Your drinks will be dispensed shortly.
                </Typography>
              </Box>
            ) : (
              <>
                <Typography
                  sx={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#00ffff',
                    mb: 3,
                    textAlign: 'center',
                    textShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
                  }}
                >
                  Your Cart
                </Typography>

                {Object.values(cart).map((item) => (
                  <Box
                    key={item.drink.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                      p: 2,
                      bgcolor: 'rgba(0, 255, 255, 0.1)',
                      borderRadius: '10px',
                      border: '1px solid rgba(0, 255, 255, 0.2)'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        component="img"
                        src={`/images/drinks/${item.drink.id}.svg`}
                        alt={item.drink.name}
                        sx={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'contain'
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            color: '#00ffff',
                            fontSize: '18px',
                            fontWeight: 'bold'
                          }}
                        >
                          {item.drink.name}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#fff',
                            fontSize: '16px'
                          }}
                        >
                          ${item.drink.price.toFixed(2)} × {item.quantity}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <IconButton
                        onClick={() => handleQuantityChange('-')}
                        sx={{
                          color: '#ff4444',
                          '&:hover': {
                            bgcolor: 'rgba(255, 68, 68, 0.1)'
                          }
                        }}
                      >
                        <Remove />
                      </IconButton>
                      <IconButton
                        onClick={() => handleQuantityChange('+')}
                        sx={{
                          color: '#00ff00',
                          '&:hover': {
                            bgcolor: 'rgba(0, 255, 0, 0.1)'
                          }
                        }}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </Box>
                ))}

                {/* Payment Mode Icons */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography
                    sx={{
                      color: '#fff',
                      fontSize: '16px',
                      mb: 2,
                      opacity: 0.8
                    }}
                  >
                    Select Payment Method:
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 3,
                      mt: 2,
                      mb: 2
                    }}
                  >
                    <Box
                      onClick={() => handlePaymentMethodSelect('card')}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: selectedPaymentMethod === 'card' ? '#00ffff' : 'rgba(0, 255, 255, 0.2)',
                        bgcolor: selectedPaymentMethod === 'card' ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(0, 255, 255, 0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <CreditCard sx={{ 
                        color: selectedPaymentMethod === 'card' ? '#00ffff' : 'rgba(0, 255, 255, 0.6)', 
                        fontSize: 40 
                      }} />
                      <Typography sx={{ 
                        color: selectedPaymentMethod === 'card' ? '#00ffff' : '#fff',
                        fontSize: '14px'
                      }}>
                        Card
                      </Typography>
                    </Box>

                    <Box
                      onClick={() => handlePaymentMethodSelect('bank')}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: selectedPaymentMethod === 'bank' ? '#00ffff' : 'rgba(0, 255, 255, 0.2)',
                        bgcolor: selectedPaymentMethod === 'bank' ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(0, 255, 255, 0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <AccountBalance sx={{ 
                        color: selectedPaymentMethod === 'bank' ? '#00ffff' : 'rgba(0, 255, 255, 0.6)', 
                        fontSize: 40 
                      }} />
                      <Typography sx={{ 
                        color: selectedPaymentMethod === 'bank' ? '#00ffff' : '#fff',
                        fontSize: '14px'
                      }}>
                        Bank
                      </Typography>
                    </Box>

                    <Box
                      onClick={() => handlePaymentMethodSelect('upi')}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: selectedPaymentMethod === 'upi' ? '#00ffff' : 'rgba(0, 255, 255, 0.2)',
                        bgcolor: selectedPaymentMethod === 'upi' ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(0, 255, 255, 0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <PhoneAndroid sx={{ 
                        color: selectedPaymentMethod === 'upi' ? '#00ffff' : 'rgba(0, 255, 255, 0.6)', 
                        fontSize: 40 
                      }} />
                      <Typography sx={{ 
                        color: selectedPaymentMethod === 'upi' ? '#00ffff' : '#fff',
                        fontSize: '14px'
                      }}>
                        UPI
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Payment Forms */}
                {showPaymentForm && selectedPaymentMethod && (
                  <Box sx={{ mb: 3, mt: 2 }}>
                    <Typography
                      sx={{
                        color: '#00ffff',
                        fontSize: '18px',
                        mb: 2,
                        textAlign: 'center'
                      }}
                    >
                      Enter Payment Details
                    </Typography>

                    {selectedPaymentMethod === 'card' && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <input
                          type="text"
                          placeholder="Card Number"
                          value={paymentDetails.card.number}
                          onChange={(e) => handlePaymentDetailsChange('card', 'number', e.target.value)}
                          style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(0, 255, 255, 0.3)',
                            background: 'rgba(0, 0, 0, 0.3)',
                            color: '#fff',
                            fontSize: '16px'
                          }}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={paymentDetails.card.expiry}
                            onChange={(e) => handlePaymentDetailsChange('card', 'expiry', e.target.value)}
                            style={{
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid rgba(0, 255, 255, 0.3)',
                              background: 'rgba(0, 0, 0, 0.3)',
                              color: '#fff',
                              fontSize: '16px',
                              width: '50%'
                            }}
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            value={paymentDetails.card.cvv}
                            onChange={(e) => handlePaymentDetailsChange('card', 'cvv', e.target.value)}
                            style={{
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid rgba(0, 255, 255, 0.3)',
                              background: 'rgba(0, 0, 0, 0.3)',
                              color: '#fff',
                              fontSize: '16px',
                              width: '50%'
                            }}
                          />
                        </Box>
                        <input
                          type="text"
                          placeholder="Cardholder Name"
                          value={paymentDetails.card.name}
                          onChange={(e) => handlePaymentDetailsChange('card', 'name', e.target.value)}
                          style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(0, 255, 255, 0.3)',
                            background: 'rgba(0, 0, 0, 0.3)',
                            color: '#fff',
                            fontSize: '16px'
                          }}
                        />
                      </Box>
                    )}

                    {selectedPaymentMethod === 'bank' && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <input
                          type="text"
                          placeholder="Account Number"
                          value={paymentDetails.bank.accountNumber}
                          onChange={(e) => handlePaymentDetailsChange('bank', 'accountNumber', e.target.value)}
                          style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(0, 255, 255, 0.3)',
                            background: 'rgba(0, 0, 0, 0.3)',
                            color: '#fff',
                            fontSize: '16px'
                          }}
                        />
                        <input
                          type="text"
                          placeholder="IFSC Code"
                          value={paymentDetails.bank.ifsc}
                          onChange={(e) => handlePaymentDetailsChange('bank', 'ifsc', e.target.value)}
                          style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(0, 255, 255, 0.3)',
                            background: 'rgba(0, 0, 0, 0.3)',
                            color: '#fff',
                            fontSize: '16px'
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Account Holder Name"
                          value={paymentDetails.bank.name}
                          onChange={(e) => handlePaymentDetailsChange('bank', 'name', e.target.value)}
                          style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(0, 255, 255, 0.3)',
                            background: 'rgba(0, 0, 0, 0.3)',
                            color: '#fff',
                            fontSize: '16px'
                          }}
                        />
                      </Box>
                    )}

                    {selectedPaymentMethod === 'upi' && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <input
                          type="text"
                          placeholder="Enter UPI ID (example@upi)"
                          value={paymentDetails.upi.id}
                          onChange={(e) => handlePaymentDetailsChange('upi', 'id', e.target.value)}
                          style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(0, 255, 255, 0.3)',
                            background: 'rgba(0, 0, 0, 0.3)',
                            color: '#fff',
                            fontSize: '16px'
                          }}
                        />
                      </Box>
                    )}

                    {paymentError && (
                      <Typography
                        sx={{
                          color: '#ff4444',
                          fontSize: '14px',
                          mt: 2,
                          textAlign: 'center'
                        }}
                      >
                        {paymentError}
                      </Typography>
                    )}
                  </Box>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                    pt: 3,
                    borderTop: '1px solid rgba(0, 255, 255, 0.2)'
                  }}
                >
                  <Typography
                    sx={{
                      color: '#00ffff',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}
                  >
                    Total: ${total.toFixed(2)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      onClick={handleCloseCart}
                      sx={{
                        color: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          borderColor: '#ff4444',
                          color: '#ff4444'
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      disabled={!selectedPaymentMethod || processing}
                      sx={{
                        bgcolor: '#00ffff',
                        color: '#000',
                        '&:hover': {
                          bgcolor: 'rgba(0, 255, 255, 0.8)'
                        },
                        '&.Mui-disabled': {
                          bgcolor: 'rgba(0, 255, 255, 0.3)',
                          color: 'rgba(0, 0, 0, 0.4)'
                        }
                      }}
                    >
                      {processing ? (
                        <CircularProgress size={24} sx={{ color: '#000' }} />
                      ) : (
                        'Checkout'
                      )}
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VendingMachine;
