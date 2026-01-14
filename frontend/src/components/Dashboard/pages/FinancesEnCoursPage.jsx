import React from 'react';
import { Typography, Box } from '@mui/material';

const FinancesEnCoursPage = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Finances - En cours
            </Typography>
            <Typography>
                Transactions en attente de paiement.
            </Typography>
        </Box>
    );
};

export default FinancesEnCoursPage;