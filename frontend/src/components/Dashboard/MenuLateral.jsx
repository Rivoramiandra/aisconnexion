import React from 'react';
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
  Badge 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BiGridAlt, 
  BiBarChartAlt2, 
  BiWifi, 
  BiBadgeCheck, 
  BiDevices, 
  BiHistory, 
  BiCog, 
  BiHelpCircle, 
  BiHomeAlt 
} from 'react-icons/bi';

const MenuLateral = ({ largeurMenu, mobileOuvert, fermerMenuMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuPrincipal = [
    { texte: 'Tableau de bord', icone: <BiGridAlt size={22} />, chemin: '/dashboard' },
    { texte: 'Analytique', icone: <BiBarChartAlt2 size={22} />, chemin: '/dashboard/analytique' },
    { texte: 'Accès Internet', icone: <BiWifi size={22} />, chemin: '/dashboard/acces-internet', badge: 5 },
    { texte: 'Tarifs', icone: <BiBadgeCheck size={22} />, chemin: '/dashboard/tarifs' },
    { texte: 'Appareils', icone: <BiDevices size={22} />, chemin: '/dashboard/appareils', badge: 12 },
  ];

  const menuSecondaire = [
    { texte: 'Historique', icone: <BiHistory size={22} />, chemin: '/dashboard/historique' },
    { texte: 'Paramètres', icone: <BiCog size={22} />, chemin: '/dashboard/parametres' },
  ];

  const contenuMenu = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={styles.logoBox}>
          <BiHomeAlt size={24} color="#fff" />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
            AIS Control
          </Typography>
          <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
            IoT Management
          </Typography>
        </Box>
      </Box>

      {/* Menu principal */}
      <List sx={{ flexGrow: 1, px: 2 }}>
        <Typography sx={styles.sectionTitle}>Menu Principal</Typography>
        {menuPrincipal.map((item) => {
          const estActif = location.pathname === item.chemin;
          return (
            <ListItem key={item.texte} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.chemin);
                  if (mobileOuvert) fermerMenuMobile();
                }}
                sx={estActif ? styles.activeBtn : styles.inactiveBtn}
              >
                <ListItemIcon sx={{ minWidth: 38, color: estActif ? '#2563eb' : '#64748b' }}>
                  {item.icone}
                </ListItemIcon>
                <ListItemText 
                  primary={item.texte}
                  primaryTypographyProps={{
                    fontSize: '14px',
                    fontWeight: estActif ? 700 : 500,
                  }}
                />
                {item.badge && (
                  <Badge badgeContent={item.badge} color="primary" sx={styles.customBadge} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}

        <Divider sx={{ my: 3, mx: 2, borderColor: '#f1f5f9' }} />

        <Typography sx={styles.sectionTitle}>Configuration</Typography>
        {menuSecondaire.map((item) => {
          const estActif = location.pathname === item.chemin;
          return (
            <ListItem key={item.texte} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.chemin)}
                sx={estActif ? styles.activeBtn : styles.inactiveBtn}
              >
                <ListItemIcon sx={{ minWidth: 38, color: estActif ? '#2563eb' : '#64748b' }}>
                  {item.icone}
                </ListItemIcon>
                <ListItemText 
                  primary={item.texte}
                  primaryTypographyProps={{ fontSize: '14px', fontWeight: estActif ? 700 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ p: 3, borderTop: '1px solid #f1f5f9' }}>
        <Typography sx={{ mt: 2, fontSize: '10px', color: '#cbd5e1', textAlign: 'center' }}>
          v2.4.0 © 2026 AIS
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: largeurMenu }, flexShrink: { sm: 0 } }}>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOuvert}
        onClose={fermerMenuMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: largeurMenu, borderRight: 'none' },
        }}
      >
        {contenuMenu}
      </Drawer>
      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            width: largeurMenu, 
            borderRight: '1px solid #e2e8f0',
            boxShadow: '4px 0 24px rgba(0,0,0,0.02)'
          },
        }}
        open
      >
        {contenuMenu}
      </Drawer>
    </Box>
  );
};

const styles = {
  logoBox: {
    width: 40,
    height: 40,
    bgcolor: '#2563eb',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)'
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    mb: 2,
    ml: 2
  },
  activeBtn: {
    borderRadius: '12px',
    bgcolor: '#eff6ff !important',
    color: '#2563eb',
    transition: '0.3s',
    '&:hover': { bgcolor: '#dbeafe' }
  },
  inactiveBtn: {
    borderRadius: '12px',
    color: '#64748b',
    transition: '0.2s',
    '&:hover': { bgcolor: '#f8fafc', color: '#1e293b' }
  },
  customBadge: {
    '& .MuiBadge-badge': {
      fontSize: '10px',
      fontWeight: 700,
      right: 8
    }
  }
};

export default MenuLateral;