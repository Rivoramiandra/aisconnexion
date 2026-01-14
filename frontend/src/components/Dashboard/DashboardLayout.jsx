import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
    Box,
    CssBaseline,
    Toolbar,
} from '@mui/material';
import EnteteDashboard from './EnteteDashboard';
import MenuLateral from './MenuLateral';

const DashboardLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const drawerWidth = 280;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            
            {/* En-tête */}
            <EnteteDashboard 
                basculerMenuLateral={handleDrawerToggle}
            />
            
            {/* Menu latéral */}
            <MenuLateral
                largeurMenu={drawerWidth}
                mobileOuvert={mobileOpen}
                fermerMenuMobile={handleDrawerToggle}
            />
            
            {/* Contenu principal - Outlet pour les pages */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    backgroundColor: '#f8fafc',
                }}
            >
                <Toolbar />
                <Outlet /> {/* Les pages s'affichent ici */}
            </Box>
        </Box>
    );
};

export default DashboardLayout;