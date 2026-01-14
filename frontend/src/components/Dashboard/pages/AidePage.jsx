import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const AidePage = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Aide et Support
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography paragraph>
                    Cette page d'aide est en cours de développement.
                </Typography>
            </Paper>
        </Box>
    );
};

export default AidePage;