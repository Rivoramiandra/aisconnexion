import React, { useState } from 'react';
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
  Badge 
} from '@mui/material';
import { 
  BiMenu, 
  BiBell, 
  BiEnvelope, 
  BiUserCircle, 
  BiCog, 
  BiLogOut, 
  BiChevronDown 
} from 'react-icons/bi';
import { useAuth } from '../../context/AuthContext';

const EnteteDashboard = ({ basculerMenuLateral }) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchor);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationOpen = (event) => setNotificationAnchor(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchor(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const getInitiales = (nom) => {
    if (!nom) return 'U';
    return nom.split(' ').map(mot => mot[0]).join('').toUpperCase().slice(0, 2);
  };

  const notifications = [
    { id: 1, text: 'Nouvel appareil détecté', time: '2 min' },
    { id: 2, text: 'Mise à jour système v2.4', time: '1 heure' },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        color: '#1e293b',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px !important' }}>
        {/* Partie gauche */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={basculerMenuLateral}
            sx={{ color: '#64748b', display: { sm: 'none' } }}
          >
            <BiMenu size={24} />
          </IconButton>

          <Typography
            variant="h6"
            sx={{ 
              fontWeight: 800, 
              letterSpacing: '-0.5px',
              color: '#1e293b'
            }}
          >
            AIS <span style={{ fontWeight: 500, fontSize: '14px', color: '#2563eb' }}>• IoT Dashboard</span>
          </Typography>
        </Box>

        {/* Partie droite */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          
          {/* Notifications & Messages */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton onClick={handleNotificationOpen} sx={styles.iconButton}>
              <Badge badgeContent={notifications.length} color="error">
                <BiBell size={22} />
              </Badge>
            </IconButton>

            <IconButton sx={styles.iconButton}>
              <Badge badgeContent={1} color="primary">
                <BiEnvelope size={22} />
              </Badge>
            </IconButton>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: '24px', alignSelf: 'center' }} />

          {/* Profil utilisateur */}
          <Box 
            onClick={handleMenuOpen}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '12px',
              transition: '0.2s',
              '&:hover': { bgcolor: '#f1f5f9' }
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#2563eb',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              {getInitiales(user?.name)}
            </Avatar>
            
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', lineHeight: 1 }}>
                {user?.name || 'Utilisateur'}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#64748b', mt: 0.5 }}>
                {user?.role || 'Administrateur'}
              </Typography>
            </Box>
            <BiChevronDown color="#94a3b8" />
          </Box>
        </Box>

        {/* Menu Notifications */}
        <Menu
          anchorEl={notificationAnchor}
          open={notificationOpen}
          onClose={handleNotificationClose}
          PaperProps={{ sx: styles.menuPaper }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Notifications</Typography>
          </Box>
          {notifications.map((n) => (
            <MenuItem key={n.id} onClick={handleNotificationClose} sx={styles.menuItem}>
              <Box>
                <Typography sx={{ fontSize: '13px', color: '#1e293b' }}>{n.text}</Typography>
                <Typography sx={{ fontSize: '11px', color: '#94a3b8' }}>{n.time}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Menu Compte */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{ sx: styles.menuPaper }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleMenuClose} sx={styles.menuItem}>
            <BiUserCircle size={20} style={{ marginRight: '12px', color: '#2563eb' }} />
            Mon Profil
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={styles.menuItem}>
            <BiCog size={20} style={{ marginRight: '12px', color: '#64748b' }} />
            Paramètres
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={handleLogout} sx={{ ...styles.menuItem, color: '#ef4444' }}>
            <BiLogOut size={20} style={{ marginRight: '12px' }} />
            Déconnexion
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

const styles = {
  iconButton: {
    color: '#64748b',
    borderRadius: '10px',
    '&:hover': { bgcolor: '#f1f5f9', color: '#2563eb' }
  },
  menuPaper: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    mt: 1,
    minWidth: 220,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  },
  menuItem: {
    fontSize: '14px',
    py: 1.5,
    px: 2,
    color: '#475569',
    '&:hover': { bgcolor: '#f8fafc', color: '#2563eb' }
  }
};

export default EnteteDashboard;