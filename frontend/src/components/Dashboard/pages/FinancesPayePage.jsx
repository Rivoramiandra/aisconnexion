import React from 'react';
import { Typography, Box } from '@mui/material';

const FinancesPayePage = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Finances - Payé
            </Typography>
            <Typography>
                Transactions payées.
            </Typography>
        </Box>
    );
};

export default FinancesPayePage;