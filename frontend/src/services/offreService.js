// frontend/src/services/offreService.js
import api from './api';

export const offreService = {
  async getAll() {
    try {
      const response = await api.get('/offres');
      console.log('📡 Réponse brute:', response.data);
      
      // Si la réponse contient du PHP, essayez d'extraire le JSON
      let responseData = response.data;
      
      // Vérifier si c'est une string qui contient du PHP
      if (typeof responseData === 'string') {
        console.log('⚠️ Réponse est une string, tentative d\'extraction JSON...');
        
        // Chercher du JSON dans la string
        const jsonMatch = responseData.match(/\{.*\}/s);
        if (jsonMatch) {
          try {
            responseData = JSON.parse(jsonMatch[0]);
            console.log('✅ JSON extrait avec succès:', responseData);
          } catch (parseError) {
            console.error('❌ Erreur parsing JSON:', parseError);
          }
        }
      }
      
      // Vérifier la structure
      if (responseData && responseData.success === true) {
        return responseData;
      } else if (Array.isArray(responseData)) {
        return {
          success: true,
          data: responseData
        };
      } else {
        console.warn('Structure inattendue, retour mock');
        return this.getMockData();
      }
    } catch (error) {
      console.error('❌ Erreur API:', error);
      return this.getMockData();
    }
  },

  getMockData() {
    return {
      success: true,
      data: [
        {
          id: 1,
          nom: '15 Minutes',
          montant: "300.00",
          montant_formate: "300,00 AR",
          duree: 10,
          duree_formatee: "10 min",
          created_at: "15/01/2026 14:24"
        },
        {
          id: 2,
          nom: '15 Minutes',
          montant: "300.00",
          montant_formate: "300,00 AR",
          duree: 15,
          duree_formatee: "15 min",
          created_at: "16/01/2026 15:52"
        }
      ],
      message: 'Données mockées'
    };
  },

  // ... autres méthodes (create, update, delete)
};

export default offreService;