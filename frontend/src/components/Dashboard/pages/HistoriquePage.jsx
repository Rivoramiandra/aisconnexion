import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  InputAdornment,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Avatar,
  LinearProgress,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Wifi as WifiIcon,
  Block as BlockIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Computer as ComputerIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  BarChart as ChartIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

// Données statiques pour l'historique
const historiqueData = [
  {
    id: 1,
    type: 'accès_internet',
    action: 'activation',
    utilisateur: 'Jean Dupont',
    appareil: 'PC Bureau',
    ip: '192.168.1.101',
    details: 'Accès 24h - 5000 FCFA',
    montant: 5000,
    date: '2024-01-15 14:30:00',
    statut: 'réussi',
    admin: 'Admin Principal'
  },
  {
    id: 2,
    type: 'accès_internet',
    action: 'blocage',
    utilisateur: 'Marie Martin',
    appareil: 'Smartphone Marie',
    ip: '192.168.1.102',
    details: 'Demande refusée',
    montant: 0,
    date: '2024-01-15 13:45:00',
    statut: 'réussi',
    admin: 'Admin Principal'
  },
  {
    id: 3,
    type: 'utilisateur',
    action: 'création',
    utilisateur: 'Pierre Durand',
    appareil: '-',
    ip: '-',
    details: 'Nouveau compte Utilisateur',
    montant: 0,
    date: '2024-01-14 16:30:00',
    statut: 'réussi',
    admin: 'Admin Système'
  },
  {
    id: 4,
    type: 'sécurité',
    action: 'connexion_admin',
    utilisateur: 'Admin Principal',
    appareil: 'Serveur Admin',
    ip: '192.168.1.10',
    details: 'Connexion depuis nouvelle IP',
    montant: 0,
    date: '2024-01-14 09:15:00',
    statut: 'réussi',
    admin: 'System'
  },
  {
    id: 5,
    type: 'accès_internet',
    action: 'expiration',
    utilisateur: 'Sophie Lambert',
    appareil: 'Tablet Salon',
    ip: '192.168.1.104',
    details: 'Accès expiré après 7 jours',
    montant: 10000,
    date: '2024-01-13 23:59:00',
    statut: 'automatique',
    admin: 'System'
  },
  {
    id: 6,
    type: 'paiement',
    action: 'réception',
    utilisateur: 'Client Corporate',
    appareil: 'Terminal Mobile Money',
    ip: '10.0.0.50',
    details: 'Paiement 50,000 FCFA - Offre Illimitée',
    montant: 50000,
    date: '2024-01-13 15:20:00',
    statut: 'réussi',
    admin: 'System'
  },
  {
    id: 7,
    type: 'maintenance',
    action: 'mise_à_jour',
    utilisateur: 'System',
    appareil: 'Serveur Principal',
    ip: '192.168.1.1',
    details: 'Mise à jour de sécurité v2.5.1',
    montant: 0,
    date: '2024-01-12 02:00:00',
    statut: 'réussi',
    admin: 'Admin Système'
  },
  {
    id: 8,
    type: 'utilisateur',
    action: 'suspension',
    utilisateur: 'Utilisateur Test',
    appareil: '-',
    ip: '-',
    details: 'Compte suspendu pour violation',
    montant: 0,
    date: '2024-01-11 11:30:00',
    statut: 'réussi',
    admin: 'Modérateur'
  },
  {
    id: 9,
    type: 'accès_internet',
    action: 'extension',
    utilisateur: 'Jean Dupont',
    appareil: 'PC Bureau',
    ip: '192.168.1.101',
    details: 'Extension de 12h supplémentaires',
    montant: 3000,
    date: '2024-01-10 18:45:00',
    statut: 'réussi',
    admin: 'Admin Principal'
  },
  {
    id: 10,
    type: 'configuration',
    action: 'modification',
    utilisateur: 'System',
    appareil: 'Panel Admin',
    ip: '192.168.1.10',
    details: 'Changement des tarifs d\'accès',
    montant: 0,
    date: '2024-01-09 14:00:00',
    statut: 'réussi',
    admin: 'Admin Principal'
  }
];

