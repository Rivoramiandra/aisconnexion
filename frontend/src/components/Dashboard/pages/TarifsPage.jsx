// src/pages/TarifsPage.jsx
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
  TextField,
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
  Grid,
  TablePagination,
  CircularProgress,
  Backdrop
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  Check as CheckIcon,
  Search as SearchIcon,
  LocalOffer as OfferIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { offreService } from '../../../services/offreService';

const TarifsPage = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    montant: '',
    duree: ''
  });
  const [errors, setErrors] = useState({
    nom: false,
    montant: false,
    duree: false
  });
  const [apiErrors, setApiErrors] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  // Charger les offres depuis l'API
  const fetchOffres = async () => {
    setLoading(true);
    try {
      const response = await offreService.getAll();
      if (response.success) {
        setOffres(response.data);
      } else {
        throw new Error(response.message || 'Erreur lors du chargement');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
      showSnackbar(error.message || 'Erreur lors du chargement des offres', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffres();
  }, []);

  const resetForm = () => {
    setFormData({ nom: '', montant: '', duree: '' });
    setErrors({ nom: false, montant: false, duree: false });
    setApiErrors({});
    setEditingId(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleOpenDialog = (offre = null) => {
    if (offre) {
      setFormData({
        nom: offre.nom || '',
        montant: offre.montant ? offre.montant.toString() : '',
        duree: offre.duree ? offre.duree.toString() : ''
      });
      setEditingId(offre.id);
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTimeout(resetForm, 300);
  };

  const validateForm = () => {
    const newErrors = {
      nom: !formData.nom.trim(),
      montant: !formData.montant || isNaN(formData.montant) || parseFloat(formData.montant) <= 0,
      duree: !formData.duree || isNaN(formData.duree) || parseInt(formData.duree) <= 0
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showSnackbar('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }

    setLoadingAction(true);
    setApiErrors({});
    
    try {
      const offreData = {
        nom: formData.nom.trim(),
        montant: parseFloat(formData.montant),
        duree: parseInt(formData.duree)
      };

      let response;
      if (editingId) {
        response = await offreService.update(editingId, offreData);
        showSnackbar(response.message || 'Offre modifiée avec succès');
      } else {
        response = await offreService.create(offreData);
        showSnackbar(response.message || 'Offre ajoutée avec succès');
      }

      // Recharger les offres
      await fetchOffres();
      handleCloseDialog();
      setPage(0);
    } catch (error) {
      console.error('Erreur:', error);
      
      // Gestion des erreurs de validation du backend
      if (error.response && error.response.data && error.response.data.errors) {
        setApiErrors(error.response.data.errors);
        const errorMessages = Object.values(error.response.data.errors).flat();
        showSnackbar(errorMessages[0] || 'Veuillez corriger les erreurs', 'error');
      } else if (error.response && error.response.data && error.response.data.message) {
        showSnackbar(error.response.data.message, 'error');
      } else {
        showSnackbar('Une erreur est survenue', 'error');
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingAction(true);
    try {
      const response = await offreService.delete(id);
      showSnackbar(response.message || 'Offre supprimée avec succès');
      
      // Mettre à jour la liste locale
      setOffres(offres.filter(offre => offre.id !== id));
      setDeleteConfirm(null);
      
      // Réinitialiser la pagination si nécessaire
      if (page > 0 && offres.length <= (page * rowsPerPage)) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        showSnackbar(error.response.data.message, 'error');
      } else {
        showSnackbar('Erreur lors de la suppression', 'error');
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(montant);
  };

  const formatDuree = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${minutes} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
    
    // Effacer les erreurs de validation
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: false
      });
    }
    
    // Effacer les erreurs API pour ce champ
    if (apiErrors[field]) {
      const newApiErrors = { ...apiErrors };
      delete newApiErrors[field];
      setApiErrors(newApiErrors);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fonction de recherche
  const filteredOffres = offres.filter(offre =>
    offre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offre.montant.toString().includes(searchTerm) ||
    offre.duree.toString().includes(searchTerm) ||
    (offre.montant_formate && offre.montant_formate.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedOffres = filteredOffres.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Statistiques
  const totalOffres = offres.length;
  const totalMontant = offres.reduce((sum, offre) => sum + parseFloat(offre.montant), 0);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des offres...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête avec statistiques */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Gestion des Tarifs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalOffres} offre(s) disponible(s) • Total valeur: {formatMontant(totalMontant)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchOffres}
              disabled={loading}
            >
              Actualiser
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ borderRadius: 1 }}
            >
              Nouvelle Offre
            </Button>
          </Box>
        </Box>

        {/* Barre de recherche */}
        <TextField
          fullWidth
          placeholder="Rechercher une offre par nom, montant ou durée..."
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

      {/* Table des offres - SANS colonne Prix/heure */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                {['Nom de l\'offre', 'Durée', 'Montant', 'Date création', 'Actions'].map((header) => (
                  <TableCell key={header} sx={{ color: 'white', fontWeight: 600 }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOffres.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <ErrorIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography color="text.secondary" gutterBottom>
                        {searchTerm ? 'Aucune offre ne correspond à votre recherche' : 'Aucune offre disponible'}
                      </Typography>
                      {!searchTerm && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenDialog()}
                          sx={{ mt: 2 }}
                        >
                          Créer votre première offre
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOffres.map((offre) => (
                  <TableRow 
                    key={offre.id}
                    hover
                    sx={{ 
                      '&:last-child td': { border: 0 },
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <OfferIcon fontSize="small" color="primary" />
                        <Typography fontWeight={500}>
                          {offre.nom || 'Sans nom'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<TimeIcon />}
                        label={offre.duree_formatee || formatDuree(offre.duree)}
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MoneyIcon fontSize="small" color="success" />
                        <Typography sx={{ fontWeight: 600 }}>
                          {offre.montant_formate || formatMontant(offre.montant)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {offre.created_at || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(offre)}
                            disabled={loadingAction}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteConfirm(offre.id)}
                            disabled={loadingAction}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {filteredOffres.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredOffres.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        )}
      </Paper>

      {/* Modal d'ajout/modification - SANS calcul de prix par heure */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '500px',
            height: 'auto',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}>
          {editingId ? 'Modifier l\'offre' : 'Nouvelle offre'}
        </DialogTitle>
        
        <DialogContent 
          dividers
          sx={{ 
            p: 3,
            overflow: 'auto'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de l'offre"
                value={formData.nom}
                onChange={handleInputChange('nom')}
                error={errors.nom || !!apiErrors.nom}
                helperText={errors.nom ? "Le nom est requis" : apiErrors.nom ? apiErrors.nom[0] : "Ex: Forfait 3 heures"}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Montant (MGA)"
                type="number"
                value={formData.montant}
                onChange={handleInputChange('montant')}
                error={errors.montant || !!apiErrors.montant}
                helperText={errors.montant ? "Montant invalide" : apiErrors.montant ? apiErrors.montant[0] : ""}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><MoneyIcon /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Durée (minutes)"
                type="number"
                value={formData.duree}
                onChange={handleInputChange('duree')}
                error={errors.duree || !!apiErrors.duree}
                helperText={errors.duree ? "Durée invalide" : apiErrors.duree ? apiErrors.duree[0] : "Ex: 60 pour 1 heure"}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><TimeIcon /></InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          pt: 2,
          borderTop: 1,
          borderColor: 'divider',
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.paper'
        }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            disabled={loadingAction}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ ml: 1 }}
            disabled={loadingAction}
            startIcon={loadingAction && <CircularProgress size={20} color="inherit" />}
          >
            {loadingAction ? 'Traitement...' : editingId ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation de suppression */}
      <Dialog
        open={deleteConfirm !== null}
        onClose={() => !loadingAction && setDeleteConfirm(null)}
        PaperProps={{
          sx: {
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'error.main',
          color: 'white',
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon />
            Confirmer la suppression
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
          >
            Cette action est irréversible
          </Alert>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l'offre <strong>"{offres.find(o => o.id === deleteConfirm)?.nom || 'cette offre'}"</strong> ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setDeleteConfirm(null)}
            variant="outlined"
            disabled={loadingAction}
          >
            Annuler
          </Button>
          <Button 
            onClick={() => handleDelete(deleteConfirm)} 
            variant="contained"
            color="error"
            sx={{ ml: 1 }}
            disabled={loadingAction}
            startIcon={loadingAction ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
            {loadingAction ? 'Suppression...' : 'Supprimer'}
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

export default TarifsPage;