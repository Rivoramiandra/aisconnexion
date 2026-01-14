import React, { useState, useEffect } from 'react';
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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Snackbar,
  Tooltip,
  Stack,
  InputAdornment,
  TextField,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Check as CheckIcon,
  Delete as DeleteIcon,
  Wifi as WifiIcon,
  Devices as DevicesIcon,
  Block as BlockIcon,
  Search as SearchIcon,
  Computer as ComputerIcon,
  CheckCircle as CheckCircleIcon,
  Payment as PaymentIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  LockOpen as LockOpenIcon,
  Calculate as CalculateIcon,
  Receipt as ReceiptIcon,
  DoneAll as DoneAllIcon,
  Visibility as VisibilityIcon,
  Timer as TimerIcon,
  HourglassEmpty as HourglassEmptyIcon,
  AccessTimeFilled as AccessTimeFilledIcon
} from '@mui/icons-material';

// Fonction pour convertir la durée en heures
const convertirDureeEnHeures = (duree) => {
  if (!duree || duree === '0') return 0;
  
  if (duree.includes('h')) {
    return parseInt(duree);
  } else if (duree.includes('j')) {
    const jours = parseInt(duree);
    return jours * 24;
  }
  return 0;
};

// Fonction pour formater le temps restant
const formaterTempsRestant = (heuresRestantes) => {
  if (heuresRestantes <= 0) return 'Expiré';
  
  if (heuresRestantes >= 24) {
    const jours = Math.floor(heuresRestantes / 24);
    const heures = Math.floor(heuresRestantes % 24);
    return `${jours}j ${heures > 0 ? `${heures}h` : ''}`;
  }
  return `${Math.floor(heuresRestantes)}h`;
};

// Calculer le temps écoulé depuis la date de création
const calculerTempsEcoule = (dateCreation) => {
  const maintenant = new Date();
  const date = new Date(dateCreation);
  const diffMs = maintenant - date;
  const diffHeures = diffMs / (1000 * 60 * 60);
  return diffHeures;
};

// Données statiques pour les appareils - trois statuts
const initialAppareils = [
  { id: 1, ip: '192.168.1.101', mac: '00:1A:2B:3C:4D:10', statut: 'bloque', montant: 5000, duree: '24h', created_at: '2024-01-15 10:30:00', paiement_termine: false },
  { id: 2, ip: '192.168.1.102', mac: '00:1A:2B:3C:4D:11', statut: 'actif', montant: 5000, duree: '24h', created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19), paiement_termine: true },
  { id: 3, ip: '192.168.1.103', mac: '00:1A:2B:3C:4D:12', statut: 'paiement_termine', montant: 3000, duree: '12h', created_at: '2024-01-15 12:00:00', paiement_termine: true },
  { id: 4, ip: '192.168.1.104', mac: '00:1A:2B:3C:4D:13', statut: 'actif', montant: 10000, duree: '7j', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19), paiement_termine: true },
  { id: 5, ip: '192.168.1.105', mac: '00:1A:2B:3C:4D:14', statut: 'bloque', montant: 10000, duree: '7j', created_at: '2024-01-15 14:20:00', paiement_termine: false },
  { id: 6, ip: '192.168.1.106', mac: '00:1A:2B:3C:4D:15', statut: 'paiement_termine', montant: 7500, duree: '48h', created_at: '2024-01-15 15:10:00', paiement_termine: true },
  { id: 7, ip: '192.168.1.107', mac: '00:1A:2B:3C:4D:16', statut: 'actif', montant: 1500, duree: '6h', created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19), paiement_termine: true },
  { id: 8, ip: '192.168.1.108', mac: '00:1A:2B:3C:4D:17', statut: 'paiement_termine', montant: 1500, duree: '6h', created_at: '2024-01-15 17:30:00', paiement_termine: true },
  { id: 9, ip: '192.168.1.109', mac: '00:1A:2B:3C:4D:18', statut: 'actif', montant: 25000, duree: '30j', created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19), paiement_termine: true },
];

