// src/pages/AccesInternetPage.jsx
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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  Backdrop
} from '@mui/material';
import {
  Check as CheckIcon,
  Delete as DeleteIcon,
  Wifi as WifiIcon,
  Block as BlockIcon,
  Search as SearchIcon,
  Computer as ComputerIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  Cached as CachedIcon
} from '@mui/icons-material';
import { appareilService } from '../../../services/appareilService';
import { offreService } from '../../../services/offreService';

const AccesInternetPage = () => {
  const [appareils, setAppareils] = useState([]);
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [openActiverDialog, setOpenActiverDialog] = useState(null);
  const [openBloquerDialog, setOpenBloquerDialog] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState('');
  const [dureePersonnalisee, setDureePersonnalisee] = useState('24h');
  const [montantPersonnalise, setMontantPersonnalise] = useState(5000);
  const [appareilDetails, setAppareilDetails] = useState(null);

  // Options de durée pour les offres
  const dureeOptions = [
    { value: '1h', label: '1 Heure', prix: 500 },
    { value: '3h', label: '3 Heures', prix: 1000 },
    { value: '6h', label: '6 Heures', prix: 1500 },
    { value: '12h', label: '12 Heures', prix: 3000 },
    { value: '24h', label: '24 Heures', prix: 5000 },
    { value: '48h', label: '48 Heures', prix: 7500 },
    { value: '7j', label: '7 Jours', prix: 10000 },
    { value: '15j', label: '15 Jours', prix: 18000 },
    { value: '30j', label: '30 Jours', prix: 25000 },
    { value: 'illimite', label: 'Illimité', prix: 50000 },
  ];

  // Charger les appareils et offres
  const fetchAppareils = async () => {
    setLoading(true);
    try {
      const response = await appareilService.getAll();
      if (response.success) {
        setAppareils(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement appareils:', error);
      showSnackbar('Erreur lors du chargement des appareils', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchOffres = async () => {
    try {
      const response = await offreService.getAll();
      if (response.success) {
        setOffres(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement offres:', error);
    }
  };

  useEffect(() => {
    fetchAppareils();
    fetchOffres();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Scanner le réseau
  const handleScanner = async () => {
    setScanning(true);
    try {
      const response = await appareilService.scanner();
      if (response.success) {
        showSnackbar(response.message, 'success');
        await fetchAppareils(); // Recharger la liste
      }
    } catch (error) {
      console.error('Erreur scan:', error);
      showSnackbar('Erreur lors du scan réseau', 'error');
    } finally {
      setScanning(false);
    }
  };

  // Filtrer seulement les appareils en attente
  const appareilsEnAttente = appareils.filter(a => a.statut === 'en_attente');

  const handleBloquer = (id) => {
    const appareil = getAppareilById(id);
    if (appareil) {
      setAppareilDetails(appareil);
      setOpenBloquerDialog(id);
    }
  };

  const handleActiver = (id) => {
    const appareil = getAppareilById(id);
    if (appareil) {
      setAppareilDetails(appareil);
      setSelectedOffre('');
      setDureePersonnalisee('24h');
      setMontantPersonnalise(5000);
      setOpenActiverDialog(id);
    }
  };

  const filteredAppareils = () => {
    return appareilsEnAttente.filter(appareil =>
      (appareil.ip && appareil.ip.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (appareil.mac && appareil.mac.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (appareil.nom && appareil.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (appareil.description && appareil.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const confirmerActivation = async () => {
    if (openActiverDialog && appareilDetails) {
      setLoadingAction(true);
      try {
        let offreData = {};
        
        if (selectedOffre) {
          const offre = offres.find(o => o.id === parseInt(selectedOffre));
          if (offre) {
            offreData = {
              offre_id: offre.id,
              duree: offre.duree,
              montant: offre.montant
            };
          }
        } else {
          // Offre personnalisée
          const dureeOption = dureeOptions.find(opt => opt.value === dureePersonnalisee);
          offreData = {
            duree: dureePersonnalisee,
            montant: montantPersonnalise,
            description: `Accès personnalisé: ${dureeOption ? dureeOption.label : dureePersonnalisee}`
          };
        }

        const response = await appareilService.activer(openActiverDialog, offreData);
        
        if (response.success) {
          showSnackbar(response.message, 'success');
          // Retirer l'appareil de la liste des en attente
          setAppareils(prev => prev.filter(a => a.id !== openActiverDialog));
          
          // Fermer le dialog
          setOpenActiverDialog(null);
          setAppareilDetails(null);
          setSelectedOffre('');
          setDureePersonnalisee('24h');
          setMontantPersonnalise(5000);
        }
      } catch (error) {
        console.error('Erreur activation:', error);
        showSnackbar('Erreur lors de l\'activation', 'error');
      } finally {
        setLoadingAction(false);
      }
    }
  };

  const confirmerBlocage = async () => {
    if (openBloquerDialog) {
      setLoadingAction(true);
      try {
        const response = await appareilService.bloquer(openBloquerDialog);
        
        if (response.success) {
          showSnackbar(response.message, 'success');
          // Retirer l'appareil de la liste
          setAppareils(prev => prev.filter(a => a.id !== openBloquerDialog));
          
          setOpenBloquerDialog(null);
          setAppareilDetails(null);
        }
      } catch (error) {
        console.error('Erreur blocage:', error);
        showSnackbar('Erreur lors du blocage', 'error');
      } finally {
        setLoadingAction(false);
      }
    }
  };

  const getAppareilById = (id) => {
    return appareils.find(a => a.id === id);
  };

  const handleOffreChange = (event) => {
    const offreId = event.target.value;
    setSelectedOffre(offreId);
    
    if (offreId) {
      const offre = offres.find(o => o.id === parseInt(offreId));
      if (offre) {
        setDureePersonnalisee(offre.duree_formatee || '24h');
        setMontantPersonnalise(offre.montant || 5000);
      }
    }
  };

  const handleDureeChange = (event) => {
    const duree = event.target.value;
    setDureePersonnalisee(duree);
    
    // Calculer le prix basé sur la durée
    const dureeOption = dureeOptions.find(opt => opt.value === duree);
    if (dureeOption) {
      setMontantPersonnalise(dureeOption.prix);
    }
  };

  const handleMontantChange = (event) => {
    setMontantPersonnalise(parseFloat(event.target.value) || 0);
  };

  const calculerTotal = () => {
    if (selectedOffre) {
      const offre = offres.find(o => o.id === parseInt(selectedOffre));
      return offre ? offre.montant : 0;
    }
    return montantPersonnalise || 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des appareils...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête avec bouton scanner */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Demande d'Accès Internet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez les demandes d'accès internet des appareils détectés
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchAppareils}
              disabled={loading}
            >
              Actualiser
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CachedIcon />}
              onClick={handleScanner}
              disabled={scanning}
              sx={{ borderRadius: 1 }}
            >
              {scanning ? 'Scan en cours...' : 'Scanner le réseau'}
            </Button>
          </Box>
        </Box>

        {/* Statistiques */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3,
          flexWrap: 'wrap' 
        }}>
          <Chip
            icon={<HourglassEmptyIcon />}
            label={`${appareilsEnAttente.length} appareil(s) en attente`}
            color="warning"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            icon={<ComputerIcon />}
            label={`${appareils.length} appareil(s) total`}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Barre de recherche */}
        <TextField
          fullWidth
          placeholder="Rechercher par IP, MAC, nom ou description..."
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

      {/* Tableau des appareils en attente */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3, boxShadow: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2,
          bgcolor: 'warning.light'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HourglassEmptyIcon color="warning" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Appareils en Attente d'Accès ({appareilsEnAttente.length})
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Acceptez ou refusez l'accès internet
          </Typography>
        </Box>
        
        {appareilsEnAttente.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucun appareil en attente
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Tous les appareils ont été traités ou aucun n'a été détecté.
            </Typography>
            <Button
              variant="contained"
              startIcon={<CachedIcon />}
              onClick={handleScanner}
              disabled={scanning}
            >
              Scanner le réseau pour détecter des appareils
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Appareil</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Adresse IP</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Adresse MAC</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date détection</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppareils().map((appareil) => (
                  <TableRow key={appareil.id} hover sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ComputerIcon fontSize="small" color="action" />
                        <Box>
                          <Typography fontWeight={500}>
                            {appareil.nom || 'Appareil inconnu'}
                          </Typography>
                          {appareil.description && (
                            <Typography variant="caption" color="text.secondary">
                              {appareil.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {appareil.ip || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {appareil.mac || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<HourglassEmptyIcon />}
                        label="En attente"
                        color="warning"
                        size="small"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(appareil.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Activer l'accès">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<WifiIcon />}
                            onClick={() => handleActiver(appareil.id)}
                            disabled={loadingAction}
                          >
                            Activer
                          </Button>
                        </Tooltip>
                        <Tooltip title="Refuser l'accès">
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<BlockIcon />}
                            onClick={() => handleBloquer(appareil.id)}
                            disabled={loadingAction}
                          >
                            Bloquer
                          </Button>
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

      {/* Modal d'activation d'accès */}
      <Dialog
        open={openActiverDialog !== null}
        onClose={() => {
          if (!loadingAction) {
            setOpenActiverDialog(null);
            setAppareilDetails(null);
            setSelectedOffre('');
            setDureePersonnalisee('24h');
            setMontantPersonnalise(5000);
          }
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          bgcolor: 'primary.main', 
          color: 'white'
        }}>
          <WifiIcon />
          Activer l'accès internet
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {appareilDetails && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                    Informations de l'appareil
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Nom</Typography>
                      <Typography fontWeight={500}>{appareilDetails.nom || 'Inconnu'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Adresse IP</Typography>
                      <Typography sx={{ fontFamily: 'monospace' }}>{appareilDetails.ip}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Adresse MAC</Typography>
                      <Typography sx={{ fontFamily: 'monospace' }}>{appareilDetails.mac || 'N/A'}</Typography>
                    </Box>
                    {appareilDetails.description && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Description</Typography>
                        <Typography>{appareilDetails.description}</Typography>
                      </Box>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                
                {offres.length > 0 && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                        Offres disponibles
                      </Typography>
                      <FormControl fullWidth size="small">
                        <InputLabel>Choisir une offre</InputLabel>
                        <Select
                          value={selectedOffre}
                          label="Choisir une offre"
                          onChange={handleOffreChange}
                          disabled={loadingAction}
                        >
                          <MenuItem value="">
                            <em>Aucune offre sélectionnée</em>
                          </MenuItem>
                          {offres.map((offre) => (
                            <MenuItem key={offre.id} value={offre.id}>
                              {offre.nom} ({offre.duree_formatee} - {offre.montant_formate})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        OU
                      </Typography>
                    </Grid>
                  </>
                )}
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                    Personnaliser l'accès
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Durée d'accès</InputLabel>
                    <Select
                      value={dureePersonnalisee}
                      label="Durée d'accès"
                      onChange={handleDureeChange}
                      disabled={loadingAction || selectedOffre}
                    >
                      {dureeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label} ({option.prix.toLocaleString()} MGA)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    size="small"
                    label="Montant personnalisé (MGA)"
                    type="number"
                    value={montantPersonnalise}
                    onChange={handleMontantChange}
                    disabled={loadingAction || selectedOffre}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">MGA</InputAdornment>,
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
                      {calculerTotal().toLocaleString()} MGA
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="info">
                    L'accès internet sera activé immédiatement après confirmation.
                    L'appareil sera retiré de la liste des en attente.
                  </Alert>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => {
              setOpenActiverDialog(null);
              setAppareilDetails(null);
              setSelectedOffre('');
              setDureePersonnalisee('24h');
              setMontantPersonnalise(5000);
            }}
            startIcon={<CancelIcon />}
            disabled={loadingAction}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={confirmerActivation}
            startIcon={loadingAction ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
            disabled={loadingAction || (!selectedOffre && (!dureePersonnalisee || !montantPersonnalise))}
          >
            {loadingAction ? 'Traitement...' : 'Confirmer l\'activation'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de blocage */}
      <Dialog
        open={openBloquerDialog !== null}
        onClose={() => !loadingAction && setOpenBloquerDialog(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          bgcolor: 'error.main', 
          color: 'white' 
        }}>
          <BlockIcon />
          Refuser l'accès internet
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {appareilDetails && (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                L'appareil n'aura pas accès à internet et devra redemander l'accès.
              </Alert>
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Appareil concerné
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Nom</Typography>
                    <Typography fontWeight={500}>{appareilDetails.nom || 'Inconnu'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Adresse IP</Typography>
                    <Typography sx={{ fontFamily: 'monospace' }}>{appareilDetails.ip}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Adresse MAC</Typography>
                    <Typography sx={{ fontFamily: 'monospace' }}>{appareilDetails.mac || 'N/A'}</Typography>
                  </Box>
                  {appareilDetails.description && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Description</Typography>
                      <Typography>{appareilDetails.description}</Typography>
                    </Box>
                  )}
                </Stack>
                <Divider />
                <Alert severity="info">
                  L'utilisateur pourra faire une nouvelle demande d'accès ultérieurement.
                  L'appareil sera retiré de la liste des en attente.
                </Alert>
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenBloquerDialog(null)}
            disabled={loadingAction}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={confirmerBlocage}
            disabled={loadingAction}
            startIcon={loadingAction ? <CircularProgress size={20} color="inherit" /> : <BlockIcon />}
          >
            {loadingAction ? 'Traitement...' : 'Confirmer le blocage'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
          sx={{ 
            borderRadius: 1,
            alignItems: 'center',
            minWidth: '300px'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {snackbarSeverity === 'success' ? <CheckIcon /> : <ErrorIcon />}
            <Typography variant="body1">
              {snackbarMessage}
            </Typography>
          </Box>
        </Alert>
      </Snackbar>

      {/* Backdrop pour les chargements */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
        open={loadingAction}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={60} />
          <Typography sx={{ mt: 2 }}>Traitement en cours...</Typography>
        </Box>
      </Backdrop>
    </Box>
  );
};

export default AccesInternetPage;