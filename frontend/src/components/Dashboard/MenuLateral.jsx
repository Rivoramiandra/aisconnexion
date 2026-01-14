import React, { useState } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Divider,
    Typography,
    Tooltip,
    Badge,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    BarChart as BarChartIcon,
    Settings as SettingsIcon,
    Devices as DevicesIcon,
    Home as HomeIcon,
    History as HistoryIcon,
    Help as HelpIcon,
    Wifi as WifiIcon,
    Payments as PaymentsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const MenuLateral = ({ largeurMenu, mobileOuvert, fermerMenuMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuPrincipal = [
        {
            texte: 'Tableau de bord',
            icone: <DashboardIcon />,
            chemin: '/dashboard',
            badge: null,
        },
        {
            texte: 'Analytique',
            icone: <BarChartIcon />,
            chemin: '/dashboard/analytique',
            badge: null,
        },
        {
            texte: 'Accès Internet',
            icone: <WifiIcon />,
            chemin: '/dashboard/acces-internet',
            badge: 5,
        },
        {
            texte: 'Tarifs',
            icone: <PaymentsIcon />,
            chemin: '/dashboard/tarifs',
            badge: null,
        },
        {
            texte: 'Appareils Connectés',
            icone: <DevicesIcon />,
            chemin: '/dashboard/appareils',
            badge: 12,
        },
    ];

    const menuSecondaire = [
        {
            texte: 'Historique',
            icone: <HistoryIcon />,
            chemin: '/dashboard/historique',
            badge: null,
        },

        {
            texte: 'Paramètres',
            icone: <SettingsIcon />,
            chemin: '/dashboard/parametres',
            badge: null,
        },
    ];

    const contenuMenu = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* En-tête du menu */}
            <Box sx={{ p: 3, pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <HomeIcon sx={{ 
                        fontSize: 32, 
                        color: 'primary.main',
                        backgroundColor: 'primary.lighter',
                        borderRadius: 2,
                        p: 0.5,
                    }} />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                            ProDashboard
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            Administration
                        </Typography>
                    </Box>
                </Box>
                <Divider />
            </Box>

            {/* Menu principal */}
            <List sx={{ flexGrow: 1, pb: 1 }}>
                {menuPrincipal.map((item) => (
                    <ListItem key={item.texte} disablePadding>
                        <Tooltip title={item.texte} placement="right" arrow>
                            <ListItemButton
                                selected={location.pathname === item.chemin}
                                onClick={() => navigate(item.chemin)}
                                sx={{
                                    mb: 0.5,
                                    mx: 1,
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.lighter',
                                        color: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'primary.lighter',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.main',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {item.icone}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.texte}
                                    primaryTypographyProps={{
                                        fontWeight: location.pathname === item.chemin ? 600 : 400,
                                        fontSize: '0.9rem',
                                    }}
                                />
                                {item.badge && (
                                    <Badge 
                                        badgeContent={item.badge} 
                                        color="error"
                                        sx={{ ml: 1 }}
                                    />
                                )}
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}

                <Divider sx={{ my: 2, mx: 2 }} />

                {/* Menu secondaire */}
                {menuSecondaire.map((item) => (
                    <ListItem key={item.texte} disablePadding>
                        <Tooltip title={item.texte} placement="right" arrow>
                            <ListItemButton
                                selected={location.pathname === item.chemin}
                                onClick={() => navigate(item.chemin)}
                                sx={{
                                    mb: 0.5,
                                    mx: 1,
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        backgroundColor: 'action.selected',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {item.icone}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.texte}
                                    primaryTypographyProps={{
                                        fontSize: '0.85rem',
                                    }}
                                />
                                {item.badge && (
                                    <Badge 
                                        badgeContent={item.badge} 
                                        color="error"
                                        sx={{ ml: 1 }}
                                    />
                                )}
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>

            <Divider />

            {/* Pied de page */}
            <Box sx={{ p: 2, pt: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary" display="block">
                    © 2026 par Rivo RAMIANDRA
                </Typography>
            </Box>
        </Box>
    );

    return (
        <>
            {/* Menu pour desktop */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    width: largeurMenu,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: largeurMenu,
                        boxSizing: 'border-box',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'background.default',
                    },
                }}
                open
            >
                {contenuMenu}
            </Drawer>

            {/* Menu pour mobile */}
            <Drawer
                variant="temporary"
                open={mobileOuvert}
                onClose={fermerMenuMobile}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        width: largeurMenu,
                        boxSizing: 'border-box',
                        backgroundColor: 'background.default',
                    },
                }}
            >
                {contenuMenu}
            </Drawer>
        </>
    );
};

export default MenuLateral;