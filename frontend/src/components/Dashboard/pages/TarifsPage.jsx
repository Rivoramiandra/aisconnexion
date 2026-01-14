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
  TablePagination
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
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

// Données initiales statiques
const initialOffres = [
  { id: 1, nom: "1 Heure", montant: 5000, duree: 60, created_at: "2024-01-15 10:30:00" },
  { id: 2, nom: "Forfait 3 Heures", montant: 12000, duree: 180, created_at: "2024-01-15 10:35:00" },
  { id: 3, nom: "Forfait 5 Heures", montant: 18000, duree: 300, created_at: "2024-01-15 10:40:00" },
  { id: 4, nom: "Forfait Journée", montant: 25000, duree: 480, created_at: "2024-01-15 10:45:00" },
  { id: 5, nom: "30 Minutes", montant: 3000, duree: 30, created_at: "2024-01-15 10:50:00" },
];

const TarifsPage = () => {
  const [offres, setOffres] = useState(initialOffres);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const resetForm = () => {
    setFormData({ nom: '', montant: '', duree: '' });
    setErrors({ nom: false, montant: false, duree: false });
    setEditingId(null);
  };

  const handleOpenDialog = (offre = null) => {
    if (offre) {
      setFormData({
        nom: offre.nom,
        montant: offre.montant.toString(),
        duree: offre.duree.toString()
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

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    const newOffre = {
      id: editingId || Math.max(...offres.map(o => o.id), 0) + 1,
      nom: formData.nom.trim(),
      montant: parseFloat(formData.montant),
      duree: parseInt(formData.duree),
      created_at: new Date().toLocaleString('fr-FR')
    };
    
    if (editingId) {
      setOffres(offres.map(offre =>
        offre.id === editingId ? newOffre : offre
      ));
      setSnackbarMessage('Offre modifiée avec succès');
    } else {
      setOffres([newOffre, ...offres]);
      setSnackbarMessage('Offre ajoutée avec succès');
    }
    
    setOpenSnackbar(true);
    handleCloseDialog();
    setPage(0);
  };

  const handleDelete = (id) => {
    setOffres(offres.filter(offre => offre.id !== id));
    setDeleteConfirm(null);
    setSnackbarMessage('Offre supprimée avec succès');
    setOpenSnackbar(true);
    setPage(0);
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

  const calculatePrixParHeure = (montant, duree) => {
    return (montant / duree) * 60;
  };

  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: false
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredOffres = offres.filter(offre =>
    offre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offre.montant.toString().includes(searchTerm) ||
    offre.duree.toString().includes(searchTerm)
  );

  const paginatedOffres = filteredOffres.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Calcul des statistiques
  const totalMontant = offres.reduce((sum, offre) => sum + offre.montant, 0);
  const avgPrixHeure = offres.length > 0 
    ? offres.reduce((sum, offre) => sum + calculatePrixParHeure(offre.montant, offre.duree), 0) / offres.length
    : 0;

  return (
    <Box sx={{ p: 0 }}>
      {/* En-tête simplifié */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Gestion des Tarifs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez vos offres tarifaires
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 1 }}
          >
            Nouvelle Offre
          </Button>
        </Box>

        {/* Barre de recherche */}
        <TextField
          fullWidth
          placeholder="Rechercher une offre..."
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

      {/* Table des offres */}
      <Paper sx={{ borderRadius: 1, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                {['Nom de l\'offre', 'Durée', 'Montant', 'Prix/heure', 'Date création', 'Actions'].map((header) => (
                  <TableCell key={header} sx={{ color: 'white', fontWeight: 600 }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOffres.map((offre) => (
                <TableRow 
                  key={offre.id}
                  hover
                  sx={{ '&:last-child td': { border: 0 } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <OfferIcon fontSize="small" color="primary" />
                      <Typography>
                        {offre.nom}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<TimeIcon />}
                      label={formatDuree(offre.duree)}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MoneyIcon fontSize="small" color="success" />
                      <Typography sx={{ fontWeight: 500 }}>
                        {formatMontant(offre.montant)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUpIcon fontSize="small" color="action" />
                      <Typography>
                        {formatMontant(calculatePrixParHeure(offre.montant, offre.duree))}/h
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {offre.created_at}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(offre)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteConfirm(offre.id)}
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOffres.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Modal d'ajout/modification */}
     {/* Modal d'ajout/modification */}
<Dialog
  open={openDialog}
  onClose={handleCloseDialog}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      maxHeight: '500px', // Hauteur maximale fixée à 500px
      height: 'auto', // Hauteur automatique selon le contenu
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
    dividers // Ajoute des séparateurs pour le défilement
    sx={{ 
      p: 3,
      overflow: 'auto' // Permet le défilement si le contenu dépasse
    }}
  >
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Nom de l'offre"
          value={formData.nom}
          onChange={handleInputChange('nom')}
          error={errors.nom}
          helperText={errors.nom ? "Le nom est requis" : ""}
          required
          sx={{ mb: 2 }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Montant"
          type="number"
          value={formData.montant}
          onChange={handleInputChange('montant')}
          error={errors.montant}
          helperText={errors.montant ? "Montant invalide" : ""}
          required
          InputProps={{
            startAdornment: <InputAdornment position="start"><MoneyIcon /></InputAdornment>,
            endAdornment: <InputAdornment position="end">MGA</InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Durée"
          type="number"
          value={formData.duree}
          onChange={handleInputChange('duree')}
          error={errors.duree}
          helperText={errors.duree ? "Durée invalide" : "En minutes"}
          required
          InputProps={{
            startAdornment: <InputAdornment position="start"><TimeIcon /></InputAdornment>,
            endAdornment: <InputAdornment position="end">min</InputAdornment>,
          }}
        />
      </Grid>
      {formData.montant && formData.duree && !errors.montant && !errors.duree && (
        <Grid item xs={12}>
          <Alert 
            severity="info"
            sx={{ mt: 2 }}
            icon={<TrendingUpIcon />}
          >
            Prix par heure : {formatMontant(calculatePrixParHeure(parseFloat(formData.montant), parseInt(formData.duree)))}/h
          </Alert>
        </Grid>
      )}
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
    >
      Annuler
    </Button>
    <Button 
      onClick={handleSubmit} 
      variant="contained"
      sx={{ ml: 1 }}
    >
      {editingId ? 'Mettre à jour' : 'Créer'}
    </Button>
  </DialogActions>
</Dialog>

      {/* Confirmation de suppression */}
      <Dialog
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
      >
        <DialogTitle sx={{ 
          bgcolor: 'error.main',
          color: 'white',
          py: 2
        }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
            icon={<DeleteIcon />}
          >
            Cette action est irréversible
          </Alert>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l'offre <strong>"{offres.find(o => o.id === deleteConfirm)?.nom}"</strong> ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setDeleteConfirm(null)}
            variant="outlined"
          >
            Annuler
          </Button>
          <Button 
            onClick={() => handleDelete(deleteConfirm)} 
            variant="contained"
            color="error"
            sx={{ ml: 1 }}
          >
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

export default TarifsPage;