// Types d'actions disponibles
const actionTypes = [
  { value: 'tous', label: 'Toutes les actions' },
  { value: 'accès_internet', label: 'Accès Internet' },
  { value: 'utilisateur', label: 'Gestion Utilisateurs' },
  { value: 'paiement', label: 'Paiements' },
  { value: 'sécurité', label: 'Sécurité' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'configuration', label: 'Configuration' }
];

// Statuts disponibles
const statutOptions = [
  { value: 'tous', label: 'Tous les statuts' },
  { value: 'réussi', label: 'Réussi', color: 'success' },
  { value: 'échec', label: 'Échec', color: 'error' },
  { value: 'en_cours', label: 'En cours', color: 'warning' },
  { value: 'automatique', label: 'Automatique', color: 'info' }
];

const HistoriquePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('tous');
  const [selectedStatut, setSelectedStatut] = useState('tous');
  const [dateRange, setDateRange] = useState('7j');
  const [tabValue, setTabValue] = useState(0);
  const [openDetails, setOpenDetails] = useState(null);

  const filteredData = () => {
    return historiqueData.filter(item => {
      const matchesSearch = 
        item.utilisateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.appareil.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAction = selectedAction === 'tous' || item.type === selectedAction;
      const matchesStatut = selectedStatut === 'tous' || item.statut === selectedStatut;
      
      return matchesSearch && matchesAction && matchesStatut;
    });
  };

  const getActionIcon = (type, action) => {
    switch (type) {
      case 'accès_internet':
        return action === 'activation' ? <WifiIcon /> : <BlockIcon />;
      case 'utilisateur':
        return action === 'création' ? <PersonAddIcon /> : <PersonRemoveIcon />;
      case 'sécurité':
        return <SecurityIcon />;
      case 'paiement':
        return <MoneyIcon />;
      case 'maintenance':
        return <SettingsIcon />;
      case 'configuration':
        return <SettingsIcon />;
      default:
        return <HistoryIcon />;
    }
  };

  const getActionColor = (type, action) => {
    switch (type) {
      case 'accès_internet':
        return action === 'activation' ? 'success' : 'error';
      case 'utilisateur':
        return action === 'création' ? 'success' : 'error';
      case 'paiement':
        return 'success';
      case 'sécurité':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'réussi':
        return <CheckCircleIcon color="success" />;
      case 'échec':
        return <CancelIcon color="error" />;
      case 'en_cours':
        return <PendingIcon color="warning" />;
      case 'automatique':
        return <SettingsIcon color="info" />;
      default:
        return <HistoryIcon />;
    }
  };

  const getStatutColor = (statut) => {
    const option = statutOptions.find(opt => opt.value === statut);
    return option ? option.color : 'default';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Hier ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
  };

  const formatMontant = (montant) => {
    if (montant === 0) return '-';
    return `${montant.toLocaleString()} FCFA`;
  };

  const exportHistorique = () => {
    // Simulation d'export
    alert('Export CSV en cours...');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDetails = (id) => {
    setOpenDetails(id);
  };

  const handleCloseDetails = () => {
    setOpenDetails(null);
  };

  const getItemDetails = (id) => {
    return historiqueData.find(item => item.id === id);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* En-tête */}
      <Box sx={{ mb: 0 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Historique des Activités
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Suivi complet des actions et événements du système
            </Typography>
          </Box>
          <Chip
            icon={<HistoryIcon />}
            label={`${historiqueData.length} événements`}
            color="primary"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 1 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontWeight: 500,
                minHeight: 48
              }
            }}
          >
            <Tab icon={<HistoryIcon />} label="Tous les événements" />
            <Tab icon={<WifiIcon />} label="Accès Internet" />
            <Tab icon={<PersonIcon />} label="Utilisateurs" />
            <Tab icon={<MoneyIcon />} label="Paiements" />
            <Tab icon={<SecurityIcon />} label="Sécurité" />
            <Tab icon={<ChartIcon />} label="Statistiques" />
          </Tabs>
        </Paper>
      </Box>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Rechercher dans l'historique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Type d'action</InputLabel>
              <Select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                label="Type d'action"
                startAdornment={<FilterIcon sx={{ mr: 1 }} />}
              >
                {actionTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Statut</InputLabel>
              <Select
                value={selectedStatut}
                onChange={(e) => setSelectedStatut(e.target.value)}
                label="Statut"
              >
                {statutOptions.map((statut) => (
                  <MenuItem key={statut.value} value={statut.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {statut.value !== 'tous' && getStatutIcon(statut.value)}
                      {statut.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Période</InputLabel>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                label="Période"
                startAdornment={<CalendarIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="24h">24 dernières heures</MenuItem>
                <MenuItem value="7j">7 derniers jours</MenuItem>
                <MenuItem value="30j">30 derniers jours</MenuItem>
                <MenuItem value="90j">90 derniers jours</MenuItem>
                <MenuItem value="tous">Toute période</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Exporter l'historique">
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={exportHistorique}
                  fullWidth
                >
                  Exporter
                </Button>
              </Tooltip>
              <Tooltip title="Actualiser">
                <IconButton>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Tableau d'historique */}
      <Paper sx={{ borderRadius: 1, overflow: 'hidden', mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2,
          bgcolor: 'grey.50',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineIcon color="action" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Journal des activités ({filteredData().length})
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Dernière mise à jour: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Typography>
        </Box>
        
        {filteredData().length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Aucun événement trouvé
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ajustez vos filtres pour voir les résultats
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>Utilisateur/Appareil</TableCell>
                  <TableCell>Détails</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData().map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: `${getActionColor(item.type, item.action)}.light`, 
                            color: `${getActionColor(item.type, item.action)}.contrastText`,
                            width: 32, 
                            height: 32 
                          }}
                        >
                          {getActionIcon(item.type, item.action)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                            {item.type.replace('_', ' ')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                            {item.action.replace('_', ' ')}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.utilisateur}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.appareil}
                        </Typography>
                        {item.ip !== '-' && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            IP: {item.ip}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.details}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Par: {item.admin}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: item.montant > 0 ? 600 : 'normal',
                          color: item.montant > 0 ? 'success.main' : 'text.secondary'
                        }}
                      >
                        {formatMontant(item.montant)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(item.date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatutIcon(item.statut)}
                        label={item.statut}
                        size="small"
                        color={getStatutColor(item.statut)}
                        sx={{ borderRadius: 1, textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir les détails">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDetails(item.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog de détails */}
      <Dialog
        open={openDetails !== null}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {openDetails && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              bgcolor: 'primary.main', 
              color: 'white'
            }}>
              <HistoryIcon />
              Détails de l'événement
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              {(() => {
                const item = getItemDetails(openDetails);
                if (!item) return null;
                
                return (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: `${getActionColor(item.type, item.action)}.light`, 
                            color: `${getActionColor(item.type, item.action)}.contrastText`,
                            width: 48, 
                            height: 48 
                          }}
                        >
                          {getActionIcon(item.type, item.action)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                            {item.type.replace('_', ' ')} - {item.action.replace('_', ' ')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: #{item.id}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Informations principales
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color="text.secondary">Utilisateur</Typography>
                          <Typography sx={{ fontWeight: 500 }}>{item.utilisateur}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color="text.secondary">Appareil</Typography>
                          <Typography sx={{ fontWeight: 500 }}>{item.appareil}</Typography>
                        </Box>
                        {item.ip !== '-' && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color="text.secondary">Adresse IP</Typography>
                            <Typography sx={{ fontWeight: 500 }}>{item.ip}</Typography>
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color="text.secondary">Administrateur</Typography>
                          <Typography sx={{ fontWeight: 500 }}>{item.admin}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Détails de l'action
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color="text.secondary">Date et heure</Typography>
                          <Typography sx={{ fontWeight: 500 }}>{new Date(item.date).toLocaleString()}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color="text.secondary">Statut</Typography>
                          <Chip
                            icon={getStatutIcon(item.statut)}
                            label={item.statut}
                            size="small"
                            color={getStatutColor(item.statut)}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography color="text.secondary">Montant</Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600,
                              color: item.montant > 0 ? 'success.main' : 'text.secondary'
                            }}
                          >
                            {formatMontant(item.montant)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Description
                        </Typography>
                        <Typography>
                          {item.details}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Alert severity="info">
                        Cet événement a été enregistré automatiquement par le système.
                      </Alert>
                    </Grid>
                  </Grid>
                );
              })()}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default HistoriquePage;