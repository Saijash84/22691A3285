import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { urlService } from '../services/urlService';
import { useLogger } from '../contexts/LoggerContext';

const Redirect: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<any>(null);
  const logger = useLogger();

  useEffect(() => {
    if (!shortCode) {
      setError('Invalid short code');
      setLoading(false);
      return;
    }

    const handleRedirect = () => {
      const foundUrl = urlService.getUrlByCode(shortCode);
      
      if (!foundUrl) {
        setError('URL not found or has expired');
        setLoading(false);
        logger.warn('Redirect failed - URL not found', { shortCode });
        return;
      }

      const now = new Date();
      const expiry = new Date(foundUrl.expiresAt);
      
      if (now > expiry) {
        setError('This URL has expired');
        setLoading(false);
        logger.warn('Redirect failed - URL expired', { shortCode, expiresAt: foundUrl.expiresAt });
        return;
      }

      setUrl(foundUrl);
      urlService.recordClick(shortCode);
      logger.info('URL redirect initiated', { 
        shortCode, 
        originalUrl: foundUrl.originalUrl,
        clicks: foundUrl.clicks.length + 1
      });

      setTimeout(() => {
        window.location.href = foundUrl.originalUrl;
      }, 2000);
    };

    handleRedirect();
  }, [shortCode, logger]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '50vh',
        gap: 2
      }} className="redirect-loading">
        <CircularProgress size={60} className="loading-pulse" />
        <Typography variant="h6">Redirecting...</Typography>
        <Typography variant="body2" color="text.secondary">
          You will be redirected automatically
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Card>
          <CardContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Typography variant="h6" gutterBottom>
              Redirect Failed
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The requested URL could not be found or has expired.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '50vh',
      gap: 2
    }} className="redirect-success">
      <Typography variant="h5" gutterBottom>
        Redirecting to:
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ wordBreak: 'break-all', textAlign: 'center' }}>
        {url?.originalUrl}
      </Typography>
      <CircularProgress size={40} sx={{ mt: 2 }} className="loading-pulse" />
      <Typography variant="body2" color="text.secondary">
        Redirecting in 2 seconds...
      </Typography>
    </Box>
  );
};

export default Redirect; 