// Options de durée
const dureeOptions = [
  { value: '1h', label: '1 Heure', prix: 500 },
  { value: '6h', label: '6 Heures', prix: 1500 },
  { value: '12h', label: '12 Heures', prix: 3000 },
  { value: '24h', label: '24 Heures', prix: 5000 },
  { value: '48h', label: '48 Heures', prix: 7500 },
  { value: '7j', label: '7 Jours', prix: 10000 },
  { value: '30j', label: '30 Jours', prix: 25000 },
  { value: 'illimite', label: 'Illimité', prix: 50000 },
];

const AppareilsPage = () => {
  const [appareils, setAppareils] = useState(initialAppareils);
  const [openConfirm, setOpenConfirm] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(null);
  const [openReconnectDialog, setOpenReconnectDialog] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(null);
  
  // États pour le formulaire de reconnexion
  const [nouveauTarif, setNouveauTarif] = useState('');
  const [dureeConnexion, setDureeConnexion] = useState('24h');
  const [totalMontant, setTotalMontant] = useState(5000);

  // Filtrer les appareils par statut
  const appareilsActifs = appareils.filter(a => a.statut === 'actif');
  const appareilsBloques = appareils.filter(a => a.statut === 'bloque');
  const appareilsPaiementTermine = appareils.filter(a => a.statut === 'paiement_termine');

  // Fonction pour calculer le temps restant pour chaque appareil actif
  const calculerTempsRestant = (appareil) => {
    const dureeTotaleHeures = convertirDureeEnHeures(appareil.duree);
    const tempsEcouleHeures = calculerTempsEcoule(appareil.created_at);
    const tempsRestantHeures = dureeTotaleHeures - tempsEcouleHeures;
    
    return {
      heuresRestantes: tempsRestantHeures,
      pourcentage: dureeTotaleHeures > 0 ? Math.max(0, Math.min(100, (tempsEcouleHeures / dureeTotaleHeures) * 100)) : 0,
      estExpire: tempsRestantHeures <= 0
    };
  };

  // Mettre à jour le statut des appareils expirés
  useEffect(() => {
    const interval = setInterval(() => {
      setAppareils(prevAppareils => 
        prevAppareils.map(appareil => {
          if (appareil.statut === 'actif') {
            const { heuresRestantes } = calculerTempsRestant(appareil);
            if (heuresRestantes <= 0) {
              return { ...appareil, statut: 'bloque', paiement_termine: false };
            }
          }
          return appareil;
        })
      );
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(interval);
  }, []);

  const getStatutChip = (statut, paiement_termine) => {
    switch(statut) {
      case 'actif':
        return (
          <Chip
            icon={<WifiIcon />}
            label={paiement_termine ? "Actif (Payé)" : "Actif"}
            color="success"
            size="small"
            sx={{ borderRadius: 1 }}
          />
        );
      case 'bloque':
        return (
          <Chip
            icon={<BlockIcon />}
            label="Bloqué"
            color="error"
            size="small"
            sx={{ borderRadius: 1 }}
          />
        );
      case 'paiement_termine':
        return (
          <Chip
            icon={<ReceiptIcon />}
            label="Paiement terminé"
            color="info"
            size="small"
            sx={{ borderRadius: 1 }}
          />
        );
      default:
        return null;
    }
  };

  const getCouleurProgression = (pourcentage) => {
    if (pourcentage < 50) return 'success';
    if (pourcentage < 80) return 'warning';
    return 'error';
  };

  const handleBloquer = (id) => {
    setAppareils(appareils.map(appareil =>
      appareil.id === id ? { ...appareil, statut: 'bloque', montant: 0, duree: '0' } : appareil
    ));
    setSnackbarMessage('Appareil bloqué avec succès');
    setOpenSnackbar(true);
  };

  const handleSupprimer = (id) => {
    setAppareils(appareils.filter(appareil => appareil.id !== id));
    setOpenConfirm(null);
    setSnackbarMessage('Appareil supprimé avec succès');
    setOpenSnackbar(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredAppareils = (list) => {
    return list.filter(appareil =>
      appareil.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appareil.mac.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleReconnecter = (id) => {
    const appareil = getAppareilById(id);
    if (appareil) {
      setNouveauTarif(appareil.montant.toString());
      setDureeConnexion(appareil.duree !== '0' ? appareil.duree : '24h');
      // Calculer le total initial basé sur le tarif existant
      const dureeOption = dureeOptions.find(opt => opt.value === (appareil.duree !== '0' ? appareil.duree : '24h'));
      setTotalMontant(dureeOption ? dureeOption.prix : 5000);
    }
    setOpenReconnectDialog(id);
  };

  const handlePaiement = (id) => {
    setOpenPaymentDialog(id);
  };

  const handleVoirDetails = (id) => {
    setOpenViewDialog(id);
  };

  const handleDureeChange = (event) => {
    const selectedDuree = event.target.value;
    setDureeConnexion(selectedDuree);
    
    // Calculer le total basé sur la durée sélectionnée
    const dureeOption = dureeOptions.find(opt => opt.value === selectedDuree);
    if (dureeOption) {
      setTotalMontant(dureeOption.prix);
      setNouveauTarif(dureeOption.prix.toString());
    }
  };

  const handleTarifChange = (event) => {
    const value = event.target.value;
    setNouveauTarif(value);
    
    // Mettre à jour le total avec le nouveau tarif
    if (value && !isNaN(value)) {
      setTotalMontant(parseInt(value));
    }
  };

  const calculerTotal = () => {
    const tarif = parseInt(nouveauTarif) || 0;
    return tarif;
  };

  const confirmerReconnexion = () => {
    if (openReconnectDialog) {
      const tarifNum = parseInt(nouveauTarif) || 0;
      const maintenant = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setAppareils(appareils.map(appareil =>
        appareil.id === openReconnectDialog ? { 
          ...appareil, 
          statut: 'actif',
          montant: tarifNum,
          duree: dureeConnexion,
          created_at: maintenant,
          paiement_termine: true
        } : appareil
      ));
      setOpenReconnectDialog(null);
      setSnackbarMessage('Appareil reconnecté avec succès');
      setOpenSnackbar(true);
    }
  };

  const confirmerPaiement = () => {
    if (openPaymentDialog) {
      const appareil = getAppareilById(openPaymentDialog);
      setAppareils(appareils.map(appareil =>
        appareil.id === openPaymentDialog ? { 
          ...appareil, 
          statut: 'paiement_termine',
          paiement_termine: true 
        } : appareil
      ));
      setOpenPaymentDialog(null);
      setSnackbarMessage('Paiement enregistré avec succès');
      setOpenSnackbar(true);
    }
  };

  const getAppareilById = (id) => {
    return appareils.find(a => a.id === id);
  };

  const getTarifRecent = (id) => {
    const appareil = getAppareilById(id);
    return appareil ? appareil.montant : 0;
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
              Gestion des Appareils
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez les connexions internet et les temps d'accès
            </Typography>
          </Box>
        </Box>

        {/* Barre de recherche */}
        <TextField
          fullWidth
          placeholder="Rechercher par IP ou MAC..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Navigation par onglets */}
      <Paper sx={{ mb: 3, borderRadius: 1 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': { fontWeight: 600 },
            '& .Mui-selected': { color: 'primary.main' }
          }}
        >
          <Tab 
            icon={<WifiIcon />} 
            iconPosition="start"
            label={`Actifs (${appareilsActifs.length})`} 
          />
          <Tab 
            icon={<BlockIcon />} 
            iconPosition="start"
            label={`Bloqués (${appareilsBloques.length})`} 
          />
          <Tab 
            icon={<ReceiptIcon />} 
            iconPosition="start"
            label={`Paiements terminés (${appareilsPaiementTermine.length})`} 
          />
        </Tabs>
      </Paper>

      {/* Tableau des appareils actifs */}
      {tabValue === 0 && (
        <Paper sx={{ borderRadius: 1, overflow: 'hidden', mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2,
            bgcolor: 'success.light'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WifiIcon color="success" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Appareils Actifs ({appareilsActifs.length})
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Appareils avec accès internet actif
            </Typography>
          </Box>
          
          {appareilsActifs.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <DevicesIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Aucun appareil actif
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>IP</TableCell>
                    <TableCell>Adresse MAC</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Montant</TableCell>
                    <TableCell>Temps restant</TableCell>
                    <TableCell>Progression</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppareils(appareilsActifs).map((appareil) => {
                    const { heuresRestantes, pourcentage, estExpire } = calculerTempsRestant(appareil);
                    const tempsFormate = formaterTempsRestant(heuresRestantes);
                    
                    return (
                      <TableRow key={appareil.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ComputerIcon fontSize="small" color="action" />
                            <Typography>
                              {appareil.ip}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {appareil.mac}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {getStatutChip(appareil.statut, appareil.paiement_termine)}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MoneyIcon fontSize="small" color="primary" />
                            <Typography variant="body1" fontWeight="medium" color="primary">
                              {appareil.montant?.toLocaleString()} FCFA
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {estExpire ? (
                              <HourglassEmptyIcon fontSize="small" color="error" />
                            ) : (
                              <AccessTimeFilledIcon fontSize="small" color="primary" />
                            )}
                            <Box>
                              <Typography 
                                variant="body1" 
                                fontWeight="medium" 
                                color={estExpire ? "error" : "primary"}
                              >
                                {tempsFormate}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                sur {appareil.duree}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                            <Box sx={{ flexGrow: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={pourcentage} 
                                color={getCouleurProgression(pourcentage)}
                                sx={{ 
                                  height: 8, 
                                  borderRadius: 4,
                                  backgroundColor: 'grey.200'
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                              {Math.round(pourcentage)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Bloquer l'appareil">
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                startIcon={<BlockIcon />}
                                onClick={() => handleBloquer(appareil.id)}
                              >
                                Bloquer
                              </Button>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton
                                size="small"
                                color="default"
                                onClick={() => setOpenConfirm(appareil.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Tableau des appareils bloqués */}
      {tabValue === 1 && (
        <Paper sx={{ borderRadius: 1, overflow: 'hidden', mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2,
            bgcolor: 'error.light'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BlockIcon color="error" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Appareils Bloqués ({appareilsBloques.length})
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Réactivez l'accès internet avec paiement
            </Typography>
          </Box>
          
          {appareilsBloques.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Aucun appareil bloqué
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>IP</TableCell>
                    <TableCell>Adresse MAC</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Tarif proposé</TableCell>
                    <TableCell>Durée</TableCell>
                    <TableCell>Date de blocage</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppareils(appareilsBloques).map((appareil) => (
                    <TableRow key={appareil.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ComputerIcon fontSize="small" color="action" />
                          <Typography>
                            {appareil.ip}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {appareil.mac}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatutChip(appareil.statut)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MoneyIcon fontSize="small" color="primary" />
                          <Typography variant="body1" fontWeight="medium">
                            {appareil.montant > 0 ? `${appareil.montant.toLocaleString()} FCFA` : 'Gratuit'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TimeIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {appareil.duree !== '0' ? appareil.duree : 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {appareil.created_at}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Reconnecter avec nouveau tarif">
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<LockOpenIcon />}
                              onClick={() => handleReconnecter(appareil.id)}
                            >
                              Reconnecter
                            </Button>
                          </Tooltip>
                          <Tooltip title="Marquer comme payé">
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<PaymentIcon />}
                              onClick={() => handlePaiement(appareil.id)}
                            >
                              Paiement
                            </Button>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton
                              size="small"
                              color="default"
                              onClick={() => setOpenConfirm(appareil.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Tableau des appareils avec paiement terminé */}
      {tabValue === 2 && (
        <Paper sx={{ borderRadius: 1, overflow: 'hidden', mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2,
            bgcolor: 'info.light'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon color="info" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Paiements Terminés ({appareilsPaiementTermine.length})
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Historique des appareils avec paiement effectué
            </Typography>
          </Box>
          
          {appareilsPaiementTermine.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <ReceiptIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Aucun paiement enregistré
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>IP</TableCell>
                    <TableCell>Adresse MAC</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Montant payé</TableCell>
                    <TableCell>Durée achetée</TableCell>
                    <TableCell>Date du paiement</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppareils(appareilsPaiementTermine).map((appareil) => (
                    <TableRow key={appareil.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ComputerIcon fontSize="small" color="action" />
                          <Typography>
                            {appareil.ip}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {appareil.mac}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatutChip(appareil.statut, appareil.paiement_termine)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MoneyIcon fontSize="small" color="success" />
                          <Typography variant="body1" fontWeight="bold" color="success">
                            {appareil.montant > 0 ? `${appareil.montant.toLocaleString()} FCFA` : 'Gratuit'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TimeIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {appareil.duree !== '0' ? appareil.duree : 'Standard'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {appareil.created_at}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Voir les détails">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleVoirDetails(appareil.id)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton
                              size="small"
                              color="default"
                              onClick={() => setOpenConfirm(appareil.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Dialog de reconnexion avec nouveau tarif */}
      <Dialog
        open={openReconnectDialog !== null}
        onClose={() => {
          setOpenReconnectDialog(null);
          setNouveauTarif('');
          setDureeConnexion('24h');
          setTotalMontant(5000);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          bgcolor: 'primary.main', 
          color: 'white'
        }}>
          <LockOpenIcon />
          Reconnecter l'appareil
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Informations de l'appareil
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Adresse IP</Typography>
                  <Typography>{getAppareilById(openReconnectDialog)?.ip}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Adresse MAC</Typography>
                  <Typography>{getAppareilById(openReconnectDialog)?.mac}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Tarif précédent</Typography>
                  <Typography>{getTarifRecent(openReconnectDialog).toLocaleString()} FCFA</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Nouvelle configuration
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Durée de connexion</InputLabel>
                <Select
                  value={dureeConnexion}
                  label="Durée de connexion"
                  onChange={handleDureeChange}
                >
                  {dureeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label} ({option.prix.toLocaleString()} FCFA)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Tarif personnalisé (FCFA)"
                type="number"
                value={nouveauTarif}
                onChange={handleTarifChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">FCFA</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'action.hover', 
                borderRadius: 1, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Total à payer
                </Typography>
                <Typography variant="h6" color="primary">
                  {calculerTotal().toLocaleString()} FCFA
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReconnectDialog(null)}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={confirmerReconnexion}
            disabled={!nouveauTarif || parseInt(nouveauTarif) <= 0}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de paiement */}
      <Dialog
        open={openPaymentDialog !== null}
        onClose={() => setOpenPaymentDialog(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          bgcolor: 'success.main', 
          color: 'white' 
        }}>
          <PaymentIcon />
          Confirmer le paiement
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Détails de l'appareil
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">IP</Typography>
                <Typography>{getAppareilById(openPaymentDialog)?.ip}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">MAC</Typography>
                <Typography>{getAppareilById(openPaymentDialog)?.mac}</Typography>
              </Box>
            </Stack>
            <Divider />
            <Box sx={{ 
              p: 2, 
              bgcolor: 'success.light', 
              borderRadius: 1, 
              textAlign: 'center' 
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Montant à payer
              </Typography>
              <Typography variant="h5" color="success.main">
                {getAppareilById(openPaymentDialog)?.montant.toLocaleString()} FCFA
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Pour {getAppareilById(openPaymentDialog)?.duree}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(null)}>Annuler</Button>
          <Button variant="contained" color="success" onClick={confirmerPaiement}>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de visualisation des détails */}
      <Dialog
        open={openViewDialog !== null}
        onClose={() => setOpenViewDialog(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          bgcolor: 'info.main', 
          color: 'white' 
        }}>
          <VisibilityIcon />
          Détails du paiement
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Informations de l'appareil
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">IP</Typography>
                <Typography>{getAppareilById(openViewDialog)?.ip}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">MAC</Typography>
                <Typography>{getAppareilById(openViewDialog)?.mac}</Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack spacing={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Détails du paiement
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Montant</Typography>
                <Typography color="success.main" sx={{ fontWeight: 500 }}>
                  {getAppareilById(openViewDialog)?.montant.toLocaleString()} FCFA
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Durée</Typography>
                <Typography>{getAppareilById(openViewDialog)?.duree}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Date</Typography>
                <Typography>{getAppareilById(openViewDialog)?.created_at}</Typography>
              </Box>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(null)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={openConfirm !== null}
        onClose={() => setOpenConfirm(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          bgcolor: 'error.main', 
          color: 'white' 
        }}>
          <DeleteIcon />
          Confirmer la suppression
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l'appareil "{appareils.find(a => a.id === openConfirm)?.ip}" ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(null)}>Annuler</Button>
          <Button variant="contained" color="error" onClick={() => handleSupprimer(openConfirm)}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success"
          sx={{ 
            borderRadius: 1,
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckIcon />
            <Typography variant="body1">
              {snackbarMessage}
            </Typography>
          </Box>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppareilsPage;