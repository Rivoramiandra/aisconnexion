import React from 'react';
import { Typography, Box } from '@mui/material';

const AnalytiquePage = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Analytique
            </Typography>
            <Typography>
                Analyses et statistiques.
            </Typography>
        </Box>
    );
};

export default AnalytiquePage;