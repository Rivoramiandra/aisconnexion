// frontend/src/services/offreService.js
import api from './api';

const offreService = {
  // Récupérer toutes les offres
  async getAll() {
    try {
      const response = await api.get('/offres');
      console.log('📡 Réponse API /offres:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des offres:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion au serveur',
        data: []
      };
    }
  },

  // Créer une offre
  async create(offreData) {
    try {
      console.log('📤 Envoi création offre:', offreData);
      const response = await api.post('/offres', offreData);
      console.log('✅ Réponse création:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur création offre:', error);
      throw error; // Important: lancer l'erreur pour que TarifsPage.jsx puisse la catcher
    }
  },

  // Mettre à jour une offre
  async update(id, offreData) {
    try {
      console.log(`📤 Envoi mise à jour offre ${id}:`, offreData);
      const response = await api.put(`/offres/${id}`, offreData);
      console.log('✅ Réponse mise à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur mise à jour offre ${id}:`, error);
      throw error;
    }
  },

  // Supprimer une offre
  async delete(id) {
    try {
      console.log(`🗑️  Suppression offre ${id}`);
      const response = await api.delete(`/offres/${id}`);
      console.log('✅ Réponse suppression:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur suppression offre ${id}:`, error);
      throw error;
    }
  }
};

export { offreService };
