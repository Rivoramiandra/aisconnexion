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
  Divider,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Tabs,
  Tab
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  LockReset as LockResetIcon,
  Search as SearchIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// Données statiques pour les utilisateurs
const initialUsers = [
  { 
    id: 1, 
    nom: 'Admin Principal', 
    email: 'admin@example.com', 
    role: 'Admin', 
    statut: 'Actif',
    created_at: '2024-01-10 09:30:00',
    derniere_connexion: '2024-01-15 14:30:00'
  },
  { 
    id: 2, 
    nom: 'Marie Martin', 
    email: 'marie@example.com', 
    role: 'Utilisateur', 
    statut: 'Actif',
    created_at: '2024-01-12 11:15:00',
    derniere_connexion: '2024-01-15 10:45:00'
  },
  { 
    id: 3, 
    nom: 'Pierre Durand', 
    email: 'pierre@example.com', 
    role: 'Modérateur', 
    statut: 'Actif',
    created_at: '2024-01-13 14:20:00',
    derniere_connexion: '2024-01-14 16:30:00'
  },
  { 
    id: 4, 
    nom: 'Sophie Lambert', 
    email: 'sophie@example.com', 
    role: 'Éditeur', 
    statut: 'Inactif',
    created_at: '2024-01-14 16:45:00',
    derniere_connexion: '2024-01-14 16:45:00'
  },
  { 
    id: 5, 
    nom: 'Jean Dupont', 
    email: 'jean@example.com', 
    role: 'Utilisateur', 
    statut: 'Actif',
    created_at: '2024-01-15 08:30:00',
    derniere_connexion: '2024-01-15 13:20:00'
  },
];

// Options de rôles
const roleOptions = [
  { value: 'Admin', label: 'Administrateur', icon: <AdminIcon fontSize="small" /> },
  { value: 'Modérateur', label: 'Modérateur', icon: <SettingsIcon fontSize="small" /> },
  { value: 'Éditeur', label: 'Éditeur', icon: <EditIcon fontSize="small" /> },
  { value: 'Utilisateur', label: 'Utilisateur', icon: <UserIcon fontSize="small" /> },
];

// Options de statut
const statutOptions = [
  { value: 'Actif', label: 'Actif', color: 'success' },
  { value: 'Inactif', label: 'Inactif', color: 'error' },
  { value: 'En attente', label: 'En attente', color: 'warning' },
  { value: 'Suspendu', label: 'Suspendu', color: 'error' },
];

const ParametresPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(null);
  
  // États pour le nouvel utilisateur
  const [newUser, setNewUser] = useState({
    nom: '',
    email: '',
    role: 'Utilisateur',
    statut: 'Actif',
    password: '',
    confirmPassword: '',
  });
  
  // États pour les paramètres système
  const [systemSettings, setSystemSettings] = useState({
    maintenance: false,
    notifications: true,
    autoBackup: true,
    twoFactorAuth: false,
    language: 'fr',
    theme: 'light',
  });

  const [errors, setErrors] = useState({});

  const filteredUsers = () => {
    return users.filter(user =>
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleOpenDialog = () => {
    setOpenDialog('add');
    setErrors({});
    setNewUser({
      nom: '',
      email: '',
      role: 'Utilisateur',
      statut: 'Actif',
      password: '',
      confirmPassword: '',
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
    setErrors({});
  };

  const handleOpenEditDialog = (user) => {
    setOpenDialog('edit');
    setNewUser({
      ...user,
      password: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newUser.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!newUser.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (openDialog === 'add') {
      if (!newUser.password) {
        newErrors.password = 'Le mot de passe est requis';
      } else if (newUser.password.length < 8) {
        newErrors.password = 'Minimum 8 caractères';
      }
      
      if (newUser.password !== newUser.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (openDialog === 'add') {
      // Ajouter nouvel utilisateur
      const newUserData = {
        id: users.length + 1,
        nom: newUser.nom,
        email: newUser.email,
        role: newUser.role,
        statut: newUser.statut,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        derniere_connexion: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };

      setUsers([...users, newUserData]);
      setSnackbarMessage('Utilisateur créé avec succès !');
    } else if (openDialog === 'edit') {
      // Modifier utilisateur existant
      setUsers(users.map(user => 
        user.id === newUser.id ? { ...user, ...newUser } : user
      ));
      setSnackbarMessage('Utilisateur modifié avec succès !');
    }

    setOpenSnackbar(true);
    handleCloseDialog();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
    setOpenDeleteDialog(null);
    setSnackbarMessage('Utilisateur supprimé avec succès');
    setOpenSnackbar(true);
  };

  const handleResetPassword = (userId) => {
    // Logique de réinitialisation
    setSnackbarMessage('Lien de réinitialisation envoyé par email');
    setOpenSnackbar(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSystemSettingChange = (setting, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const saveSystemSettings = () => {
    setSnackbarMessage('Paramètres système enregistrés');
    setOpenSnackbar(true);
  };

  const getStatutColor = (statut) => {
    const option = statutOptions.find(opt => opt.value === statut);
    return option ? option.color : 'default';
  };

  const getRoleIcon = (role) => {
    const option = roleOptions.find(opt => opt.value === role);
    return option ? option.icon : <UserIcon fontSize="small" />;
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
              Paramètres du Système
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez les utilisateurs et configurez le système
            </Typography>
          </Box>
          <Chip
            icon={<AdminIcon />}
            label={`${users.length} utilisateur(s)`}
            color="primary"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 1 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontWeight: 500
              }
            }}
          >
            <Tab icon={<AdminIcon />} label="Gestion Utilisateurs" />
            <Tab icon={<SettingsIcon />} label="Paramètres Système" />
            <Tab icon={<SecurityIcon />} label="Sécurité" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
          </Tabs>
        </Paper>
      </Box>

      {tabValue === 0 && (
        <>
          {/* Barre de recherche et bouton d'ajout */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 3,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <TextField
              fullWidth
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleOpenDialog}
              sx={{ minWidth: 220 }}
            >
              Nouvel Utilisateur
            </Button>
          </Box>

          {/* Tableau des utilisateurs */}
          <Paper sx={{ borderRadius: 1, overflow: 'hidden', mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              p: 2,
              bgcolor: 'primary.light'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AdminIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Liste des Utilisateurs ({users.length})
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Gestion complète des comptes utilisateurs
              </Typography>
            </Box>
            
            {users.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <PersonAddIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Aucun utilisateur trouvé
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Commencez par ajouter un nouvel utilisateur
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Utilisateur</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Rôle</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Dernière connexion</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers().map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getRoleIcon(user.role)}
                            <Box>
                              <Typography>
                                {user.nom}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Créé le {new Date(user.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getRoleIcon(user.role)}
                            label={user.role}
                            size="small"
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.statut}
                            color={getStatutColor(user.statut)}
                            size="small"
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(user.derniere_connexion).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(user.derniere_connexion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Voir les détails">
                              <IconButton size="small">
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Modifier">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleOpenEditDialog(user)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Réinitialiser mot de passe">
                              <IconButton 
                                size="small" 
                                color="warning"
                                onClick={() => handleResetPassword(user.id)}
                              >
                                <LockResetIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => setOpenDeleteDialog(user.id)}
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
        </>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon />
                Paramètres Généraux
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemSettings.maintenance}
                        onChange={(e) => handleSystemSettingChange('maintenance', e.target.checked)}
                        color="warning"
                      />
                    }
                    label={
                      <Box>
                        <Typography>Mode Maintenance</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Activez pour mettre le système en maintenance
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemSettings.autoBackup}
                        onChange={(e) => handleSystemSettingChange('autoBackup', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography>Sauvegarde Automatique</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Sauvegarde quotidienne à 2h du matin
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Langue</InputLabel>
                    <Select
                      value={systemSettings.language}
                      onChange={(e) => handleSystemSettingChange('language', e.target.value)}
                      label="Langue"
                      startAdornment={<LanguageIcon sx={{ mr: 1 }} />}
                    >
                      <MenuItem value="fr">Français</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Español</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Thème</InputLabel>
                    <Select
                      value={systemSettings.theme}
                      onChange={(e) => handleSystemSettingChange('theme', e.target.value)}
                      label="Thème"
                      startAdornment={<PaletteIcon sx={{ mr: 1 }} />}
                    >
                      <MenuItem value="light">Clair</MenuItem>
                      <MenuItem value="dark">Sombre</MenuItem>
                      <MenuItem value="auto">Automatique</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={saveSystemSettings}
                >
                  Enregistrer les modifications
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Dialog pour ajouter/modifier un utilisateur */}
      <Dialog
        open={openDialog !== null}
        onClose={handleCloseDialog}
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
          <PersonAddIcon />
          {openDialog === 'add' ? 'Nouvel Utilisateur' : 'Modifier Utilisateur'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <form id="user-form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom complet *"
                  name="nom"
                  value={newUser.nom}
                  onChange={handleChange}
                  error={!!errors.nom}
                  helperText={errors.nom}
                  margin="normal"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  value={newUser.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Rôle *</InputLabel>
                  <Select
                    name="role"
                    value={newUser.role}
                    onChange={handleChange}
                    label="Rôle *"
                  >
                    {roleOptions.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {role.icon}
                          {role.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Statut *</InputLabel>
                  <Select
                    name="statut"
                    value={newUser.statut}
                    onChange={handleChange}
                    label="Statut *"
                  >
                    {statutOptions.map((statut) => (
                      <MenuItem key={statut.value} value={statut.value}>
                        <Chip 
                          label={statut.label} 
                          size="small" 
                          color={statut.color}
                          sx={{ mr: 1 }}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {openDialog === 'add' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Mot de passe *"
                      name="password"
                      type="password"
                      value={newUser.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      margin="normal"
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirmer mot de passe *"
                      name="confirmPassword"
                      type="password"
                      value={newUser.confirmPassword}
                      onChange={handleChange}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      margin="normal"
                      size="small"
                    />
                  </Grid>
                </>
              )}
              
              <Grid item xs={12}>
                <Alert severity="info">
                  {openDialog === 'add' 
                    ? "L'utilisateur recevra un email avec ses identifiants"
                    : "Les modifications seront appliquées immédiatement"}
                </Alert>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
            startIcon={<CancelIcon />}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            form="user-form"
            variant="contained" 
            startIcon={<CheckIcon />}
          >
            {openDialog === 'add' ? 'Créer l\'utilisateur' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={openDeleteDialog !== null}
        onClose={() => setOpenDeleteDialog(null)}
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
          Supprimer l'utilisateur
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {openDeleteDialog && (
            <>
              <Alert severity="error" sx={{ mb: 2 }}>
                Cette action est irréversible. Toutes les données de l'utilisateur seront supprimées.
              </Alert>
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Utilisateur concerné
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Nom</Typography>
                    <Typography>{users.find(u => u.id === openDeleteDialog)?.nom}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Email</Typography>
                    <Typography>{users.find(u => u.id === openDeleteDialog)?.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Rôle</Typography>
                    <Typography>{users.find(u => u.id === openDeleteDialog)?.role}</Typography>
                  </Box>
                </Stack>
                <Divider />
                <Alert severity="warning">
                  L'utilisateur ne pourra plus accéder au système.
                </Alert>
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(null)}>Annuler</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => handleDeleteUser(openDeleteDialog)}
          >
            Confirmer la suppression
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

export default ParametresPage;