import React from 'react';
import { Container, CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import VendingMachine from './components/VendingMachine';

const theme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <VendingMachine />
    </ThemeProvider>
  );
}

export default App; 