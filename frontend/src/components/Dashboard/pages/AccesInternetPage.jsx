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
  Divider
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
  Cancel as CancelIcon
} from '@mui/icons-material';

// Données statiques pour les appareils EN ATTENTE uniquement
const initialAppareils = [
  { 
    id: 1, 
    ip: '192.168.1.101', 
    mac: '00:1A:2B:3C:4D:10', 
    statut: 'en_attente', 
    montant: 5000, 
    duree: '24h', 
    created_at: '2024-01-15 10:30:00',
    nom: 'PC Bureau',
    type: 'Ordinateur',
    utilisateur: 'Jean Dupont'
  },
  { 
    id: 2, 
    ip: '192.168.1.102', 
    mac: '00:1A:2B:3C:4D:11', 
    statut: 'en_attente', 
    montant: 3000, 
    duree: '12h', 
    created_at: '2024-01-15 11:15:00',
    nom: 'Smartphone Jean',
    type: 'Mobile',
    utilisateur: 'Marie Martin'
  },
  { 
    id: 3, 
    ip: '192.168.1.103', 
    mac: '00:1A:2B:3C:4D:12', 
    statut: 'en_attente', 
    montant: 1500, 
    duree: '6h', 
    created_at: '2024-01-15 13:45:00',
    nom: 'Laptop Marie',
    type: 'Ordinateur',
    utilisateur: 'Pierre Durand'
  },
  { 
    id: 4, 
    ip: '192.168.1.104', 
    mac: '00:1A:2B:3C:4D:13', 
    statut: 'en_attente', 
    montant: 10000, 
    duree: '7j', 
    created_at: '2024-01-15 14:20:00',
    nom: 'Tablet Salon',
    type: 'Tablette',
    utilisateur: 'Sophie Lambert'
  },
  { 
    id: 5, 
    ip: '192.168.1.105', 
    mac: '00:1A:2B:3C:4D:14', 
    statut: 'en_attente', 
    montant: 25000, 
    duree: '30j', 
    created_at: '2024-01-15 15:10:00',
    nom: 'Serveur NAS',
    type: 'Serveur',
    utilisateur: 'Admin Système'
  },
];

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

// Options d'offres prédéfinies
const offresOptions = [
  { id: 1, nom: 'Offre Basique', duree: '6h', prix: 1500, description: 'Accès court pour besoins temporaires' },
  { id: 2, nom: 'Offre Standard', duree: '24h', prix: 5000, description: 'Accès journalier standard' },
  { id: 3, nom: 'Offre Weekend', duree: '48h', prix: 7500, description: 'Accès pour tout le weekend' },
  { id: 4, nom: 'Offre Hebdo', duree: '7j', prix: 10000, description: 'Accès pour une semaine' },
  { id: 5, nom: 'Offre Mensuelle', duree: '30j', prix: 25000, description: 'Accès pour un mois complet' },
  { id: 6, nom: 'Offre Illimitée', duree: 'illimite', prix: 50000, description: 'Accès illimité' },
];

