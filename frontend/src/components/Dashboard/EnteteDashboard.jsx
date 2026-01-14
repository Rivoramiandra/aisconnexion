import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Tooltip,
    Divider,
    Badge,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Notifications as NotificationsIcon,
    Mail as MailIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const EnteteDashboard = ({ basculerMenuLateral }) => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notificationAnchor, setNotificationAnchor] = React.useState(null);
    const open = Boolean(anchorEl);
    const notificationOpen = Boolean(notificationAnchor);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationOpen = (event) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    const getInitiales = (nom) => {
        if (!nom) return 'U';
        return nom
            .split(' ')
            .map(mot => mot[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const notifications = [
        { id: 1, text: 'Nouveau message reçu', time: '2 min' },
        { id: 2, text: 'Mise à jour système disponible', time: '1 heure' },
        { id: 3, text: 'Votre rapport est prêt', time: 'Hier' },
    ];

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: 'background.paper',
                color: 'text.primary',
                boxShadow: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Partie gauche */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Bouton menu mobile */}
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={basculerMenuLateral}
                        sx={{ display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Logo/Titre */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ 
                            fontWeight: 600,
                            color: 'primary.main',
                            display: { xs: 'none', sm: 'block' },
                        }}
                    >
                        AIS – Accès Control Internet
                    </Typography>
                </Box>

                {/* Partie droite */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Notifications */}
                    <Tooltip title="Notifications">
                        <IconButton
                            onClick={handleNotificationOpen}
                            color="inherit"
                            size="small"
                        >
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {/* Messages */}
                    <Tooltip title="Messages">
                        <IconButton color="inherit" size="small">
                            <Badge badgeContent={1} color="error">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {/* Séparateur */}
                    <Divider orientation="vertical" flexItem />

                    {/* Profil utilisateur */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {user?.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {user?.email}
                            </Typography>
                        </Box>

                        <Tooltip title="Mon compte">
                            <IconButton
                                onClick={handleMenuOpen}
                                size="small"
                                aria-controls={open ? 'menu-compte' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        bgcolor: 'primary.main',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    {getInitiales(user?.name)}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Menu notifications */}
                <Menu
                    anchorEl={notificationAnchor}
                    open={notificationOpen}
                    onClose={handleNotificationClose}
                    PaperProps={{
                        elevation: 3,
                        sx: {
                            mt: 1.5,
                            minWidth: 320,
                            maxHeight: 400,
                        },
                    }}
                >
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Notifications
                        </Typography>
                    </Box>
                    {notifications.map((notification) => (
                        <MenuItem key={notification.id} onClick={handleNotificationClose}>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="body2">{notification.text}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {notification.time}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem onClick={handleNotificationClose}>
                        <Typography variant="body2" color="primary" sx={{ textAlign: 'center', width: '100%' }}>
                            Voir toutes les notifications
                        </Typography>
                    </MenuItem>
                </Menu>

                {/* Menu compte */}
                <Menu
                    anchorEl={anchorEl}
                    id="menu-compte"
                    open={open}
                    onClose={handleMenuClose}
                    PaperProps={{
                        elevation: 3,
                        sx: {
                            mt: 1.5,
                            minWidth: 200,
                        },
                    }}
                >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {user?.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {user?.email}
                        </Typography>
                    </Box>
                    
                    <MenuItem onClick={handleMenuClose}>
                        <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
                        Mon profil
                    </MenuItem>
                    
                    <MenuItem onClick={handleMenuClose}>
                        <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
                        Paramètres
                    </MenuItem>
                    
                    <Divider />
                    
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                        <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                        Déconnexion
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default EnteteDashboard;