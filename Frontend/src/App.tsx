import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link, BarChart } from '@mui/icons-material';
import UrlShortener from './components/UrlShortener';
import Statistics from './components/Statistics';
import Redirect from './components/Redirect';
import { LoggerProvider } from './contexts/LoggerContext';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoggerProvider>
        <Router>
          <Box sx={{ flexGrow: 1 }} className="app-container">
            <AppBar position="static" className="custom-appbar">
              <Toolbar>
                <Link sx={{ mr: 2 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="app-title">
                  URL Shortener
                </Typography>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/"
                  startIcon={<Link />}
                  className="nav-button"
                >
                  Shorten
                </Button>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/stats"
                  startIcon={<BarChart />}
                  className="nav-button"
                >
                  Statistics
                </Button>
              </Toolbar>
            </AppBar>
            
            <Container maxWidth={false} sx={{ mt: 2 }} className="main-container">
              <Routes>
                <Route path="/" element={<UrlShortener />} />
                <Route path="/stats" element={<Statistics />} />
                <Route path="/r/:shortCode" element={<Redirect />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </LoggerProvider>
    </ThemeProvider>
  );
};

export default App; 