const AccesInternetPage = () => {
  const [appareils, setAppareils] = useState(initialAppareils);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openActiverDialog, setOpenActiverDialog] = useState(null);
  const [openBloquerDialog, setOpenBloquerDialog] = useState(null);
  
  // États pour la configuration d'accès
  const [selectedOffre, setSelectedOffre] = useState('');
  const [dureePersonnalisee, setDureePersonnalisee] = useState('24h');
  const [montantPersonnalise, setMontantPersonnalise] = useState(5000);

  // Filtrer seulement les appareils en attente
  const appareilsEnAttente = appareils.filter(a => a.statut === 'en_attente');

  const handleBloquer = (id) => {
    setOpenBloquerDialog(id);
  };

  const handleActiver = (id) => {
    const appareil = getAppareilById(id);
    if (appareil) {
      setSelectedOffre('');
      setDureePersonnalisee(appareil.duree || '24h');
      setMontantPersonnalise(appareil.montant || 5000);
    }
    setOpenActiverDialog(id);
  };

  const filteredAppareils = () => {
    return appareilsEnAttente.filter(appareil =>
      appareil.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appareil.mac.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appareil.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appareil.utilisateur.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const confirmerActivation = () => {
    if (openActiverDialog) {
      const offre = offresOptions.find(o => o.id === parseInt(selectedOffre));
      let duree, montant;
      
      if (selectedOffre && offre) {
        duree = offre.duree;
        montant = offre.prix;
      } else {
        duree = dureePersonnalisee;
        montant = montantPersonnalise;
      }

      // Simuler la mise à jour
      setAppareils(prevAppareils => 
        prevAppareils.filter(appareil => appareil.id !== openActiverDialog)
      );
      
      setOpenActiverDialog(null);
      setSnackbarMessage('Accès internet activé avec succès');
      setOpenSnackbar(true);
    }
  };

  const confirmerBlocage = () => {
    if (openBloquerDialog) {
      // Simuler la suppression
      setAppareils(prevAppareils => 
        prevAppareils.filter(appareil => appareil.id !== openBloquerDialog)
      );
      
      setOpenBloquerDialog(null);
      setSnackbarMessage('Appareil bloqué avec succès');
      setOpenSnackbar(true);
    }
  };

  const getAppareilById = (id) => {
    return appareils.find(a => a.id === id);
  };

  const handleOffreChange = (event) => {
    const offreId = event.target.value;
    setSelectedOffre(offreId);
    
    if (offreId) {
      const offre = offresOptions.find(o => o.id === parseInt(offreId));
      if (offre) {
        setDureePersonnalisee(offre.duree);
        setMontantPersonnalise(offre.prix);
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
    setMontantPersonnalise(event.target.value);
  };

  const calculerTotal = () => {
    return selectedOffre ? 
           offresOptions.find(o => o.id === parseInt(selectedOffre))?.prix || 0 : 
           montantPersonnalise;
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
              Demande d'Accès Internet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez les demandes d'accès internet des appareils
            </Typography>
          </Box>
          <Chip
            icon={<HourglassEmptyIcon />}
            label={`${appareilsEnAttente.length} appareil(s) en attente`}
            color="warning"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Barre de recherche */}
        <TextField
          fullWidth
          placeholder="Rechercher par IP, MAC, nom ou utilisateur..."
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
      <Paper sx={{ borderRadius: 1, overflow: 'hidden', mb: 3 }}>
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
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Aucune demande en attente
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Toutes les demandes d'accès ont été traitées
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Appareil</TableCell>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Adresse IP</TableCell>
                  <TableCell>Adresse MAC</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Date demande</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppareils().map((appareil) => (
                  <TableRow key={appareil.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ComputerIcon fontSize="small" color="action" />
                        <Box>
                          <Typography>
                            {appareil.nom}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {appareil.type}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {appareil.utilisateur}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {appareil.ip}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {appareil.mac}
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
                        {new Date(appareil.created_at).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(appareil.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
          setOpenActiverDialog(null);
          setSelectedOffre('');
          setDureePersonnalisee('24h');
          setMontantPersonnalise(5000);
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
          <WifiIcon />
          Activer l'accès internet
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {openActiverDialog && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                    Informations de l'appareil
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Appareil</Typography>
                      <Typography>{getAppareilById(openActiverDialog)?.nom}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Utilisateur</Typography>
                      <Typography>{getAppareilById(openActiverDialog)?.utilisateur}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Adresse IP</Typography>
                      <Typography>{getAppareilById(openActiverDialog)?.ip}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                    Offres prédéfinies
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel>Choisir une offre</InputLabel>
                    <Select
                      value={selectedOffre}
                      label="Choisir une offre"
                      onChange={handleOffreChange}
                    >
                      <MenuItem value="">
                        <em>Aucune offre sélectionnée</em>
                      </MenuItem>
                      {offresOptions.map((offre) => (
                        <MenuItem key={offre.id} value={offre.id}>
                          {offre.nom} ({offre.duree} - {offre.prix.toLocaleString()} FCFA)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
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
                    >
                      {dureeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label} ({option.prix.toLocaleString()} FCFA)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    size="small"
                    label="Montant personnalisé (FCFA)"
                    type="number"
                    value={montantPersonnalise}
                    onChange={handleMontantChange}
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
                <Grid item xs={12}>
                  <Alert severity="info">
                    L'accès internet sera activé immédiatement après confirmation.
                  </Alert>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenActiverDialog(null);
              setSelectedOffre('');
              setDureePersonnalisee('24h');
              setMontantPersonnalise(5000);
            }}
            startIcon={<CancelIcon />}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={confirmerActivation}
            startIcon={<CheckIcon />}
            disabled={!selectedOffre && (!dureePersonnalisee || !montantPersonnalise)}
          >
            Confirmer l'activation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de blocage */}
      <Dialog
        open={openBloquerDialog !== null}
        onClose={() => setOpenBloquerDialog(null)}
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
          <BlockIcon />
          Refuser l'accès internet
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {openBloquerDialog && (
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
                    <Typography color="text.secondary">Appareil</Typography>
                    <Typography>{getAppareilById(openBloquerDialog)?.nom}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Utilisateur</Typography>
                    <Typography>{getAppareilById(openBloquerDialog)?.utilisateur}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Adresse IP</Typography>
                    <Typography>{getAppareilById(openBloquerDialog)?.ip}</Typography>
                  </Box>
                </Stack>
                <Divider />
                <Alert severity="info">
                  L'utilisateur pourra faire une nouvelle demande d'accès ultérieurement.
                </Alert>
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBloquerDialog(null)}>Annuler</Button>
          <Button variant="contained" color="error" onClick={confirmerBlocage}>
            Confirmer le blocage
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

export default AccesInternetPage;