import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from '@mui/material';
import {
  ExpandMore,
  Delete,
  ContentCopy,
  Visibility,
  LocationOn,
  AccessTime
} from '@mui/icons-material';
import { urlService, ShortUrl } from '../services/urlService';
import { useLogger } from '../contexts/LoggerContext';

const Statistics: React.FC = () => {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const logger = useLogger();

  useEffect(() => {
    loadUrls();
    logger.info('Statistics page loaded');
  }, []);

  const loadUrls = () => {
    const allUrls = urlService.getAllUrls();
    setUrls(allUrls);
    logger.info('Loaded URLs for statistics', { count: allUrls.length });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 2000);
      logger.info('URL copied from statistics', { url: text });
    } catch (error) {
      logger.error('Failed to copy URL from statistics', { error, url: text });
    }
  };

  const deleteUrl = (id: string) => {
    urlService.deleteUrl(id);
    loadUrls();
    logger.info('URL deleted from statistics', { urlId: id });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const hoursLeft = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursLeft < 1) return 'error';
    if (hoursLeft < 24) return 'warning';
    return 'success';
  };

  const getStatusText = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const hoursLeft = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursLeft < 0) return 'Expired';
    if (hoursLeft < 1) return 'Expires Soon';
    if (hoursLeft < 24) return `${Math.round(hoursLeft)}h Left`;
    return `${Math.round(hoursLeft / 24)}d Left`;
  };

  if (urls.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Statistics
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          No shortened URLs found. Create some URLs first to see statistics.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        URL Statistics
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Track your shortened URLs and their performance
      </Typography>

      <Grid container spacing={3}>
        {urls.map((url) => (
          <Grid item xs={12} key={url.id}>
            <Card className="statistics-card">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {url.shortCode}
                      {url.customCode && (
                        <Chip 
                          label="Custom" 
                          size="small" 
                          color="primary" 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all', mb: 1 }}>
                      {url.originalUrl}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ wordBreak: 'break-all', mb: 1 }}>
                      <strong>{url.shortUrl}</strong>
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip 
                        label={`Created: ${formatDate(url.createdAt)}`} 
                        size="small" 
                        icon={<AccessTime />}
                      />
                      <Chip 
                        label={getStatusText(url.expiresAt)}
                        size="small"
                        color={getStatusColor(url.expiresAt) as any}
                      />
                      <Chip 
                        label={`${url.clicks.length} clicks`} 
                        size="small" 
                        color="secondary"
                        icon={<Visibility />}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Copy URL">
                      <IconButton
                        onClick={() => copyToClipboard(url.shortUrl)}
                        color={copiedUrl === url.shortUrl ? 'success' : 'primary'}
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
                </Box>

                {url.clicks.length > 0 && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1">
                        Click Details ({url.clicks.length} clicks)
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Timestamp</TableCell>
                              <TableCell>Source</TableCell>
                              <TableCell>Location</TableCell>
                              <TableCell>User Agent</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {url.clicks.map((click, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {formatDate(click.timestamp)}
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={click.source} 
                                    size="small" 
                                    variant="outlined"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <LocationOn fontSize="small" />
                                    {click.location}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {click.userAgent}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Statistics; 