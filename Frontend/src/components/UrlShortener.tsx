import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { ContentCopy, Delete, Link } from '@mui/icons-material';
import { urlService, ShortUrl, UrlFormData } from '../services/urlService';
import { useLogger } from '../contexts/LoggerContext';

interface UrlForm {
  originalUrl: string;
  validityMinutes: number;
  customCode: string;
}

const UrlShortener: React.FC = () => {
  const [urls, setUrls] = useState<UrlForm[]>([
    { originalUrl: '', validityMinutes: 30, customCode: '' }
  ]);
  const [shortenedUrls, setShortenedUrls] = useState<ShortUrl[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const logger = useLogger();

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { originalUrl: '', validityMinutes: 30, customCode: '' }]);
      logger.info('Added new URL input field', { currentCount: urls.length + 1 });
    }
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      logger.info('Removed URL input field', { index, remainingCount: newUrls.length });
    }
  };

  const updateUrl = (index: number, field: keyof UrlForm, value: string | number) => {
    const newUrls = [...urls];
    newUrls[index] = { ...newUrls[index], [field]: value };
    setUrls(newUrls);
  };

  const validateUrls = (): boolean => {
    const newErrors: string[] = [];
    
    urls.forEach((url, index) => {
      if (!url.originalUrl.trim()) {
        newErrors.push(`URL ${index + 1}: Please enter a URL`);
      } else if (!url.originalUrl.startsWith('http://') && !url.originalUrl.startsWith('https://')) {
        newErrors.push(`URL ${index + 1}: URL must start with http:// or https://`);
      }
      
      if (url.customCode && !/^[a-zA-Z0-9]+$/.test(url.customCode)) {
        newErrors.push(`URL ${index + 1}: Custom code must be alphanumeric`);
      }
      
      if (url.customCode && url.customCode.length > 10) {
        newErrors.push(`URL ${index + 1}: Custom code must be 10 characters or less`);
      }
      
      if (url.validityMinutes < 1 || url.validityMinutes > 1440) {
        newErrors.push(`URL ${index + 1}: Validity must be between 1 and 1440 minutes`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleShorten = () => {
    if (!validateUrls()) {
      logger.warn('URL validation failed', { errors });
      return;
    }

    const newShortenedUrls: ShortUrl[] = [];
    const validUrls = urls.filter(url => url.originalUrl.trim());

    validUrls.forEach((urlData, index) => {
      const data: UrlFormData = {
        originalUrl: urlData.originalUrl,
        validityMinutes: urlData.validityMinutes,
        customCode: urlData.customCode || undefined
      };

      const shortened = urlService.shortenUrl(data);
      if (shortened) {
        newShortenedUrls.push(shortened);
        logger.info('URL shortened successfully', { 
          originalUrl: urlData.originalUrl, 
          shortCode: shortened.shortCode 
        });
      }
    });

    setShortenedUrls(newShortenedUrls);
    logger.info('Bulk URL shortening completed', { 
      totalUrls: validUrls.length, 
      successful: newShortenedUrls.length 
    });
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      logger.info('URL copied to clipboard', { url: text });
    } catch (error) {
      logger.error('Failed to copy URL to clipboard', { error, url: text });
    }
  };

  const deleteUrl = (id: string) => {
    urlService.deleteUrl(id);
    setShortenedUrls(shortenedUrls.filter(url => url.id !== id));
    logger.info('URL deleted', { urlId: id });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center" className="main-title">
        URL Shortener
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }} className="main-description">
        Shorten up to 5 URLs at once with custom validity and shortcodes
      </Typography>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Enter URLs to Shorten
          </Typography>
          
          {urls.map((url, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }} className="url-form-container">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Long URL"
                    value={url.originalUrl}
                    onChange={(e) => updateUrl(index, 'originalUrl', e.target.value)}
                    placeholder="https://example.com/very-long-url"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    label="Validity (minutes)"
                    type="number"
                    value={url.validityMinutes}
                    onChange={(e) => updateUrl(index, 'validityMinutes', parseInt(e.target.value) || 30)}
                    size="small"
                    inputProps={{ min: 1, max: 1440 }}
                  />
                </Grid>
                
                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    label="Custom Code (optional)"
                    value={url.customCode}
                    onChange={(e) => updateUrl(index, 'customCode', e.target.value)}
                    placeholder="mycode"
                    size="small"
                    inputProps={{ maxLength: 10 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={1}>
                  <Tooltip title="Remove URL">
                    <IconButton 
                      onClick={() => removeUrlField(index)}
                      disabled={urls.length === 1}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Box>
          ))}
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={addUrlField}
              disabled={urls.length >= 5}
            >
              Add Another URL
            </Button>
            
            <Button
              variant="contained"
              onClick={handleShorten}
              disabled={urls.every(url => !url.originalUrl.trim())}
              startIcon={<Link />}
            >
              Shorten URLs
            </Button>
          </Box>
        </CardContent>
      </Card>

      {shortenedUrls.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Shortened URLs
            </Typography>
            
            {shortenedUrls.map((url, index) => (
              <Box key={url.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }} className="url-result-container">
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Original: {url.originalUrl}
                    </Typography>
                    <Typography variant="h6" sx={{ wordBreak: 'break-all' }}>
                      {url.shortUrl}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={`Expires: ${new Date(url.expiresAt).toLocaleString()}`} 
                        size="small" 
                        color="primary" 
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={`Clicks: ${url.clicks.length}`} 
                        size="small" 
                        color="secondary"
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="Copy URL">
                        <IconButton
                          onClick={() => copyToClipboard(url.shortUrl, index)}
                          color={copiedIndex === index ? 'success' : 'primary'}
                        >
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete URL">
                        <IconButton
                          onClick={() => deleteUrl(url.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default UrlShortener; 